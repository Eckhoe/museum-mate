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
                <div className="nav-option">Museum/Info?</div>
                <Link to="/directions" className="nav-option">Directions</Link>
                <Link to="/chatbot" className="nav-option">Chat-Bot</Link>
                <Link to="/Login" className="nav-option">About/Admin</Link>
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

    return (


        <BrowserRouter>
            {isMobile ?
                <div>mobile layout </div>
                :
                <Routes>
                    <Route path="/" element={<NavigationBar/>}>
                        <Route index element={<Home/>}/>
                        <Route path="directions" element={<Directions/>}/>
                        <Route path="chatbot" element={<Chatbot/>}/>
                        <Route path="login" element={<Login/>}/>
                    </Route>
                </Routes>
            }
        </BrowserRouter>


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

export {NavigationBar, ImageChangerComponent, PageRouter, Footer};