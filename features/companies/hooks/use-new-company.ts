import { create } from 'zustand';

type NewCompanyState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewCompany = create<NewCompanyState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
