import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '../services/data'
import { TaskStatusEnum } from '../enums/app'
import { getNextIndexForColumn } from '../utils/taskIndexUtils'


interface TasksState {
  tasks: Task[]
}

const initialState: TasksState = {
  tasks: [],
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      // Убеждаемся, что у всех задач есть правильные индексы
      const tasksWithIndexes = action.payload.map((task, index) => ({
        ...task,
        index: task.index ?? index
      }))
      
      // Просто сортируем все задачи по индексу
      state.tasks = tasksWithIndexes.sort((a, b) => a.index - b.index)
    },
    addTask(state, action: PayloadAction<Task>) {
      const newTask = action.payload
      
      // Устанавливаем индекс новой задачи
      newTask.index = getNextIndexForColumn(state.tasks, newTask.status)
      
      state.tasks.push(newTask)
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: TaskStatusEnum; index?: number }>) {
      const { id, status, index } = action.payload
      const task = state.tasks.find(t => t.id === id)
      
      if (task) {
        const oldStatus = task.status
        task.status = status
        
        if (index !== undefined) {
          // Если перемещаем в другую колонку, устанавливаем новый индекс
          if (oldStatus !== status) {
            task.index = index
          }
        } else {
          // Если индекс не указан, находим следующий доступный в новой колонке
          const targetColumnTasks = state.tasks.filter(t => t.status === status && t.id !== id)
          task.index = getNextIndexForColumn(targetColumnTasks, status)
        }
      }
    },
    reorderTasks(state, action: PayloadAction<{ 
      activeId: string; 
      overId: string; 
      container: TaskStatusEnum 
    }>) {
      const { activeId, overId, container } = action.payload
      
      // Находим задачи в контейнере и сортируем по индексу
      const containerTasks = state.tasks
        .filter(task => task.status === container)
        .sort((a, b) => a.index - b.index)
      
      const activeIndex = containerTasks.findIndex(task => task.id === activeId)
      const overIndex = containerTasks.findIndex(task => task.id === overId)
      
      if (activeIndex === -1 || overIndex === -1) return
      
      // Перемещаем элемент
      const [movedTask] = containerTasks.splice(activeIndex, 1)
      containerTasks.splice(overIndex, 0, movedTask)
      
      // Обновляем индексы
      containerTasks.forEach((task, index) => {
        task.index = index
      })
    },
  },
})

// Типы для Redux store
export interface RootState {
  tasks: TasksState
}

// Геттеры (selectors)
export const selectTasks = (state: RootState): Task[] => state.tasks.tasks
export const selectTodoTasks = (state: RootState): Task[] =>
  state.tasks.tasks
    .filter(task => task.status === TaskStatusEnum.TODO)
    .sort((a, b) => a.index - b.index)
export const selectInProgressTasks = (state: RootState): Task[] =>
  state.tasks.tasks
    .filter(task => task.status === TaskStatusEnum.IN_PROGRESS)
    .sort((a, b) => a.index - b.index)
export const selectDoneTasks = (state: RootState): Task[] =>
  state.tasks.tasks
    .filter(task => task.status === TaskStatusEnum.DONE)
    .sort((a, b) => a.index - b.index)

export const { setTasks, addTask, updateTaskStatus, reorderTasks } = tasksSlice.actions
export default tasksSlice.reducer
