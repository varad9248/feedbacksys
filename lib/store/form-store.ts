import { create } from "zustand";
import { FormElement } from "@/types/form";

interface FormStore {
  elements: FormElement[];
  shareCode: string | null;
  setShareCode: (code: string) => void;
  clearShareCode: () => void;

  addElement: (element: FormElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: Partial<FormElement>) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  elements: [],
  shareCode: null,

  setShareCode: (code) => set(() => ({ shareCode: code })),
  clearShareCode: () => set(() => ({ shareCode: null })),

  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),
  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
    })),
  updateElement: (id, updatedElement) =>
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? { ...element, ...updatedElement } : element
      ),
    })),
  reorderElements: (startIndex, endIndex) =>
    set((state) => {
      const newElements = [...state.elements];
      const [removed] = newElements.splice(startIndex, 1);
      newElements.splice(endIndex, 0, removed);
      return { elements: newElements };
    }),
}));
