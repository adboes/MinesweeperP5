let canv_width = 400;
let canv_height = 400;
let rows = 10; // Number of rows
let cols = rows; // Number of columns
let cellWidth = canv_width / cols;  // Width of each cell
let cellHeight = canv_height / rows; // Height of each cell

let cells = [];
let cells_mines = [];
let mines = 10;
let num_cells = 0; // fields to be found
let found_cells = 0; // already found fields

function setup() {
  refresh();
}

function draw() {
}

function refresh() {
  // Reset game variables
  rem_mines = mines;
  num_cells = 0; // fields to be found
  found_cells = 0; // already found fields
  
  // Canvas setup
  createCanvas(canv_width, canv_height);
  num_cells = rows * cols - mines;

  // Initialize the cells array as a 2D grid
  cells = [];
  for (let i = 0; i < cols; i++) {
    cells[i] = []; // Create a new array for each column
    for (let j = 0; j < rows; j++) {
      let x = i * cellWidth;
      let y = j * cellHeight;
      fill(200)
      let newCell = new Cell(i, j, x, y, cellWidth, cellHeight);
      cells[i][j] = newCell;
      newCell.drawCell(); // Draw the cell
    }
  }
  
  // Place mines
  cells_mines = []; // Reset the mines list
  for (let m = 0; m < mines; m++) {
    // Choose a random tile
    let m_x = floor(random(0, cols));  // Random column
    let m_y = floor(random(0, rows));  // Random row
    
    let c = cells[m_x][m_y];
    if (c.mine === true) {
      m--; // If mine is already placed, try again
    } else {
      c.mine = true; // Place the mine
      cells_mines.push(c); // Track cells with mines
    }
  }
  
  // Calculate the number of mines around each cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!cells[i][j].mine) {
        cells[i][j].num = calculateNeighborMines(i, j);
      }
    }
  }

  console.log("Setup done.");
}

// Function to calculate the number of mines around a given cell
function calculateNeighborMines(i, j) {
  let total = 0;
  
  // Check the 8 surrounding cells
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      let neighborX = i + x;
      let neighborY = j + y;
      
      if (neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows) {
        if (cells[neighborX][neighborY].mine) {
          total++;
        }
      }
    }
  }
  return total;
}

// Mouse click handler
function mouseReleased(event) {
  cells.forEach(col => {
    col.forEach(c => {
      // Check if the mouse is over any cell, and if so, call updateCell
      if (mouseX > c.x && mouseX < c.x + c.c_width && 
          mouseY > c.y && mouseY < c.y + c.c_height) 
      {
        if (event.button === 0) {updateCell(c);}
        if (event.button === 1) {flagCell(c);}
      }
    });
  });
}

function flagCell(c) {
  if (!c.clicked) {  // Ensure you can't flag a clicked cell
    if (!c.flagged) {
      // Draw red "X" on the cell
      textAlign(CENTER, CENTER);
      fill(255, 0, 0); // Red for the "X"
      textSize(cellHeight / 2); // Adjust text size to fit inside cell
      text("X", c.x + cellWidth / 2, c.y + cellHeight / 2);
      c.flagged = true; // Mark cell as flagged
    } else {
      // Unflag the cell (clear the X)
      c.drawCell();  // Redraw the cell to remove the flag
      c.flagged = false; // Unmark the flag
    }
  }
}

function updateCell(c) {
  
  if (!c.flagged) {  // Prevent clicking flagged cells
    console.log("Cell clicked at position: ", c.i, c.j);
    c.clicked = true;
  
  
  if (c.mine) {
    console.log("Boom! You clicked a mine.");
    fill(255, 0, 0); // Red for mines
    // Add a delay to reset the game so player can see they lost
    setTimeout(refresh, 1000); // 1 second delay before reset
  } else {
    fill(255); // white for safe cells
    c.drawCell()

    found_cells++;
    if (found_cells == num_cells) {
      console.log("You've won! Congratulations!");
      fill(0, 255, 0);
      setTimeout(refresh, 1000); // 1 second delay before reset
    }
    
    if (c.num > 0) {
      // Draw the number on the cell
      textAlign(CENTER, CENTER);
      fill(0); // Black for numbers
      textSize(cellHeight / 2); // Adjust text size to fit inside cell
      text(c.num, c.x + cellWidth / 2, c.y + cellHeight / 2);
    }

    if (c.num === 0)    {  
        // Check the 8 surrounding cells
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            let neighborX = c.i + x;
            let neighborY = c.j + y;

            if (neighborX >= 0 && neighborX < cols && 
                neighborY >= 0 && neighborY < rows) 
            {
              nb = cells[neighborX][neighborY]
              if (nb.num < 10 && nb.clicked === false) 
              {
                updateCell(nb);
              }
            }
          }
        }
      }
    
  }
  }
}

// Class for each cell
class Cell {
  constructor(i, j, x, y, c_width, c_height) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.c_width = c_width;
    this.c_height = c_height;
    
    this.flagged = false;    
    this.clicked = false;
    this.mine = false; // Flag for whether this cell has a mine
    this.num = 0; // Number of mines in neighboring cells
  }

  drawCell() {
    stroke(50); // Set stroke color
    strokeWeight(3); // Set stroke weight
    rect(this.x, this.y, this.c_width, this.c_height); // Draw the rectangle
  }
}
