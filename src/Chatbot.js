import React, {useEffect, useRef, useState} from "react";
import './App.css';

//message component
const Text = ({text}) => {

    const textFrom = "text-" + (text.sender === "user" ? "user" : "bot");

    return (
        <div className={textFrom}>
            <div className="text-sender">
                {text.sender+" : "}
            </div>
            <div className="text-content">
                {text.content}
            </div>
        </div>
    )
}

export const Chatbot = (props) => {

    const [input,setInput] = useState("")
    const [text,setText] = useState([]);
    const textListEndRef = useRef(null);

    useEffect(() => {
        textListEndRef.current.scrollIntoView({behavior:"smooth"});
        }, [text]
    );

    const handleSubmit=(event) => {

        event.preventDefault();

        const temp = ([...text,{content:input, sender:"user"}]);
        //can be sent out to the chatbot/server to generate a response held below:
        //const output = return some data from chatbot/server
        //the chatbot's response to user input below:
        //setMessage([...tempMessage,{content:output, sender:"bot"}]);
        setText([...temp,{content:"chatbot response to user (temp)...", sender:"bot"}]);
        setInput("");

        console.log(input)
        console.log(text);
    }

    return(
            <div className="chatbot">

                <h1 className="chatBot-header">ChatBot</h1>
                <div className="text-list">

                    {text.map((text,index)=> (
                        <Text key={index} text={text}/>
                        )
                    )
                    }
                    <div ref={textListEndRef}></div>
            </div>
                <div className="text-form">
                    <form className="form-container" method="post" onSubmit={handleSubmit}>

                        <input value={input} maxLength="100" onChange={(event)=>setInput(event.target.value)} placeholder="Enter Text..."/>

                        <button className="chatbot-button" type="submit" >Submit</button>
                    </form>
            </div>

            <button className="return-login" onClick={() => props.onFormSwitch('login')}> Return to login</button>
            </div>
        )
}