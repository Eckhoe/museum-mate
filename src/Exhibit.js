import '/.Exhibit.css'
import {useState} from 'react'

import Modal from "./Modal"
import '/.modal.css'





function Modal({open, modalLable, children, custom_modal, onClose}) {

    const handleClose = (e) => {
      if(e.target.className === 'modalContainer'){
        onClose()
      }
      return null
    }
  
    if(open) {
      return (
        <div className='modalContainer' onClick={handleClose}>
          <div className= {`modal ${custom_modal}`}>
            <div className='modal__head'>
              <h2>{modalLable}</h2>
              <span className='modal__close' onClick={onClose}>x</span>
            </div>
            {children}
          </div>
        </div>
      )
    }
    return null
  }



  function Edit({open, onClose, toEditTitle, toEditDescription, id}) {

    const [title, setTitle] = useState(toEditTitle)
    const [description, setDescription] = useState(toEditDescription)
  
    /* function to update document in firestore */
  
    return (
      <Modal modalLable='Edit Exhibit' onClose={onClose} open={open}>
        <form className='edit' name='update'>
          <input 
            type='text' 
            name='title' 
            onChange={(e) => setTitle(e.target.value)} 
            value={title}/>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
          <button type='submit'>Edit</button>
        </form> 
      </Modal>
    )
  }







function TheExhibit({onClose, open, title, description}) {

  return (
    <Modal modalLable='The Exhibit' onClose={onClose} open={open}>
      <div className='TheExhibit'>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Modal>
  )
}

function Exhibit ({id, title, description, completed}) {

  const [checked, setChecked] = useState(completed)
  const [open, setOpen] = useState({edit:false, view:false})

  const handleClose = () => {
    setOpen({edit:false, view:false})
  }

   /* function to update document in firestore */

   /* function to delete a document from firstore */ 

  return (
    <div className={`exhibit ${checked && 'exhibit-border'}`}>
      <div>
        <input 
          id={`checkbox-${id}`} 
          className='checkbox-custom'
          name="checkbox" 
          checked={checked} 
          type="checkbox" />
        <label 
          htmlFor={`checkbox-${id}`} 
          className="checkbox-custom-label" 
          onClick={() => setChecked(!checked)} ></label>
      </div>
      <div className='exhibit__body'>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className='exhibit__buttons'>
          <div className='exhibit__delete'>
            <button 
              className='exhibit__editButton' 
              onClick={() => setOpen({...open, edit: true})}>
              Edit
            </button>
            <button className='exhibit__deleteButton'>Delete</button>
          </div>
          <button 
            onClick={() => setOpen({...open, view: true})}>
            View
          </button>
        </div>
      </div>

      {open.view &&
        <TheExhibit 
          onClose={handleClose} 
          title={title} 
          description={description} 
          open={open.view} />
      }

      {open.edit &&
        <Edit 
          onClose={handleClose} 
          toEditTitle={title} 
          toEditDescription={description} 
          open={open.edit}
          id={id} />
      }

    </div>
  )
}



export default Exhibit