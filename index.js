window.onload = function () {
  const canvas = document.createElement("CANVAS");
  const context = canvas.getContext("2d");
  const CELL_SIZE = 15;
  const GRID_WIDTH = 25;
  const GRID_HEIGHT = 35;
  const FONT_FAMILY = "Courier";
  const STROKE_COLOR = "#222222";
  const SCENE_COLOR = "#111111";
  const NUM_ENTITIES = 150;
  const canvasStyles = {
    color: "#111111",
    border: { width: 0, color: "#EEEEEE", radius: 0 }
  };
  const colors = ["white", "yellow", "red", "cyan", "black", "blue"];
  const tiles = [];
  const TIME_TO_UPDATE = 5;
  let countToUpdate = 0;
  let grid = [];

  const random = (min, max) => parseInt(Math.random() * (max - min) + min);

  function Tile(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.dir = { x: 0, y: 0 };

    const rndmDir = random(1, 4);

    if (rndmDir > 2) this.dir.x = 1; else this.dir.y = 1;
  };

  const setupScene = function () {
    document.body.style.background = SCENE_COLOR;
    canvas.style.background = canvasStyles.color;
    canvas.style.border = `solid ${canvasStyles.border.width}px
      ${canvasStyles.border.color}`;
    canvas.style.borderRadius = `${canvasStyles.border.radius}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.width = CELL_SIZE * grid[0].length;
    canvas.height = grid.length * CELL_SIZE;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
  };

  const buildGrid = function (rows, cols) {
    const matrix = [];

    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++)
        matrix[i][j] = 0;
    }
    return matrix;
  };

  const renderGrid = function (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        context.lineWidth = 2;
        context.strokeStyle = STROKE_COLOR;
        context.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const renderTiles = function () {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      context.fillStyle = tile.color;
      context.fillRect(tile.x * CELL_SIZE, tile.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  };

  const updateTiles = function () {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];

      if (tile.x > 0 && tile.x < grid[0].length - 1) {
        if (Math.abs(tile.dir.x) > 0) {
          if (grid[tile.y][tile.x + tile.dir.x] === 1) {
            tile.dir.x *= -1;
          }
        }
      }

      if (tile.y > 0 && tile.y < grid.length - 1) {
        if (Math.abs(tile.dir.y) > 0) {
          if (grid[tile.y + tile.dir.y][tile.x] === 1) {
            tile.dir.y *= -1;
          }
        }
      }

      grid[tile.y][tile.x] = 0;
      tile.x += tile.dir.x;
      tile.y += tile.dir.y;
      grid[tile.y][tile.x] = 1;

      if (tile.x >= grid[0].length - 1 || tile.x <= 0)
        tile.dir.x *= -1;

      if (tile.y >= grid.length - 1 || tile.y <= 0)
        tile.dir.y *= -1;
    }
  };

  const march = function () {
    countToUpdate++;
    if (countToUpdate >= TIME_TO_UPDATE) {
      countToUpdate = 0;
      updateTiles();
    }
  };

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#DDDDDD";
    context.fillRect(0, CELL_SIZE * Math.round(grid.length / 2), canvas.width, CELL_SIZE * Math.round(grid.length / 2));
    context.fillStyle = "blue";
    context.fillRect(0, CELL_SIZE * Math.round(grid.length / 2), CELL_SIZE * Math.round(grid[0].length / 2), canvas.width, CELL_SIZE * Math.ceil(grid.length / 2));
    renderTiles();
    renderGrid(grid);
  };

  const tick = function () { march(); draw(); requestAnimationFrame(tick); };

  grid = buildGrid(GRID_HEIGHT, GRID_WIDTH);

  document.body.appendChild(canvas);

  setupScene();


  for (let i = 0; i < NUM_ENTITIES; i++) {
    const col = random(0, grid[0].length - 1);
    const row = random(0, grid.length - 1);
    tiles.push(new Tile(col, row, colors[Math.round(random(0, colors.length))]));
  }

  context.font = `${CELL_SIZE * 0.8}px ${FONT_FAMILY}`;

  tick();
}