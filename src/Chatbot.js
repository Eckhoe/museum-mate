import React, { useEffect, useRef, useState } from "react";
import { GenerateBasic, GenerateChat } from "./GPT-3";
import { _queryPrefix, _directionPrefix, _museumInfo, _conTypeExamples, _exhibitInfo, _locIdentExamples, _musIdentExamples } from "./InputData";
import "./App.css";
import "./ChatBot.css";

/* This class implements the MuseumMate chatbot using calls to GPT-3 for text generation and React JS for I/O */
// Global variables
// TO DO: Change these variables to the final exhibits being used. Also update directionPrefix.
const locations = ["Lobby", "Restroom", "Security Office", "Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];
const exhibits = ["Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];
const museumTopics = ["MuseumMate", "Niagara on the Lake (NOTL) Museum", "Operating Hours", "Address", "Contact", "Facilities"];
const model = "text-davinci-003";
const restart = "\nGuest: ";
const start = "\nMuseumMate:";
const stop = [" Guest:", " MuseumMate:"];

// Message component
const Text = ({ text, onTextClick }) => {
    const textFrom = "text-" + (text.sender === "Guest" ? "Guest" : "MuseumMate");
    const textFrom1 = (text.sender === "Guest" ? "Guest" : "MuseumMate") + "-container";

    // Limit the clickable suggestions in text list to chatbot only
    const handleClick = () => {
        if (text.sender === "MuseumMate") {
            onTextClick(text.content);
        }
    };

    return (
        <div className="text-container">
            <div className={textFrom1}>
                <div className={textFrom} onClick={handleClick}
                    style={{ cursor: text.sender === "MuseumMate" ? "pointer" : "auto" }}>
                    <div className="text-sender">{text.sender + ": "}</div>
                    <div className="text-content">{text.content}</div>
                </div>
            </div>
        </div>
    );
};

// Main chatbot component
export const Chatbot = () => {
    // Local variables
    let isDirections = false;
    let directionPrefix = _directionPrefix;
    let queryPrefix = _queryPrefix;
    const museumInfo = _museumInfo;
    const conTypeExamples = _conTypeExamples;
    const exhibitInfo = _exhibitInfo;
    const locIdentExamples = _locIdentExamples;
    const musIdentExamples = _musIdentExamples;
    
    // TO DO: Query database for information on topics. DON'T FORGET TO UPDATE InputData.JS.

    // Default input prompt for starting the conversation.
    const startPrompt = "Hi! I am MuseumMate and I can provide information on all the exhibits around you as well as directions to anywhere in the museum! What can I help you with?";

    // Set the intitial output to match the type of conversation that is happening
    const [input, setInput] = useState("");
    directionPrefix = directionPrefix + "MuseumMate: " + startPrompt + "\nGuest: ";
    queryPrefix = queryPrefix + "MuseumMate: " + startPrompt + "\nGuest: ";

    // Output the intro
    const [text, setText] = useState([{ content: startPrompt, sender: "MuseumMate" }]);
    const textListEndRef = useRef(null);

    // Keep text list scrolled to the latest message
    useEffect(() => {
        if (textListEndRef.current) {
            textListEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [text]);

    // On enter add input to text list for display, get chatbot response and add to list as well
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (input.trim() === "") {
            return;
        }

        // Get user input and check the conversation type
        const temp = [...text, { content: input, sender: "Guest" }];
        let conType = await GenerateBasic(model, "Indicate if input is asking for directions.\n" + conTypeExamples + "Input: " + input + "\nOutput:");
        isDirections = conType.includes("Yes") ? true : false;

        // Determine the conversation we are having (Possibly make dynamic in the future)
        if (isDirections) {
            // Add user intput to the prompt
            directionPrefix = directionPrefix + input;

            // Use GPT-3 to find the starting and ending locations within the user input, confirm them (i.e., spelling issues), and 
            // remove blank lines (an issue with GPT-3)
            let departure = await GenerateBasic(model, "Return just the departure point from the following text: " + input);
            departure = await ConfirmLocation(locations, departure, locIdentExamples);
            departure = RemoveLines(departure);
            let destination = await GenerateBasic(model, "Return just the destination point from the following text: " + input);
            destination = await ConfirmLocation(locations, destination, locIdentExamples);
            destination = RemoveLines(destination);

            let curDirect = "";
            // Ensure you get the start and endpoints
            if(locations.includes(departure) && locations.includes(destination)){
                // TO DO: Output the points to the path finding algorithm and recieve the directions
                // Note: The code below is temporary to test the directions, replace later.
                const tempDirections = ["right(King Tut Exhibit), left, straight, right, straight, left(Security Office)",
                    "straight, right, left, upstairs, right(Ancient Greek Exhibit), downstairs(Dinosaur Exhibit)",
                    "left(Restroom), straight, right, straight(Lobby)"];
                const direction = tempDirections[Math.floor(Math.random() * tempDirections.length)];
                curDirect = directionPrefix + direction;
            }
            else{
                curDirect = "Rephrase this: I'm sorry! I couldn't quite figure out where you are and where you are going (some circuits must have crossed). Can you please let me know your current location and where you are trying to go?"
            }

            // Use GPT-3 to translate the directions into plain text
            const answer = await GenerateBasic(model, curDirect);
            setText([...temp, { content: `${answer}`, sender: "MuseumMate" }]);
            directionPrefix = directionPrefix + answer;
        }
        else {
            // Add user intput to the prompt
            queryPrefix = queryPrefix + input;

            // Use GPT-3 to extract the subject of the conversation
            let subject = await ConfirmLocation(exhibits, input, locIdentExamples);

            // Supply information to for the chatbot
            // If the subject is an exhibit then give exhibit information, if it is about the museum then give specific museum info, else just chat (i.e., info = "")
            let information = "";
            if(exhibits.includes(subject)){
                exhibitInfo.forEach(index => {
                    if (subject.includes(index[0])) {
                        information = index[1];
                    }
                })
            }
            else if(subject.includes("Other")){
                // This is the same variable extraction as above but for specific museum info from the input
                // This stops the chatbot from overoutputting information that wasn't explicitly asked
                subject = await ConfirmLocation(museumTopics, input, musIdentExamples);
                museumInfo.forEach(index => {
                    if (subject.includes(index[0])) {
                        information = index[1];
                    }
                })
            }

            // Generate an output
            const answer = await GenerateChat(model, queryPrefix, information, start, restart, stop + ".");
            queryPrefix = answer[1];
            setText([...temp, { content: `${answer[0]}`, sender: "MuseumMate" }]);
        }
        setInput(""); // Remove user text and reset text input field to default
    }

    // Fully reset the chatbot text list
    const handleReset = () => {
        setText([]);
        setText([{ content: startPrompt, sender: "MuseumMate" }])
    }


    // Chatbot popup toggle
    const [toggleOn, setToggle] = useState(false);

    // Clickable suggestions from chatbot
    const handleTextClick = (clickedText) => {
        setInput(clickedText);
    };

    // Add any other chatbot suggestions to array
    const suggestions = [
        "Here are some suggestions you can ask:",
        "Where is the museum?",
        "What are some famous exhibits?",
        "Are there any events approaching?",
        "What are the hours of operation?",
        "Other options..."
    ];

    // Initial suggestions display
    useEffect(() => {
        const timeout = setTimeout(() => {
            const suggestionsArray = suggestions.map((suggestion) => ({
                sender: "MuseumMate",
                content: suggestion
            }));
            setText((prevState) => [...prevState, ...suggestionsArray]);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    //accessibility below
    //text-to-speech
    const handleTTS = () => {
        setInput("text-to-speech logic here...")
    }

    // speech-to-text
    const handleSTT = () => {
        setInput("speech-to-text logic here...")
    }

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
                                <Text key={index} text={text} onTextClick={handleTextClick} />
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
                                <button className="chatbot-button" type="button" onClick={handleTTS}>
                                    Text-To-speech
                                </button>
                                <button className="chatbot-button" type="button" onClick={handleSTT}>
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

// This method uses GPT-3 to confirm a natural language input against a set list of data. It requires the set list, input, and a string of training data
export const ConfirmLocation = async (list, inputText, exampleData) => {
    inputText = RemoveLines(inputText);
    const prompt = "Return closest match to the Input from the List. If no match is found, return other." + "\nList: " + list.join(', ') + 
                    "\n" + exampleData + "Input: " + inputText + "\nOutput:";
    const temp = await GenerateBasic(model, prompt);
    return temp;
}

// This method uses GPT-3 to remove unnecessary white spaces from GPT generated responses
export const RemoveLines = (inputText) => {
    let temp = inputText.replace(/[\n\r]/g, '');
    return temp
}

export default Chatbot;