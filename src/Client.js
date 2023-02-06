import React from "react"
import {db} from "./Firebase"

function Client() {
    const logout = () => {
      localStorage.clear();
      window.location.reload();
    };
  
    const addHoursToFirebase = () => {
      db.collection("Hours")
        .add({
          time: "9am-5pm",
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    };
  
    return (
      <div>
        <h1> DASHBOARD</h1>
        <button onClick={logout}> Logout </button>
        <button onClick={addHoursToFirebase}>Add Hours</button>
      </div>
    );
  }
  export default Client;
  
