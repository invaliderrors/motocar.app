"use client"

import { create } from "zustand"

type NavigationStore = {
    isPageLoaded: boolean
    isNavigatingFromLogin: boolean
    setPageLoaded: (loaded: boolean) => void
    setNavigatingFromLogin: (navigating: boolean) => void
    resetNavigation: () => void
}

// Create a store to track page loading state across components
export const useNavigationStore = create<NavigationStore>((set) => ({
    isPageLoaded: false,
    isNavigatingFromLogin: false,
    setPageLoaded: (loaded) => set({ isPageLoaded: loaded }),
    setNavigatingFromLogin: (navigating) => set({ isNavigatingFromLogin: navigating }),
    resetNavigation: () => set({ isPageLoaded: false, isNavigatingFromLogin: false }),
}))
