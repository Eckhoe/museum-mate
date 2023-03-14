import {
    ConfirmLocation,
    RemoveLines,
    CalcSim,
    _queryPrefix,
    _directionPrefix,
    _museumInfo,
    _musIdentExamples,
    _conTypeExamples,
    _subIdentExamples,
    _startPrompt,
} from "./ChatbotHelper";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React, { useEffect, useRef, useState } from "react";
import { LanguageSelector, Loading } from "./Components";
import { GenerateBasic, GenerateChat } from "./GPT-3";
import { useSpeechSynthesis } from 'react-speech-kit'
import "./ChatBot.css";
import "./App.css";
import { db } from './Firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';

// Separate import of firebase database to get chatbot code working
/* import * as firebase from "firebase/app";
import "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyDXd3SXujiOC-0iYxe4E0gg2pfv5NUJaWI",
    authDomain: "museummate-e06b8.firebaseapp.com",
    databaseURL: "https://museummate-e06b8-default-rtdb.firebaseio.com",
    projectId: "museummate-e06b8",
    storageBucket: "museummate-e06b8.appspot.com",
    messagingSenderId: "607698800264",
    appId: "1:607698800264:web:4c20dd01fe7e9ededcd93d",
    measurementId: "G-JW69LNL7LD"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); */

/* 
 * This class implements the MuseumMate chatbot using calls to GPT-3 for text generation and React JS for I/O 
 */
// Global variables
const museumInfo = _museumInfo;
const startPrompt = _startPrompt;
const conTypeExamples = _conTypeExamples;
const subIdentExamples = _subIdentExamples;
const musIdentExamples = _musIdentExamples;
const locations = ["Lobby", "Restroom", "Security Office", "Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];
const exhibits = ["Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];
const museumTopics = ["MuseumMate", "Niagara on the Lake (NOTL) Museum", "Operating Hours", "Address", "Contact", "Facilities"];
const model = "text-davinci-003";
const restart = "\nGuest: ";
const start = "\nMuseumMate:";
const stop = [" Guest:", " MuseumMate:"];
const artifactRef = collection(db, "artifacts");
let directionPrefix = _directionPrefix;
let queryPrefix = _queryPrefix;
let isDirections = false;
let lang = "English";
let chatLog = "MuseumMate: Hi! I am MuseumMate and I can provide information on all the exhibits around you as well as directions to anywhere in the museum!\nGuest:";


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

    //src="https://www.youtube.com/embed/elp6ZktpQ1c"
    //add video component: "https://www.youtube.com/embed/"+VIDEO_ID+?{any options below}
    // autoplay=1  autoplay enabled
    // cc_lang_pref=en caption language (use ISO 639-1 Code http://www.loc.gov/standards/iso639-2/php/code_list.php)
    // cc_load_policy=1 captions on by default
    // controls=0 player controls not displayed
    // modestbranding=1 no youtube logo

    return (
        <div className="text-container">
            <div className={textFrom1}>
                <div className={textFrom} onClick={handleClick}
                    style={{ cursor: text.sender === "MuseumMate" ? "pointer" : "auto" }}>
                    <div className="text-sender">{text.sender + ": "}</div>
                    {text.image ? (
                        <>
                            <div className="text-content">{text.content}</div>
                            {text.video ? (
                                <iframe height="315" src={"https://www.youtube.com/embed/" + text.video + "?autoplay=1"}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen>
                                </iframe>
                            ) : (
                                <></>
                            )}
                            <img className="text-image" src={text.image} alt="Displayed image from database here" />
                        </>
                    ) : (
                        <>
                            {text.video ? (
                                <iframe height="315" src={"https://www.youtube.com/embed/" + text.video + "?autoplay=1"}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen>
                                </iframe>
                            ) : (
                                <></>
                            )}
                            <div className="text-content">{text.content}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main chatbot component
export const Chatbot = () => {
    const [input, setInput] = useState("");
    //Hook for variable use to capture speech to text
    const { transcript } = useSpeechRecognition();
    //Hook for variable use to capture text to speech
    const { speak } = useSpeechSynthesis();
    //use state for variable use to capture text to speech
    const [reply, setReply] = useState(startPrompt);

    // video/image that is added to chabot reply text through setText
    // @imageOutput contains an image pulled from the database or a url link
    // @videoOutput contains the end ending url segment of video from youtube or database
    const imageOutput = "/image1.jpg";
    const videoOutput = "elp6ZktpQ1c"; //war of 1812 link

    // Output the intro
    const [text, setText] = useState([{ content: startPrompt, sender: "MuseumMate", image: null, video: null }]);
    const textListEndRef = useRef(null);

    // Keep text list scrolled to the latest message
    useEffect(() => {
        if (textListEndRef.current) {
            textListEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    },);

    // Set loading
    const [isLoading, setLoading] = useState(false);

    // On enter add input to text list for display, get chatbot response and add to list as well
    const handleSubmit = async (event) => {

        event.preventDefault();
        if (input.trim() === "") {
            return;
        }

        // Get user input and check the conversation type
        const temp = [...text, { content: input, sender: "Guest" }];
        setLoading(true); // Loading animation starts
        let answer = await chat(input);
        setText([...temp, { content: `${answer[0]}`, sender: "MuseumMate", image: answer[1], video: null }]);
        setReply(answer);
        console.log(reply);
        setInput(""); // Remove user text and reset text input field to default
        setLoading(false); // Loading animation ends
        //TTS if on
        if (ttsOn) {
            speak({ text: answer });
        }
    }

    // Fully reset the chatbot text list and TTS
    const handleReset = () => {
        setText([]);
        setText([{ content: startPrompt, sender: "MuseumMate" }])
        setReply(startPrompt);
        if (ttsOn) {
            speak({ text: startPrompt });
        }
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

    // Accessibility below
    // Text-to-speech
    const handleTTS = () => {
        //speak({text:reply});
        // enable auto TTS
        if (ttsOn) {

            toggleTTS(false);
        } else {
            toggleTTS(true);
            speak({ text: reply });
        };
        console.log(ttsOn)
    };

    // toggle automatic text-to-speech on/off
    const [ttsOn, toggleTTS] = useState(false);

    // Speech-to-text
    useEffect(() => {
        setInput(transcript);
    }, [transcript])

    // Sets chatbot popup default to active if on chatbot page
    useEffect(() => {
        const currentUrl = window.location.href;
        //console.log(currentUrl);
        if (currentUrl === "http://localhost:3000/chatbot") {
            setToggle(true);
        }
    }, []);

    // Sets a loading animation while waiting for chabot response
    const Loader = () => {
        if (isLoading) {
            return (
                <div>
                    <Loading />
                </div>
            )
        }
    };

    // selected language for user-chabot interaction
    // @language contains the currently selected language from the chatbot drop down menu
    const [language, setLanguage] = useState("English");
    const handleLanguageChange = (language) => {
        setLanguage(language);
        lang = language
    };

    return (
        <div>
            {toggleOn ? (
                <div className="chatbot">

                    <div className="chatbot-components">
                        <div className="chatbot-header">
                            <LanguageSelector onlanguagechange={handleLanguageChange} />
                            <h1 className="chatbot-title">ChatBot</h1>
                            <button onClick={() => setToggle(false)}>Minimize</button>
                        </div>

                        <div className="text-list">
                            {text.map((text, index) => (
                                <Text key={index} text={text} onTextClick={handleTextClick} />
                            ))}
                            <Loader />
                            <div ref={textListEndRef}></div>
                        </div>

                        <div className="text-form">
                            <form
                                className="form-container"
                                method="submit"
                                onSubmit={handleSubmit}
                                onReset={handleReset}
                            >
                                <input className="form-input"
                                    value={input}
                                    maxLength="100"
                                    //size="100"
                                    onChange={(event) => setInput(event.target.value)}
                                    placeholder="Enter Text..."
                                />
                                <button className="chatbot-button" type="submit">
                                    Submit
                                </button>
                                <button className="chatbot-button" type="reset">
                                    Reset
                                </button>
                                <button className="chatbot-button" type="button" onClick={SpeechRecognition.startListening} >
                                    Mic Start
                                </button>
                                <button className={ttsOn ? "chatbot-button-on" : "chatbot-button"} type="button" onClick={handleTTS}>
                                    {ttsOn ? "Speech off" : "Speech on"}
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

/*
* This method contains the main chatbot logic and is called whenever submit is pressed
*/
export const chat = async (input) => {
    // Local variables
    let answer = "";
    let photo = "";
    let response = [];

    // Indicate the type of conversation
    let conType = await GenerateBasic(model, "Reply Yes if the following input is asking for direction or No if it is not:\n"
        + conTypeExamples + "Input: " + input + "\nOutput:");
    isDirections = false;

    if (isDirections) {
        // Add user intput to the prompt
        chatLog = chatLog + input;

        // Use GPT-3 to find the starting and ending locations within the user input and confirm them (i.e., spelling issues)
        // TODO: Change example data
        let departure = await GenerateBasic(model, "Return just the departure point from the following text: " + input);
        departure = await ConfirmLocation(locations, departure, locIdentExamples);
        departure = RemoveLines(departure);
        let destination = await GenerateBasic(model, "Return just the destination point from the following text: " + input);
        destination = await ConfirmLocation(locations, destination, locIdentExamples);
        destination = RemoveLines(destination);

        let curDirect = "";
        // Ensure you get the start and endpoints
        if (locations.includes(departure) && locations.includes(destination)) {
            // TO DO: Output the points to the path finding algorithm and recieve the directions
            // Note: The code below is temporary to test the directions, replace later.
            const tempDirections = ["right(King Tut Exhibit), left, straight, right, straight, left(Security Office)",
                "straight, right, left, upstairs, right(Ancient Greek Exhibit), downstairs(Dinosaur Exhibit)",
                "left(Restroom), straight, right, straight(Lobby)"];
            const direction = tempDirections[Math.floor(Math.random() * tempDirections.length)];
            curDirect = directionPrefix + direction;
        }
        else {
            curDirect = "Rephrase this: I'm sorry! I couldn't quite figure out where you are and where you are going (some circuits must have crossed). Can you please let me know your current location and where you are trying to go?"
        }

        // Use GPT-3 to translate the directions into plain text
        answer = await GenerateBasic(model, curDirect);
        chatLog = chatLog + answer;
    }
    else {
        // Add user intput to the prompt
        chatLog = chatLog + input;

        // Use GPT-3 to extract the subject of the conversation
        let subject = await GenerateBasic(model, "Determine the subject or category of the provided text. The input prompts can be in the form of a question or statement, and the model should respond with the most appropriate subject or category. Examples of valid input prompts and their corresponding outputs are:\n"
            + subIdentExamples + "Prompt: " + input + "Output:");
        let min = Infinity;
        let information = "";

        let temp = await ConfirmLocation(museumTopics, input, musIdentExamples);
        // First check if they are asking about the museum
        museumInfo.forEach(index => {
            if (temp.includes(index[0])) {
                information = index[1];
            }
        })

        // If we aren't then run the database code
        if (information == "") {
            // Search the database for the closest matching GPTName to the user input and store the data in a 2Darray
            const querySnapshot = await getDocs(artifactRef);
            querySnapshot.forEach((doc) => {
                let GPTName = doc.data().GPTName;
                let Desc = doc.data().Description;
                console.log(doc.data().Id);

                // Use Levenshtein Distance to get a number metric for the closeness of string to the input and record the description
                temp = CalcSim(subject, GPTName);

                // We want the smallest value, meaning closest
                if (temp < min) {
                    min = temp;
                    information = Desc;
                    photo = doc.data().images[0];
                }
            });
        }

        answer = await GenerateChat(model, queryPrefix + "\nSource Material: " + information + "\n" + chatLog, start, restart, stop + ".");
        chatLog += answer[1];
        answer = answer[0];
    }

    // Generate an output
    if (lang != "English") {
        answer = await GenerateBasic(model, "Translate the following text into " + lang + ": " + answer);
    }
    response = [answer, photo];
    return response;
}

export default Chatbot;