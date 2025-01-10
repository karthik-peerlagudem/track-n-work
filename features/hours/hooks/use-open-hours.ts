import { create } from 'zustand';

type OpenHoursState = {
    id?: number;
    isOpen: boolean;
    onOpen: (id: number) => void;
    onClose: () => void;
};

export const useOpenHours = create<OpenHoursState>((set) => ({
    isOpen: false,
    onOpen: (id: number) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));
