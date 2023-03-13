import {
    ConfirmLocation,
    RemoveLines,
    LevenshteinDistance,
    _queryPrefix,
    _directionPrefix, _museumInfo,
    _conTypeExamples, _exhibitInfo,
    _locIdentExamples, _musIdentExamples,
    _startPrompt
} from "./ChatbotHelper";
import React, { useEffect, useRef, useState } from "react";
import { GenerateBasic, GenerateChat } from "./GPT-3";
import { LanguageSelector, Loading } from "./Components"
import "./App.css";
import "./ChatBot.css";;

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
const museumInfo = _museumInfo;
const conTypeExamples = _conTypeExamples;
const exhibitInfo = _exhibitInfo;    // TO DO: Query database for information on topics. DON'T FORGET TO UPDATE InputData.JS.
const locIdentExamples = _locIdentExamples;
const musIdentExamples = _musIdentExamples;
const startPrompt = _startPrompt;
let isDirections = false;
let directionPrefix = _directionPrefix;
let queryPrefix = _queryPrefix;
let lang = "English";


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
    // Set the intitial output to match the type of conversation that is happening
    const [input, setInput] = useState("");

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
        setText([...temp, { content: `${answer}`, sender: "MuseumMate", image: null, video: null }]);
        setInput(""); // Remove user text and reset text input field to default
        setLoading(false); // Loading animation ends
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
        setInput((getSpeech) => [...getSpeech, ...talk]);
    }

    // Speech-to-text
    const handleSTT = () => {
        setInput((Listen) => [...Listen, ...Stop, ...End, ...onFinal, ...onInterimResult, ...onStop]);
    }

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

/*
* This method contains the main chatbot logic and is called whenever submit is pressed
*/
export const chat = async (input) => {
    // Local variables
    let answer = "";

    // Indicate the type of conversation
    let conType = await GenerateBasic(model, "Indicate if input is asking for directions. Reply Yes, No or Other.\n" + conTypeExamples + "Input: " + input + "\nOutput:");
    isDirections = conType.includes("Yes") ? true : false;

    if (isDirections) {
        // Add user intput to the prompt
        directionPrefix = directionPrefix + input;

        // Use GPT-3 to find the starting and ending locations within the user input and confirm them (i.e., spelling issues)
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
        directionPrefix = directionPrefix + answer;
    }
    else {
        // Add user intput to the prompt
        queryPrefix = queryPrefix + input;

        // Use GPT-3 to extract the subject of the conversation
        let subject = await ConfirmLocation(exhibits, input, locIdentExamples);

        let test = LevenshteinDistance("Cat", "Dog");

        // Supply information to for the chatbot about artifact
        // TODO: Find info using a Fuzzy String Search
        let information = "";
        if (exhibits.includes(subject)) {
            exhibitInfo.forEach(index => {
                if (subject.includes(index[0])) {
                    information = index[1];
                }
            })
        }
        else if (subject.includes("Other")) {
            // TODO: Add database quuery for museum info
            subject = await ConfirmLocation(museumTopics, input, musIdentExamples);
            museumInfo.forEach(index => {
                if (subject.includes(index[0])) {
                    information = index[1];
                }
            })
        }

        answer = await GenerateChat(model, queryPrefix, information, start, restart, stop + ".");
        queryPrefix = answer[1];
        answer = answer[0];
    }

    // Generate an output
    if (lang != "English") {
        answer = await GenerateBasic(model, "Translate the following text into " + lang + ": " + answer);
    }
    return answer;
}

export default Chatbot;