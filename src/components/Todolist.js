import React, { useState } from 'react'
import { CheckCircle } from '@mui/icons-material'
import { Edit } from '@mui/icons-material'
import { Delete } from '@mui/icons-material'

const Todolist = ({ todo, toggleComplete, handleEdit, handleDelete }) => {
    const [newTitle, setNewTitle] = useState(todo.title)
    const [dueTime, setDueTime] = useState('')
    const handleChange = (e) =>{
        e.preventDefault()
        if(todo.title === true){
            setNewTitle(todo.title)
        }else{
            todo.title = ""
            setNewTitle(e.target.value)
        }
    }

    const scheduleNotification = () => {
      if (Notification.permission === 'granted') {
        const now = new Date();
        const dueDateTime = new Date(now.toDateString() + ' ' + dueTime);
  
        if (dueDateTime <= now) {
          alert('Please select a future time.');
          return;
        }else{
          alert('Reminder is set');
        }
  
        const timeDifference = dueDateTime.getTime() - now.getTime();
  
        setTimeout(() => {
          new Notification(`Task "${todo.title}" is due. Complete it now!`);
        }, timeDifference);
      } else {
        alert('Please allow notifications for this feature to work.');
      }
    }

  return (
    <div className='todo'>
      <input type='text' className={`todo ${todo.completed ? 'completeed-task' : ''}`} value={todo.title === "" ? newTitle : todo.title} onChange={handleChange}/>
      <div className={`todo ${todo.completed ? 'btns' : ''}`}>
        <button className='button-complete' onClick={()=>toggleComplete(todo)}>
            <CheckCircle id="i"/>
        </button>
        <button className='button-edit' onClick={()=>handleEdit(todo, newTitle)}>
            <Edit id="i"/>
        </button>
        <button className='button-delete' onClick={()=>handleDelete(todo.id)}>
            <Delete id="i"/>
        </button>
        {
          !todo.completed && (
            <div className='timer'>
              <input type="time" id="taskTime" name="taskTime" onChange={(e) => setDueTime(e.target.value)}></input>
              <button onClick={scheduleNotification}>Schedule</button>
            </div>
          )
        }
        

      </div>
      
    </div>
  )
}

export default Todolist
