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
      //Ex. If the Enterance node is a neighbour of the Desk, then the Desk is a neighbour of the Enterance node
    }
  }
}

function buildGraph() {
  //Function adds the neighbours which builds the graph
  //Main Room
  ENTERANCE.addNeighbour(DESK, 4);
  ENTERANCE.addNeighbour(WASHROOM, 7.5);
  ENTERANCE.addNeighbour(FIRST_EXHIBIT, 5);
  ENTERANCE.addNeighbour(E1_A1, 4.5);
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

  //Upper Floor
  US2.addNeighbour(C1, 1);
  US2.addNeighbour(E3_A1, 4);
  E3_A1.addNeighbour(C2, 3);
  E3_A2.addNeighbour(E3_A3, 6);
  E3_A3.addNeighbour(US1, 4);
  E3_A4.addNeighbour(C3, 3.5);
  E3_A5.addNeighbour(E3_A6, 5);
  E3_A6.addNeighbour(C1, 6);
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
    if (current === dest) return reconstructPath(cameFrom, current, dest); //may not need to use the function, may just be able to return the cameFrom set

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
  }
}

//This may not be needed, may just be able to store the path within the A_Star more research to be done
function reconstructPath(cameFrom, current, dest) {
  let finalPath = [];
  finalPath.push(dest.name);
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    finalPath.push(current.name);
  }
  return finalPath;
}

function getLowestInOpenSet(openSet, dest) {
  let current = openSet[0];
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].f = euclidianDistance(openSet[i], dest);
    if (openSet[i].f < current.f) current = openSet[i];
  }
  return current;
}

const ENTERANCE = new Node("ENTERANCE", 11, -3);
const DESK = new Node("DESK", 14, 0.5);
const WASHROOM = new Node("WASHROOM", 10, 4.5);
const FIRST_EXHIBIT = new Node("FIRST_EXHIBIT", 6, 2.5);
const E1_A1 = new Node("E1_A1", 6, -2);
const E1_A2 = new Node("E1_A2", 2, 0.5);
const E1_A3 = new Node("E1_A3", 0, 4);
const E1_A4 = new Node("E1_A4", -2, 0.5);
const E1_A5 = new Node("E1_A5", -5.5, 0.5);
const LS1 = new Node("LS1", -5.5, 4);

const SECOND_EXHIBIT = new Node("SECOND_EXHIBIT", -9.5, 2.5);
const E2_A1 = new Node("E2_A1", -9, -1);
const E2_A2 = new Node("E2_A2", -12, 0);
const E2_A3 = new Node("E2_A3", -15, 4);
const E2_A4 = new Node("E2_A4", -15, -3);
const E2_A5 = new Node("E2_A5", -9, -8);
const LS2 = new Node("LS2", -16, -7.5);

const US1 = new Node("US1", -17.5, 4);
const US2 = new Node("US2", -25, -10);
const C1 = new Node("C1", -25, -9);
const C2 = new Node("C2", -18, -9);
const C3 = new Node("C3", -25, 4.5);
const E3_A1 = new Node("E3_A1", -21, -9);
const E3_A2 = new Node("E3_A2", -19.5, -6);
const E3_A3 = new Node("E3_A3", -19.5, 0);
const E3_A4 = new Node("E3_A4", -21, 4.5);
const E3_A5 = new Node("E3_A5", -25, 3);
const E3_A6 = new Node("E3_A6", -25, -3);

buildGraph();

aStar(ENTERANCE, E2_A1);

//Remember the things you've accomplished, not the things you haven't
