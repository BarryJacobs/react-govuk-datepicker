interface CalendarDayHeadingProps {
  text: string
  description: string
}

export const CalendarDayHeading = ({ text, description }: CalendarDayHeadingProps) => (
  <th scope="col">
    <span aria-hidden="true">{text}</span>
    <span className="visually-hidden">{description}</span>
  </th>
)
