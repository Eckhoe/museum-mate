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
                <Link to="/chatbot" className="nav-option">Chat-Bot</Link>
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
                            <Link to="/chatbot" onClick={handleToggle}>Chatbot</Link>
                            <Link to="/login" onClick={handleToggle}>Login</Link>
                        </div>
                    </div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/directions" element={<Directions/>}/>
                        <Route path="/chatbot" element={<Chatbot/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </BrowserRouter>
            </> : <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<NavigationBar/>}>
                            <Route index element={<Home/>}/>
                            <Route path="directions" element={<Directions/>}/>
                            <Route path="chatbot" element={<Chatbot/>}/>
                            <Route path="login" element={<Login/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </>}
        </>
    );
};

//footer component for site
//<p>Resources</p>
const Footer = () => {
    return (
        <>
        <div className="footer">
            <div className="footer-text">
                <p>About</p>
                <p>Group information</p>
            </div>
            <div className="footer-text">
                <p>Copyright information</p>
                <p>Privacy Policy Link</p>
            </div>
            <div className="footer-text">

                <p>Contact information</p>
                <p>chatbot icons from https://icons8.com</p>
            </div>
        </div>
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