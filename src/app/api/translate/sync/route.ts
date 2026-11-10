import { NextResponse } from "next/server";

interface SyncRequestBody {
  fields: Record<string, string>;
  targetLangs?: ("en" | "ru")[];
  context?: string;
}

/**
 * Backend Translation Sync Endpoint:
 * Receives new or updated text fields in Armenian, translates them with AI,
 * and returns the localized translations ready to merge into Firestore.
 */
export async function POST(req: Request) {
  try {
    const { fields, targetLangs = ["en", "ru"], context }: SyncRequestBody =
      await req.json();

    if (!fields || Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to translate" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const translateUrl = `${protocol}://${host}/api/translate`;

    const res = await fetch(translateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: fields,
        targetLangs,
        sourceLang: "hy",
        context,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      translations: data.translations,
      translatedAt: data.translatedAt,
      isAiTranslated: true,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Translate sync error:", error);
    return NextResponse.json(
      { error: "SYNC_FAILED", message: errMsg },
      { status: 500 }
    );
  }
}
