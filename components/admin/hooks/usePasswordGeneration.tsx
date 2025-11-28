import { useState, useEffect } from "react"
import { generateRandomPassword } from "@/lib/utils/password"

export function usePasswordGeneration() {
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = () => {
    setPassword(generateRandomPassword())
    setCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
      
      return true
    } catch (error) {
      console.error("Failed to copy password:", error)
      return false
    }
  }

  const reset = () => {
    setPassword("")
    setCopied(false)
  }

  return {
    password,
    copied,
    generate,
    copyToClipboard,
    reset,
  }
}
