import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { configureAxe, toHaveNoViolations } from "jest-axe"
import { CalendarNavigationButton } from "../CalendarNavigationButton"
import userEvent from "@testing-library/user-event"

expect.extend(toHaveNoViolations)

const mockOnClick = vi.fn()
const testComponent = (
  <CalendarNavigationButton description="Next Month" iconName="NextMonth" onClick={mockOnClick} />
)

describe("CalendarNavigationButton", () => {
  it("is accessible", async () => {
    const { container } = render(testComponent)
    const axe = configureAxe()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("renders correctly", () => {
    const { getByLabelText, getByRole } = render(testComponent)
    expect(getByLabelText("Next Month")).toBeInTheDocument()
    expect(getByRole("button")).toBeInTheDocument()
  })

  it("calls onClick function when button is clicked", async () => {
    const { getByRole } = render(testComponent)
    await userEvent.click(getByRole("button"))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
