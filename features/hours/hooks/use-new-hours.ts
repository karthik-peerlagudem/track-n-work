import { create } from 'zustand';

type NewHoursState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewHours = create<NewHoursState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
