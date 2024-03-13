import { render, waitFor } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { configureAxe, toHaveNoViolations } from "jest-axe"
import { DatePicker } from "../DatePicker"
import userEvent from "@testing-library/user-event"

expect.extend(toHaveNoViolations)

const mockOnChange = vi.fn()
const mockOnBlur = vi.fn()

const testComponent = (
  <DatePicker
    identifier="test-datepicker"
    label="Test Date"
    value="11/03/2022"
    onChange={mockOnChange}
    onBlur={mockOnBlur}
  />
)

describe("DatePicker", () => {
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
    const { getByLabelText } = render(testComponent)
    expect(getByLabelText(/Test Date/i)).toBeInTheDocument()
  })

  it("renders correctly with error provided", () => {
    const { getByText } = render(
      <DatePicker
        identifier="test-datepicker"
        label="Test Date"
        value="11/03/2022"
        error="This control has an error"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    )
    const errorSpan = getByText(/error:/i)
    expect(errorSpan).toBeInTheDocument()
    expect(errorSpan).toHaveClass("govuk-visually-hidden")
    expect(getByText("This control has an error")).toBeInTheDocument()
  })

  it("renders correctly with hint provided", () => {
    const { getByText } = render(
      <DatePicker
        identifier="test-datepicker"
        label="Test Date"
        value="11/03/2022"
        hint="This is a hint"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    )
    const hint = getByText("This is a hint")
    expect(hint).toBeInTheDocument()
    expect(hint).toHaveClass("govuk-hint")
    expect(hint).toHaveAttribute("id", "test-datepicker-hint")
  })

  it("displays calendar when calendar button is clicked", async () => {
    const { getByRole } = render(testComponent)
    const calendarButton = getByRole("button", { name: /choose date/i })
    await userEvent.click(calendarButton)
    expect(getByRole("dialog")).toBeInTheDocument()
  })

  it("displays calendar when space bar is pressed", async () => {
    const { getByLabelText, getByRole } = render(testComponent)
    const dateInput = getByLabelText(/Test Date/i)
    expect(dateInput).toBeInTheDocument()
    await waitFor(() => dateInput.focus())

    await userEvent.type(dateInput, " ")
    expect(getByRole("dialog")).toBeInTheDocument()
  })

  it("updates the date when a new date is selected from the calendar", async () => {
    const { getByRole, getByText } = render(testComponent)
    await userEvent.click(getByRole("button", { name: /choose date/i }))
    await userEvent.click(getByText("15"))
    expect(mockOnChange).toHaveBeenCalledWith("15/03/2022")
  })

  it("calls onChange with the correct format when user types a date", async () => {
    const { getByLabelText } = render(testComponent)
    const dateInput = getByLabelText(/Test Date/i)
    expect(dateInput).toBeInTheDocument()
    await userEvent.type(dateInput, "23112023")
    expect(mockOnChange).toHaveBeenCalledWith("23/11/2023")
  })

  it("handles day span click", async () => {
    const { getByText } = render(testComponent)
    const daySpan = getByText("11")
    expect(daySpan).toBeInTheDocument()
    expect(daySpan).toHaveClass("date-section")
    expect(daySpan).not.toHaveClass("section-selected")
    await userEvent.click(daySpan)
    expect(daySpan).toHaveClass("section-selected")
  })

  it("handles month span click", async () => {
    const { getByText } = render(testComponent)
    const monthSpan = getByText("03")
    expect(monthSpan).toBeInTheDocument()
    expect(monthSpan).toHaveClass("date-section")
    expect(monthSpan).not.toHaveClass("section-selected")
    await userEvent.click(monthSpan)
    expect(monthSpan).toHaveClass("section-selected")
  })

  it("handles year span click", async () => {
    const { getByText } = render(testComponent)
    const yearSpan = getByText("2022")
    expect(yearSpan).toBeInTheDocument()
    expect(yearSpan).toHaveClass("date-section")
    expect(yearSpan).not.toHaveClass("section-selected")
    await userEvent.click(yearSpan)
    expect(yearSpan).toHaveClass("section-selected")
  })

  it("handles arrow navigation correctly", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    const dateInput = getByLabelText(/Test Date/i)
    expect(dateInput).toBeInTheDocument()
    await waitFor(() => dateInput.focus())

    const daySpan = getByText("11")
    const monthSpan = getByText("03")
    const yearSpan = getByText("2022")

    expect(daySpan).toBeInTheDocument()
    expect(monthSpan).toBeInTheDocument()
    expect(yearSpan).toBeInTheDocument()

    expect(daySpan).toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await userEvent.type(dateInput, "{arrowRight}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await userEvent.type(dateInput, "{arrowRight}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).toHaveClass("section-selected")

    await userEvent.type(dateInput, "{arrowLeft}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await userEvent.type(dateInput, "{arrowLeft}")
    expect(daySpan).toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")
  })

  it("handles tab correctly", async () => {
    const { getByLabelText, getByText } = render(testComponent)
    const dateInput = getByLabelText(/Test Date/i)
    expect(dateInput).toBeInTheDocument()
    await waitFor(() => dateInput.focus())

    const daySpan = getByText("11")
    const monthSpan = getByText("03")
    const yearSpan = getByText("2022")

    expect(daySpan).toBeInTheDocument()
    expect(monthSpan).toBeInTheDocument()
    expect(yearSpan).toBeInTheDocument()

    expect(daySpan).toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await userEvent.type(dateInput, "{tab}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await userEvent.type(dateInput, "{tab}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).toHaveClass("section-selected")

    const user = userEvent.setup()
    await user.keyboard("[ShiftLeft>]")
    await user.type(dateInput, "{tab}")
    expect(daySpan).not.toHaveClass("section-selected")
    expect(monthSpan).toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")

    await user.keyboard("[ShiftLeft>]")
    await user.type(dateInput, "{tab}")
    expect(daySpan).toHaveClass("section-selected")
    expect(monthSpan).not.toHaveClass("section-selected")
    expect(yearSpan).not.toHaveClass("section-selected")
  })

  describe.each([
    ["Day", "{arrowUp}", "11", "12"],
    ["Month", "{arrowUp}", "03", "04"],
    ["Year", "{arrowUp}", "2022", "2023"],
    ["Day", "{arrowDown}", "11", "10"],
    ["Month", "{arrowDown}", "03", "02"],
    ["Year", "{arrowDown}", "2022", "2021"]
  ])(
    "handles stepping value correctly",
    (scenario: string, key: string, datePartValue: string, expected: string) => {
      it(`for ${key} on date part: ${scenario}`, async () => {
        const { getByLabelText, getByText } = render(testComponent)
        const dateInput = getByLabelText(/Test Date/i)
        expect(dateInput).toBeInTheDocument()

        const datePart = getByText(datePartValue)
        await userEvent.click(datePart)
        expect(datePart).toBeInTheDocument()

        await userEvent.type(dateInput, key)
        expect(getByText(expected)).toBeInTheDocument()
      })
    }
  )

  describe.each([
    ["Day", "11", "dd"],
    ["Month", "03", "mm"],
    ["Year", "2022", "yyyy"]
  ])(
    "handles delete key correctly",
    (scenario: string, datePartValue: string, expected: string) => {
      it(`on date part: ${scenario}`, async () => {
        const { getByLabelText, getByText } = render(testComponent)
        const dateInput = getByLabelText(/Test Date/i)
        expect(dateInput).toBeInTheDocument()

        const datePart = getByText(datePartValue)
        await userEvent.click(datePart)
        expect(datePart).toBeInTheDocument()

        await userEvent.type(dateInput, "{delete}")
        expect(getByText(expected)).toBeInTheDocument()
      })
    }
  )

  describe.each([
    ["2024-08-19", "19/08/2024"],
    ["01/02/2023", "01/02/2023"],
    ["not a date", "11/03/2022"]
  ])("handles clipboard paste into the control", (pasteValue: string, expected: string) => {
    it(`for value ${pasteValue}`, async () => {
      const { getByLabelText } = render(testComponent)
      const dateInput = getByLabelText(/Test Date/i)
      expect(dateInput).toBeInTheDocument()

      await waitFor(() => dateInput.focus())
      await userEvent.paste(pasteValue)
      expect(mockOnChange).toHaveBeenCalledWith(expected)
    })
  })
})
