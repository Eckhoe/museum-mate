import {db} from './Firebase'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import React, { useState } from 'react';
import './addExhibit.css'
import Modal from "./Modal"
import { GenerateBasic } from './GPT-3';


const addExhibitsSubmit = async (e, Title, Description, Date, ObjId, People, Subject, ImgUrl, onClose) => {
    e.preventDefault()
    try {
      let values = Title+"\n"+Description+"\n"+Date+"\n"+Subject;
      let GPTName = await GenerateBasic("text-davinci-003", "Generate a 2-8 word subject to encapsualte the following information:\n"+"//\n"+values+"\n//\n");
      await addDoc(collection(db, 'artifacts'), {
        Title: Title,
        Description: Description,
        Date: Date,
        ObjId: ObjId,
        People: People,
        Subject: Subject,
        ImgUrl: ImgUrl,
        GPTName: GPTName
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
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            placeholder='Enter Name'/>
          <textarea 
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter exhibit description'
            value={description}> 
            </textarea>
          <textarea 
            name='Date' 
            onChange={(e) => setDate(e.target.value)} 
            value={date}
            placeholder='Enter date'></textarea>
            
            <textarea 
            name='Object ID' 
            onChange={(e) => setObjId(e.target.value)} 
            value={ObjId}
            placeholder='Enter Object ID'></textarea>

            <textarea 
            type='text' 
            name='people' 
            onChange={(e) => setPeople(e.target.value)} 
            value={people}
            placeholder='Enter Names of People'></textarea>

            <textarea 
            type='text' 
            name='subjects' 
            onChange={(e) => setSubject(e.target.value)} 
            value={subject}
            placeholder='Enter the Subject'></textarea>

            <textarea 
            type='text' 
            name='imgUrls' 
            onChange={(e) => setImgurl(e.target.value)} 
            value={imgUrl}
            placeholder='Enter the Valid Image URLs'></textarea>
          <button type='submit'>Add</button>
        </form> 
      </Modal>
    )
  }
  
  export default AddExhibit
