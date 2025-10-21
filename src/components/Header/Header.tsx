import styles from './Header.module.css'
import logoImg from '../../assets/logo.png'
import taskIcon from '../../assets/icons/task.svg'
import { Button } from '../Button/Button'
import { useAddTaskMutation } from '../../services/api'
import { useState } from 'react'
import { TaskStatusEnum } from '../../enums/app'
import { useSelector } from 'react-redux'
import { selectTodoTasks } from '../../store/tasksSlice'
import { getNextIndexForColumn } from '../../utils/taskIndexUtils'

export const Header = () => {
  const [addTask, { isLoading }] = useAddTaskMutation()
  const [text, setText] = useState('')
  const todoTasks = useSelector(selectTodoTasks)

  const handleAddTask = async () => {
    if (text.trim() === '') return
    // Вычисляем правильный индекс перед отправкой
    const nextIndex = getNextIndexForColumn(todoTasks, TaskStatusEnum.TODO)
    await addTask({ text: text, createdAt: new Date(), index: nextIndex, status: TaskStatusEnum.TODO })
    setText('')
  }
  return (
    <header className={styles.header}>
        <div className="container">
            <div className="flex aic jcsb">
                <div className="flex aic fg-1">
                  <img src={logoImg} alt="Logo" className={styles.logo} />
                  <input className={styles.input} type="text" placeholder="Add new task" value={text} onChange={(e) => setText(e.target.value)} />
                  <Button text={isLoading ? '∞' : '+'} onClick={handleAddTask} disabled={text.trim() === '' || isLoading} />
                </div>
                <div className="flex aic">
                  <h1 className={styles.title}>Task Master</h1>
                  <img src={taskIcon} width="38px" height="38px" alt="Task" className={styles.taskIcon} />
                </div>
            </div>
        </div>
    </header>
  )
}
