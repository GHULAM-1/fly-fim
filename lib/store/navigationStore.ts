import { create } from "zustand";

interface NavigationState {
  // Section Navigation
  activeSection: string;
  isSectionActive: boolean;
  showSectionNavigation: boolean;
  scroll: boolean;

  // Categories Dropdown
  showCategoriesDropdown: boolean;
  hoveredCategory: number;

  // Banner
  showBanner: boolean;

  // Global Modal State
  isModalOpen: boolean;

  // Actions
  setActiveSection: (section: string) => void;
  setIsSectionActive: (active: boolean) => void;
  setShowSectionNavigation: (show: boolean) => void;
  setScroll: (scroll: boolean) => void;
  setShowCategoriesDropdown: (show: boolean) => void;
  setHoveredCategory: (category: number) => void;
  setShowBanner: (show: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;

  // Reset functions
  resetSectionNavigation: () => void;
  resetCategoriesDropdown: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  // Initial state
  activeSection: "",
  isSectionActive: false,
  showSectionNavigation: true,
  scroll: false,
  showCategoriesDropdown: false,
  hoveredCategory: 1,
  showBanner: false,
  isModalOpen: false,

  // Actions
  setActiveSection: (section) => set({ activeSection: section }),
  setIsSectionActive: (active) => set({ isSectionActive: active }),
  setShowSectionNavigation: (show) => set({ showSectionNavigation: show }),
  setScroll: (scroll) => set({ scroll }),
  setShowCategoriesDropdown: (show) => set({ showCategoriesDropdown: show }),
  setHoveredCategory: (category) => set({ hoveredCategory: category }),
  setShowBanner: (show) => set({ showBanner: show }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // Reset functions
  resetSectionNavigation: () =>
    set({
      activeSection: "",
      isSectionActive: false,
      showSectionNavigation: true,
    }),
  resetCategoriesDropdown: () =>
    set({
      showCategoriesDropdown: false,
      hoveredCategory: 1,
    }),
}));
