import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '../services/data'
import { TaskStatusEnum } from '../enums/app'


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
      state.tasks = action.payload
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload)
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: TaskStatusEnum }>) {
      const task = state.tasks.find(t => t.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
      }
    },
  },
})

// Геттеры (selectors)
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks
export const selectTodoTasks = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => task.status === TaskStatusEnum.TODO)
export const selectInProgressTasks = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => task.status === TaskStatusEnum.IN_PROGRESS)
export const selectDoneTasks = (state: { tasks: TasksState }) =>
  state.tasks.tasks.filter(task => task.status === TaskStatusEnum.DONE)

export const { setTasks, addTask, updateTaskStatus } = tasksSlice.actions
export default tasksSlice.reducer
