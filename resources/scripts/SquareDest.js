(function(){
  
  var total_dests = [];
  SquareDest.getAll = function GetAll(){
    return total_dests;
  }
  
  function SquareDest(){
    var self = this;
    var undefined;
    
    var frame, html;
    var square;
    
    self.snap = Snap;
    self.canSnap = CanSnap;
    self.unsnap = UnSnap;
    
    self.hasSquare = HasSquare;
    self.getSquare = GetSquare;
    
    self.getHTML = GetHTML;
    self.remove = Remove;
    
    function Snap(_square){
      if(_square == undefined) return false;
      if(HasSquare()) return false;
      
      square = _square;
      square.snapTo(self);
      
      return true;
    }
    function CanSnap(){
      return !HasSquare();
    }
    function UnSnap(){
      html.removeChild(square.getHTML());
      square = undefined;
    }
    
    function HasSquare(){
      return square != undefined;
    }
    function GetSquare(){
      return square;
    }
    
    function GetHTML(){
      return html;
    }
    function Remove(){
      frame.removeChild(html);
    }
    
    function CreateHTML(){
      html = document.createElement('square:dest');
      frame.appendChild(html);
    }
    
    (function Constructor(_frame){
      frame = _frame;
      CreateHTML();
      
      total_dests.push(self);
    }).apply(this, arguments);
  }
  
  window.SquareDest = SquareDest;
  
})();