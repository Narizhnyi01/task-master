import type { TaskStatusEnum } from "../enums/app"

export interface Task {
    id: string
    createdAt: Date
    index: number
    text: string
    status: TaskStatusEnum
}