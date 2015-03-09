(function(){
  
  // EVENTS: onwin
  function Game(){
    var self = this;
    var undefined;
    
    var board, drop, timer;
    var dict;
    
    var timer_isrunning, timer_start, timer_interval;
    var is_complete = false;
    
    self.create = Create;
    
    self.pause = PauseTimer;
    self.resume = StartTimer;
    self.isPaused = IsPaused;
    
    self.isComplete = IsComplete;
    
    function CheckPuzzle(){
      if(!IsValidPuzzle()) return;
      
      PauseTimer();
      is_complete = true;
      
      self.dispatchEvent({
        type: 'win',
        target: self
      });
    }
    function IsValidPuzzle(){
      var puzzle = board.getValue(),
          rows = puzzle.map(function(value){return value.join('');}),
          cols = [];
      
      for(var x=0; x<board.getWidth(); x++){
        var col = '';
        for(var y=0; y<board.getHeight(); y++)
          col += puzzle[y][x] || '';
        cols.push(col);
      }
      
      var rows_valid = rows.filter(function(value){return dict.contains(value);}).length == board.getHeight(),
          cols_valid = cols.filter(function(value){return dict.contains(value);}).length == board.getWidth();
      
      return rows_valid && cols_valid;
    }
    
    function GeneratePuzzle(width, height){
      var rows = [], cols = [], used = [];
      
      function Valid(str, len){
        if(str.length == len){
          if(used.indexOf(str) != -1) return false;
          else return dict.contains(str);
        }else{
          var node = dict.get(str);
          return !!node && node.hasChildren();
        }
      }
      
      function Intersect(arr1, arr2){
        return arr1.filter(function(value){
          return arr2.indexOf(value) != -1;
        });
      }
      
      function Recurse(index){
        if(index == width*height) return rows[rows.length-1] != cols[cols.length-1];
        
        var row = Math.floor(index / width),
            col = index - row * width;
        
        if(rows[row] == undefined) rows[row] = '';
        if(cols[col] == undefined) cols[col] = '';
        
        var letters = Intersect(dict.get(rows[row]).getChildren(), dict.get(cols[col]).getChildren());
        while(letters.length > 0){
          var letter = letters.splice(Math.floor(Math.random()*letters.length), 1);
          
          rows[row] += letter;
          cols[col] += letter;
          
          if(Valid(rows[row], width) && Valid(cols[col], height)){
            if(rows[row].length == width) used.push(rows[row]);
            if(cols[col].length == height) used.push(cols[col]);
            if(Recurse(index+1)) return true;
            if(rows[row].length == width) used.splice(-1,1);
            if(cols[col].length == height) used.splice(-1,1);
          }
          
          rows[row] = rows[row].slice(0,-1);
          cols[col] = cols[col].slice(0,-1);
          
        }
        
        return false;
      }
      
      Recurse(0);
      
      var puzzle = [];
      for(var i=0,row; row=rows[i++];) puzzle.push(row.split(''));
      return puzzle;
    }
    
    function Create(width, height, stationary_selector){
      stationary_selector = stationary_selector || function(){return false;}
      
      is_complete = false;
      
      board.resize(width, height);
      drop.resize(width, Math.floor(height/2));
      
      var puzzle = GeneratePuzzle(width, height);
      
      var indices = [], sudo_random = [];
      
      for(var y=0; y<board.getHeight(); y++)
        for(var x=0; x<board.getWidth(); x++)
          if(stationary_selector(x, y, board.getWidth(), board.getHeight()))
          {
            if(!sudo_random[y]) sudo_random[y] = [];
            sudo_random[y][x] = puzzle[y][x];
          }else{
            indices.push({x:x, y:y});
          }
      
      var letters = indices.concat([]);
      while(indices.length > 0){
        var index = indices.splice(Math.floor(Math.random()*indices.length), 1)[0],
            letter_index = letters.shift(),
            letter = puzzle[letter_index.y][letter_index.x];
        if(!sudo_random[index.y]) sudo_random[index.y] = [];
        sudo_random[index.y][index.x] = letter;
      }
      
      board.setValue(sudo_random);
      
      var cells = board.getCells();
      for(var y=0; y<board.getHeight(); y++)
        for(var x=0; x<board.getWidth(); x++)
          if(stationary_selector(x, y, board.getWidth(), board.getHeight()))
            cells[y][x].getSquare().setMovable(false);
      
      ResetTimer();
      StartTimer();
    }
    
    function StartTimer(){
      if(timer_isrunning) return;
      timer_isrunning = true;
      
      if(timer_start == undefined) timer_start = 0;
      timer_start += Date.now();
      
      timer_interval = setInterval(UpdateTimer, 1000);
    }
    function PauseTimer(){
      if(!timer_isrunning) return;
      timer_isrunning = false;
      timer_start -= Date.now();
      
      clearInterval(timer_interval);
    }
    function ResetTimer(){
      timer_start = 0;
    }
    function UpdateTimer(){
      var difftime = Date.now() - timer_start,
          hours   = Math.floor((difftime % (60*60*60*1000))/(60*60*1000)),
          minutes = Math.floor((difftime % (   60*60*1000))/(   60*1000)),
          seconds = Math.floor((difftime % (      60*1000))/(      1000));
  
      if(seconds < 10) seconds = '0'+seconds;
      if(hours > 0) if(minutes < 10) minutes = '0'+minutes;
  
      if(hours > 0) timer.innerHTML = hours+':'+minutes+':'+seconds;
      else timer.innerHTML = minutes+':'+seconds;
    }
    function IsPaused(){
      return !timer_isrunning;
    }
    
    function IsComplete(){
      return is_complete;
    }
    
    (function Constructor(dictionary, board_frame, drop_frame, timer_frame){
      dict = dictionary;
      
      board = new Board(board_frame);
      board.addEventListener('snap', CheckPuzzle);
      
      drop = new Board(drop_frame);
      
      timer = timer_frame;
    }).apply(this, arguments);
  }
  
  EventDispatcher.prototype.apply(Game.prototype);
  
  window.Game = Game;
  
})();