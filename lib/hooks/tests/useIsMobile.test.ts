import { renderHook } from "@testing-library/react"
import { describe, beforeAll, afterAll, it, expect, vi } from "vitest"
import useIsMobile from "../useIsMobile"

describe("useIsMobile hook", () => {
  describe.each([
    ["", false],
    [
      "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36",
      true
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/123.0 Mobile/15E148 Safari/605.1.15",
      true
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15",
      false
    ]
  ])("when userAgent is %s", (userAgent: string, expected: boolean) => {
    beforeAll(() => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: userAgent,
        configurable: true
      })
    })

    it(`should return ${expected}`, () => {
      const { result } = renderHook(() => useIsMobile())
      expect(result.current).toBe(expected)
    })

    afterAll(() => {
      vi.restoreAllMocks()
    })
  })
})
