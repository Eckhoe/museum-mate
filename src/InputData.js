// Prefix for defining the characteristics of the query chat
var _queryPrefix = `Response Tone:
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

// Prefix for defining the characteristics of the directions chat
var _directionPrefix = `Response Tone:
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
3. Continue straight and you will end up in the King Tut Exhibit. You will know you are there when you hear the sound of blowing sand!"

Apply the MuseumMate Directional Format to the following input if it matches a Directional Input, if it does not, just respond normally: 
`;

// MuseumMate information
var _museumInfo = [["MuseumMate", "MuseumMate is a robust chatbot that can provide information on every exhibit, artifact, and archive found in the Niagara on the Lake (NOTL) Museum, as well as give detailed directions for guests to find any exhibit or facility within the museum."], 
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
var _conTypeExamples = `Examples:
Input: Is there a washroom near here?
Output:Yes
Input: How do I get to the Dinosaur Exhibit from here?
Output:Yes
Input: Do you know how big the T-Rex was?
Output:No
Input: Can you tell me where the nearest giftshop is?
Output:Yes
Input: What's the best way to get to the Ancient Greek Exhibit?
Output:Yes
Input: Can you recommend an exhibit to visit?
Output:No
Input: I want to see the King Tut Exhibit!
Output:Yes
Input: What's your favorite exhibit?
Output:No
Input: What are your operating hours?
Output:No
Input: Are there any events approaching?
Output:No
Input: What are some famous exhibits?
Output:No

`
// Few-shot training data for identifying the language
var _langTypeExamples = `Examples:
Input: Translate into urdu?
Output:Urdu
Input: Can you tell me in mandarin?
Output:Mandarin
Input: I don't understand, do you speak Italian?
Output:Italian
Input: Speak Spanish?
Output:Spanish
Input: Can you speak Swahili?
Output:Swahili
Input: Korean please
Output:Korean
Input: Change back to English.
Output:English

`

// Testing Exhibit Information
var _exhibitInfo = [
    ["Dinosaur Exhibit", `Dinosaurs are a diverse group of reptiles of the clade Dinosauria. They first appeared during the Triassic period, between 245 and 233.23 million years ago (mya), although the exact origin and timing of the evolution of dinosaurs is the subject of active research. They became the dominant terrestrial vertebrates after the Triassic-Jurassic extinction event 201.3 mya; their dominance continued throughout the Jurassic and Cretaceous periods. The fossil record shows that birds are feathered dinosaurs, having evolved from earlier theropods during the Late Jurassic epoch, and are the only dinosaur lineage known to have survived the Cretaceous-Paleogene extinction event approximately 66 mya. Dinosaurs can therefore be divided into avian dinosaurs—birds—and the extinct non-avian dinosaurs, which are all dinosaurs other than birds.
Dinosaurs are varied from taxonomic, morphological and ecological standpoints. Birds, at over 10,700 living species, are among the most diverse groups of vertebrates. Using fossil evidence, paleontologists have identified over 900 distinct genera and more than 1,000 different species of non-avian dinosaurs. Dinosaurs are represented on every continent by both extant species (birds) and fossil remains. Through the first half of the 20th century, before birds were recognized as dinosaurs, most of the scientific community believed dinosaurs to have been sluggish and cold-blooded. Most research conducted since the 1970s, however, has indicated that dinosaurs were active animals with elevated metabolisms and numerous adaptations for social interaction. Some were herbivorous, others carnivorous. Evidence suggests that all dinosaurs were egg-laying, and that nest-building was a trait shared by many dinosaurs, both avian and non-avian.`],
    ["King Tut Exhibit", `Tutankhamun (or Tutankhamen; c.1341 BC - c.1323 BC) was the antepenultimate pharaoh of the Eighteenth Dynasty of ancient Egypt. He ascended to the throne around the age of nine and reigned until his death around the age of nineteen. Historically, Tutankhamun is primarily known for restoring the traditional polytheistic ancient Egyptian religion, after its suppression by Akhenaten in favor of the Atenist religion. Also, Tutankhamun was one of few kings worshipped as a deity during his lifetime; this was usually done posthumously for most pharaohs. In popular culture, he is known for his vastly opulent wealth found during the 1922 discovery of his tomb, KV62, the only such tomb to date to have been found in near-intact condition. The discovery of his tomb is widely considered one of the greatest archaeological discoveries of all time. 
His parentage is debated, as they are not attested in surviving inscriptions. DNA testing has identified his father as the mummy within tomb KV55, thought to be the pharaoh Akhenaten. His mother was identified as a mummy from tomb KV35, which was also his aunt, informally referred to as "The Younger Lady" but is otherwise unknown.
Tutankhamun took the throne under the unprecedented viziership of his eventual successor, Ay, to whom he may have been related. Within tomb KV21, the mummy KV21A was identified as having been the biological mother of Tutankhamun's two daughters — it is therefore speculated that this mummy is of his only known wife, Ankhesenamun, who was his paternal half-sister. Their two daughters were identified as the 317a and 317b mummies; daughter 317a was born prematurely at 5-6 months of pregnancy while daughter 317b was born at full-term, though both died in infancy. His names — Tutankhaten and Tutankhamun — are thought to have meant "living image of Aten" and "living image of Amun" in the ancient Egyptian language, with the god Aten having been replaced by the god Amun after Akhenaten's death. Some Egyptologists, including Battiscombe Gunn, have claimed that the translation may be incorrect, instead being closer to "the-life-of-Aten-is-pleasing" or "one-perfect-of-life-is-Aten" (the latter translation by Gerhard Fecht).`],
    ["Ancient Greek Exhibit", `Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a northeastern Mediterranean civilization, existing from the Greek Dark Ages of the 12th-9th centuries BC to the end of classical antiquity (c.600 AD), that comprised a loose collection of culturally and linguistically related city-states and other territories. Most of these regions were officially unified only once, for 13 years, under Alexander the Great's empire from 336 to 323 BC (though this excludes a number of Greek city-states free from Alexander's jurisdiction in the western Mediterranean, around the Black Sea, Cyprus, and Cyrenaica). In Western history, the era of classical antiquity was immediately followed by the Early Middle Ages and the Byzantine period.
Roughly three centuries after the Late Bronze Age collapse of Mycenaean Greece, Greek urban poleis began to form in the 8th century BC, ushering in the Archaic period and the colonization of the Mediterranean Basin. This was followed by the age of Classical Greece, from the Greco-Persian Wars to the 5th to 4th centuries BC, and which included the Golden Age of Athens. The conquests of Alexander the Great of Macedon spread Hellenistic civilization from the western Mediterranean to Central Asia. The Hellenistic period ended with the conquest of the eastern Mediterranean world by the Roman Republic, and the annexation of the Roman province of Macedonia in Roman Greece, and later the province of Achaea during the Roman Empire.`]
];

// Few-shot training data for identifying locations
var _locIdentExamples = `
Example inputs and outputs:
Input: Where is the Ancient Greek Exhibit located?
Output:Ancient Greek Exhibit
Input: The subject is Dinosaurs
Output:Dinosaur Exhibit
Input: it is pyramids
Output:King Tut Exhibit
Input: Operating Hours
Output:Other
Input: Greeting
Output:Other
Input: the subject is MuseumMate
Output:Other

`

// Few-shot training data for identifying museum information
var _musIdentExamples = `
Example inputs and outputs:
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

export{ _queryPrefix, _directionPrefix, _museumInfo, _conTypeExamples, _exhibitInfo, _locIdentExamples, _musIdentExamples, _langTypeExamples };