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
  saveCenterDoc,
  deleteCenterDoc,
  saveAuthorDoc,
  deleteAuthorDoc,
  savePublicationDoc,
  deletePublicationDoc,
  seedAllContentToFirestore,
} from "@/lib/contentService";
import { Civilization, ThinkTank, Thinker, Publication } from "@/lib/civilizationsData";

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  canEdit: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
  clearStatusMessage: () => void;
  savePageField: (
    pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations",
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
  saveCenter: (civId: string, center: ThinkTank) => Promise<void>;
  deleteCenter: (civId: string, centerId: string) => Promise<void>;
  saveAuthor: (civId: string, author: Thinker) => Promise<void>;
  deleteAuthor: (civId: string, authorId: string) => Promise<void>;
  savePublication: (civId: string, publication: Publication) => Promise<void>;
  deletePublication: (civId: string, pubId: string) => Promise<void>;
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
    pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations",
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

  // Subcollection Center CRUD
  const saveCenter = async (civId: string, center: ThinkTank) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await saveCenterDoc(civId, center);
      showStatus("success", `✓ Կենտրոնը («${center.name}») պահպանվեց ենթահավաքածուում:`);
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ կենտրոնը պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteCenter = async (civId: string, centerId: string) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await deleteCenterDoc(civId, centerId);
      showStatus("success", "✓ Կենտրոնը հեռացվեց ենթահավաքածուից:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ կենտրոնը հեռացնելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Subcollection Author CRUD
  const saveAuthor = async (civId: string, author: Thinker) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await saveAuthorDoc(civId, author);
      showStatus("success", `✓ Հեղինակը («${author.name}») պահպանվեց ենթահավաքածուում:`);
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ հեղինակին պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteAuthor = async (civId: string, authorId: string) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await deleteAuthorDoc(civId, authorId);
      showStatus("success", "✓ Հեղինակը հեռացվեց ենթահավաքածուից:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ հեղինակին հեռացնելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const savePublication = async (civId: string, publication: Publication) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await savePublicationDoc(civId, publication);
      showStatus("success", `✓ Աշխատությունը («${publication.title}») պահպանվեց ենթահավաքածուում:`);
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ աշխատությունը պահպանելիս. ${err.message || err}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deletePublication = async (civId: string, pubId: string) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      await deletePublicationDoc(civId, pubId);
      showStatus("success", "✓ Աշխատությունը հեռացվեց ենթահավաքածուից:");
    } catch (err: any) {
      console.error(err);
      showStatus("error", `Սխալ աշխատությունը հեռացնելիս. ${err.message || err}`);
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
        saveCenter,
        deleteCenter,
        saveAuthor,
        deleteAuthor,
        savePublication,
        deletePublication,
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
