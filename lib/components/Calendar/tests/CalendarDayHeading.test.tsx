import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { CalendarDayHeading } from "../CalendarDayHeading"
import { configureAxe, toHaveNoViolations } from "jest-axe"

const defaultProps = {
  text: "Monday",
  description: "Monday, the first day of the week"
}

const headingWrapper = (
  <table>
    <thead>
      <tr>
        <CalendarDayHeading {...defaultProps} />
      </tr>
    </thead>
  </table>
)

expect.extend(toHaveNoViolations)

describe("CalendarDayHeading", () => {
  it("is accessible", async () => {
    const { container } = render(headingWrapper)
    const axe = configureAxe()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("renders correctly", () => {
    render(headingWrapper)

    const headingText = screen.getByText(defaultProps.text)
    expect(headingText).toBeInTheDocument()
    expect(headingText).toHaveAttribute("aria-hidden", "true")

    const descriptionText = screen.getByText(defaultProps.description)
    expect(descriptionText).toBeInTheDocument()
    expect(descriptionText).toHaveClass("visually-hidden")
  })
})
