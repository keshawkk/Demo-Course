var Sphere=pc.createScript("sphere");Sphere.attributes.add("entity1",{type:"entity"}),Sphere.attributes.add("entity2",{type:"entity"}),Sphere.attributes.add("goal",{type:"entity"}),Sphere.attributes.add("gameover",{type:"entity"}),Sphere.attributes.add("score",{type:"entity"}),Sphere.prototype.initialize=function(){this.colorOfSphere="blue",this.s=0,this.en1=!0,this.en2=!0},
Sphere.prototype.update=function(t){
  var e=this.app.keyboard,i=e.isPressed(pc.KEY_LEFT),s=e.isPressed(pc.KEY_RIGHT),h=e.isPressed(pc.KEY_UP),a=e.isPressed(pc.KEY_DOWN);i&&this.entity.translate(-t,0,0),s&&this.entity.translate(t,0,0),h&&this.entity.translate(0,0,-t),a&&this.entity.translate(0,0,t);var r=this.entity.getPosition(),n=this.entity2.getPosition(),o=this.entity1.getPosition(),y=this.goal.getPosition(),p=Math.abs(r.x-o.x),d=Math.abs(r.z-o.z),b=Math.hypot(p,d),c=Math.abs(r.x-n.x),l=Math.abs(r.z-n.z),g=Math.hypot(c,l),S=Math.abs(r.x-y.x),u=Math.abs(r.z-y.z),M=Math.hypot(S,u);b<.5&&this.en1&&(this.en1=!1,this.s+=1,this.entity1.destroy()),g<.5&&this.en2&&(this.en2=!1,this.s+=1,this.entity2.destroy());
  if(M<.5){this.gameOver();
    xapistatement(
      'interacted',
      'interaction',
      'game done by the USER',
      '',
      false
    );}},

Sphere.prototype.gameOver=function(){this.entity1.destroy(),this.entity2.destroy(),this.goal.destroy(),this.score.element.text=this.s.toString(),this.gameover.enabled=!0,console.log("Over:")};var Entity2=pc.createScript("entity2");Entity2.attributes.add("sphere",{type:"entity"}),Entity2.prototype.initialize=function(){},Entity2.prototype.update=function(t){};var Entity1=pc.createScript("entity1");Entity1.prototype.initialize=function(){},Entity1.prototype.update=function(t){console.log("entityt1")};

var Game=pc.createScript("game");
Game.attributes.add("sphere",{type:"entity"}),
Game.attributes.add("entity1",{type:"entity"}),
Game.attributes.add("entity2",{type:"entity"}),
Game.attributes.add("goal",{type:"entity"}),
Game.attributes.add("gameover",{type:"entity"}),
Game.prototype.initialize=function(){},
Game.prototype.update=function(t){
    if(this.gameover.enabled){
      this.sphere.destroy();
      }
    };

