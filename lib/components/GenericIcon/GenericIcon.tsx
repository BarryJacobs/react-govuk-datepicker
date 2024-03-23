import { Icons, IconType } from "../../types"

interface GenericIconProps {
  iconName: IconType
}

export const GenericIcon = ({ iconName }: GenericIconProps) => {
  const IconComponent = Icons[iconName]
  return <IconComponent />
}
