import type { Task } from '../services/data'
import { TaskStatusEnum } from '../enums/app'

// Получить следующий доступный индекс для задачи в указанной колонке
export const getNextIndexForColumn = (tasks: Task[], status: TaskStatusEnum): number => {
  const tasksInColumn = tasks.filter(task => task.status === status)
  
  if (tasksInColumn.length === 0) {
    return 0
  }
  
  const maxIndex = Math.max(...tasksInColumn.map(task => task.index))
  return maxIndex + 1
}

// Получить максимальный индекс среди всех задач
export const getMaxIndex = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return -1
  }
  
  return Math.max(...tasks.map(task => task.index))
}

// Пересчитать индексы для задач в указанной колонке
export const reindexTasks = (tasks: Task[]): Task[] => {
  return tasks.map((task, index) => ({
    ...task,
    index
  }))
}

