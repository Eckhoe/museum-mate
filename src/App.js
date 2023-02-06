
import React, { useState } from "react";
import './App.css';
import { Login } from "./Login"
import {Chatbot} from "./Chatbot";

function App() {
  const [currentForm, setCurrentForm ] = useState('login');
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className="App">
    {
      currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Chatbot  onFormSwitch={toggleForm}/>
    }
    </div>
    
   
  );
}

export default App;
