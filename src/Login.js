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
import React, {useState, useEffect} from "react";
import {auth, provider} from "./Firebase"
import {signInWithPopup} from "firebase/auth";
import Client from "./Client";
import {Footer} from "./Components";

export const Login = (props) => {
    const [value, setValue] = useState('')

    const handleClick = () => {
        signInWithPopup(auth, provider).then((data) => {
            setValue(data.user.email)
            localStorage.setItem("email", data.user.email)
        })
    }

    useEffect(() => {
        setValue(localStorage.getItem('email'))
    })

    //const isMobile = window.innerWidth <= 768;

    return (
        <>
            <div className="input-group">
                <h1>MuseumMate Admin</h1>
                {value ? <Client/> : <button onClick={handleClick}>Sign In With Google</button>}
            </div>
            <Footer/>
        </>
    )
}