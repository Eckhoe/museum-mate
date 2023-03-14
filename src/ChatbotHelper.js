import { GenerateBasic } from "./GPT-3";

// This method uses GPT-3 to confirm a natural language input against a set list of data. It requires the set list, input, and a string of training data
export const ConfirmLocation = async (list, inputText, exampleData) => {
    inputText = RemoveLines(inputText);
    const prompt = "Return closest match to the Input from the List. If no match is found, return other." + "\nList: " + list.join(', ') +
        "\n" + exampleData + "Input: " + inputText + "\nOutput:";
    const temp = await GenerateBasic("text-davinci-003", prompt);
    return temp;
}

// This method uses GPT-3 to remove unnecessary white spaces from GPT generated responses
export function RemoveLines(inputText) {
    let temp = inputText.replace(/[\n\r]/g, '');
    return temp
}

// This method finds the levenshtein distance between 2 strings
export function LevenshteinDistance(input, candidate) {
    let inLen = input.length; // Length of input string
    let canLen = candidate.length;  // Length of candidate string
    let distMat = Array(inLen + 1).fill(null).map(() => Array(canLen + 1).fill(null)); // Distance matrix
    let cost

    // Populate matrix with the strings
    for (let i = 0; i <= inLen; i++) {
        distMat[i][0] = i;
    }
    for (let i = 0; i <= canLen; i++) {
        distMat[0][i] = i;
    }
    for (let j = 1; j <= canLen; j++) {
        for (let i = 1; i <= inLen; i++) {
            cost = (input[i - 1] === candidate[j - 1]) ? 0 : 1; // Cost of current letter substitution
            distMat[i][j] = Math.min(
                distMat[i][j - 1] + 1, // Cost of Deletion
                distMat[i - 1][j] + 1, // Cost of Insertion
                distMat[i - 1][j - 1] + cost  // Cost of Substitution
            );
        }
    }
    return distMat[inLen][canLen];
}

// This method calculates the likeness of 2 phrases
export function CalcSim(input, candidate){
    // Split the inputs into substrings by delimiters
    const inWords = input.split(/[\s_-]/);
    const canWords = candidate.split(/[\s_-]/);
    let total = 0;

    for(let i = 0; i < inWords.length; i++){
        let best = candidate.length;
        for(let j = 0; j < canWords.length; j++){
            // Calculate the levenshtein distance between the current words in the phrases
            let dist = LevenshteinDistance(inWords[i], canWords[j]);

            // Keep track of the smallest distance so far
            if(dist < best){
                best = dist;
            }

            // If the distance is zero then we have found the best match
            if(dist === 0){
                break;
            }
        }
        // Add the best distance to the total
        total += best;
    }
    return total;
}

/*
 * Below is a collection of few shot or zero shot training data for various tasks
 */
// Prefix for defining the characteristics of the query chat
export var _queryPrefix = `Response Tone:
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
If the user asks a question that MuseumMate cannot answer with the current conversation's information, politely explain that MuseumMate is not able to provide a response at this time.`;

// Prefix for defining the characteristics of the directions chat
export var _directionPrefix = `Response Tone:
Use a friendly and enthusiastic tone that engages the user.
Be polite, respectful, and humble in all responses.

Response Style:
Vary sentence length and structure to keep responses dynamic and engaging.

Response Structure:
Use bullet points to organize information and make it easier to read.
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
3. Continue straight and you will end up in the King Tut Exhibit. You will know you are there when you hear the sound of blowing sand!"`;

// Start prompt
export var _startPrompt = "Hi! I am MuseumMate and I can provide information on all the exhibits around you as well as directions to anywhere in the museum!"

// MuseumMate information
export var _museumInfo = [["MuseumMate", "MuseumMate is a robust chatbot that can provide information on every exhibit, artifact, and archive found in the Niagara on the Lake (NOTL) Museum, as well as give detailed directions for guests to find any exhibit or facility within the museum."],
["Niagara on the Lake (NOTL) Museum", `The Niagara Historical Society was established in 1895 to foster an appreciation of Niagara-on-the-Lake's rich heritage. Within a year, the Society had a significant collection of artefacts that it decided to open a Museum in the local Courthouse. In 1907, under the leadership of the Society’s President, Janet Carnochan, they opened Memorial Hall, Ontario’s first purpose-built Museum.
The NOTL Museum acknowledges that we are operating on lands that have been inhabited by Indigenous people for millennia and would like to honor all the centuries of Indigenous Peoples who have walked on Turtle Island before us. We are grateful for the opportunity to live, work and play here in Niagara-on-the-Lake and we give thanks to the ancestors who have served as stewards of this special place. Today, we have a responsibility to live in balance and harmony with each other and all living things, so that our 7th generation will be able to enjoy these beautiful lands as well!
Today, the Niagara Historical Society continues to promote and preserve our local heritage by owning and operating the Niagara-on-the-Lake Museum. The site now consists of three independent buildings that are merged together. The three buildings are: The High School building (1875), Memorial Hall (1907) and the Link Building (1971).
The Niagara-on-the-Lake Museum contains one of Ontario's most important local history collections. Located 20km north of Niagara Falls, Niagara-on-the-Lake was an important home and terminus for Indigenous peoples, provided a safe haven for refugees and United Empire Loyalists, was the capital of Upper Canada, was in the middle of a war zone and visited by millions as a place of recreation for over 160 years. These stories play a major role in the development of Canada. The galleries host a permanent exhibition, titled Our Story, chronicling the history of our community. Two temporary exhibitions are mounted each year and over 80 engaging programs are enjoyed by the young and the young at heart.`],
["Operating Hours", `Monday 1p.m.-5p.m., Tuesday 1p.m. - 5p.m., Wednesday 1p.m. - 5p.m., Thursday 1p.m. - 5p.m., Friday 1p.m. - 5p.m., Saturday 1p.m. - 5p.m., Sunday 1p.m. - 5p.m.
The museum is closed on the following holidays: Good Friday, Easter Sunday, Thanksgiving day, and during the Christmas season between December 18th and January 1st.`],
["Address", "43 Castlereagh St, Niagara-on-the-Lake, ON L0S 1J0, Canada"],
["Contact", `Phone (905) 468-3912
Fax (905) 468 1728
Email contact@nhsm.ca`],
["Facilities", "Is wheelchair accessable and has ramps and an elevator. There is also a washroom on site"]];

// Few-shot training data for identifying the conversation type
export var _conTypeExamples = `Examples:
Asking for directions:
Input: Can you give me directions to the Niagara Falls History Museum?
Output: Yes
Input: Which is the quickest route to the Fort Erie Peace Bridge from here?
Output: Yes
Input: How do I get to the battlefield of the War of 1812?
Output: Yes

ArtifactInfo:
Input: Can you give me information about the cannon used in the Battle of Lundy's Lane?
Output: No
Input: Who is Sir Isaac Brock?
Output: No
Input: What is the history behind Laura Secord's trek during the War of 1812?
Output: No
Input: Can you tell me about the significance of the Brock Monument at Queenston Heights?
Output: No

`

// Few-shot training data for identifying subjects
export var _subIdentExamples = `Prompt: Where is the War of 1812 exhibit located?
Output: War of 1812 exhibit

Prompt: What is the phone number?
Output: Contact information

Prompt: Tell me about yourself?
Output: MuseumMate

`

// Few-shot training data for identifying museum information
export var _musIdentExamples = `
Examples:
Input: Where time are you open?
Output:Operating Hours
Input: When was the NOTL museum founded?
Output:Niagara on the Lake (NOTL) Museum
Input: Is there a ramp?
Output:Facilities
Input: What is the phone number?
Output:Contact
Input: Tell me about MuseumMate?
Output:MuseumMate
Input: Tell me about yourself?
Output:MuseumMate

`