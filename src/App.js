import React, { useEffect, useState } from 'react';
import Input from './components/Input';
import Todolist from './components/Todolist';
import { onSnapshot, query, collection, doc, deleteDoc, updateDoc,Timestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase-Config'
import {messaging} from './firebase-Config'
import {getToken} from 'firebase/messaging'
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [uncompletedTodos, setUncompletedTodos] = useState([]);

  const requestPermission = async () =>{
    const permission = await Notification.requestPermission()
    if(permission === 'granted'){
      const token = await getToken(messaging, {vapidKey: 
        'BDsZEoWg99KmYrEQaQHApf9mb9MUoZwnK-Twwsw0HzmU-2EC04aiM4g3HcSIk-CUsDGBRwlamF3xliwPW5YIzl4'})
      console.log('token gen:', token)

    }else if(permission === 'denied'){
      alert('You denied for the notification')
    }
  }


  const sendReminderNotification = (action,todo) => {
    let message = '';
  
    if (action === 'completed') {
      message = 'Task is completed!';
    } else if (action === 'deleted') {
      message = 'Task is deleted!';
    } else if (action === 'updated') {
      message = 'Task is updated!';
    } else if (action === 'added') {
      message = 'New Task Added';
    }else if (action === 'due') {
      message = `Task "${todo.title}" is due. Complete it now!`;
    }else if (action === 'render'){
      message = 'You have uncompleted tasks.';
    }
  
    if (Notification.permission === 'granted') {
      new Notification('Reminder', {
        body: message,
      });
    }
  };
  

  useEffect(() => {
    if ('Notification' in window) {
      navigator.serviceWorker.addEventListener('notificationclick', (event) => {
        event.notification.close();
        
        window.location.href = '/uncompleted-tasks';
      });
    }
  }, []);

  useEffect(() => {
    sendReminderNotification('render');
  }, []);

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (snapshot) => {
      let todosArray = [];
      snapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });

      setTodos(todosArray);
      
    });

    requestPermission()
    return () => unsub();
  }, [uncompletedTodos]);

  const handleEdit = async (todo, title) => {
    const updatedTodo = { ...todo, title };
  
    await updateDoc(doc(db, "todos", todo.id), updatedTodo);
  
    if (updatedTodo.completed) {
      setCompletedTodos((prev) =>
        prev.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
      );
      setUncompletedTodos((prev) => [...prev, updatedTodo]);

      sendReminderNotification('updated');
    } else {
      setUncompletedTodos((prev) =>
        prev.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
      );
      setCompletedTodos((prev) => prev.filter((item) => item.id !== updatedTodo.id));

    }
  };
  

  const toggleComplete = async (todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
  
    if (updatedTodo.completed) {
      updatedTodo.completedTimestamp = Timestamp.now();
      setUncompletedTodos((prev) => prev.filter((item) => item.id !== todo.id));
      setCompletedTodos((prev) => [...prev, updatedTodo]);
    } else {
      updatedTodo.completedTimestamp = null;
      setUncompletedTodos((prev) => [...prev, updatedTodo]);
      setCompletedTodos((prev) => prev.filter((item) => item.id !== todo.id));
    }
  
    await updateDoc(doc(db, "todos", todo.id), updatedTodo);
  };
  
  


  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setUncompletedTodos((prev) => prev.filter((item) => item.id !== id));
    setCompletedTodos((prev) => prev.filter((item) => item.id !== id));

    sendReminderNotification('deleted');
  };

  return (
    <div className="App">
      {/* <div className="navbar">
        <header>
          <nav className="nav">
            <ul className="list">
              <li className='notification-icon'>
              <FontAwesomeIcon icon={faBell} className="my-custom-class" style={{ fontSize: '24px' }} />

              </li>
            </ul>
          </nav>  
        </header>
      </div>    */}
      <div className='container'>
        <div className="title">
          <h1>Todo App</h1>
        </div>
      <div>
        <Input />
      </div>
      <div className="todo-container">
        <div className="uncompleted-tasks">
        <h2>All Tasks</h2>
        {todos.map((todo) => (
          <Todolist
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
        </div>
        <div className="completed-tasks">
        <h2>Completed Tasks</h2>
        {completedTodos.map((todo) => (
          <div key={todo.id} className="completed-task">
            <span className="completed-title">{todo.title}</span>
            {todo.completedTimestamp && (
              <span className="completed-timestamp">
                Completed on: {new Date(todo.completedTimestamp.toMillis()).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>


      </div>
      </div>
    </div>
  );
}

export default App;
