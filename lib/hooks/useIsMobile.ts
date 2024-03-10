import { useState, useEffect } from "react"

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return isMobile
}

export default useIsMobile
