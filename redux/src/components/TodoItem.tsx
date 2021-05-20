import { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import cx from 'classnames'

import { toggleTodo, deleteTodo } from '../actions/todo'
import { Todo } from '../models/Todo'

interface Props {
  todo: Todo
}

const TodoItem: FC<Props> = ({ todo }) => {
  const dispatch = useDispatch()

  const handleDelete = useCallback(() => {
    dispatch(deleteTodo(todo.id))
  }, [dispatch, todo.id])

  const handleToggle = useCallback(() => {
    dispatch(toggleTodo(todo.id))
  }, [dispatch, todo.id])

  const textClassName = cx(
    'todo-item__text',
    todo && todo.completed && 'todo-item__text--completed'
  )

  return (
    <li className="todo-item">
      <span onClick={handleDelete}>
        {'❎'}
      </span>
      {' '}
      <span className={textClassName} onClick={handleToggle}>
        {todo && todo.completed ? '✅' : '🔴'}
        {' '}
        {todo.text}
      </span>
      {todo.link
        ? <span>
            {' '}
            <a href={todo.link} rel="noreferrer" target="_blank">
              {todo.link}
            </a>
          </span>
        : null
      }
    </li>
  )
}

export default TodoItem
