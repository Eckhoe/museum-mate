import React, {useState, useEffect} from "react";
import {auth, provider} from "./Firebase"
import {signInWithPopup} from "firebase/auth";
import Client from "./Client";
import { useNavigate} from "react-router-dom"

export const Login = (props) => {
    const [value, setValue] = useState('')
    
    const handleClick = () =>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue(data.user.email)
            localStorage.setItem("email", data.user.email)
        })
    }
    
    useEffect(()=>{
        setValue(localStorage.getItem('email'))
    })

   return (
    <>
    
        <div className="input-group">
        <h1>MuseumMate</h1>
        
    
        {value?<Client/>:<button onClick={handleClick}>Sign In With Google</button>}


        <div className="continue-button">
        <button onClick={() => props.onFormSwitch('chatbot')}> Continue as a vistor</button>
        </div>
        </div>
    </>
   )
}