//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// All website layouts, designs, coding and functionality are Copyright © 2023 Robert Morabito, David Bailey, Maheen Samad, Fahad Arain, Dana Dobrosavljevic, and Jordan Bharati All right reserved.
//
// You may not otherwise copy, modify, or distribute this website (https://museum-mate-v1.vercel.app/) or the code contained in any manner.
// You may not remove or alter any copyright or other notice from this code or this website (https://museum-mate-v1.vercel.app/).
// 
// If you have further inquiry contact:
// Robert Morabito
// Developer
// hello@robertmorabito.ca
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import "./Home.css";
import {Footer, ImageChangerComponent, PhotogrpahImage} from "./Components";
import Chatbot from "./Chatbot";

const Home = () => {

    //common breakpoints
    // 320px-480px: Mobile devices
    // 481px-768px: iPads, Tablets
    // 769px-1024px: Small screens, laptops
    // 1025px-1200px: Desktops, large screens

    const isMobile = window.innerWidth <= 768;

    const introText = "Welcome to the Niagara on the Lake Museum, a place where history comes alive! Situated in the heart of one of Canada's most " +
        "picturesque towns, our museum showcases the rich heritage of Niagara on the Lake and the surrounding region. From Indigenous history to " +
        "the War of 1812, and beyond, our exhibits offer a fascinating glimpse into the people, events, and cultural " +
        "traditions that have shaped this area over the centuries. Whether you're a history buff or simply curious about the past, " +
        "we invite you to explore our collection of thousands of artefacts, documents and photographs, and discover the stories that make Niagara on the Lake such a unique and special place.";
    const locationText = "Our museum is conveniently located in the heart of Niagara on the Lake, just a short walk from many popular shops, restaurants, " +
        "and attractions. Whether you're a local resident or a visitor from out of town, we invite you to stop by and discover the fascinating history of " +
        "this charming and historic community.";
    const chatbotText = "Need help exploring our museum? Chat with Museum Mate! our AI-powered chatbot that is ready to answer any of your questions, from administrative to additional information about any artefacts you are curious about!";

    const text1 = "Explore the rich history of the Niagara region, from the early First Nations to their historic legacy.";
    const text2 = "Discover the dramatic events and pivotal battles as well as the untold stories of bravery, sacrifice, and triumph.";
    const text3 = "Learn about and explore a wide variety of local sites in the Niagara region that are full of history.";
    const text4 = "There are constant new events coming up at the museum, our chatbot can give you all the details!";

    return (
        <>
            <div className="container">

                {isMobile ? <>

                    <Chatbot />

                    <div className="mobile-container">
                        <div className="mobile-header">
                            <h1 className="top-left-box">Niagara-on-the-Lake Museum</h1>
                        </div>

                        <div className="center-mobile">
                            <div className="center-img"></div>
                        </div>

                        <div className="row">
                            <div className="text">
                                {introText}
                            </div>
                        </div>

                        <div className="nav-row">
                            <h4>{chatbotText}</h4>
                        </div>

                        <div className="row">
                            <ImageChangerComponent/>
                        </div>

                        <div className="mobile-main">
                            <div className="mobile-image"></div>
                            <div className="mobile-text">
                                {locationText}
                            </div>
                        </div>

                        <div className="box-grid">
                            <div className="top-left">
                                <h2 className="title">Indigenous History</h2>
                                <p className="text-area">{text1}</p>
                            </div>
                            <div className="top-right">
                                <h2 className="title">War of 1812</h2>
                                <p className="text-area">{text2}</p>
                            </div>
                            <div className="bottom-left">
                                <h2 className="title">Heritage Sites</h2>
                                <p className="text-area">{text3}</p>
                            </div>
                            <div className="bottom-right">
                                <h2 className="title">Events</h2>
                                <p className="text-area">{text4}</p>
                            </div>
                        </div>


                        <div className="nav-row">
                            <h4>{locationText}</h4>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2905.962048121403!2d-79.0767329032104!3d43.25221719999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35f73ea17c31f%3A0xf975dbf3ff67d6c0!2sNiagara-on-the-Lake%20Museum!5e0!3m2!1sen!2sca!4v1682212922535!5m2!1sen!2sca"
                            width="600"
                            height="450"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            style={{border: '0'}}
                        />

                        <div className="mobile-info">
                            <div className="mobile-hours">
                                <h2>Hours</h2>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Wednesday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Thursday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Friday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Saturday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    <tr>
                                        <td>Sunday</td>
                                        <td>1pm - 5pm</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mobile-location">
                                <h2>Location</h2>
                                <p>43 Castlereagh St, Niagara-on-the-Lake, ON L0S 1J0</p>
                                <p>Phone: (905) 468-3912</p>
                                <p>Email: contact@nhsm.ca</p>
                            </div>

                            <div className="mobile-text">
                                <h2>Admissions</h2>
                                <p className="text-area">18 and under: free</p>
                                <p className="text-area">Students: $2</p>
                                <p className="text-area">Adults: $5</p>
                                <p className="text-area">Seniors: $3</p>
                            </div>

                        </div>
                        <Footer/>
                    </div>

                </> : <div className="home">

                    <Chatbot/>

                    <div className="half-section">

                        <div className="left-half">
                            <h1 className="top-left-box">Niagara-on-the-Lake Museum</h1>
                            <p className="text-area">{introText}</p>
                        </div>

                        <div className="right-half">
                            <div className="top-right-box center"></div>
                        </div>

                    </div>

                    <div className="nav-row">
                        <h4>{chatbotText}</h4>
                    </div>

                    <div className="half-section">

                        <div className="left-half">
                            <div className="top-right-box">
                                <ImageChangerComponent/>
                            </div>
                        </div>

                        <div className="right-half">

                            <div className="box-grid">
                                <div className="grid-item">
                                    <h2 className="title">Indigenous History</h2>
                                    <p className="text-area">{text1}</p>
                                </div>
                                <div className="grid-item">
                                    <h2 className="title">War of 1812</h2>
                                    <p className="text-area">{text2}</p>
                                </div>
                                <div className="grid-item">
                                    <h2 className="title">Heritage Sites</h2>
                                    <p className="text-area">{text3}</p>
                                </div>
                                <div className="grid-item">
                                    <h2 className="title">Events</h2>
                                    <p className="text-area">{text4}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="nav-row">
                        <h4>{locationText}</h4>
                    </div>

                    <div className="half-section">
                        <div className="left-half">
                            <div className="mobile-location">
                                <h2>Location</h2>
                                <p>43 Castlereagh St, Niagara-on-the-Lake, ON L0S 1J0</p>
                                <p>Phone: (905) 468-3912</p>
                                <p>Email: contact@nhsm.ca</p>

                                <h2>Hours</h2>
                                <p>The museum is currently open all week long from 1pm to 5pm</p>

                                <h2>Admissions</h2>
                                <p className="text-area">18 and under: free</p>
                                <p className="text-area">Students: $2</p>
                                <p className="text-area">Adults: $5</p>
                                <p className="text-area">Seniors: $3</p>

                            </div>
                        </div>

                        <div className="right-half">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2905.962048121403!2d-79.0767329032104!3d43.25221719999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35f73ea17c31f%3A0xf975dbf3ff67d6c0!2sNiagara-on-the-Lake%20Museum!5e0!3m2!1sen!2sca!4v1682212922535!5m2!1sen!2sca"
                                    width="600"
                                    height="450"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{border: '0'}}
                                />
                        </div>
                    </div>
                    <div>
                        <Footer/>
                    </div>

                </div>}
            </div>

        </>
    )
};

export default Home;