import {BrowserRouter, Link, Outlet, Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";

import "./Components.css"
import Home from "./Home";
import Directions from "./Directions";
import {Login} from "./Login";
import {Chatbot} from "./Chatbot";

const NavigationBar = () => {
    return (
        <>
            <div className="navbar">
                <Link to="/" className="nav-option" >Home</Link>
                <div className="nav-option">Museum/Info?</div>
                <Link to="/directions" className="nav-option">Directions</Link>
                <Link to="/chatbot" className="nav-option">Chat-Bot</Link>
                <Link to="/Login" className="nav-option">About/Admin</Link>
            </div>
            <Outlet />
        </>
    );
};


const ImageChangerComponent = () => {
    const [image,setImage] = useState(0);
    const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

    useEffect(() => {
        const index = setInterval(() => {
            setImage((image+1) % images.length);
        }, 5000);
        return () => clearInterval(index);
    }, [image, images.length]);

    return (
        <div className="image-changer-container">
            <img className="image-changer" src={images[image]}/>
        </div>
    );
};

const PageRouter = () => {
    return (

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<NavigationBar />}>
                        <Route index element={<Home />} />
                        <Route path="directions" element={<Directions />} />
                        <Route path="chatbot" element={<Chatbot />} />
                        <Route path="login" element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>

    );
};

const Footer = () => {
  return (
      <div className="footer">
          Copyright info, Privacy Policy Link, Contact info, Group info ect...
      </div>
  );
};

export { NavigationBar, ImageChangerComponent, PageRouter, Footer };