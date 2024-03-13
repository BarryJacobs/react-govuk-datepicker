import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { configureAxe, toHaveNoViolations } from "jest-axe"
import { CalendarDayButton } from "../CalendarDayButton"
import { startOfDay } from "date-fns"
import userEvent from "@testing-library/user-event"

const mockOnClick = vi.fn()
const mockOnChange = vi.fn()

const getDate = (date: string) => startOfDay(date)
const calendarDate = getDate("2024-03-01")
const dayDate = getDate("2024-03-15")

expect.extend(toHaveNoViolations)

describe("CalendarDayButton", () => {
  it("is accessible", async () => {
    const { container } = render(
      <CalendarDayButton
        calendarDate={calendarDate}
        dayDate={dayDate}
        index={1}
        onChangeSelectedDate={mockOnChange}
        onClickedSelectedDate={mockOnClick}
      />
    )
    const axe = configureAxe()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("renders correctly", () => {
    const { getByText } = render(
      <CalendarDayButton
        calendarDate={calendarDate}
        dayDate={dayDate}
        index={1}
        onChangeSelectedDate={mockOnChange}
        onClickedSelectedDate={mockOnClick}
      />
    )
    expect(getByText("15")).toBeInTheDocument()
  })

  it("calls onClickedSelectedDate when clicked", async () => {
    const { getByText } = render(
      <CalendarDayButton
        calendarDate={calendarDate}
        dayDate={dayDate}
        index={1}
        onChangeSelectedDate={mockOnChange}
        onClickedSelectedDate={mockOnClick}
      />
    )
    await userEvent.click(getByText("15"))
    expect(mockOnClick).toHaveBeenCalledWith(dayDate)
  })

  it("hides button when outside of current calendar month", async () => {
    const { getByText } = render(
      <CalendarDayButton
        calendarDate={calendarDate}
        dayDate={getDate("2024-02-29")}
        index={1}
        onChangeSelectedDate={mockOnChange}
        onClickedSelectedDate={mockOnClick}
      />
    )

    const dateButton = getByText("29")
    expect(dateButton).toBeInTheDocument()
    expect(dateButton).toHaveClass("fully-hidden")
  })

  it("handles today correctly", async () => {
    const today = startOfDay(new Date())
    const { getByText } = render(
      <CalendarDayButton
        calendarDate={today}
        dayDate={today}
        index={1}
        onChangeSelectedDate={mockOnChange}
        onClickedSelectedDate={mockOnClick}
      />
    )

    const dateButton = getByText(today.getDate().toString())
    expect(dateButton).toBeInTheDocument()
    expect(dateButton).toHaveClass("ds_datepicker__today")
    expect(dateButton).toHaveClass("ds_selected")
  })

  describe.each([
    ["{arrowLeft}", false, getDate("2024-03-14")],
    ["{arrowRight}", false, getDate("2024-03-16")],
    ["{arrowUp}", false, getDate("2024-03-08")],
    ["{arrowDown}", false, getDate("2024-03-22")],
    ["{pageUp}", false, getDate("2024-02-15")],
    ["{pageDown}", false, getDate("2024-04-15")],
    ["{pageUp}", true, getDate("2023-03-15")],
    ["{pageDown}", true, getDate("2025-03-15")],
    ["{home}", false, getDate("2024-03-10")],
    ["{end}", false, getDate("2024-03-16")]
  ])("handles keyboard navigation properly", (key: string, useShift: boolean, expected: Date) => {
    afterAll(() => {
      vi.restoreAllMocks()
    })

    it(`for key ${useShift ? "shift + " : ""}${key}`, async () => {
      const { getByText } = render(
        <CalendarDayButton
          calendarDate={calendarDate}
          dayDate={dayDate}
          index={1}
          onChangeSelectedDate={mockOnChange}
          onClickedSelectedDate={mockOnClick}
        />
      )

      if (useShift) {
        const user = userEvent.setup()
        await user.keyboard("[ShiftLeft>]")
        await user.type(getByText("15"), key)
      } else {
        await userEvent.type(getByText("15"), key)
      }

      expect(mockOnChange).toHaveBeenCalledOnce()
      expect(mockOnChange).toHaveBeenCalledWith(expected)
    })
  })
})
