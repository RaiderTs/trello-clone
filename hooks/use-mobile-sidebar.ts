
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

type MobileSidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};


const mobileSidebarStore: StateCreator<MobileSidebarStore> = (set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
});

export const useMobileSidebar = create<MobileSidebarStore>()(
  devtools(mobileSidebarStore)
);
