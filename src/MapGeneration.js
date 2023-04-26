
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// All website layouts, designs, coding and functionality are Copyright © 2023 Robert Morabito, David Bailey, Maheen Samad, Fahad Arain, Dana Dobrosavljevic, and Jordan Bharati All right reserved.
//
// You may not otherwise copy, modify, or distribute this website (https://museum-mate-v1.vercel.app/) or the code contained in any manner.
// You may not remove or alter any copyright or other notice from this code or this website (https://museum-mate-v1.vercel.app/).
// 
// If you have further inquiry contact:
// Robert Morabito
// Developer
// hello@robertmorabito.ca
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { formattedPathForVisual } from "./Directional";
//const sharp = require("sharp");
const fs = require("fs");

export async function merge() {
  try {
    await sharp("public/map_images/Base_Map.png")
      .composite(buildCompositeList(formattedPathForVisual()))
      .toFile("public/map_images/finalPath.png");
  } catch (error) {
    console.log(error);
  }
}

function buildCompositeList(files) {
  //takes the array of files as input
  const inputList = [];
  files.forEach((str) => {
    if (doesFileExist(str)) {
      //for each file we will convert to the format required by the composite method when using image merging
      const inputObj = { input: str };
      inputList.push(inputObj);
    }
  });
  return inputList; //will return an array which is a collection of images paths formatted to work with the composite method
}

function doesFileExist(str) {
  return fs.existsSync(str) ? true : false;
}

merge();
