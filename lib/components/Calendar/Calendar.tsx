import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  format,
  startOfMonth,
  subDays,
  getDay,
  addDays,
  addMonths,
  addYears,
  isEqual
} from "date-fns"
import {
  HiMiniChevronLeft,
  HiMiniChevronDoubleLeft,
  HiMiniChevronRight,
  HiMiniChevronDoubleRight
} from "react-icons/hi2"
import { CalendarNavigationButton } from "./CalendarNavigationButton"
import { CalendarDayHeading } from "./CalendarDayHeading"
import { CalendarDayButton } from "./CalendarDayButton"
import FocusLock from "react-focus-lock"

import "./Calendar.scss"

const dayAbbreviationDescriptionMap: Record<string, string> = {
  Su: "Sunday",
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday"
}

interface CalendarProps {
  id: string
  date: Date
  onChange: (date: Date) => void
  onCancel: () => void
}

const getFirstSundayBeforeFirstOfMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date)
  if (getDay(startOfMonthDate) === 0) {
    return startOfMonthDate
  } else {
    const daysToSubtract = getDay(startOfMonthDate)
    return subDays(startOfMonthDate, daysToSubtract)
  }
}

export const Calendar = ({ id, date, onChange, onCancel }: CalendarProps) => {
  const [calendarDate, setCalendarDate] = useState(date)
  const [selectedIndex, setSelectedIndex] = useState({ index: 0 })
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>(Array(42).fill(null))

  const onChangeSelectedDate = useCallback((date: Date) => {
    setCalendarDate(date)
  }, [])

  const onClickedSelectedDate = useCallback((date: Date) => {
    onChange(date)
  }, [])

  const renderDays = useMemo(() => {
    let dayDate = getFirstSundayBeforeFirstOfMonth(calendarDate)
    const rows = []
    for (let row = 0; row < 6; row++) {
      const columns = []
      for (let col = 0; col < 7; col++) {
        const currentIndex = row * 7 + col
        columns.push(
          <td key={uuidv4()}>
            <CalendarDayButton
              index={currentIndex}
              calendarDate={calendarDate}
              dayDate={dayDate}
              onChangeSelectedDate={onChangeSelectedDate}
              onClickedSelectedDate={onClickedSelectedDate}
              ref={(el: HTMLButtonElement | null) => (buttonRefs.current[currentIndex] = el)}
            />
          </td>
        )
        if (isEqual(calendarDate, dayDate)) {
          setSelectedIndex({ index: currentIndex })
        }
        dayDate = addDays(dayDate, 1)
      }
      rows.push(<tr key={uuidv4()}>{columns}</tr>)
    }
    return rows
  }, [calendarDate, buttonRefs])

  useEffect(() => {
    if (buttonRefs.current[selectedIndex.index]) {
      buttonRefs.current[selectedIndex.index]?.focus()
    }
  }, [selectedIndex])

  return (
    <FocusLock>
      <div
        id={id}
        className="ds_datepicker__dialog datepickerDialog ds_datepicker__dialog--open"
        role="dialog"
        aria-modal="true"
        aria-label="March 2024">
        <div className="ds_datepicker__dialog__header">
          <div className="ds_datepicker__dialog__navbuttons">
            <CalendarNavigationButton
              description="Previous year"
              icon={HiMiniChevronDoubleLeft}
              onClick={() => onChangeSelectedDate(addYears(calendarDate, -1))}
            />
            <CalendarNavigationButton
              description="Previous month"
              icon={HiMiniChevronLeft}
              onClick={() => onChangeSelectedDate(addMonths(calendarDate, -1))}
            />
          </div>
          <h2 className="ds_datepicker__dialog__title">{format(calendarDate, "MMMM yyyy")}</h2>
          <div className="ds_datepicker__dialog__navbuttons">
            <CalendarNavigationButton
              description="Next month"
              icon={HiMiniChevronRight}
              onClick={() => onChangeSelectedDate(addMonths(calendarDate, 1))}
            />
            <CalendarNavigationButton
              description="Next year"
              icon={HiMiniChevronDoubleRight}
              onClick={() => onChangeSelectedDate(addYears(calendarDate, 1))}
            />
          </div>
        </div>

        <table className="ds_datepicker__dialog__table" role="grid">
          <caption id="datepicker-ds1-caption" className="ds_datepicker__dialog__table-caption">
            You can use the cursor keys to select a date
          </caption>
          <thead>
            <tr>
              {Object.entries(dayAbbreviationDescriptionMap).map(([key, value]) => (
                <CalendarDayHeading key={uuidv4()} text={key} description={value} />
              ))}
            </tr>
          </thead>
          <tbody>{renderDays}</tbody>
        </table>

        <div className="ds_datepicker__dialog__buttongroup">
          <button
            type="button"
            className="govuk-button govuk-button--secondary"
            value="cancel"
            data-button="button-datepicker-cancel"
            onClick={() => onCancel()}>
            Cancel
          </button>
          <button
            type="button"
            className="govuk-button govuk-button--primary"
            value="ok"
            data-button="button-datepicker-ok"
            onClick={() => onChange(calendarDate)}>
            OK
          </button>
        </div>
      </div>
    </FocusLock>
  )
}
