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

    return (
        <>
            <div className="container">

                {isMobile ? <>

                    <Chatbot />

                    <div className="mobile-container">
                        <div className="mobile-header">
                            <h1>Niagara On The Lake Museum</h1>
                        </div>

                        <div className="center">
                            <div className="center-img"></div>
                        </div>

                        <div className="row">
                            <div className="text">
                                {introText}
                            </div>
                            <ImageChangerComponent/>
                        </div>

                        <div className="mobile-main">
                            <div className="mobile-image"></div>
                            <div className="mobile-text">
                                {locationText}
                            </div>
                        </div>

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

                            <div className="mobile-events">
                                <h2>Upcoming Events</h2>
                                <p>No upcoming events at this time.</p>
                            </div>

                            <div className="mobile-chat">
                                <h2>Chatbot</h2>
                                <div className="mobile-text">
                                    {chatbotText}
                                </div>
                            </div>
                        </div>
                    </div>

                </> : <div>

                    <Chatbot/>

                    <h1>Niagara On The Lake Museum</h1>
                    <div className="center">
                        <div className="center-img"></div>
                    </div>

                    <div className="row">
                        <ImageChangerComponent/>
                        <div className="text">
                            {introText}
                        </div>
                    </div>

                    <div className="row">
                        <div className="text"> Hours
                            <table>
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
                            </table>
                        </div>
                        <div className="text">
                            {locationText}
                        </div>
                    </div>

                    <div className="row">
                        <div className="text">
                            {chatbotText}
                        </div>
                        <div className="text">
                            <p>43 Castlereagh St, Niagara-on-the-Lake, ON L0S 1J0 (maybe add map)</p>
                            <p>Phone: (905) 468-3912</p>
                            <p>Email: contact@nhsm.ca</p>
                        </div>
                    </div>
                </div>}

            </div>
            <Footer/>
        </>
    )
};

export default Home;