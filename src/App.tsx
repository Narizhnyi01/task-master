import { useGetTaskListsQuery } from './services/api'
import { Header } from './components/Header/Header'
import { selectDoneTasks, selectInProgressTasks, selectTodoTasks, setTasks } from './store/tasksSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TaskList } from './components/TaskList/TaskList'
import { TaskStatusEnum } from './enums/app'

export default function App() {
  const { data, isLoading, error } = useGetTaskListsQuery()
  const dispatch = useDispatch()

  const todoTasks = useSelector(selectTodoTasks)
  const inProgressTasks = useSelector(selectInProgressTasks)
  const doneTasks = useSelector(selectDoneTasks)

  useEffect(() => {
    if (data) dispatch(setTasks(data))
  }, [data, dispatch])

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка загрузки</p>

  return (
    <div className="">
      <Header />
      <div className="container">
        <div className="flex jcsb">
          <TaskList title="To do" status={TaskStatusEnum.TODO} tasks={todoTasks} />
          <TaskList title="Doing" status={TaskStatusEnum.IN_PROGRESS} tasks={inProgressTasks} />
          <TaskList title="Done" status={TaskStatusEnum.DONE} tasks={doneTasks} />
        </div>
      </div>
    </div>
  )
}
