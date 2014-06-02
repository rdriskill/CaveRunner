var GoldGem = me.CollectableEntity.extend({
   init : function(x, y, settings) {
      this.parent(x, y, settings);
      this.type = me.game.COLLECTABLE_OBJECT;
      this.name = 'GoldGem';
   },

   onCollision : function() {
      me.audio.play("cling");

      me.game.HUD.updateItemValue("score", 10);
      // make sure it cannot be collected "again"
      this.collidable = false;
      // remove it
      me.game.remove(this);
   }

});

var PlayerEntity = me.ObjectEntity.extend({
   init : function(x, y, settings) {
      // call the constructor
      this.parent(x, y, settings);

      // set the default horizontal & vertical speed (accel vector)
      this.setVelocity(3, 15);

      this.mutipleJump = 1;

      // set the display to follow our position on both axis
      me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

      // me.game.viewport.setDeadzone( me.game.viewport.width / 10, 1 );

      this.currBoulderAttack = null;
      this.lastWalkLeft = false;
      this.curWalkLeft = false;
      this.name = 'PlayerEntity';

   },

   die : function() {
      // me.state.current().restartLevel();
      // me.state.change( me.state.GAMEOVER );
      me.state.change(me.state.MENU);

   },
   
   update : function() {

      if(me.input.isKeyPressed('left')) {
         // flip the sprite on horizontal axis
         this.flipX(true);
         // update the entity velocity
         this.vel.x -= this.accel.x * me.timer.tick;
         this.curWalkLeft = true;
      }
      else if(me.input.isKeyPressed('right')) {
         // unflip the sprite
         this.flipX(false);
         // update the entity velocity
         this.vel.x += this.accel.x * me.timer.tick;
         this.curWalkLeft = false;

      }
      else {
         this.vel.x = 0;
      }
      if(me.input.isKeyPressed('jump')) {

         this.jumping = true;

         // reset the dblJump flag if off the ground
         this.mutipleJump = (this.vel.y === 0) ? 1 : this.mutipleJump;

         if(this.mutipleJump <= 2) {
            // easy 'math' for double jump
            this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
            me.audio.play("jump", false);
         }

      }

      if(me.input.isKeyPressed("shoot")) {
         me.audio.play("swoosh");
         this.currBoulderAttack = new BoulderAttack(this.pos.x + 5, this.pos.y + 10, this.curWalkLeft);
         me.game.add(this.currBoulderAttack, this.z);
         me.game.sort();
         
      }

      // die if fall off screen
      if(this.pos.y > me.game.viewport.bottom) {
         this.die();
      }

      // check & update player movement
      this.updateMovement();

      // check for collision
      var res = me.game.collide(this);

      if(res) {
         // if we collide with an enemy
         if(res.obj.type == me.game.ENEMY_OBJECT) {
            // check if we jumped on it
            if((res.y > 0) && !this.jumping) {
               // bounce (force jump)
               this.falling = false;
               this.vel.y = -this.maxVel.y * me.timer.tick;
               // set the jumping flag
               this.jumping = true;

            }
            else {
               // let's flicker in case we touched an enemy
               this.flicker(45);
            }
         }
      }

      // update animation if necessary
      if(this.vel.x != 0 || this.vel.y != 0) {
         // update objet animation
         this.parent(this);
         return true;
      }

      // else inform the engine we did not perform
      // any update (e.g. position, animation)
      return false;
   }

});

var SnakeEnemyEntity = me.ObjectEntity.extend({
   init : function(x, y, settings) {
      // define this here instead of tiled
      settings.image = "snake_run_right";
      settings.spritewidth = 29;

      // call the parent constructor
      this.parent(x, y, settings);

      this.startX = x;
      this.endX = x + settings.width - settings.spritewidth;
      // size of sprite

      // make him start from the right
      this.pos.x = x + settings.width - settings.spritewidth;
      this.walkLeft = true;

      // walking & jumping speed
      this.setVelocity(2, 6);

      // make it collidable
      this.collidable = true;
      // make it a enemy object
      this.type = me.game.ENEMY_OBJECT;
      
      this.name = 'SnakeEnemyEntity';

   },

   // call by the engine when colliding with another object
   // obj parameter corresponds to the other object (typically the player)
   // touching this one
   onCollision : function(res, obj) {
      if(obj.name = 'BoulderAttack') {
         me.game.remove(this);
      }
      
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      else if(this.alive && (res.y > 0) && obj.falling) {
         this.flicker(45);
      }
   },

   // manage the enemy movement
   update : function() {
      // do nothing if not visible
      if(!this.visible)
         return false;

      if(this.alive) {
         if(this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
         }
         else if(!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
         }
         // make it walk
         this.flipX(this.walkLeft);
         this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

      }
      else {
         this.vel.x = 0;
      }

      // check and update movement
      this.updateMovement();

      // update animation if necessary
      if(this.vel.x != 0 || this.vel.y != 0) {
         // update object animation
         this.parent();
         return true;
      }
      return false;
   }
});

var LizardEnemyEntity = me.ObjectEntity.extend({
   init : function(x, y, settings) {
      // define this here instead of tiled
      settings.image = "lizard_run_right";
      settings.spritewidth = 32;

      // call the parent constructor
      this.parent(x, y, settings);

      this.startX = x;
      this.endX = x + settings.width - settings.spritewidth;
      // size of sprite

      // make him start from the right
      this.pos.x = x + settings.width - settings.spritewidth;
      this.walkLeft = true;

      // walking & jumping speed
      this.setVelocity(2, 6);

      // make it collidable
      this.collidable = true;
      // make it a enemy object
      this.type = me.game.ENEMY_OBJECT;
      this.name = 'LizardEnemyEntity';
   },

   // call by the engine when colliding with another object
   // obj parameter corresponds to the other object (typically the player)
   // touching this one
   onCollision : function(res, obj) {
      if(obj.name = 'BoulderAttack') {
         me.game.remove(this);
      }
      
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      else if(this.alive && (res.y > 0) && obj.falling) {
         this.flicker(45);
      }
   },

   // manage the enemy movement
   update : function() {
      // do nothing if not visible
      if(!this.visible)
         return false;

      if(this.alive) {
         if(this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
         }
         else if(!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
         }
         // make it walk
         this.flipX(this.walkLeft);
         this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

      }
      else {
         this.vel.x = 0;
      }

      // check and update movement
      this.updateMovement();

      // update animation if necessary
      if(this.vel.x != 0 || this.vel.y != 0) {
         // update object animation
         this.parent();
         return true;
      }
      return false;
   }
});

var TrexEnemyEntity = me.ObjectEntity.extend({
   init : function(x, y, settings) {
      // define this here instead of tiled
      settings.image = "trex_run_right";
      settings.spritewidth = 66;

      // call the parent constructor
      this.parent(x, y, settings);

      this.startX = x;
      this.endX = x + settings.width - settings.spritewidth;
      // size of sprite

      // make him start from the right
      this.pos.x = x + settings.width - settings.spritewidth;
      this.walkLeft = true;

      // walking & jumping speed
      this.setVelocity(2, 6);

      // make it collidable
      this.collidable = true;
      // make it a enemy object
      this.type = me.game.ENEMY_OBJECT;
      this.name = 'TrexEnemyEntity';
   },

   // call by the engine when colliding with another object
   // obj parameter corresponds to the other object (typically the player)
   // touching this one
   onCollision : function(res, obj) {
      if(obj.name = 'BoulderAttack') {
         me.game.remove(this);
      }
      
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      else if(this.alive && (res.y > 0) && obj.falling) {
         this.flicker(45);
      }
   },

   // manage the enemy movement
   update : function() {
      // do nothing if not visible
      if(!this.visible)
         return false;

      if(this.alive) {
         if(this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
         }
         else if(!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
         }
         // make it walk
         this.flipX(this.walkLeft);
         this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

      }
      else {
         this.vel.x = 0;
      }

      // check and update movement
      this.updateMovement();

      // update animation if necessary
      if(this.vel.x != 0 || this.vel.y != 0) {
         // update object animation
         this.parent();
         return true;
      }
      return false;
   }
});

var BoulderAttack = me.ObjectEntity.extend({
   init : function(x, y, flip) {
      var settings = {};
      settings.image = "boulder_attack";
      settings.spritewidth = 16;
      settings.spriteheight = 16;
      this.parent(x, y, settings);
      this.flip = flip;
      this.flipX(flip);
      this.collidable = true;
      this.setVelocity(5, 2);
      this.currentDuration = 0;
      this.maxDuration = 30;
      this.name = 'BoulderAttack';
   },

   update : function() {
      this.currentDuration++;

      if(this.currentDuration >= this.maxDuration || me.game.collide(this)) {
         me.game.remove(this);
      }

      this.flipX(this.flip);

      this.vel.x += this.flip ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
      this.updateMovement();
      return true;
   }
   
});

var EndGameEntity = me.ObjectEntity.extend({
   init : function(x, y, settings) {
      settings.image = 'blank';
      settings.spritewidth = 1;

      // call the parent constructor
      this.parent(x, y, settings);

      // make it collidable
      this.collidable = true;

      this.name = 'EndGameEntity';
   },


   onCollision : function(res, obj) {
      me.state.change(me.state.GAME_END);
   },
});