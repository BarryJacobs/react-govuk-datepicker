import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { configureAxe, toHaveNoViolations } from "jest-axe"
import { startOfDay } from "date-fns"
import { Calendar } from "../Calendar"
import userEvent from "@testing-library/user-event"

expect.extend(toHaveNoViolations)

const mockDate = startOfDay(new Date("2024-03-11"))
const mockOnChange = vi.fn()
const mockOnCancel = vi.fn()

const testComponent = (
  <Calendar id="test-calendar" date={mockDate} onChange={mockOnChange} onCancel={mockOnCancel} />
)

describe("Calendar", () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  it("is accessible", async () => {
    const { container } = render(testComponent)
    const axe = configureAxe()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("renders correctly", () => {
    const { getByText } = render(testComponent)
    expect(getByText("March 2024")).toBeInTheDocument()
  })

  it("navigates to previous month when clicking previous month button", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    await userEvent.click(getByLabelText("Previous month"))
    expect(getByText("February 2024")).toBeInTheDocument()
  })

  it("navigates to next month when clicking next month button", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    await userEvent.click(getByLabelText("Next month"))
    expect(getByText("April 2024")).toBeInTheDocument()
  })

  it("navigates to previous year when clicking previous year button", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    await userEvent.click(getByLabelText("Previous year"))
    expect(getByText("March 2023")).toBeInTheDocument()
  })

  it("navigates to next year when clicking next year button", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    await userEvent.click(getByLabelText("Next year"))
    expect(getByText("March 2025")).toBeInTheDocument()
  })

  it("calls onChange when selecting a date", async () => {
    const { getByText } = render(testComponent)
    await userEvent.click(getByText("15"))
    expect(mockOnChange).toHaveBeenCalledOnce()
    expect(mockOnChange).toHaveBeenCalledWith(startOfDay(new Date("2024-03-15")))
  })

  it("calls onChange when clicking OK button", async () => {
    const { getByText } = render(testComponent)
    await userEvent.click(getByText("OK"))
    expect(mockOnChange).toHaveBeenCalledWith(mockDate)
  })

  it("calls onCancel when clicking cancel button", async () => {
    const { getByText } = render(testComponent)
    await userEvent.click(getByText("Cancel"))
    expect(mockOnCancel).toHaveBeenCalledOnce()
  })
})
