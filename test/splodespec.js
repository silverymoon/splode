describe("the splode game", function(){

  var splode;
  var ctx;
  
  beforeEach(function() {
    ctx = {};
    ctx.getContext = function(){};
    spyOn(ctx, 'getContext').andReturn(ctx);
	splode = new Splode(401, 451, 50, ctx);
  });
  
  it("should draw the board properly", function(){
    ctx.moveTo = jasmine.createSpy("moveTo");
    ctx.lineTo = jasmine.createSpy("lineTo");
    ctx.stroke = jasmine.createSpy("stroke");
    splode.drawBoard();
    expect(ctx.moveTo).toHaveBeenCalledWith(0.5, 50);
    expect(ctx.lineTo).toHaveBeenCalledWith(0.5, 450.5);
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 50.5);
    expect(ctx.lineTo).toHaveBeenCalledWith(401, 50.5);
    expect(ctx.stroke.callCount).toEqual(1);
    expect(ctx.moveTo.callCount).toEqual(18);
    expect(ctx.lineTo.callCount).toEqual(18);
  });  
  it("should make proper random numbers", function(){
    Math.seedrandom("foo42");    
    expect(splode.randInt(9)).toEqual(2);
    expect(splode.randInt(9)).toEqual(8);
    expect(splode.randInt(9)).toEqual(4);
    expect(splode.randInt(9)).toEqual(9);    
  });
  it("should generate pieces with a provided random seed", function(){
    Math.seedrandom("foo42");
	splode.addPieceInColumn = jasmine.createSpy("addPieceInColumn");
    splode.fillBoard();
    expect(splode.addPieceInColumn.callCount).toEqual(8);
    expect(splode.addPieceInColumn.argsForCall[0]).toEqual([3, 8]);
    expect(splode.addPieceInColumn.argsForCall[1]).toEqual([0, 9]);
    expect(splode.addPieceInColumn.argsForCall[2]).toEqual([7, 4]);
    expect(splode.addPieceInColumn.argsForCall[3]).toEqual([4, 1]);
    expect(splode.addPieceInColumn.argsForCall[4]).toEqual([7, 9]);
    expect(splode.addPieceInColumn.argsForCall[5]).toEqual([3, 9]);
    expect(splode.addPieceInColumn.argsForCall[6]).toEqual([5, 6]);
    expect(splode.addPieceInColumn.argsForCall[7]).toEqual([0, 5]);   
  });
  it("should stack pieces correctly in columns", function(){
	splode.drawPiece = jasmine.createSpy("drawPiece");
	splode.checkSplosions = jasmine.createSpy("checkSplosions");
	splode.addPieceInColumn(0, 2);
	splode.addPieceInColumn(0, 5);
	splode.addPieceInColumn(0, 7);
	splode.addPieceInColumn(3, 2);
	expect(splode.checkSplosions.callCount).toEqual(4);
	expect(splode.drawPiece.callCount).toEqual(4);
    expect(splode.drawPiece.argsForCall[0]).toEqual([new Piece(7, 0, 2)]);
    expect(splode.drawPiece.argsForCall[1]).toEqual([new Piece(6, 0, 5)]);
    expect(splode.drawPiece.argsForCall[2]).toEqual([new Piece(5, 0, 7)]);
    expect(splode.drawPiece.argsForCall[3]).toEqual([new Piece(7, 3, 2)]);
  });
  it("should draw a piece correctly", function(){
    ctx.stroke = jasmine.createSpy("stroke");
    ctx.fill = jasmine.createSpy("fill");    
    ctx.beginPath = jasmine.createSpy("beginPath");
    ctx.arc = jasmine.createSpy("arc");
    ctx.closePath = jasmine.createSpy("closePath");
    ctx.fillText = jasmine.createSpy("fillText");    
    splode.drawPiece(new Piece(0, 0, 3));
    expect(ctx.stroke.callCount).toEqual(1);
    expect(ctx.fill.callCount).toEqual(1);
    expect(ctx.beginPath.callCount).toEqual(1);
    expect(ctx.closePath.callCount).toEqual(1);
	expect(ctx.arc).toHaveBeenCalledWith(25.4, 75.4, 20, 0, Math.PI * 2, false);
	expect(ctx.fillText).toHaveBeenCalledWith("3", 17.4, 85.4);	
    expect(ctx.fillStyle).toEqual("#fff");
    expect(ctx.strokeStyle).toEqual("#000");
    expect(ctx.font).toEqual("bold 30px Trebuchet MS");
  });
  describe("according to the splosion rules", function(){
    it("hasPiece and noPiece should run correctly", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 2, 7],
                       [2, 0, 0, 0, 0, 0, 8, 6],
                       [4, 0, 0, 2, 5, 0, 6, 6],
      ];
      expect(splode.hasPiece(7, 0)).toBeTruthy();
      expect(splode.hasPiece(5, 6)).toBeTruthy();
      expect(splode.hasPiece(0, 0)).toBeFalsy();
      expect(splode.noPiece(0, 0)).toBeTruthy();
      expect(splode.noPiece(7, 2)).toBeTruthy();
      expect(splode.noPiece(5, 6)).toBeFalsy();
    });
    it("should correctly check for number of pieces in column", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 2, 7],
                       [2, 0, 0, 0, 0, 0, 8, 6],
                       [4, 0, 0, 2, 5, 0, 6, 6],
      ];
      expect(splode.colHasNumOfPieces(0, 2)).toEqual([new Piece(7, 0, 4), new Piece(6, 0, 2)]);
      expect(splode.colHasNumOfPieces(0, 1)).toEqual([]);
      expect(splode.colHasNumOfPieces(3, 1)).toEqual([new Piece(7, 3, 2)]);
      expect(splode.colHasNumOfPieces(1, 0)).toEqual([]);
      expect(splode.colHasNumOfPieces(3, 5)).toEqual([]);
      expect(splode.colHasNumOfPieces(6, 2)).toEqual([]);
      expect(splode.colHasNumOfPieces(7, 3)).toEqual([new Piece(7, 7, 6), new Piece(6, 7, 6), new Piece(5, 7, 7)]);
    });
    it("should correctly check for number of pieces in row containing a piece", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 2, 7],
                       [2, 0, 0, 1, 0, 4, 8, 6],
                       [4, 1, 0, 2, 5, 1, 6, 6],
      ];
      expect(splode.hasRowOfPiecesContaining(new Piece(5, 6, 2))).toEqual([new Piece(5, 6, 2), new Piece(5, 7, 7),]);
      expect(splode.hasRowOfPiecesContaining(new Piece(6, 0, 2))).toEqual([]);
      expect(splode.hasRowOfPiecesContaining(new Piece(7, 4, 5))).
      	toEqual([new Piece(7, 4, 5), new Piece(7, 5, 1), new Piece(7, 6, 6), new Piece(7, 7, 6), new Piece(7, 3, 2)]);
      expect(splode.hasRowOfPiecesContaining(new Piece(7, 1, 1))).toEqual([]);
      expect(splode.hasRowOfPiecesContaining(new Piece(6, 3, 1))).toEqual([new Piece(6, 3, 1)]);
    });
    it("should explode one 1-piece correctly in the first column", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [1, 0, 0, 0, 0, 0, 0, 0],
      ];
      var p = new Piece(7, 0, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([p, p]);
    });
    it("should explode one 1 piece correctly in the last column", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 1],
      ];
      var p = new Piece(7, 7, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([p, p]);
    });
    it("should explode one 1-piece correctly in the middle columns", function(){
      splode.pieces = [[0, 0, 0, 0, 1, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
                       [0, 0, 0, 0, 8, 0, 0, 0],
      ];
      var p = new Piece(0, 4, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([p]);
    });
    it("should not explode several 1-pieces in clumps", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [1, 1, 0, 0, 0, 0, 1, 1],
                       [1, 1, 0, 0, 0, 0, 1, 1],
      ];
      var p = new Piece(6, 0, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(7, 0, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(6, 1, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(7, 1, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      var p = new Piece(6, 6, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(7, 6, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(6, 7, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
      p = new Piece(7, 7, 1)
      expect(splode.checkSplosionForPiece(p)).toEqual([]);
    });
    it("should explode 2-pieces correctly", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 2, 7],
                       [2, 0, 0, 0, 0, 0, 8, 6],
                       [4, 0, 0, 2, 5, 0, 6, 6],
      ];
      var p = new Piece(6, 0, 2)
      expect(splode.checkSplosionForPiece(p)).toEqual([new Piece(7, 0, 4), p]);
      p = new Piece(7, 3, 2)
      expect(splode.checkSplosionForPiece(p)).toEqual([p, new Piece(7, 4, 5)]);
      p = new Piece(5, 6, 2)
      expect(splode.checkSplosionForPiece(p)).toEqual([p, new Piece(5, 7, 7)]);
    });
    it("should explode 3-pieces correctly", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [3, 0, 0, 0, 0, 0, 2, 7],
                       [2, 0, 0, 0, 0, 0, 8, 6],
                       [4, 0, 3, 2, 5, 0, 6, 6],
      ];
      var p = new Piece(5, 0, 3)
      expect(splode.checkSplosionForPiece(p)).toEqual([new Piece(7, 0, 4), new Piece(6, 0, 2), p]);
      p = new Piece(7, 2, 3)
      expect(splode.checkSplosionForPiece(p)).toEqual([p, new Piece(7, 3, 2), new Piece(7, 4, 5)]);
    });
    it("should explode 8-pieces correctly", function(){
      splode.pieces = [[0, 0, 8, 0, 0, 0, 0, 0],
                       [0, 0, 7, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 0, 2, 0, 0, 0, 0, 0],
                       [0, 0, 8, 0, 0, 0, 0, 0],
                       [3, 0, 5, 0, 0, 0, 2, 7],
                       [2, 0, 4, 0, 0, 0, 8, 6],
                       [4, 8, 3, 2, 5, 8, 6, 6],
      ];
      var p = new Piece(7, 1, 8);
      expect(splode.checkSplosionForPiece(p)).toEqual([p, new Piece(7, 2, 3), new Piece(7, 3, 2),
          new Piece(7, 4, 5), new Piece(7, 5, 8), new Piece(7, 6, 6), new Piece(7, 7, 6), new Piece(7, 0, 4)]);
      p = new Piece(7, 5, 8);
      expect(splode.checkSplosionForPiece(p)).toEqual([p, new Piece(7, 6, 6), new Piece(7, 7, 6), 
          new Piece(7, 4, 5), new Piece(7, 3, 2), new Piece(7, 2, 3), new Piece(7, 1, 8), new Piece(7, 0, 4)]);
      p = new Piece(4, 2, 8);
      expect(splode.checkSplosionForPiece(p)).toEqual([new Piece(7, 2, 3), new Piece(6, 2, 4), new Piece(5, 2, 5),
      	  p, new Piece(3, 2, 2), new Piece(2, 2, 4), new Piece(1, 2, 7), new Piece(0, 2, 8)]);
    });
    it("should not explode various pieces in non-fitting places", function(){
      splode.pieces = [[0, 0, 8, 0, 0, 0, 0, 0],
                       [0, 0, 7, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 0, 2, 0, 0, 0, 0, 0],
                       [5, 0, 8, 0, 0, 0, 0, 0],
                       [3, 0, 5, 0, 0, 0, 2, 7],
                       [2, 0, 4, 0, 0, 0, 8, 6],
                       [4, 8, 3, 2, 5, 8, 6, 6],
      ];
      expect(splode.checkSplosionForPiece(new Piece(1, 2, 7))).toEqual([]);
      expect(splode.checkSplosionForPiece(new Piece(3, 2, 2))).toEqual([]);
      expect(splode.checkSplosionForPiece(new Piece(6, 6, 8))).toEqual([]);
      expect(splode.checkSplosionForPiece(new Piece(7, 6, 6))).toEqual([]);
      expect(splode.checkSplosionForPiece(new Piece(5, 0, 3))).toEqual([]);
    });
    it("should properly splode 2 pieces of same value", function(){
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 3, 0],
                       [0, 0, 0, 0, 0, 0, 3, 0],
                       [0, 0, 0, 2, 2, 0, 3, 0],
      ];
      var p1 = new Piece(7, 3, 2);
      var p2 = new Piece(7, 4, 2);
      expect(splode.checkSplosionForPiece(p1)).toEqual([p1, p2]);
      expect(splode.checkSplosionForPiece(p2)).toEqual([p2, p1]);
      var q1 = new Piece(5, 6, 3);
      var q2 = new Piece(6, 6, 3);
      var q3 = new Piece(7, 6, 3);
      expect(splode.checkSplosionForPiece(q1)).toEqual([q3, q2, q1]);
      expect(splode.checkSplosionForPiece(q2)).toEqual([q3, q2, q1]);
      expect(splode.checkSplosionForPiece(q3)).toEqual([q3, q2, q1]);
    });
    it("should call splode properly", function(){
      spyOn(splode, "splode").andCallThrough();
	  splode.drawBoard = jasmine.createSpy("drawBoard");
	  splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 1],
      ];
      splode.checkSplosions();
      expect(splode.drawBoard.callCount).toEqual(1);
      expect(splode.splode).toHaveBeenCalledWith(new Piece(7, 7,1), [new Piece(7, 7, 1), new Piece(7, 7, 1)]);
    });  
    it("should explode two simultaneous pieces correctly", function(){
	  spyOn(splode, "splode").andCallThrough();
	  splode.drawBoard = jasmine.createSpy("drawBoard");
	  splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 2, 0, 0, 0, 0],
                       [0, 0, 0, 3, 0, 0, 0, 1],
      ];
      splode.checkSplosions();
      expect(splode.drawBoard.callCount).toEqual(1);
      var p = new Piece(7, 7, 1);
      expect(splode.splode).toHaveBeenCalledWith(p, [p, p]);
      p = new Piece(6, 3, 2);
      expect(splode.splode).toHaveBeenCalledWith(p, [new Piece(7, 3, 3), p]);
    });
    it("splode should properly delete pieces, drop the ones above and reveal, if necessary", function(){
      splode.drawBoard = jasmine.createSpy("drawBoard");
      splode.pieces = [[0, 0, 6, 0, 0, 0, 0, 0],
                       [0, 0, 6, 0, 0, 0, 0, 0],
                       [0, 0, 5, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 0, 5, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 0, 5, 0, 0, 4, 0, 0],
                       [5, 9, 3, 0, 0, 2, 0, 1],
      ];
      spyOn(splode, "randInt").andReturn(7);
      splode.checkSplosions();
      expect(splode.pieces[7][7]).toEqual(0);
	  expect(splode.pieces[6][5]).toEqual(0);
	  expect(splode.pieces[7][5]).toEqual(4);
	  expect(splode.pieces[7][2]).toEqual(5);
	  expect(splode.pieces[6][2]).toEqual(4);
	  expect(splode.pieces[5][2]).toEqual(5);
	  expect(splode.pieces[4][2]).toEqual(4);
	  expect(splode.pieces[3][2]).toEqual(5);
	  expect(splode.pieces[2][2]).toEqual(6);
	  expect(splode.pieces[1][2]).toEqual(6);
	  expect(splode.pieces[0][2]).toEqual(0);
	  expect(splode.pieces[7][1]).toEqual(7);      
    });
    it("should properly chain a double splosion", function(){
      splode.drawBoard = jasmine.createSpy("drawBoard");
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [5, 2, 3, 0, 0, 0, 0, 0],
      ];
      splode.checkSplosions();
      expect(splode.pieces[7][0]).toEqual(5);
      expect(splode.pieces[7][1]).toEqual(0);
      expect(splode.pieces[7][2]).toEqual(0);
    });
    it("should properly chain a triple splosion", function(){
      splode.drawBoard = jasmine.createSpy("drawBoard");
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 0, 4, 0, 0, 0, 0, 0],
                       [0, 2, 3, 6, 6, 0, 0, 0],
      ];
      splode.checkSplosions();
      expect(splode.pieces[7][2]).toEqual(0);
      expect(splode.pieces[6][2]).toEqual(0);
      expect(splode.pieces[5][2]).toEqual(0);
    });
    it("should properly chain a quadruple splosion with a few simultaneous splosions thrown in", function(){
      splode.drawBoard = jasmine.createSpy("drawBoard");
      spyOn(splode, "splode").andCallThrough();
      splode.pieces = [[0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 0, 0, 0, 0],
                       [0, 0, 0, 0, 7, 0, 0, 0],
                       [0, 0, 4, 0, 3, 0, 0, 0],
                       [0, 0, 4, 6, 2, 4, 0, 0],
                       [0, 2, 3, 6, 6, 5, 3, 0],
      ];
      splode.checkSplosions();
      expect(splode.pieces[4][4]).toEqual(0);      
      expect(splode.pieces[5][2]).toEqual(0);
      expect(splode.pieces[5][4]).toEqual(0);
      expect(splode.pieces[6][2]).toEqual(0);
      expect(splode.pieces[6][3]).toEqual(0);
      expect(splode.pieces[6][4]).toEqual(0);
      expect(splode.pieces[6][5]).toEqual(0);
      expect(splode.pieces[7][1]).toEqual(0);
      expect(splode.pieces[7][2]).toEqual(4);
      expect(splode.pieces[7][3]).toEqual(0);
      expect(splode.pieces[7][4]).toEqual(7);
      expect(splode.pieces[7][5]).toEqual(5);
    });
  });

});
