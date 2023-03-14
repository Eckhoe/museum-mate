import "./Home.css";
import {Footer, ImageChangerComponent} from "./Components";
import Chatbot from "./Chatbot";

const Home = () => {

    //common breakpoints
    // 320px-480px: Mobile devices
    // 481px-768px: iPads, Tablets
    // 769px-1024px: Small screens, laptops
    // 1025px-1200px: Desktops, large screens

    const isMobile = window.innerWidth <= 768;

    return (
        <>
            <div className="container">

                {isMobile ? <> Mobile layout - Home

                    <h1>Niagara On The Lake Museum</h1>


                </> : <div>

                    <Chatbot/>

                    <h1>Niagara On The Lake Museum</h1>
                    <div className="center">
                        <div className="center-img"></div>
                    </div>

                    <div className="row">
                        <div className="image">
                          <ImageChangerComponent/>
                        </div>
                        <div className="text"> Text / info about museum</div>
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
                        <div className="text"> Upcoming events</div>
                    </div>

                    <div className="row">
                        <div className="text"> Possible museum twitter feed</div>
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