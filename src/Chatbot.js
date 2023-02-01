import React, { useEffect, useRef, useState } from "react";
import { GPTResponse, QueryGPT } from "./Rufis";
import "./App.css";
import "./ChatBot.css";

//message component
const Text = ({ text }) => {
  const textFrom = "text-" + (text.sender === "User" ? "User" : "bot");

  return (
    <div className={textFrom}>
      <div className="text-sender">{text.sender + ": "}</div>
      <div className="text-content">{text.content}</div>
    </div>
  );
};

export const Chatbot = (props) => {
  const [input, setInput] = useState("");
  const [text, setText] = useState([]);
  const textListEndRef = useRef(null);

  useEffect(() => {
    textListEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const temp = [...text, { content: input, sender: "user" }];
    QueryGPT(input);
    const rufisResponse = await GPTResponse();
    setText([...temp, { content: `${rufisResponse}`, sender: "bot" }]);
    setInput("");
  };

  return (
    <div className="chatbot">
      <h1 className="chatbot-header">ChatBot</h1>
      <table className="chatbot-components">
        <tr>
          <th>
            <div className="shortcut-box">
              <h2 className="shortcut-header">Shortcuts</h2>
              <div className="shortcut-list">
                <table className="shortcut-button-table">
                  <tr>
                    <td>
                      <button
                        className="shortcut-button"
                        onClick={museumLocation}
                      >
                        Museum Location
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        className="shortcut-button"
                        onClick={famousExhibits}
                      >
                        Famous Exhibits
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        className="shortcut-button"
                        onClick={eventCalender}
                      >
                        Event Calender
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button className="shortcut-button" onClick={museumHours}>
                        Museum Hours
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </th>
          <th>
            <div className="text-list">
              {text.map((text, index) => (
                <Text key={index} text={text} />
              ))}
              <div ref={textListEndRef}></div>
            </div>
          </th>
        </tr>
      </table>
      <div className="text-form">
        <form
          className="form-container"
          method="submit"
          onSubmit={handleSubmit}
        >
          <input
            value={input}
            maxLength="100"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter Text..."
          />
          <button className="chatbot-button" type="submit">
            Submit
          </button>
        </form>
      </div>

      <button
        className="return-login"
        onClick={() => props.onFormSwitch("login")}
      >
        {" "}
        Return to login
      </button>
    </div>
  );

  //Following functions are just used to demonstrate the buttons working/blueprint for when the actually functionality is there
  function museumLocation() {
    setInput("Where is the museum?");
    handleSubmit;
  }

  function famousExhibits() {
    setInput("What are some famous exhibits?");
    handleSubmit;
  }

  function eventCalender() {
    setInput("Are there any events approaching?");
    handleSubmit;
  }

  function museumHours() {
    setInput("What are the hours of operation?");
    handleSubmit;
  }
};
