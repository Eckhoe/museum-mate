import "./Directions.css";
import Chatbot from "./Chatbot";
import {Footer} from "./Components";

const Directions = () => {

    const isMobile = window.innerWidth <= 768;
    
    return (
        <>
            <div className="directions">
                {isMobile ?
                    <div> Mobile layout - Directions
                        <Chatbot/>
                    </div> :
                    <>
                        <h1 className="directions-header">Directions</h1>




                        <div className="directions-container">

                        <iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2905.962048121403!2d-79.0767329032104!3d43.25221719999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35f73ea17c31f%3A0xf975dbf3ff67d6c0!2sNiagara-on-the-Lake%20Museum!5e0!3m2!1sen!2sca!4v1682212922535!5m2!1sen!2sca" 
  width="600" 
  height="450" 
  allowfullscreen="" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade" 
  style={{border: '0'}}
/>
                        
                           
                            <div className="chatbot-map-text">
                            <img className="map-image" src="/image2.jpg" alt="temp image"/>
                                <Chatbot/>
                            </div>
                        </div>
                    </>
                }
            </div>
            <Footer/>
        </>
    )
}

export default Directions;