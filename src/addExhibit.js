import {db} from './Firebase'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import React, { useState } from 'react';
import './addExhibit.css'
import Modal from "./Modal"


const addExhibitsSubmit = async (e, title, description, date, objId, people, subject, imgUrl, onClose) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'artifacts'), {
        title: title,
        description: description,
        date: date,
        objId:objId,
        people: people,
        subject: subject,
        imgUrl: imgUrl

      })

      onClose()
    } catch (err) {
      alert(err)
    }
  }

  function AddExhibit({onClose, open}) {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('');
    const [ObjId, setObjId] = useState('');
    const [people, setPeople] = useState('');
    const [subject, setSubject] = useState('');
    const [imgUrl, setImgurl] = useState(''); 


    return (
      <Modal modalLable='Add Artifact' onClose={onClose} open={open}>
        <form onSubmit={(e) => addExhibitsSubmit(e, title, description, date, ObjId, people, subject, imgUrl,onClose)} className='addE' name='addE'>
          <input 
            type='text' 
            name='title' 
            onChange={(e) => setTitle(e.target.value.toUpperCase())} 
            value={title}
            placeholder='Enter Name'/>
          <textarea 
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter exhibit description'
            value={description}> 
            </textarea>
          <textarea 
            type='text' 
            name='Date' 
            onChange={(e) => setDate(e.target.value)} 
            value={date}
            placeholder='Enter date'></textarea>
            <textarea 
            type='text' 
            name='Object ID' 
            onChange={(e) => setObjId(e.target.value)} 
            value={date}
            placeholder='Enter Object ID'></textarea>
            <textarea 
            type='text' 
            name='people' 
            onChange={(e) => setPeople(e.target.value)} 
            value={date}
            placeholder='Enter Names of People'></textarea>
            <textarea 
            type='text' 
            name='subjects' 
            onChange={(e) => setSubject(e.target.value)} 
            value={date}
            placeholder='Enter the Subject'></textarea>
            <textarea 
            type='text' 
            name='imgUrls' 
            onChange={(e) => setImgurl(e.target.value)} 
            value={date}
            placeholder='Enter the Valid Image URLs'></textarea>
          <button type='submit'>Add</button>
        </form> 
      </Modal>
    )
  }
  
  export default AddExhibit
