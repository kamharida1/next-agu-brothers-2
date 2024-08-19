'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Layout = {
  theme: string
  drawerOpen: boolean
}
const initialState: Layout = {
  theme: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  drawerOpen: false,
}

export const layoutStore = create<Layout>()(
  persist(() => initialState, {
    name: 'layoutStore',
  })
)

export default function useLayoutService() {
  const { theme, drawerOpen } = layoutStore()

  return {
    theme,
    drawerOpen,
    toggleDrawer: () => { 
      layoutStore.setState({
        drawerOpen: !drawerOpen,
      })
    },
    toggleTheme: () => {
      layoutStore.setState({
        theme: theme === 'dark' ? 'light' : 'dark',
      })
    },
  }
}