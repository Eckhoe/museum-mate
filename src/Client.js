//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// All website layouts, designs, coding and functionality are Copyright © 2023 Robert Morabito, David Bailey, Maheen Samad, Fahad Arain, Dana Dobrosavljevic, and Jordan Bharati All right reserved.
//
// You may not otherwise copy, modify, or distribute this website (https://museum-mate-v1.vercel.app/) or the code contained in any manner.
// You may not remove or alter any copyright or other notice from this code or this website (https://museum-mate-v1.vercel.app/).
// 
// If you have further inquiry contact:
// Robert Morabito
// Developer
// hello@robertmorabito.ca
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
      <b>Artifacts</b>
      <div className='container'>
        <button 
          onClick={() => setOpenAddModal(true)}>
          Add Artifact 
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

