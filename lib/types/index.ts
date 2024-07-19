import { CalendarIcon as Calendar } from "../assets/CalendarIcon"
import { NextMonthIcon as NextMonth } from "../assets/NextMonthIcon"
import { NextYearIcon as NextYear } from "../assets/NextYearIcon"
import { PreviousMonthIcon as PreviousMonth } from "../assets/PreviousMonthIcon"
import { PreviousYearIcon as PreviousYear } from "../assets/PreviousYearIcon"

export const Icons = {
  Calendar,
  NextMonth,
  NextYear,
  PreviousMonth,
  PreviousYear
}

export type IconType = keyof typeof Icons

export enum InputWidth {
  Full = 1,
  ThreeQuarters = 2,
  TwoThirds = 3,
  OneHalf = 4,
  OneThird = 5,
  OneQuarter = 6,
  Char20 = 7,
  Char10 = 8
}

export enum DayEnum {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export const InputWidthClass: Record<InputWidth, string> = {
  [InputWidth.Full]: "govuk-!-width-full",
  [InputWidth.ThreeQuarters]: "govuk-!-width-three-quarters",
  [InputWidth.TwoThirds]: "govuk-!-width-two-thirds",
  [InputWidth.OneHalf]: "govuk-!-width-one-half",
  [InputWidth.OneThird]: "govuk-!-width-one-third",
  [InputWidth.OneQuarter]: "govuk-!-width-one-quarter",
  [InputWidth.Char20]: "govuk-input--width-20",
  [InputWidth.Char10]: "govuk-input--width-10"
}
