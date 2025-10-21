import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Task } from './data'
import { TaskStatusEnum } from '../enums/app'
import { toast } from 'react-toastify'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://68f681e56b852b1d6f16f361.mockapi.io/api/v1' }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTaskLists: builder.query<Task[], void>({
      query:() => 'task-list',
      providesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `task-list/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getTaskLists', undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === id)
            if (index !== -1) draft.splice(index, 1)
          })
        )
        try {
          await queryFulfilled
        } catch {
          toast.error('Failed to delete task')
          patchResult.undo()
        }
      },
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<void, { id: string; text?: string; index?: number; status?: TaskStatusEnum }>({
      query: (task) => ({
        url: `task-list/${task.id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    addTask: builder.mutation<Omit<Task, 'id'>, Omit<Task, 'id'>>({
      query: (task) => ({
        url: 'task-list',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
})

export const { 
  useGetTaskListsQuery, 
  useDeleteTaskMutation, 
  useUpdateTaskMutation, 
  useAddTaskMutation
} = api