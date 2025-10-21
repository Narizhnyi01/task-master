import { useGetTaskListsQuery } from './services/api'
import { Header } from './components/Header/Header'
import { setTasks } from './store/tasksSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Board from './components/Board/Board'
import { toast, ToastContainer } from 'react-toastify'
import { TaskList } from './components/TaskList/TaskList'
import { TaskListSkeleton } from './components/Skeleton/Skeleton'
import { TaskStatusEnum } from './enums/app'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const { data, isLoading, error } = useGetTaskListsQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) dispatch(setTasks(data))
  }, [data, dispatch])

  useEffect(() => {
    if (error) {
      toast.error('Failed to load tasks. Please try again.')
    }
  }, [error])

  return (
    <div className="">
      <Header />
      {isLoading ? (
        <div className="container">
          <div className="flex jcsb">
            <TaskList title="To do" status={TaskStatusEnum.TODO} tasks={[]}>
              <TaskListSkeleton count={3} />
            </TaskList>
            <TaskList title="Doing" status={TaskStatusEnum.IN_PROGRESS} tasks={[]}>
              <TaskListSkeleton count={2} />
            </TaskList>
            <TaskList title="Done" status={TaskStatusEnum.DONE} tasks={[]}>
              <TaskListSkeleton count={1} />
            </TaskList>
          </div>
        </div>
      ) : error ? (
        <div className="container">
          <div className="flex jcsb">
            <TaskList title="To do" status={TaskStatusEnum.TODO} tasks={[]} />
            <TaskList title="Doing" status={TaskStatusEnum.IN_PROGRESS} tasks={[]} />
            <TaskList title="Done" status={TaskStatusEnum.DONE} tasks={[]} />
          </div>
        </div>
      ) : (
        <Board />
      )}
      <ToastContainer />
    </div>
  )
}
