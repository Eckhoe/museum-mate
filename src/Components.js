import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";

import "./Components.css"
import Home from "./Home";
import Directions from "./Directions";
import {Login} from "./Login";
import {Chatbot} from "./Chatbot";

//navigation bar for desktop layout
const NavigationBar = () => {
    return (
        <>

        
            <div className="navbar">
            <div className="logo">
                <img src= '/logo.svg' alt="logo"/>
                 </div>
                
                <Link to="/" className="nav-option">Home</Link>
                <Link to="/directions" className="nav-option">Directions</Link>
                <Link to="/Login" className="nav-option">Admin</Link>
            </div>
            <Outlet/>
        </>
    );
};

//rotating image list for home page
const ImageChangerComponent = () => {
    const [image, setImage] = useState(0);
    const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

    useEffect(() => {
        const index = setInterval(() => {
            setImage((image + 1) % images.length);
        }, 5000);
        return () => clearInterval(index);
    }, [image, images.length]);

    return (
        <div className="image-changer-container">
            <img className="image-changer" src={images[image]} alt="rotating images"/>
        </div>
    );
};

//routes for site displays proper navigation bars based on layout
const PageRouter = () => {

    const isMobile = window.innerWidth <= 768;
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {isMobile ? <>
                <BrowserRouter>
                    <div className="navbar-mobile">
                        <div className="navbar-left">
                            <h1>Museum Mate</h1>
                        </div>
                        <div className="navbar-right">
                            <button className="menu-toggle" onClick={handleToggle}>
                                <span className="menu-toggle-icon">{isOpen ? "X" : "☰"}</span>
                            </button>
                        </div>
                        <div className={`drawer ${isOpen ? 'open' : ''}`}>
                            <Link to="/" onClick={handleToggle}>Home</Link>
                            <Link to="/directions" onClick={handleToggle}>Directions</Link>
                            <Link to="/login" onClick={handleToggle}>Login</Link>
                        </div>
                    </div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/directions" element={<Directions/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </BrowserRouter>
            </> : <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<NavigationBar/>}>
                            <Route index element={<Home/>}/>
                            <Route path="directions" element={<Directions/>}/>
                            <Route path="login" element={<Login/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </>}
        </>
    );
};

//footer component for site
const about1 = "Welcome to the Niagara on the Lake Museum Chatbot, developed by our team of students as part of a capstone project for Brock University! Our AI-powered chatbot is designed to provide you with quick and easy access to information about the museum's exhibits, events, and administrative details.";
const about2 =" We wanted to create a user-friendly and innovative way to help people learn about the fascinating history of the region. By using the latest in natural language processing technology, our chatbot delivers easy-to-read, human-like responses to your questions, helping you explore the museum's collections with ease.";
const about3 = " Our chatbot is powered by the text-davinci-003 AI model, which allows us to provide accurate and informative responses to your queries in real-time. We work closely with the museum's database to ensure that all information provided is up-to-date and reliable, so you can trust the information you receive from our chatbot.";
const about4 = " Whether you're planning a visit to the museum or simply curious about the history of Niagara on the Lake, our chatbot is here to help. Simply type in your question and let our AI do the rest. We're dedicated to making your experience with the Niagara on the Lake Museum as informative and enjoyable as possible. Thank you for using our chatbot and we hope you enjoy learning about the rich history of Niagara on the Lake!";

const copyright = "Copyright © 2023 MuseumMate. All Rights Reserved. No part of this website may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the copyright owner, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.";
const privacyPolicy = "We respect your privacy and are committed to protecting your personal information. Any data we collect from you will be used solely for the purpose of providing you with the services you have requested and will not be shared with any third parties without your explicit consent. We will never sell or rent your information to any other organization for marketing or commercial purposes. By using our website, you consent to our privacy policy.";

const Popup = ({ header, text, onClose }) => {

    return (
        <div className="popup">
            <div className="popup-header">{header}</div>
            <div className="popup-body">{text}</div>
            <div className="popup-footer">
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

const Footer = () => {

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedText, setSelectedText] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    const openPopup = (option, text) => {
        setSelectedOption(option);
        setSelectedText(text);
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const textMap = {
        about: about1+about2+about3+about4,
        groupInfo: "This is the text for the Group information option",
        copyright: copyright,
        privacy: privacyPolicy,
        licencing: "This is the text for the Contact information option",
        resources: "chatbot icons from https://icons8.com",
    };

    return (
        <>
            <div className="footer">
                <div className="footer-text">
                    <p onClick={() => openPopup("About", textMap.about)}>About</p>
                    <p onClick={() => openPopup("Group information", textMap.groupInfo)}>Group information</p>
                </div>
                <div className="footer-text">
                    <p onClick={() => openPopup("Copyright information", textMap.copyright)}>Copyright information</p>
                    <p onClick={() => openPopup("Privacy Policy", textMap.privacy)}>Privacy Policy</p>
                </div>
                <div className="footer-text">
                    <p onClick={() => openPopup("Licencing", textMap.licencing)}>Licencing</p>
                    <p onClick={() => openPopup("Resources", textMap.resources)}>Resources</p>
                </div>
            </div>
            {popupOpen && <Popup header={selectedOption} text={selectedText} onClose={closePopup} />}
        </>
    );
};

//chatbot reply message loading component
const Loading = () => {
    return (
        <div className="loading">
            <div className="loading-circle"></div>
            <div className="loading-circle loading-circle2"></div>
            <div className="loading-circle loading-circle3"></div>
        </div>
    );
};

//language drop down selector component flag images are linked through url from https://flagpedia.net/download/api
const LanguageSelector = (props) => {

    const flagList = [
        {lang: "English", flagID: "ca"},
        {lang: "French", flagID: "fr"},
        {lang: "Spanish", flagID: "es"},
        {lang: "German", flagID: "de"}
    ]

    const [selectedLanguage, setLanguage] = useState("English");
    const [flag, setFlag] = useState("ca");

    // update the selected language
    function handleLanguageChange(event) {
        const language = event.target.value;
        setLanguage(language);
        props.onlanguagechange(language);
        setFlag(getFlag(language));
    }

    // find the flag corresponding to the given language
    function getFlag(lang) {
        const language = flagList.find(obj => obj.lang === lang);
        return language ? language.flagID : "";
    }

    return (
        <div className="language-selector-container">
            <label className="language-label">Language:</label>
            <div className="language-selector">
            <img className="language-flag" src={"https://flagcdn.com/256x192/"+flag+".png"} alt="Country flag"/>

                <select
                    className="language-select"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}>

                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                </select>
            </div>
        </div>
    );
};

//photogrpahImage


const PhotogrpahImage = () => {
    const IMAGES = [
        {
            src: '/image1.jpg',
            alt: 'Image 1',
            angle: -5,
        },
        {
            src: '/image2.jpg',
            alt: 'Image 2',
            angle: 0,
        },
        {
            src: '/image3.jpg',
            alt: 'Image 3',
            angle: 5,
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((activeIndex + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const { src, alt, angle } = IMAGES[activeIndex];

    return (
        <div className="photograph-images">
            <div className="image-stack">
                {IMAGES.map((image, index) => (
                    <img
                        key={index}
                        className={`image ${index === activeIndex ? 'active' : ''}`}
                        src={image.src}
                        alt={image.alt}
                        style={{ transform: `rotate(${image.angle - angle}deg)` }}
                    />
                ))}
            </div>

        </div>
    );
};

export {NavigationBar, ImageChangerComponent, PageRouter, Footer, Loading, LanguageSelector, PhotogrpahImage};