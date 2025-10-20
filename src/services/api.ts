import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Task } from './data'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://68f681e56b852b1d6f16f361.mockapi.io/api/v1' }),
  endpoints: (builder) => ({
    getTaskLists: builder.query<Task[], void>({
      query:() => 'task-list',
    }),
  }),
})

export const { useGetTaskListsQuery } = api