(function(){
  
  function Square(){
    var self = this;
    var undefined;
    
    var letter = '', html;
    var mover;
    
    var movable = true;
    var touch;
    
    var currentdest;
    
    self.setLetter = SetLetter;
    self.getLetter = GetLetter;
    
    self.setMovable = SetMovable;
    self.getMovable = GetMovable;
    
    self.snapTo = SnapTo;
    
    self.getHTML = GetHTML;
    
    function SetLetter(l){
      var old = letter;
      letter = l;
      
      html.innerHTML = letter;
      
      return old;
    }
    function GetLetter(){
      return letter;
    }
    
    function SetMovable(bool){
      var old = movable;
      movable = bool;
      
      if(!movable) classie.add(html, 'locked');
      else classie.remove(html, 'locked');
      
      return movable;
    }
    function GetMovable(){
      return movable;
    }
    
    function SnapTo(dest){
      dest.getHTML().appendChild(html);
      currentdest = dest;
    }
    
    function GetHTML(){
      return html;
    }
    
    function CreateHTML(){
      html = document.createElement('square');
      html.innerHTML = letter;
      
      if(!movable) classie.add(html, 'locked');
      
      Bind();
    }
    function Bind(){
      html.addEventListener('touchstart', PickUp);
    }
    function PickUp(event){
      event.preventDefault();
      if(!GetMovable()) return;
      
      CreateMover(event);
      
      window.addEventListener('touchmove', OnMove);
      window.addEventListener('touchcancel', PutDown);
      window.addEventListener('touchend', PutDown);
    }
    function OnMove(event){
      event.preventDefault();
      
      UpdateMover(event);
    }
    function PutDown(event){
      AutoSnap();
      
      RemoveMover();
      
      window.removeEventListener('touchmove', OnMove);
      window.removeEventListener('touchcancel', PutDown);
      window.removeEventListener('touchend', PutDown);
    }
    
    function CreateMover(event){
      var coords = html.parentElement.getBoundingClientRect();
      
      mover = document.createElement('square:moving');
      mover.innerHTML = html.innerHTML;
      
      mover.style.top = coords.top+scrollY+'px';
      mover.style.left = coords.left+scrollX+'px';
      
      mover.style.width = html.offsetWidth+'px';
      mover.style.height = html.offsetHeight+'px';
      mover.style.lineHeight = html.offsetHeight+'px';
      
      document.body.appendChild(mover);
      classie.add(html, 'moving');
      
      UpdateMover(event);
    }
    function UpdateMover(event){
      if(event.targetTouches.length == 0) return;
      
      var touches = event.targetTouches,
          x = touches[0].clientX,
          y = touches[0].clientY;
      
      if(touch == undefined){
        touch = {lx:x, ly:y};
        return;
      }
      
      var dx = x - touch.lx,
          dy = y - touch.ly;
      touch = {lx:x, ly:y};
      
      mover.style.top = (mover.offsetTop+dy) + 'px';
      mover.style.left = (mover.offsetLeft+dx) + 'px';
    }
    function RemoveMover(){
      document.body.removeChild(mover);
      
      mover = undefined;
      touch = undefined;
    }
    function AutoSnap(){
      classie.remove(html, 'moving');
      
      var mover_center = {
        x: mover.offsetLeft + mover.offsetWidth/2,
        y: mover.offsetTop + mover.offsetHeight/2
      }
      
      var diagonal = Math.sqrt(Math.pow(mover.offsetWidth,2)+Math.pow(mover.offsetHeight,2));
      var dests = SquareDest.getAll();
      
      var min_dist, min;
      
      for(var i=0,dest; dest=dests[i++];){
        var dest_frame = dest.getHTML(),
            dest_center = {
              x: dest_frame.offsetLeft + dest_frame.offsetWidth/2,
              y: dest_frame.offsetTop + dest_frame.offsetHeight/2
            },
            dist = Math.sqrt(
              Math.pow(dest_center.x - mover_center.x,2)+
              Math.pow(dest_center.y - mover_center.y,2)
            );
        if(dist < diagonal && (dist < min_dist || min == undefined) && (dest.canSnap() || dest == currentdest)){
          min_dist = dist;
          min = dest;
        }
      }
      
      if(min != undefined && dest != currentdest){
        currentdest.unsnap();
        min.snap(self);
      }
    }
    
    var Constructor = Overload.function();
    Constructor.overload(function(){this('');});
    Constructor.overload(function(ismovable){this('', ismovable);}, ['boolean']);
    Constructor.overload(function(letter){this(letter, true);}, ['string']);
    Constructor.overload(function(_letter, _movable){
      letter = _letter;
      movable = _movable;
      CreateHTML();
    }, ['string', 'boolean']);
    Constructor.apply(this, arguments);
  }
  
  window.Square = Square;
  
})();