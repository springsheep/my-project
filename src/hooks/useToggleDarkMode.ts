import { useDarkModeStore } from '@/store/modules/darkMode'

export function useDarkMode() {
      return useDarkModeStore().darkMode
}

export function useToggleDarkMode() {
      useDarkModeStore().toggleDarkMode()
}
