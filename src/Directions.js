import "./Directions.css";
import Chatbot from "./Chatbot";

const Directions = () => {

    const isMobile = window.innerWidth <= 768;
    
    return (
        <div className="directions">
            {isMobile ? <div> Mobile layout - Directions</div> :
                <>
            <h1 className="directions-header">Directions and/or Map Page</h1>
            <div className="directions-container">
                <img className="map-image" src="/image2.jpg" alt="temp image"/>
                <div className="chatbot-map-text">
                    ChatBot / directions info goes here?
                    <Chatbot/>
                </div>
            </div>
                </>
             }
        </div>
    )
}

export default Directions;