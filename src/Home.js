import "./Home.css";
import {ImageChangerComponent} from "./Components";

const Home = () => {
    return (

        <div className="container">

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
        </div>
    )
};

export default Home;