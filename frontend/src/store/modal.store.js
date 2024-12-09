import { create } from "zustand";

export const useModalStore = create((set) => ({
  modals: [],
  openModal: (modalId, modalProps = null) =>
    set((state) => ({
      modals: [...state.modals, { modalId, modalProps }],
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.modalId !== modalId),
    })),
}));
