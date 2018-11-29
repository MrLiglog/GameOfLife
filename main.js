let res = 10;
let r;
let c;
let grid;
//variable to lock rendering
var go = false;
//boardtype 1 = random, 0 = blank
var boardType = 1;
//variable for game fps
var gamefps = 15;
//variable to enable/disable grid overlay
var overlay = false;
//variables to track current cell coordinates
var cellx;
var celly;


//function to toggle grid overlay rendering
function toggleGrid()
{
    if (overlay==false) overlay=true;
    else if (overlay==true) overlay=false;
}

//function to set fps (currently broken)
function setfps(fr)
{
    gamefps = fr;
    frameRate(fr);
}

//function to toggle locking
function togglelock()
{
    if (go == false) go = true;
    else if (go == true) go = false;
}

//function to change the board type
function changeBoard(opt)
{
    if (opt==1) boardType=1;
    else if (opt==2) boardType=0;
    setup();
}


function make2DArray(cols, rows)
{
    //create a new 2d array to present the world
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++)
    {
        arr[i] = new Array(rows);
    }
    return arr;
}

//setup function from p5
function setup()
{
    //set the framerate
    frameRate(gamefps);
    createCanvas(800, 400);
    r = 400/res;
    c = 800/res;
    grid = make2DArray(c, r);
    for (let i = 0; i < c; i++)
    {
        for (let j = 0; j < r; j++)
        {
            if (boardType==1) grid[i][j] = floor(random(2));
            else grid[i][j] = 0;
        }
    }
}

//counts the number of live neighbours to a cell[x][y]
function countn(x, y)
{
    out = 0;
    for (let i = -1; i < 2; i++)
    {
        for (let j = -1; j < 2; j++)
        {
            //implement wraparound
            let col = (x+i+c)%c;
            let row = (y+j+c)%r;
            out+=grid[col][row];
        }
    }
    out-=grid[x][y];
    return out;
}

//function to draw a grid overlay
function drawgrid()
{
    for (let i = 0; i < c; i++)
    {
        for (let j = 0; j < r; j++)
        {
            stroke(255, 0, 0);
            line(i*res, 0, i*res, 400);
            line(0, j*res, 800, j*res);
        }
    }
    //draw perimeter lines
    line(799, 400, 799, 0);
    line(0, 399, 800, 399);
}

function mousePressed()
{
    //set boundaries on the window
    if (mouseX<800 && mouseY<400)
    {
    cellx = floor(mouseX/res);
    celly = floor(mouseY/res);
    grid[cellx][celly]=1;
    cellx = -1;
    celly = -1;
    }
}

//draws the grid from p5
function draw()
{
    background(0);
    for (let i = 0; i < c; i++)
    {
        for (let j = 0; j < r; j++)
        {
            let x = i*res;
            let y = j*res;
            //render the grid if the overlay is toggled on
            if (grid[i][j] == 1)
            {
                fill(255);
                stroke(0);
                rect(x, y, res, res);
            }
        }
    }
    //compute the next generation of the game
    let nxt = make2DArray(c, r);
    for (let i = 0; i < c; i++)
    {
        for (let j = 0; j < r; j++)
        {
            let sum = countn(i, j);
            let state = grid[i][j];
            if (state == 0 && sum == 3) nxt[i][j] = 1;
            else if (state == 1 && (sum < 2 || sum > 3)) nxt[i][j] = 0;
            else nxt[i][j] = state;
        }
    }
    if (go==true) grid = nxt;
    if (overlay) drawgrid();
    if (mouseIsPressed == true) mousePressed();
}