import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase-Config';

const Input = () => {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title !== '') {
            await addDoc(collection(db, 'todos'), {
                title,
                completed: false
            });
            setTitle('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Enter Todo Task'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                ></input>
                <button>+</button>
            </form>
        </div>
    );
};

export default Input;
