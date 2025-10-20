import { TaskStatusEnum } from '../enums/app'
import todoIcon from '../assets/icons/todo.svg'
import inProgressIcon from '../assets/icons/doing.svg'
import doneIcon from '../assets/icons/done.svg'

export const statusIcons: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: todoIcon,
  [TaskStatusEnum.IN_PROGRESS]: inProgressIcon,
  [TaskStatusEnum.DONE]: doneIcon,
}
