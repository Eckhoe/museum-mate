import React, {useEffect, useRef, useState} from "react";
import {GPTResponse, QueryGPT} from "./Rufis";
import "./App.css";
import "./ChatBot.css";

//message component
const Text = ({text, onTextClick}) => {
    const textFrom = "text-" + (text.sender === "user" ? "user" : "bot");
    const textFrom1 = (text.sender === "user" ? "user" : "bot") + "-container";

    //limit the clickable suggestions in text list to chatbot only
    const handleClick = () => {
        if (text.sender === "bot") {
            onTextClick(text.content);
        }
    };

    return (
        <div className="text-container">
            <div className={textFrom1}>
                <div className={textFrom} onClick={handleClick}
                     style={{cursor: text.sender === "bot" ? "pointer" : "auto"}}>
                    <div className="text-sender">{text.sender + ": "}</div>
                    <div className="text-content">{text.content}</div>
                </div>
            </div>
        </div>
    );
};

export const Chatbot = (props) => {
    const [input, setInput] = useState("");
    const [text, setText] = useState([{content: "Hello, I am a Chat-Bot, how can I help you?", sender: "bot"}]);
    const textListEndRef = useRef(null);

    //keep text list scrolled to the latest message
    useEffect(() => {
        if (textListEndRef.current) {
            textListEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [text]);

    //on enter add input to text list for display, get chatbot response and add to list as well
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (input.trim() === "") {
            return;
        }
        const temp = [...text, {content: input, sender: "user"}];
        QueryGPT(input);
        const rufisResponse = await GPTResponse();
        setText([...temp, {content: `${rufisResponse}`, sender: "bot"}]);
        setInput("");
    };

    //fully reset the chatbot text list
    const handleReset = () => {
        setText([]);
        setText([{content: "Hello, I am a Chat-Bot, how can I help you?", sender: "bot"}])
    }

    //chatbot popup toggle
    const [toggleOn, setToggle] = useState(false);

    //clickable suggestions from chatbot
    const handleTextClick = (clickedText) => {
        setInput(clickedText);
    };

    //add any other chatbot suggestions to array
    const suggestions = [
        "Here are some suggestions you can ask:",
        "Where is the museum?",
        "What are some famous exhibits?",
        "Are there any events approaching?",
        "What are the hours of operation?",
        "Other options..."
    ];

    //initial suggestions display
    useEffect(() => {
        const timeout = setTimeout(() => {
            const suggestionsArray = suggestions.map((suggestion) => ({
                sender: "bot",
                content: suggestion
            }));
            setText((prevState) => [...prevState, ...suggestionsArray]);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div>
            {toggleOn ? (
                <div className="chatbot">

                    <div className="chatbot-components">
                        <div className="chatbot-header">
                            <h1 className="chatbot-title">ChatBot</h1>
                            <button onClick={() => setToggle(false)}>Minimize</button>
                        </div>

                        <div className="text-list">
                            {text.map((text, index) => (
                                <Text key={index} text={text} onTextClick={handleTextClick}/>
                            ))}
                            <div ref={textListEndRef}></div>
                        </div>

                        <div className="text-form">
                            <form
                                className="form-container"
                                method="submit"
                                onSubmit={handleSubmit}
                                onReset={handleReset}
                            >
                                <input
                                    value={input}
                                    maxLength="100"
                                    size="40"
                                    onChange={(event) => setInput(event.target.value)}
                                    placeholder="Enter Text..."
                                />
                                <button className="chatbot-button" type="submit">
                                    Submit
                                </button>
                                <button className="chatbot-button" type="reset">
                                    Reset
                                </button>
                                <button className="chatbot-button">
                                    Text-To-speech
                                </button>
                                <button className="chatbot-button">
                                    Speech-To-Text
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            ) : (
                <div className="chatbot-toggle" onClick={() => setToggle(true)}>
                    ChatBot
                </div>
            )}
        </div>
    );

};

export default Chatbot;