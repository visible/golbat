"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

interface SettingsContextType {
  showSuggestions: boolean
  setShowSuggestions: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextType>({
  showSuggestions: true,
  setShowSuggestions: () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("golbat-suggestions")
    if (saved !== null) {
      setShowSuggestions(saved === "true")
    }
  }, [])

  const updateShowSuggestions = (value: boolean) => {
    setShowSuggestions(value)
    localStorage.setItem("golbat-suggestions", String(value))
  }

  return (
    <SettingsContext.Provider
      value={{
        showSuggestions,
        setShowSuggestions: updateShowSuggestions,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
