import { forwardRef, KeyboardEvent } from "react"
import {
  format,
  isEqual,
  isToday,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addDays,
  addMonths,
  addYears,
  isSaturday,
  isSunday,
  startOfDay,
  startOfWeek,
  endOfWeek
} from "date-fns"
import { enGB } from "date-fns/locale"

interface ButtonAttr {
  className: string
  "data-form": string
  "data-button": string
  "aria-label": string
  tabIndex?: number
}

interface CalendarDayButtonProps {
  calendarDate: Date
  dayDate: Date
  index: number
  onChangeSelectedDate: (date: Date) => void
  onClickedSelectedDate: (date: Date) => void
}

const isWithinCurrentMonth = (calendarDate: Date, dateToCheck: Date): boolean => {
  const startOfCurrentMonth = startOfMonth(calendarDate)
  const endOfCurrentMonth = endOfMonth(calendarDate)
  return isWithinInterval(dateToCheck, {
    start: startOfCurrentMonth,
    end: endOfCurrentMonth
  })
}

const CalendarDayButton = forwardRef<HTMLButtonElement, CalendarDayButtonProps>(
  (
    {
      calendarDate,
      dayDate,
      index,
      onChangeSelectedDate,
      onClickedSelectedDate
    }: CalendarDayButtonProps,
    ref
  ) => {
    const buttonAttr: ButtonAttr = {
      className: "",
      "data-form": "date-select",
      "data-button": `button-${index}`,
      "aria-label": format(dayDate, "EEEE d MMMM yyyy", { locale: enGB })
    }

    if (isWithinCurrentMonth(calendarDate, dayDate)) {
      buttonAttr.tabIndex = isEqual(calendarDate, dayDate) ? 0 : -1
      if (isToday(dayDate)) {
        buttonAttr.className += "ds_datepicker__today "
      }
      if (isEqual(calendarDate, dayDate)) {
        buttonAttr.className += "ds_selected"
      }
    } else {
      buttonAttr.className = "fully-hidden"
    }

    const handleButtonClick = () => {
      onClickedSelectedDate(dayDate)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "ArrowLeft":
          onChangeSelectedDate(addDays(dayDate, -1))
          break
        case "ArrowRight":
          onChangeSelectedDate(addDays(dayDate, 1))
          break
        case "ArrowUp":
          onChangeSelectedDate(addDays(dayDate, -7))
          break
        case "ArrowDown":
          onChangeSelectedDate(addDays(dayDate, 7))
          break
        case "Home":
          if (!isSunday(dayDate)) {
            onChangeSelectedDate(startOfWeek(dayDate, { weekStartsOn: 0 }))
          }
          break
        case "End":
          if (!isSaturday(dayDate)) {
            onChangeSelectedDate(startOfDay(endOfWeek(dayDate, { weekStartsOn: 0 })))
          }
          break
        case "PageUp":
          if (event.shiftKey) {
            onChangeSelectedDate(addYears(dayDate, -1))
          } else {
            onChangeSelectedDate(addMonths(dayDate, -1))
          }
          break
        case "PageDown":
          if (event.shiftKey) {
            onChangeSelectedDate(addYears(dayDate, 1))
          } else {
            onChangeSelectedDate(addMonths(dayDate, 1))
          }
          break
        default:
          return
      }
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <button
        ref={ref}
        type="button"
        {...buttonAttr}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}>
        {dayDate.getDate()}
      </button>
    )
  }
)

CalendarDayButton.displayName = "CalendarDayButton"

export { CalendarDayButton }
