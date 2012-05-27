function Piece(row, col, num){
  this.row = row;
  this.col = col;  
  this.num = num;
}

function Splode(width, height, rowWidth, canvas){
  this.width = width;
  this.height = height;
  this.rowWidth = rowWidth;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.columns = 8;
  this.pieceSize = 20;
  this.pieceFont = "bold 30px Trebuchet MS";
  this.pieceStroke = "#000";
  this.pieceTextColor = "#fff";
  this.pieceTextOffsetX = -8;
  this.pieceTextOffsetY = 10;
  this.pieces = [];
  this.colors = { 1: "#ff3",
                  2: "#3f3",
                  3: "#09c",
                  4: "#03c",
                  5: "#306",
                  6: "#c03",
                  7: "#f60",
                  8: "#600",
                  9: "#999"}; // ?
  for (var i = 0; i < this.columns; i++){
    this.pieces.push([0, 0, 0, 0, 0, 0, 0, 0]);
  }
}


Splode.prototype.cancasClick = function(){
// figure what column the click is in
// drop the piece
}

Splode.prototype.dropPiece = function(){
// addPieceToColumn
// update score
// game loop
}

Splode.prototype.gameLoop = function (){
// check if the game is over
// generate a new piece
}

Splode.prototype.drawPiece = function(piece){
  this.context.beginPath();
  var x = (piece.col - 1) * this.rowWidth + this.rowWidth + this.pieceSize * 1.27;
  var y = (piece.row + 1) * this.rowWidth + this.pieceSize * 1.27;
  this.context.arc(x, y, this.pieceSize, 0, Math.PI * 2, false);
  this.context.closePath();
  this.context.strokeStyle = this.pieceStroke;
  this.context.stroke();
  this.context.fillStyle = this.colors[piece.num];
  this.context.fill();
  this.context.font = this.pieceFont;
  this.context.fillStyle = this.pieceTextColor;
  var txt = piece.num + "";
  if(piece.num == 9){
    txt = "?";
  }
  this.context.fillText(txt, x + this.pieceTextOffsetX, y + this.pieceTextOffsetY);
}


Splode.prototype.drawBoard = function(){
  for (var xy = 0.5; xy < this.width; xy += this.rowWidth){
  	this.context.moveTo(xy, this.rowWidth);
  	this.context.lineTo(xy, this.height - 0.5);
  	this.context.moveTo(0, xy + this.rowWidth);
  	this.context.lineTo(this.width, xy + this.rowWidth);
  }
  this.context.strokeStyle = "#aaa";
  this.context.stroke();
  for(var i = 0; i < this.columns; i++){
    for(var j = 0; j < this.columns; j++){
        var piece = new Piece(i, j, this.pieces[i][j]);
        if (piece.num){
        	this.drawPiece(piece);
        }
    }
  }
}

Splode.prototype.fillBoard = function(){
  // 10 +/- 2 pieces
  //
  var piecenum = 10;
  var pieceadj = this.randInt(8);
  if (pieceadj < 3){
    piecenum -= pieceadj;
  }
  else if (pieceadj > 6){
    piecenum += 9 - pieceadj;
  }
  for (var pc = 0; pc < piecenum; pc++){
    var piece = this.randInt(9);
    var col = this.randInt(9) - 1;
    this.addPieceInColumn(col, piece);
  }
}

Splode.prototype.addPieceInColumn = function(column, piece){
  for (var i = this.columns - 1; i >= 0; i--){
    if (!this.pieces[i][column]){
      this.pieces[i][column] = piece;
      var p = new Piece(i, column, piece);
      this.drawPiece(p);
      break;
    }
  }
  // check for game over -> column full
  this.checkSplosions();
}

Splode.prototype.checkSplosions = function(){
  var sploded = false;
  for (var i = 0; i < this.columns; i++){
    for(var j = 0; j < this.columns; j++){
      if (this.pieces[i][j]){
	      var piece = new Piece(i, j, this.pieces[i][j]);
          var result = this.checkSplosionForPiece(piece);
          if (result[0]){
            this.splode(piece, result);
            sploded = true;
          }
      }
    }
  }
  if (sploded){
      this.canvas.width = this.canvas.width;
      this.drawBoard();
      this.checkSplosions(true);
  }
}

Splode.prototype.splode = function(piece, coSploders){
  console.log("piece go boom: " + piece.row + ", " + piece.col + " (" + piece.num + ")");
  // TODO score!
  // TODO animate!
  var crow = piece.row;
  while(this.pieces[crow][piece.col] != 0 && crow > 0){
    var newp = 
    this.pieces[crow][piece.col] = this.pieces[crow - 1][piece.col];
    crow--;
  }
  this.pieces[crow][piece.col] = 0;
  coSploders.forEach(function(pc){
    if(pc.num == 9){
      var row = pc.row;
      if(pc.col == piece.col){
        row -= 1;
      }
      this.pieces[row][pc.col] = this.randInt(8);
    }
  }, this);
}

Splode.prototype.checkSplosionForPiece = function(piece){
  var pcs = [];
  pcs = this.hasRowOfPiecesContaining(piece);
  var mpcs = this.colHasNumOfPieces(piece.col, piece.num);
  if (mpcs){
    mpcs.forEach(function(pc){ pcs.push(pc)});
  }
  return pcs;
}

Splode.prototype.hasRowOfPiecesContaining = function(piece){
  var pcs = [piece];
  for(var i = piece.col + 1; i < this.columns; i++){
    if(this.hasPiece(piece.row, i)){
      pcs.push(new Piece(piece.row, i, this.pieces[piece.row][i]));
    }
    else{
      break;
    }
  }
  if(pcs.length > piece.num){
    return [];
  }
  else{
    if(pcs.length == piece.num && (piece.col == 0 || this.noPiece(piece.row, piece.col - 1))){
      return pcs;
    }
    else{
      for(var i = piece.col - 1; i >= 0; i--){
        if(this.hasPiece(piece.row, i)){
      	  pcs.push(new Piece(piece.row, i, this.pieces[piece.row][i]));
    	}
	    else{
    	  break;
    	}
      }
	  if(pcs.length == piece.num){
        return pcs;
      }
}
  }
  return [];
}

Splode.prototype.colHasNumOfPieces = function(col, pcnum){
  var pcs = [];
  if(pcnum < this.columns && this.hasPiece(this.columns - pcnum - 1, col)){
    return [];
  }
  for(var i = this.columns - 1; i > this.columns - pcnum - 1; i--){
    if(this.hasPiece(i, col)){
      pcs.push(new Piece(i, col, this.pieces[i][col]));
    }
    else{
      return [];
    }
  }
  return pcs;
}

Splode.prototype.hasPiece = function(row, col){
  return this.pieces[row][col] != 0;
}

Splode.prototype.noPiece = function(row, col){
  return this.pieces[row][col] == 0;
}

Splode.prototype.randInt = function(range){
  return Math.floor(Math.random() * range + 1)
}

Splode.prototype.initGame = function(){
  Math.seedrandom("REMOVETHISSHIT!!!");
  this.drawBoard();
  this.fillBoard();
// start loop
}
