import { create } from 'zustand';

type OpenCompanyState = {
    id?: number;
    isOpen: boolean;
    onOpen: (id: number) => void;
    onClose: () => void;
};

export const useOpenCompany = create<OpenCompanyState>((set) => ({
    isOpen: false,
    onOpen: (id: number) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));
