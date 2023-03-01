import React, { useEffect, useRef, useState } from "react";
import { GenerateBasic, GenerateChat, GenerateChatWithInfo } from "./GPT-3";
import "./App.css";
import "./ChatBot.css";

/* This class implements the MuseumMate chatbot using calls to GPT-3 for text generation and React JS for I/O */
// Global variables
// TO DO: Change these variables to the final exhibits being used. Also update directionPrefix.
const locations = ["Lobby", "Restroom", "Security Office", "Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];
const exhibits = ["Dinosaur Exhibit", "King Tut Exhibit", "Ancient Greek Exhibit"];

const model = "text-davinci-003";   // GPT-3 Model version being used
const stop = [" Guest:", " MuseumMate:"];
const restart = "\nGuest: ";
const start = "\nMuseumMate:";

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
    // Prefixes for defining the characteristics of each version of the chatbot. These are seen by the chatbot and not the users.
    let queryPrefix = `Response Tone:
    Use a friendly and enthusiastic tone that engages the user.
    Be polite, respectful, and humble in all responses.

    Response Style:
    Use descriptive and engaging language to make responses interesting and informative.
    Vary sentence length and structure to keep responses dynamic and engaging.
    Avoid using jargon or technical language that the user may not understand.

    Response Structure:
    Break up responses into small paragraphs that each focus on a specific topic or idea.
    Use headings or bullet points to organize information and make it easier to read.
    Use transition words to connect ideas and make the response flow smoothly.

    Response Content:
    Only use information from the current conversation to provide relevant and accurate responses.
    When asked about unknown information, respond with "I'm sorry, but I don't have that information at the moment. Is there anything else I can help you with?"
    Do not generate any new information or facts that are not already present in the current conversation.
    If the user asks a question that MuseumMate cannot answer with the current conversation's information, politely explain that MuseumMate is not able to provide a response at this time.`
    ;
    let directionPrefix = `Response Tone:
    Use a friendly and enthusiastic tone that engages the user.
    Be polite, respectful, and humble in all responses.
    
    Response Style:
    Vary sentence length and structure to keep responses dynamic and engaging.

    Response Structure:
    Use ullet points to organize information and make it easier to read.
    Use transition words to connect ideas and make the response flow smoothly.

    Response Content:
    Only use information from the current conversation to provide relevant and accurate responses.
    When asked about unknown information, respond with "I'm sorry, but I don't have that information at the moment. Is there anything else I can help you with?"
    Do not generate any new information or facts that are not already present in the current conversation.
    If the user asks a question that MuseumMate cannot answer with the current conversation's information, politely explain that MuseumMate is not able to provide a response at this time.

    Source Material:
    The Lobby has a big green sign that says "Welcome to the Museum!". 
    The Dinosaur Exhibit has a large T-Rex on display. 
    The King Tut Exhibit has the sound of blowing sand playing when you enter. 
    The Ancient Greek Exhibit has a large marble statue in from of the door. 
    The Security office has a red sign with a white plus symbol for medical aid. 
    The Restrooms have a green arrow pointing to them with a restroom symbol. 

    Examples:
    Directional Input "right(Dinosaur Exhibit), left, straight, right(Restroom) 
    I would be more than happy to get you there! Just follow these directions:
    1. Head right into the Dinosaur Exhibit, you will see a huge T-Rex on display.
    2. Now make a left-hand turn and continue straight.
    3. Finally, turn right and you will see a green arrow with a restroom symbol pointing where to go."

    Directional Input "straight(Lobby), right, straight(King Tut Exhibit)
    I love that exhibit! If you follow these directions you will be there ASAP:
    1. Head straight into the Lobby where you'll notice a big green sign that says "Welcome to the Museum!".
    2. Now turn right turn.
    3. Continue straight and you will end up in the King Tut Exhibit. You will know you are there when you hear the sound of blowing sand!"

    Apply the MuseumMate Directional Format to the following input if it matches a Directional Input, if it does not, just respond normally: 
    `;

    // Default input prompts for starting the conversation.
    const queryPrompt = "Hi! I am MuseumMate and I can provide information on all the exhibits around you! What would you like to know?";
    const directionPrompt = "Hi! I am MuseumMate and I can provide directions on how to get anywhere in the museum. Could you tell me where you are now and where you would like to go?";
    let isDirections = false;  // Check for directions chat over query chat

    // TO DO: Query database for information on topics, these are testing variables. I know, this is very messy.
    const exhibitInformation = [
        ["Dinosaur Exhibit", `Dinosaurs are a diverse group of reptiles of the clade Dinosauria. They first appeared during the Triassic period, between 245 and 233.23 million years ago (mya), although the exact origin and timing of the evolution of dinosaurs is the subject of active research. They became the dominant terrestrial vertebrates after the Triassic-Jurassic extinction event 201.3 mya; their dominance continued throughout the Jurassic and Cretaceous periods. The fossil record shows that birds are feathered dinosaurs, having evolved from earlier theropods during the Late Jurassic epoch, and are the only dinosaur lineage known to have survived the Cretaceous-Paleogene extinction event approximately 66 mya. Dinosaurs can therefore be divided into avian dinosaurs—birds—and the extinct non-avian dinosaurs, which are all dinosaurs other than birds.
    Dinosaurs are varied from taxonomic, morphological and ecological standpoints. Birds, at over 10,700 living species, are among the most diverse groups of vertebrates. Using fossil evidence, paleontologists have identified over 900 distinct genera and more than 1,000 different species of non-avian dinosaurs. Dinosaurs are represented on every continent by both extant species (birds) and fossil remains. Through the first half of the 20th century, before birds were recognized as dinosaurs, most of the scientific community believed dinosaurs to have been sluggish and cold-blooded. Most research conducted since the 1970s, however, has indicated that dinosaurs were active animals with elevated metabolisms and numerous adaptations for social interaction. Some were herbivorous, others carnivorous. Evidence suggests that all dinosaurs were egg-laying, and that nest-building was a trait shared by many dinosaurs, both avian and non-avian.`],
        ["King Tut Exhibit", `Tutankhamun (or Tutankhamen; c.1341 BC - c.1323 BC) was the antepenultimate pharaoh of the Eighteenth Dynasty of ancient Egypt. He ascended to the throne around the age of nine and reigned until his death around the age of nineteen. Historically, Tutankhamun is primarily known for restoring the traditional polytheistic ancient Egyptian religion, after its suppression by Akhenaten in favor of the Atenist religion. Also, Tutankhamun was one of few kings worshipped as a deity during his lifetime; this was usually done posthumously for most pharaohs. In popular culture, he is known for his vastly opulent wealth found during the 1922 discovery of his tomb, KV62, the only such tomb to date to have been found in near-intact condition. The discovery of his tomb is widely considered one of the greatest archaeological discoveries of all time. 
    His parentage is debated, as they are not attested in surviving inscriptions. DNA testing has identified his father as the mummy within tomb KV55, thought to be the pharaoh Akhenaten. His mother was identified as a mummy from tomb KV35, which was also his aunt, informally referred to as "The Younger Lady" but is otherwise unknown.
    Tutankhamun took the throne under the unprecedented viziership of his eventual successor, Ay, to whom he may have been related. Within tomb KV21, the mummy KV21A was identified as having been the biological mother of Tutankhamun's two daughters — it is therefore speculated that this mummy is of his only known wife, Ankhesenamun, who was his paternal half-sister. Their two daughters were identified as the 317a and 317b mummies; daughter 317a was born prematurely at 5-6 months of pregnancy while daughter 317b was born at full-term, though both died in infancy. His names — Tutankhaten and Tutankhamun — are thought to have meant "living image of Aten" and "living image of Amun" in the ancient Egyptian language, with the god Aten having been replaced by the god Amun after Akhenaten's death. Some Egyptologists, including Battiscombe Gunn, have claimed that the translation may be incorrect, instead being closer to "the-life-of-Aten-is-pleasing" or "one-perfect-of-life-is-Aten" (the latter translation by Gerhard Fecht).`],
        ["Ancient Greek Exhibit", `Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a northeastern Mediterranean civilization, existing from the Greek Dark Ages of the 12th-9th centuries BC to the end of classical antiquity (c.600 AD), that comprised a loose collection of culturally and linguistically related city-states and other territories. Most of these regions were officially unified only once, for 13 years, under Alexander the Great's empire from 336 to 323 BC (though this excludes a number of Greek city-states free from Alexander's jurisdiction in the western Mediterranean, around the Black Sea, Cyprus, and Cyrenaica). In Western history, the era of classical antiquity was immediately followed by the Early Middle Ages and the Byzantine period.
    Roughly three centuries after the Late Bronze Age collapse of Mycenaean Greece, Greek urban poleis began to form in the 8th century BC, ushering in the Archaic period and the colonization of the Mediterranean Basin. This was followed by the age of Classical Greece, from the Greco-Persian Wars to the 5th to 4th centuries BC, and which included the Golden Age of Athens. The conquests of Alexander the Great of Macedon spread Hellenistic civilization from the western Mediterranean to Central Asia. The Hellenistic period ended with the conquest of the eastern Mediterranean world by the Roman Republic, and the annexation of the Roman province of Macedonia in Roman Greece, and later the province of Achaea during the Roman Empire.`]
    ];

    // Set the intitial output to match the type of conversation that is happening
    const [input, setInput] = useState("");
    let intro = isDirections ? directionPrompt : queryPrompt;
    directionPrefix = directionPrefix + "MuseumMate: " + directionPrompt + "\nGuest: ";
    queryPrefix = queryPrefix + "MuseumMate: " + queryPrompt + "\nGuest: ";

    // Output the intro
    const [text, setText] = useState([{ content: intro, sender: "MuseumMate" }]);
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

        // Determine the conversation we are having (Possibly make dynamic in the future)
        if (isDirections) {
            // Recieve the user input and add to prompt
            const temp = [...text, { content: input, sender: "Guest" }];
            directionPrefix = directionPrefix + input;

            // Use GPT-3 to find the starting and ending locations within the user input, confirm them (i.e., spelling issues), and 
            // remove blank lines (an issue with GPT-3)

            let departure = await GenerateBasic(model, "Return just the departure point from the following text: " + input);
            departure = await ConfirmLocation(locations, departure);
            departure = RemoveLines(departure);
            let destination = await GenerateBasic(model, "Return just the destination point from the following text: " + input);
            destination = await ConfirmLocation(locations, destination);
            destination = RemoveLines(destination);

            // TO DO: Output the points to the path finding algorithm and recieve the directions

            // Note: The code below is temporary to test the directions, replace later.
            const tempDirections = ["right(King Tut Exhibit), left, straight, right, straight, left(Security Office)",
                "straight, right, left, upstairs, right(Ancient Greek Exhibit), downstairs(Dinosaur Exhibit)",
                "left(Restroom), straight, right, straight(Lobby)"];
            const direction = tempDirections[Math.floor(Math.random() * tempDirections.length)];

            // Use GPT-3 to translate the directions into plain text
            const answer = await GenerateBasic(model, directionPrefix + direction);
            setText([...temp, { content: `${answer + "\n\n Do you need help getting anywhere else?"}`, sender: "MuseumMate" }]);

            // Ask for more directions and add information to the prefix
            directionPrefix = directionPrefix + answer + "\n" + "MuseumMate: Do you need help getting anywhere else?";
            setInput("");
        }
        else {
            // Recieve the user input
            const temp = [...text, { content: input, sender: "Guest" }];
            queryPrefix = queryPrefix + input;

            // Use GPT-3 to extract the exhibit name, then supply that exhibit information
            // If there is not exhibit (E.g., input is "Hi") then supply nothing
            let curExhibit = await GenerateBasic(model, "What is the subject in the following text: " + input);
            curExhibit = await ConfirmLocation(exhibits, curExhibit);
            curExhibit = RemoveLines(curExhibit);
            let information = "";
            exhibitInformation.forEach(index => {
                if (curExhibit == index[0]) {
                    information = index[1];
                }
            })

            // Generate an output, if no exhibit exists just generate basic chat
            let answer = "";
            if (curExhibit == "n/a") {
                answer = await GenerateChat(model, queryPrefix, start, restart, stop);
            }
            else {
                answer = await GenerateChatWithInfo(model, queryPrefix, information, start, restart, stop);
            }
            queryPrefix = answer[1];
            setText([...temp, { content: `${answer[0]}`, sender: "MuseumMate" }]);
        }
        setInput(""); //remove user text and reset text input field to default
    }

    // Fully reset the chatbot text list
    const handleReset = () => {
        let intro = isDirections ? directionPrompt : queryPrompt;
        setText([]);
        setText([{ content: intro, sender: "MuseumMate" }])
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

// This method uses GPT-3 to confirm a natural language input as a set location. Ex. "ancent grek" -> "Ancient Greek Exhibit"
export const ConfirmLocation = async (locations, inputText) => {
    const prompt = "Locations: " + locations.join(', ') + "\nReturn just the name from Locations that closest matches the following input: " +
        inputText + "\nIf no Location matches the input return n/a";
    const temp = await GenerateBasic(model, prompt);
    return temp;
}

// This method uses GPT-3 to remove unnecessary white spaces from GPT generated responses
export const RemoveLines = (inputText) => {
    let temp = inputText.replace(/[\n\r]/g, '');
    return temp
}

export default Chatbot;