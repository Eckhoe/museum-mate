import React from "react"
import {db} from "./Firebase"
import {ref, set, get, update, remove, child} from "firebase/database"
import {useState} from 'react'
import AddExhibit from "./addExhibit"


function Client() {

  const [openAddModal, setOpenAddModal] = useState(false)
   const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className='exhibits'>
      <header>Exhibits </header>
      <div className='container'>
        <button 
          onClick={() => setOpenAddModal(true)}>
          Add Exhibit 
        </button>
        <button onClick={logout}> Logout </button>
        
      </div>

      {openAddModal &&
        <AddExhibit onClose={() => setOpenAddModal(false)} open={openAddModal}/>
      }

    </div>
    

  )
}

export default Client

