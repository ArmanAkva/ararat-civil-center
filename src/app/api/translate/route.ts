import { NextResponse } from "next/server";

interface TranslateRequestBody {
  texts: Record<string, unknown>;
  targetLangs?: ("en" | "ru")[];
  sourceLang?: string;
  context?: string;
}

const SYSTEM_PROMPT = `You are a high-level scholarly and cultural translator for the "Ararat Civilizational Center" (Արարատյան Քաղաքակրթական Կենտրոն).
Your task is to translate content accurately from Armenian (hy) into English (en) and Russian (ru).

Translation guidelines:
1. Maintain deep intellectual, philosophical, and diplomatic tone.
2. Accurately translate core conceptual terms:
   - «Համարարչություն» -> "Co-creation" (EN) / "Со-созидание" (RU)
   - «Քաղաքակրթական Բևեռներ» -> "Civilizational Poles" (EN) / "Цивилизационные полюса" (RU)
   - «Ուղեղային Կենտրոն» -> "Think Tank" (EN) / "Мозговой центр" / "Аналитический центр" (RU)
   - «Արդար Աշխարհակարգ» -> "Just World Order" (EN) / "Справедливый миропорядок" (RU)
   - «Ինքնիշխանություն» -> "Sovereignty" (EN) / "Суверенитет" (RU)
3. Preserve markdown formatting, HTML tags, line breaks, placeholders, and quotes exactly as in the original.
4. If an input value is not a string (or is empty), keep it as is.
5. You MUST return ONLY a valid JSON object with the requested language codes as top-level keys ('en' and/or 'ru'), each containing the exact same keys as the input 'texts' object. Do not wrap in markdown quotes if possible, or use standard JSON.`;

/**
 * Calls Google Gemini REST API to translate text key-values into EN and RU.
 * Defaults to the latest Gemini Flash model (gemini-2.5-flash / gemini-2.0-flash).
 */
async function translateWithGemini(
  texts: Record<string, string>,
  targetLangs: string[],
  apiKey: string,
  context?: string
) {
  const preferredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fallbackModel = "gemini-2.0-flash";

  const prompt = `${SYSTEM_PROMPT}

Context: ${context || "Civilizational dialog, philosophy, think tanks, and geopolitical articles"}
Target Languages: ${targetLangs.join(", ")}

Translate the following JSON object of Armenian texts:
${JSON.stringify(texts, null, 2)}

Respond with a single JSON object where each target language code is a key, containing the translated fields:
Example structure:
{
  ${targetLangs.map((lang) => `"${lang}": { /* translated keys */ }`).join(",\n  ")}
}`;

  const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const callModel = async (modelName: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });
  };

  let response = await callModel(preferredModel);

  // If the preferred latest flash model returns 404 or unsupported, fallback to gemini-2.0-flash
  if (!response.ok && (response.status === 404 || response.status === 400) && preferredModel !== fallbackModel) {
    console.warn(`Gemini model ${preferredModel} returned ${response.status}, falling back to ${fallbackModel}`);
    response = await callModel(fallbackModel);
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `Gemini API error (${response.status}): ${errorText}`;
    try {
      const errObj = JSON.parse(errorText);
      if (errObj.error?.message) {
        errorMsg = errObj.error.message;
      }
      if (errObj.error?.code === 402 || errObj.error?.status === "RESOURCE_EXHAUSTED") {
        errorMsg = "Google Gemini: Prepayment credits are depleted for this API key project. Please top up or create an API key in a free-tier project in Google AI Studio (https://aistudio.google.com).";
      }
    } catch {
      // keep fallback
    }
    throw new Error(errorMsg);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini returned empty response");
  }

  return JSON.parse(rawText);
}

/**
 * Calls OpenAI API (gpt-4o-mini) as fallback if OPENAI_API_KEY is configured.
 */
async function translateWithOpenAI(
  texts: Record<string, string>,
  targetLangs: string[],
  apiKey: string,
  context?: string
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Translate these texts into ${targetLangs.join(", ")}:\nContext: ${
            context || ""
          }\n${JSON.stringify(texts, null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  return JSON.parse(content);
}

export async function POST(req: Request) {
  try {
    const body: TranslateRequestBody = await req.json();
    const { texts, targetLangs = ["en", "ru"], context } = body;

    if (!texts || typeof texts !== "object" || Object.keys(texts).length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'texts' object" },
        { status: 400 }
      );
    }

    // Filter only string values to save tokens
    const textToTranslate: Record<string, string> = {};
    for (const [key, val] of Object.entries(texts)) {
      if (typeof val === "string" && val.trim().length > 0 && !key.startsWith("_")) {
        textToTranslate[key] = val;
      }
    }

    if (Object.keys(textToTranslate).length === 0) {
      return NextResponse.json({
        translations: { en: {}, ru: {} },
        isAiTranslated: false,
      });
    }

    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let translationsResult: Record<string, Record<string, string>> = {};
    let provider = "none";

    if (geminiKey) {
      provider = "gemini";
      translationsResult = await translateWithGemini(
        textToTranslate,
        targetLangs,
        geminiKey,
        context
      );
    } else if (openaiKey) {
      provider = "openai";
      translationsResult = await translateWithOpenAI(
        textToTranslate,
        targetLangs,
        openaiKey,
        context
      );
    } else {
      return NextResponse.json(
        {
          error: "NO_API_KEY",
          message:
            "No AI API key found. Please set GEMINI_API_KEY (or OPENAI_API_KEY) in .env.local to enable real-time AI translations.",
          preview: textToTranslate,
        },
        { status: 422 }
      );
    }

    const now = new Date().toISOString();
    const formattedTranslations: Record<string, Record<string, unknown>> = {};

    for (const lang of targetLangs) {
      const translatedMap = translationsResult[lang] || {};
      formattedTranslations[lang] = {
        ...translatedMap,
        _isAiTranslated: true,
        _translatedAt: now,
        _sourceLang: "hy",
      };
    }

    return NextResponse.json({
      success: true,
      provider,
      translations: formattedTranslations,
      isAiTranslated: true,
      translatedAt: now,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Translation route error:", error);
    return NextResponse.json(
      { error: "TRANSLATION_FAILED", message: errMsg },
      { status: 500 }
    );
  }
}
