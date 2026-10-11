"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  updatePageContent,
  updateCivilizationContent,
  seedAllContentToFirestore,
} from "@/lib/contentService";
import { Civilization } from "@/lib/civilizationsData";

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  canEdit: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
  clearStatusMessage: () => void;
  savePageField: (
    pageKey: "home" | "about" | "dialogue" | "forum",
    field: string,
    value: any
  ) => Promise<void>;
  saveCivilizationField: (
    civId: string,
    field: keyof Civilization,
    value: any
  ) => Promise<void>;
  saveCivilizationFull: (
    civId: string,
    data: Partial<Civilization>
  ) => Promise<void>;
  seedAll: () => Promise<void>;
  saving: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const toggleEditMode = () => {
    if (!isAdmin) {
      alert("Միայն Ադմինիստրատորները կարող են ակտիվացնել Խմբագրման ռեժիմը:");
      return;
    }
    setIsEditMode((prev) => !prev);
  };

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const clearStatusMessage = () => setStatusMessage(null);

  const savePageField = async (
    pageKey: "home" | "about" | "dialogue" | "forum",
    field: string,
    value: any
  ) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await updatePageContent(pageKey, { [field]: value });
      showStatus("success", "✓ Փոփոխությունը պահպանվեց Firestore-ում:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveCivilizationField = async (
    civId: string,
    field: keyof Civilization,
    value: any
  ) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await updateCivilizationContent(civId, { [field]: value });
      showStatus("success", "✓ Քաղաքակրթության տվյալները պահպանվեցին:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveCivilizationFull = async (
    civId: string,
    data: Partial<Civilization>
  ) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await updateCivilizationContent(civId, data);
      showStatus("success", "✓ Քաղաքակրթության տվյալները պահպանվեցին:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const seedAll = async () => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      const res = await seedAllContentToFirestore();
      if (res.success) {
        showStatus("success", res.message);
      } else {
        showStatus("error", res.message);
      }
    } catch (err: any) {
      showStatus("error", `Սխալ. ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditModeContext.Provider
      value={{
        isEditMode: isAdmin && isEditMode,
        toggleEditMode,
        canEdit: isAdmin,
        statusMessage,
        clearStatusMessage,
        savePageField,
        saveCivilizationField,
        saveCivilizationFull,
        seedAll,
        saving,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode(): EditModeContextType {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}
