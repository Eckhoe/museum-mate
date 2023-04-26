import {
  RemoveLines,
  SearchDB,
  _queryPrefix,
  _directionPrefix,
  _museumInfo,
  _conTypeExamples,
  _subIdentExamples,
  _startPrompt,
  _startIdentExamples,
  _endIdentExamples
} from "./ChatbotHelper";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useEffect, useRef, useState } from "react";
import { LanguageSelector, Loading } from "./Components";
import { GenerateBasic, GenerateChat } from "./GPT-3";
import { useSpeechSynthesis } from "react-speech-kit";
import { getPath } from "./Directional.js";
import { merge } from "./MapGeneration.js";
import "./ChatBot.css";
import "./App.css";
//import $ from "jquery";

/*
 * This class implements the MuseumMate chatbot using calls to GPT-3 for text generation and React JS for I/O
 */
// Global variables
const museumInfo = _museumInfo;
const startPrompt = _startPrompt;
const conTypeExamples = _conTypeExamples;
const subIdentExamples = _subIdentExamples;
const startIdentExamples = _startIdentExamples;
const endIdentExamples = _endIdentExamples;
const model = "text-davinci-003";
const restart = "\nGuest: ";
const start = "\nMuseumMate:";
const stop = [" Guest:", " MuseumMate:"];
const staticLocations = ["Entrance", "Desk", "Washroom"];
let directionPrefix = _directionPrefix;
let queryPrefix = _queryPrefix;
let isDirections = false;
let lang = "English";
let startLoc = "N/A";
let endLoc = "N/A";
let chatLog =
  "MuseumMate: Hi! I am MuseumMate and I can provide information on all the exhibits around you as well as directions to anywhere in the museum!\nGuest:";

// Message component
const Text = ({ text, onTextClick }) => {
  const textFrom = "text-" + (text.sender === "Guest" ? "Guest" : "MuseumMate");
  const textFrom1 =
    (text.sender === "Guest" ? "Guest" : "MuseumMate") + "-container";

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
        <div
          className={textFrom}
          onClick={handleClick}
          style={{ cursor: text.sender === "MuseumMate" ? "pointer" : "auto" }}
        >
          <div className="text-sender">{text.sender + ": "}</div>
          {text.image ? (
            <>
              <div className="text-content">{text.content}</div>
              {text.video ? (
                <iframe
                  height="315"
                  src={
                    "https://www.youtube.com/embed/" +
                    text.video +
                    "?autoplay=1"
                  }
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <></>
              )}
              <img
                className="text-image"
                src={text.image}
                alt="Displayed image from database here"
              />
            </>
          ) : (
            <>
              {text.video ? (
                <iframe
                  height="315"
                  src={
                    "https://www.youtube.com/embed/" +
                    text.video +
                    "?autoplay=1"
                  }
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
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
  const [text, setText] = useState([
    { content: startPrompt, sender: "MuseumMate", image: null, video: null },
  ]);
  const textListEndRef = useRef(null);

  // Keep text list scrolled to the latest message
  useEffect(() => {
    if (textListEndRef.current) {
      textListEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

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
    setText([
      ...temp,
      {
        content: `${answer[0]}`,
        sender: "MuseumMate",
        image: answer[1],
        video: null,
      },
    ]);
    setReply(answer[0]);
    console.log(reply);
    setInput(""); // Remove user text and reset text input field to default
    setLoading(false); // Loading animation ends
    //TTS if on
    if (ttsOn) {
      speak({ text: answer[0] });
    }
  };

  // Fully reset the chatbot text list and TTS
  const handleReset = () => {
    setText([]);
    setText([{ content: startPrompt, sender: "MuseumMate" }]);
    setReply(startPrompt);
    if (ttsOn) {
      speak({ text: startPrompt });
    }
  };

  // Chatbot popup toggle
  const [toggleOn, setToggle] = useState(false);

  // Clickable suggestions from chatbot
  const handleTextClick = (clickedText) => {
    setInput(clickedText);
  };

  // Add any other chatbot suggestions to array
  const suggestions = [
    "Here are some suggestions you can ask:",
    "What is the museum address?",
    "What are some famous exhibits?",
    "What are the hours of operation?",
  ];

  // Initial suggestions display
  useEffect(() => {
    const timeout = setTimeout(() => {
      const suggestionsArray = suggestions.map((suggestion) => ({
        sender: "MuseumMate",
        content: suggestion,
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
    }
  };

  // toggle automatic text-to-speech on/off
  const [ttsOn, toggleTTS] = useState(false);

  // Speech-to-text
  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // Sets a loading animation while waiting for chabot response
  const Loader = () => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      );
    }
  };

  // selected language for user-chabot interaction
  // @language contains the currently selected language from the chatbot drop down menu
  const [language, setLanguage] = useState("English");
  const handleLanguageChange = (language) => {
    setLanguage(language);
    lang = language;
  };

  return (
    <div>
      {toggleOn ? (
        <div className="chatbot-container">

          <div className="chatbot-components">
            <div className="chatbot-header">
              <LanguageSelector onlanguagechange={handleLanguageChange} />
              <h1 className="chatbot-title">ChatBot</h1>
              <button onClick={() => setToggle(false)}>
                <img src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/14/null/external-minimize-arrows-tanah-basah-basic-outline-tanah-basah-2.png" alt="Minimize" />
              </button>
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
                  <img src="https://img.icons8.com/external-solidglyph-m-oki-orlando/14/null/external-Enter-basic-ui-solidglyph-m-oki-orlando.png" alt="Submit" />
                </button>
                <button className="chatbot-button" type="reset">
                  <img src="https://img.icons8.com/sf-black/14/null/recurring-appointment.png" alt="Reset" />
                </button>
                <button className="chatbot-button" type="button" onClick={SpeechRecognition.startListening} >
                  <img src="https://img.icons8.com/material-rounded/14/null/microphone.png" alt="Mic Start" />
                </button>
                <button className={ttsOn ? "chatbot-button-on" : "chatbot-button"} type="button" onClick={handleTTS}>
                  {ttsOn ? <img src="https://img.icons8.com/metro/14/null/no-audio.png" alt="Speech off" />
                    : <img src="https://img.icons8.com/metro/14/null/high-volume.png" alt="Speech on" />}

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
  let response = [];
  let information = [];
  let conType = "";

  if (startLoc.includes("N/A") && endLoc.includes("N/A")){
    // Indicate the type of conversation
    conType = await GenerateBasic(
      model,
      "Determine if the input is asking for directions or guidance on how to navigate from one location to another. Reply 'Yes' if it is, or 'No' if it is not. The input could be related to any type of location, such as public places, buildings, rooms, or landmarks.\n" +
      conTypeExamples +
      "Input: " +
      input +
      "\nOutput:"
    );
  }
  else{
    conType = "Yes";
  }
  isDirections = conType.includes("Yes");
  if (isDirections) {
    // Add user intput to the prompt
    chatLog = chatLog + input;

    //Test: How do I get to the entrance from the 1812 exhibit?
    //Test: How do I get to the Mary Ann McKay Death exhibit from the desk?

    // Use GPT-3 to find the starting and ending locations within the user input and confirm them (i.e., spelling issues)
    if (startLoc.includes("N/A")) {
      startLoc = await GenerateBasic(model, "Return just the StartPoint from the following Prompt. If there is no StartPoint return N/A:\n" +
        startIdentExamples + "Prompt: " + input + "\nStartPoint: ");
    }
    if (endLoc.includes("N/A")) {
      endLoc = await GenerateBasic(model, "Return just the EndPoint from the following Prompt. If there is no EndPoint return N/A:\n" +
        endIdentExamples + "Prompt: " + input + "\nEndPoint: ");
    }
    if (!startLoc.includes("N/A") && !endLoc.includes("N/A")) {
      // Check for static locations, then, if needed, check the database for locations
      let temp = await GenerateBasic(model, "Return just the location from the following that matches closest to the input. If none match return other:\n" +
        "Locations: " + staticLocations + "\nInput: " + startLoc + "\nOutput: ");
      if ((temp.toLowerCase()).includes("other")) {
        temp = await SearchDB(startLoc);
        startLoc = temp[2];
      } else {
        startLoc = RemoveLines(temp.toUpperCase());
      }
      temp = await GenerateBasic(model, "Return just the location from the following that matches closest to the input. If none match return other:\n" +
        "Locations: " + staticLocations + "\nInput: " + endLoc + "\nOutput: ");
      if ((temp.toLowerCase()).includes("other")) {
        temp = await SearchDB(endLoc);
        endLoc = temp[2];
      } else {
        endLoc = RemoveLines(temp.toUpperCase());
      }

      // Run pathfinding algorithm
      let path = await getPath(startLoc, endLoc);

      // Use GPT-3 to translate the directions into plain text
      let verbalPath = "\npath: " + path[0];
      answer = await GenerateChat(model, directionPrefix  + "\n" + chatLog + verbalPath, start, restart, stop + ".");
      if (answer != null) {
        chatLog += answer[1];
        answer = answer[0];
      }else{
        answer = "I apologize, but I seem to be having some technical difficulties! Please enjoy the museum while the code monkeys fix me!";
      }

      // Output the map

      startLoc = "N/A";
      endLoc = "N/A";
    }else if(startLoc.includes("N/A")){
      answer = "I'm sorry! I didn't quite catch all of that. Could you please tell me where you are currently?";
    }else if(endLoc.includes("N/A")){
      answer = "I'm sorry! I didn't quite catch all of that. Could you please tell me where you are trying to go?";
    }
  }
  else {
    // Add user intput to the prompt
    chatLog = chatLog + input;

    // Use GPT-3 to extract the subject of the conversation
    let subject = await GenerateBasic(model, "Classify the subject or category of given text prompts, and generate appropriate outputs accordingly. Example input prompts can be in question or statement form and should elicit responses that identify the subject of conversation. Examples of valid input prompts and outputs are:\n"
      + subIdentExamples + "Input: " + input + "\nOutput: ");

    // Note, searching is all done in lower case for accuracy
    let temp = subject.toLowerCase();

    // First check if they are asking about the museum
    museumInfo.forEach(index => {
      if (temp.includes(index[0].toLowerCase())) {
        information[0] = index[1];
        information[1] = "";
      }
    })

    // If we aren't then run the database code
    if (information.length == 0) {
      // Check if it is just a general conversation
      if (!temp.includes("general conversation")) {
        information = await SearchDB(subject);
      }
    }

    let context = "\nSource Material: " + information[0];
    answer = await GenerateChat(model, queryPrefix + context + "\n" + chatLog, start, restart, stop + ".");
    if (answer != null) {
      chatLog += answer[1];
      answer = answer[0];
    }else{
      answer = "I apologize, but I seem to be having some technical difficulties! Please enjoy the museum while the code monkeys fix me!";
    }
  }

  // Generate an output
  if (lang != "English") {
    answer = await GenerateBasic(model, "Translate the following text into " + lang + ": " + answer);
  }
  response = [answer, information[1]];
  return response;
};

export default Chatbot;
