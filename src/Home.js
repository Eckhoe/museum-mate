import "./Home.css";
import {ImageChangerComponent} from "./Components";
import Chatbot from "./Chatbot";

const Home = () => {

    //common breakpoints
    // 320px-480px: Mobile devices
    // 481px-768px: iPads, Tablets
    // 769px-1024px: Small screens, laptops
    // 1025px-1200px: Desktops, large screens

    const isMobile = window.innerWidth <= 768;

    return (

        <div className="container">

            {isMobile ? <div> Mobile layout </div> : <div>
            <Chatbot/>

            <h1>Niagara On The Lake Museum</h1>
            <div className="center">
                <div  className="center-img"></div>
            </div>

            <div className="row">
                <div className="image">
                    <ImageChangerComponent/>
                </div>
                <div className="text"> Text / info about museum </div>
            </div>

            <div className="row">
                <div className="text"> Hours </div>
                <div className="text"> Upcoming events </div>
            </div>

            <div className="row">
                <div className="text"> Possible museum twitter feed </div>
                <div className="text"> Location / contact info </div>
            </div>
        </div> }
        </div>
    )
};

export default Home;