import React, {useState} from "react";

export const Login = (props) => {
    const [User, setUser] =useState('');
    const [Pass, setPass] =useState('');

   const handleSubmit = (e) => {
       e.preventDefault();
       console.log(User);
   }
   return (
    <>
    
        <div className="input-group">
        <h1>MuseumMate</h1>
       <form className="login-page" onSubmit={handleSubmit}>
           <label htmlFor="Username">Username</label>
           <input  value= {User} onChange={(e) => setUser(e.target.value)} type="Username" placeholder="          NOLTMuseum" id="Username" name="Username"/>

           <label htmlFor="Password">Password</label>
           <input value= {Pass} onChange={(e) => setPass(e.target.value)} type="Password" placeholder="              ***********" id="Password" name="Password"/>

           <button type="submit">Log In</button>
        </form>
        
        <div className="continue-button">
        <button onClick={() => props.onFormSwitch('chatbot')}> Continue as a vistor</button>
        </div>
        </div>
    </>
   )
}