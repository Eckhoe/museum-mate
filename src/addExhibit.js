import {db} from './Firebase'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import React, { useState } from 'react';
import './addExhibit.css'
import Modal from "./Modal"


const addExhibitsSubmit = async (e, title, description, onClose) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'exhibits'), {
        title: title,
        description: description,
        
      })
      onClose()
    } catch (err) {
      alert(err)
    }
  }

  function AddExhibit({onClose, open}) {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
  
    return (
      <Modal modalLable='Add Exhibit' onClose={onClose} open={open}>
        <form onSubmit={(e) => addExhibitsSubmit(e, title, description, onClose)} className='addE' name='addE'>
          <input 
            type='text' 
            name='title' 
            onChange={(e) => setTitle(e.target.value.toUpperCase())} 
            value={title}
            placeholder='Enter title'/>
          <textarea 
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter exhibit decription'
            value={description}></textarea>
          <button type='submit'>Add</button>
        </form> 
      </Modal>
    )
  }
  
  export default AddExhibit
