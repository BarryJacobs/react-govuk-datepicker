import { IconType } from "../../types"
import { GenericIcon } from "../GenericIcon/GenericIcon"

interface CalendarNavigationButtonProps {
  description: string
  iconName: IconType
  onClick: () => void
}

export const CalendarNavigationButton = ({
  description,
  iconName,
  onClick
}: CalendarNavigationButtonProps) => {
  return (
    <button
      type="button"
      className="ds_button ds_button--icon-only"
      aria-label={description}
      onClick={onClick}>
      <span className="visually-hidden">{description}</span>
      <GenericIcon iconName={iconName} />
    </button>
  )
}
