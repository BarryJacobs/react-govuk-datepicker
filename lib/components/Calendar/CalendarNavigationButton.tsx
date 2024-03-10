import { IconType } from "react-icons"

interface CalendarNavigationButtonProps {
  description: string
  icon: IconType
  onClick: () => void
}

export const CalendarNavigationButton = ({
  description,
  icon: Icon,
  onClick
}: CalendarNavigationButtonProps) => {
  return (
    <button
      type="button"
      className="ds_button ds_button--icon-only"
      aria-label={description}
      onClick={onClick}>
      <span className="visually-hidden">{description}</span>
      <Icon className="ds_icon" focusable={false} aria-hidden={true} role="img" />
    </button>
  )
}
