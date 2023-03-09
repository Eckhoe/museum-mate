import React, {useState, useEffect} from "react";
import {auth, provider} from "./Firebase"
import {signInWithPopup} from "firebase/auth";
import Client from "./Client";

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
        </>
    )
}