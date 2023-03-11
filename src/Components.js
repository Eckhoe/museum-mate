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
const Footer = () => {
    return (
        <div className="footer">
            Copyright info, Privacy Policy Link, Contact info, Group info ect...
        </div>
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

export {NavigationBar, ImageChangerComponent, PageRouter, Footer, Loading};