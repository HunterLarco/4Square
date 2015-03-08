(function(){
  
  function Board(){
    var self = this;
    var undefined;
  
    var width, height;
    var frame;
  
    var cells = [];
  
    self.resize = Resize;
    self.clear = Clear;
  
    self.getWidth = GetWidth;
    self.getHeight = GetHeight;
  
    self.getValue = GetValue;
    self.setValue = SetValue;
  
    function Resize(_width, _height){
      width = _width;
      height = _height;
    
      ClearBoard();
      CreateBoard();
    }
    function Clear(){
      resize(width, height);
    }
  
    function GetWidth(){
      return width;
    }
    function GetHeight(){
      return height;
    }
  
    function GetValue(){
      var values = [];
    
      for(var i=0,row; row=cells[i++];){
        var val_row = [];
        for(var j=0,col; col=row[j++];)
          if(col.hasSquare()) val_row.push(col.getSquare().getLetter());
          else val_row.push(undefined);
        values.push(val_row)
      }
    
      return values;
    }
    function SetValue(arr){
      if(arr.length != height || (arr.length == 0 ? {length:0} : arr[0]).length != width) return false;
    
      for(var y=0; y<cells.length; y++)
        for(var x=0; x<cells[y].length; x++)
          if(cells[y][x].hasSquare()){
            cells[y][x].getSquare().setLetter(arr[y][x]);
          }else{
            var square = new Square(arr[y][x]);
            cells[y][x].snap(square);
          }
    
      return true;
    }
  
    function ClearBoard(){
      for(var i=0,row; row=cells[i++];)
        for(var j=0,dest; dest=row[j++];)
          dest.remove();
    
      cells = [];
    }
    function CreateBoard(){
      var row = [];
    
      for(var i=0; i<width*height; i++){
        if(i%width == 0 && i != 0){
          frame.appendChild(document.createElement('br'));
          cells.push(row);
          row = [];
        }
      
        var dest = new SquareDest(frame);
        row.push(dest);
      }
    
      cells.push(row);
    }
  
    var Constructor = Overload.function();
    Constructor.overload(function(){this(document.body);});
    Constructor.overload(function(frame){this(0,0,frame);}, ['object']);
    Constructor.overload(function(width, height){this(width, height, document.body);}, ['number', 'number']);
    Constructor.overload(function(_width, _height, _frame){
      width = _width;
      height = _height;
      frame = _frame;
    
      CreateBoard();
    
    }, ['number', 'number', 'object']);
    Constructor.apply(this, arguments);
  }
  
  window.Board = Board;
  
})();