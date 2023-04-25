class Node {
  constructor(name, x, y) {
    this.name = name; //name of the node
    this.x = x; //x-coord
    this.y = y; //y-coord
    this.f = Infinity; //F-score
    this.g = Infinity; //G-score
    this.neighbours = []; //Current neighbours of the node
    this.direction = "";
  }

  addNeighbour(node, distance) {
    if (!this.neighbours[node]) {
      //if the node that is trying to be added is not within the neightbours array of the 'parent' node
      this.neighbours.push([node, distance]); //adds the neighbouring node into the array of neighbours with a distance from the 'parent'
      node.neighbours.push([this, distance]); //adds the 'parent' node into the array of the neighbouring nodes neighbours
      //Ex. If the Entrance node is a neighbour of the Desk, then the Desk is a neighbour of the Entrance node
    }
  }
}

function buildGraph() {
  //Function adds the neighbours which builds the graph
  //Main Room
  ENTRANCE.addNeighbour(DESK, 4);
  ENTRANCE.addNeighbour(WASHROOM, 7.5);
  ENTRANCE.addNeighbour(FIRST_EXHIBIT, 5);
  ENTRANCE.addNeighbour(E1_A1, 4.5);
  DESK.addNeighbour(WASHROOM, 3);
  DESK.addNeighbour(FIRST_EXHIBIT, 8);
  DESK.addNeighbour(E1_A1, 8);
  WASHROOM.addNeighbour(FIRST_EXHIBIT, 4.5);
  FIRST_EXHIBIT.addNeighbour(E1_A1, 4.5);
  FIRST_EXHIBIT.addNeighbour(E1_A2, 4);
  FIRST_EXHIBIT.addNeighbour(E1_A3, 6);
  FIRST_EXHIBIT.addNeighbour(E1_A4, 8);
  FIRST_EXHIBIT.addNeighbour(E1_A5, 10);
  FIRST_EXHIBIT.addNeighbour(LS1, 12);
  FIRST_EXHIBIT.addNeighbour(SECOND_EXHIBIT, 15);
  E1_A2.addNeighbour(E1_A3, 3);
  E1_A2.addNeighbour(E1_A4, 4);
  E1_A3.addNeighbour(E1_A4, 3);
  E1_A3.addNeighbour(LS1, 6);
  E1_A4.addNeighbour(E1_A5, 3.5);
  E1_A5.addNeighbour(LS1, 4);
  E1_A5.addNeighbour(SECOND_EXHIBIT, 4);

  //Second Room
  SECOND_EXHIBIT.addNeighbour(E2_A1, 3);
  SECOND_EXHIBIT.addNeighbour(E2_A2, 2.5);
  SECOND_EXHIBIT.addNeighbour(E2_A3, 4);
  E2_A1.addNeighbour(E2_A5, 7);
  E2_A1.addNeighbour(LS2, 7);
  E2_A2.addNeighbour(E2_A1, 2.5);
  E2_A2.addNeighbour(E2_A4, 3);
  E2_A2.addNeighbour(LS2, 6);
  E2_A3.addNeighbour(E2_A2, 3);
  E2_A3.addNeighbour(E2_A4, 7);
  E2_A4.addNeighbour(LS2, 3.5);
  E2_A4.addNeighbour(E2_A5, 4.5);
  E2_A5.addNeighbour(LS2, 6);
  LS1.addNeighbour(US1, 1);
  LS2.addNeighbour(US2, 1);

  //Upper Floor
  US2.addNeighbour(C1, 1);
  US2.addNeighbour(E3_A1, 4);
  E3_A1.addNeighbour(C2, 3);
  E3_A2.addNeighbour(E3_A3, 6);
  E3_A3.addNeighbour(US1, 4);
  E3_A4.addNeighbour(C3, 3.5);
  E3_A5.addNeighbour(C1, 11);
  C1.addNeighbour(E3_A1, 4);
  C2.addNeighbour(E3_A2, 3);
  US1.addNeighbour(E3_A4, 4);
  C3.addNeighbour(E3_A5, 1.5);
}

function euclidianDistance(currNode, destNode) {
  return Math.sqrt(
    (destNode.x - currNode.x) ** 2 + (destNode.y - currNode.y) ** 2
  );
}

//All that needs to be done is implement the A_Star then I am done what was needed
//Must start working on way to do the map visualization
function aStar(source, dest) {
  let openSet = [source]; //will contain the nodes that will be evaluated (source is going to already be in the openSet)
  let cameFrom = new Map(); //will hold the parent of each node
  source.f = source.g + euclidianDistance(source, dest);
  source.g = 0;
  while (openSet.length > 0) {
    var current = getLowestInOpenSet(openSet, dest); //will be the node with the lowest fScore
    // console.log(current.name);
    if (current === dest) return reconstructPath(cameFrom, current, dest); // This is needed as it finds cardinality and you cannot just return the cameFrom set

    const index = openSet.indexOf(cameFrom, current); //gets the index of the current node
    openSet.splice(index, 1); //removes it from the openSet, since we no longer want to work with the node

    for (let i = 0; i < current.neighbours.length; i++) {
      const curr_gScore = current.g + current.neighbours[i][1]; //this makes the current gScore the distance from current to its neighbour
      if (curr_gScore < current.neighbours[i][0].g) {
        cameFrom.set(current.neighbours[i][0], current); //adds the current neighbour as a child of the current 'parent' node
        current.neighbours[i][0].g = curr_gScore; //sets the gScore of the current observable neighbour
        current.neighbours[i][0].f =
          curr_gScore + euclidianDistance(current.neighbours[i][0], dest); //sets the fScore of the current obervable neighbour
        if (!openSet.includes(current.neighbours[i][0])) {
          //if the neighbour of the current node is not in the open set
          openSet.push(current.neighbours[i][0]); //adds to the open set
        }
      }
    }
    // Check if there are no more nodes to evaluate and the current node is not the destination node
    if (openSet.length === 0 && current !== dest) {
      throw new Error("No path found from source to destination");
    }
  }
}

// This finds the cardinality of the current transition from x and y coordinates
function getCardinality(path) {
  let dirPath = [];

  // Get the cardinality by comparing the vectors of two connected nodes in the list radially
  for (let i = path.length - 1; i > 0; i--) {
    let A = path[i];
    let B = path[i - 1];
    let dx = B[0] - A[0];
    let dy = B[1] - A[1];
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < -157.5 || angle > 157.5) {
      dirPath[i] = "west";
    } else if (angle > -157.5 && angle < -112.5) {
      dirPath[i] = "northwest";
    } else if (angle > -112.5 && angle < -67.5) {
      dirPath[i] = "north";
    } else if (angle > -67.5 && angle < -22.5) {
      dirPath[i] = "northeast";
    } else if (angle > -22.5 && angle < 22.5) {
      dirPath[i] = dx >= 0 ? "east" : "west";  // use dx to determine east/west direction
    } else if (angle >= 22.5 && angle <= 67.5) {
      dirPath[i] = "southeast";
    } else if (angle >= 67.5 && angle <= 112.5) {
      dirPath[i] = "south";
    } else {
      dirPath[i] = "southwest";
    }

  }
  // Return the translation of the above
  return naturalDir(dirPath);
}

// This translates to natural language directions from cardinality
function naturalDir(path) {
  const card = [
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  let dirPath = [];
  let lastDir;

  for (let i = 0; i < path.length - 1; i++) {
    let cur = card.indexOf(i);
    let next = card.indexOf(i + 1);
    let diff = next - cur;
    let modDiff = ((diff % 8) + 8) % 8;
    switch (modDiff) {
      case 0:
        if (lastDir !== "straight") {
          dirPath.push("straight");
          lastDir = "straight";
        }
        break;
      case 1:
        dirPath.push("slight right");
        lastDir = "slight right";
        break;
      case 2:
        dirPath.push("right");
        lastDir = "right";
        break;
      case 3:
        dirPath.push("sharp right");
        lastDir = "sharp right";
        break;
      case 4:
        dirPath.push("sharp left");
        lastDir = "sharp left";
        break;
      case 5:
        dirPath.push("left");
        lastDir = "left";
        break;
      case 6:
        dirPath.push("slight left");
        lastDir = "slight left";
        break;
      default:
        dirPath.push("invalid input");
        break;
    }
  }
  return dirPath;
}


// THIS IS NOW NEEDED AS IT IS WHERE THE CARDINALITY IS DETERMINED
function reconstructPath(cameFrom, current, dest) {
  let vocalPath = [];
  let visualPath = [];

  vocalPath.push([dest.x, dest.y]);
  visualPath.push(dest.name);

  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    vocalPath.push([current.x, current.y]);
    visualPath.push(current.name);
  }

  vocalPath = getCardinality(vocalPath);
  visualPath = formattedPathForVisual(visualPath);

  // Return a natual language path
  return [vocalPath, visualPath];
}

function getLowestInOpenSet(openSet, dest) {
  let current = openSet[0];
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].f = euclidianDistance(openSet[i], dest);
    if (openSet[i].f < current.f) current = openSet[i];
  }
  return current;
}

function getPath(source, dest) {
  resetScores();
  let finalPath = aStar(eval(source), eval(dest));
  return finalPath;
}

function formattedPathForVisual(path) {
  let formatted = [];
  for (let i = 0; i < path.length - 1; i++) {
    formatted.push(`public/map_images/${path[i].name}-${path[i + 1].name}.png`);
    formatted.push(`public/map_images/${path[i + 1].name}-${path[i].name}.png`);
    //Adds both possible path names to the formatted array. Will handle inside the Map Generation
  }
  return formatted;
}

function resetScores() {
  ENTRANCE.f = Infinity; //F-score
  ENTRANCE.g = Infinity; //G-score
  DESK.f = Infinity; //F-score
  DESK.g = Infinity; //G-score
  WASHROOM.f = Infinity; //F-score
  WASHROOM.g = Infinity; //G-score

  FIRST_EXHIBIT.f = Infinity; //F-score
  FIRST_EXHIBIT.g = Infinity; //G-score
  E1_A1.f = Infinity; //F-score
  E1_A1.g = Infinity; //G-score
  E1_A2.f = Infinity; //F-score
  E1_A2.g = Infinity; //G-score
  E1_A3.f = Infinity; //F-score
  E1_A3.g = Infinity; //G-score
  E1_A4.f = Infinity; //F-score
  E1_A4.g = Infinity; //G-score
  E1_A5.f = Infinity; //F-score
  E1_A5.g = Infinity; //G-score
  LS1.f = Infinity; //F-score
  LS1.g = Infinity; //G-score

  SECOND_EXHIBIT.f = Infinity; //F-score
  SECOND_EXHIBIT.g = Infinity; //G-score
  E2_A1.f = Infinity; //F-score
  E2_A1.g = Infinity; //G-score
  E2_A2.f = Infinity; //F-score
  E2_A2.g = Infinity; //G-score
  E2_A3.f = Infinity; //F-score
  E2_A3.g = Infinity; //G-score
  E2_A4.f = Infinity; //F-score
  E2_A4.g = Infinity; //G-score
  E2_A5.f = Infinity; //F-score
  E2_A5.g = Infinity; //G-score
  LS2.f = Infinity; //F-score
  LS2.g = Infinity; //G-score

  E3_A1.f = Infinity; //F-score
  E3_A1.g = Infinity; //G-score
  E3_A2.f = Infinity; //F-score
  E3_A2.g = Infinity; //G-score
  E3_A3.f = Infinity; //F-score
  E3_A3.g = Infinity; //G-score
  E3_A4.f = Infinity; //F-score
  E3_A4.g = Infinity; //G-score
  E3_A5.f = Infinity; //F-score
  E3_A5.g = Infinity; //G-score
  C1.f = Infinity; //F-score
  C1.g = Infinity; //G-score
  C2.f = Infinity; //F-score
  C2.g = Infinity; //G-score
  C3.f = Infinity; //F-score
  C3.g = Infinity; //G-score
  US1.f = Infinity;
  US1.g = Infinity;
  US2.f = Infinity;
  US2.g = Infinity;
}

module.exports = { getPath, formattedPathForVisual };

let ENTRANCE = new Node("ENTRANCE", 11, -3);
let DESK = new Node("DESK", 14, 0.5);
let WASHROOM = new Node("WASHROOM", 10, 4.5);
let FIRST_EXHIBIT = new Node("FIRST_EXHIBIT", 6, 2.5);
let E1_A1 = new Node("E1_A1", 6, -2);
let E1_A2 = new Node("E1_A2", 2, 0.5);
let E1_A3 = new Node("E1_A3", 0, 4);
let E1_A4 = new Node("E1_A4", -2, 0.5);
let E1_A5 = new Node("E1_A5", -5.5, 0.5);
let LS1 = new Node("LS1", -5.5, 4);

let SECOND_EXHIBIT = new Node("SECOND_EXHIBIT", -9.5, 2.5);
let E2_A1 = new Node("E2_A1", -9, -1);
let E2_A2 = new Node("E2_A2", -12, 0);
let E2_A3 = new Node("E2_A3", -15, 4);
let E2_A4 = new Node("E2_A4", -15, -3);
let E2_A5 = new Node("E2_A5", -9, -8);
let LS2 = new Node("LS2", -16, -7.5);

let US1 = new Node("US1", -17.5, 4);
let US2 = new Node("US2", -25, -10);
let C1 = new Node("C1", -25, -9);
let C2 = new Node("C2", -18, -9);
let C3 = new Node("C3", -25, 4.5);
let E3_A1 = new Node("E3_A1", -21, -9);
let E3_A2 = new Node("E3_A2", -19.5, -6);
let E3_A3 = new Node("E3_A3", -19.5, 0);
let E3_A4 = new Node("E3_A4", -21, 4.5);
let E3_A5 = new Node("E3_A5", -25, 3);

buildGraph();

//Remember the things you've accomplished, not the things you haven't
//Remember to buy milk next time you are at the grocery store
