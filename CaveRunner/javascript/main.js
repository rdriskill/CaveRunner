/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
    name: "mytileset",
    type: "image",
    src: "tilesets/mytileset.png"
},{
    name: "mytileset2",
    type: "image",
    src: "tilesets/mytileset2.png"
},{
    name: "mytileset3",
    type: "image",
    src: "tilesets/mytileset3.png"
},{
    name: "area011",
    type: "tmx",
    src: "maps/area011.tmx"
},{
    name: "area012",
    type: "tmx",
    src: "maps/area012.tmx"
}, {
    name: "caveman_run_right",
    type: "image",
    src: "sprites/caveman.png"
}, {
    name: "lizard_run_right",
    type: "image",
    src: "sprites/lizard.png"
}, {
    name: "snake_run_right",
    type: "image",
    src: "sprites/snake.png"
},{
    name: "trex_run_right",
    type: "image",
    src: "sprites/trex.png"
},{
    name: "area01_bkg0",
    type: "image",
    src: "bg/bg0.png"
},{
    name: "area01_bkg1",
    type: "image",
    src: "bg/bg1.png"
},{
    name: "area012_bkg0",
    type: "image",
    src: "bg/bg01.png"
},{
    name: "area012_bkg1",
    type: "image",
    src: "bg/bg11.png"
},{
    name: "title",
    type: "image",
    src:  "images/title1.png"
},{
    name: "intro_bg",
    type: "image",
    src:  "images/intro_bg.png"
},{
    name: "logo",
    type: "image",
    src:  "images/logo.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "sprites/32x32_font.png"
},{
    name: "blank",
    type: "image",
    src: "sprites/blank.png"
},
{
    name: "DST-Away",
    type: "audio",
    src: "sound/",
    channel: 1
},
{
    name: "DST-AngryMod",
    type: "audio",
    src: "sound/",
    channel: 1
},
// audio resources
{
    name: "swoosh",
    type: "audio",
    src: "sound/",
    channel: 2
},
{
   name: "cling",
   type: "audio",
   src: "sound/",
   channel: 2
},
{
    name: "tada",
    type: "audio",
    src: "sound/",
    channel: 1
},
// the gold gem spritesheet
{
    name: "gem_10_points",
    type: "image",
    src: "sprites/gem_10_points.png"
},
{
    name: "boulder_attack",
    type: "image",
    src: "sprites/boulder.png"
}];


var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---	*/
	loaded: function ()
	{
            me.state.set( me.state.INTRO, new IntroScreen() );

            // set the Title Screen Object
            me.state.set(me.state.MENU, new TitleScreen());

	    // set the "Play/Ingame" Screen Object
            me.state.set(me.state.PLAY, new PlayScreen(true, false));

            //GameEndScreen
            me.state.set(me.state.GAME_END, new GameEndScreen());

            // add our player entity in the entity pool
            me.entityPool.add("mainPlayer", PlayerEntity);

	    me.entityPool.add("GoldGem", GoldGem);

            me.entityPool.add("EndGameEntity", EndGameEntity);

            me.entityPool.add("LizardEnemyEntity", LizardEnemyEntity);

            me.entityPool.add("SnakeEnemyEntity", SnakeEnemyEntity);

            me.entityPool.add("TrexEnemyEntity", TrexEnemyEntity);
             
            // enable the keyboard
            me.input.bindKey(me.input.KEY.LEFT,  "left");
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.SPACE,     "jump", true);
            me.input.bindKey( me.input.KEY.CTRL, "shoot", true);
      
      // start the game 
		//me.state.change(me.state.PLAY);

// display the menu title
    me.state.change(me.state.INTRO);
	}

}; // jsApp

/*--------------
a score HUD Item
--------------------- */
 
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    /* -----
 
    draw our score
 
    ------ */
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});



/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
   init: function() {
      this.level2AudioOn = false;      
   },

   onResetEvent: function()
	{	
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("area012");

        me.audio.playTrack("DST-Away");

        // add a default HUD to the game mngr
        me.game.addHUD(0, 430, 640, 60);
 
        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(620, 10));
 
        // make sure everyhting is in the right order
        me.game.sort();
	},

        update: function()
        {
	  // play the audio track
           if(me.levelDirector.getCurrentLevelId() === 'area012' && !this.level2AudioOn) {
              me.audio.playTrack("DST-AngryMod");
              this.level2AudioOn = true;
           }
        },
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
	   // stop the current audio track
         me.audio.stopTrack();

        // remove the HUD
        me.game.disableHUD();
      }

});

/*----------------------
 
    A title screen
 
  ----------------------*/
 
var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
 
        this.font = null;
        
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
 
            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");
 
        }
 
        // reset to default value
        this.scrollerpos = 640;
 
        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
    },
 
    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
        
        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        //this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
 
        //just in case
        this.scrollertween.stop();
    }
 
});

/*----------------------
 
    A game end screen
 
  ----------------------*/
 
var GameEndScreen = me.ScreenObject.extend({

    init: function() {
        this.parent(true);
        this.font = null;
        this.title = null;
    },
 

    onResetEvent: function() {
        me.audio.play("tada");
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("left");
        this.timeoutID = setTimeout(function(){me.state.change(me.state.MENU)},5000);
 
    },
 
    // update function
    update: function() {
       
       if (me.input.isKeyPressed('enter')) {
          clearTimeout(this.timeoutID);
          me.state.change(me.state.MENU);
       }

       return false;
    },
 
    // draw function
    draw: function(context) {
        this.font.draw(context, "YOU WIN!!!", 170, 240);
    },
 
    // destroy function
    onDestroyEvent: function() {
        this.font = null;
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});

var IntroScreen = me.ScreenObject.extend({
    init: function() {
        this.parent( true );
        this.counter = 0;
    },

    onResetEvent: function() {
        if( ! this.title ) {
            this.bg= me.loader.getImage("intro_bg");
            this.logo = me.loader.getImage("logo");

            /*this.glasses1 = me.loader.getImage("intro_glasses1"); // 249 229
            this.glasses2 = me.loader.getImage("intro_glasses2"); // 249 229
            this.glasses3 = me.loader.getImage("intro_glasses3"); // 249 229
            this.glasses4 = me.loader.getImage("intro_glasses4"); // 249 229
            this.text_mars = me.loader.getImage("intro_mars"); // 266 317
            this.text_radmars1 = me.loader.getImage("intro_radmars1"); // 224 317
            this.text_radmars2 = me.loader.getImage("intro_radmars2");*/
        }

        /*me.input.bindKey( me.input.KEY.ENTER, "enter", true );
        me.audio.playTrack( "radmarslogo" );*/
    },

    update: function() {
        
        if ( this.counter < 350 )
        {
            this.counter++;
        }

        else{
           me.state.change(me.state.MENU);
        }
        // have to force redraw :(
        me.game.repaint();
    },

    draw: function(context) {
        context.drawImage( this.bg, 0, 0 );
        
        if( this.counter < 130) context.drawImage( this.logo, 266, 317 );

        /*if( this.counter < 130) context.drawImage( this.text_mars, 266, 317 );
        else if( this.counter < 135) context.drawImage( this.text_radmars2, 224, 317 );
        else if( this.counter < 140) context.drawImage( this.text_radmars1, 224, 317 );
        else if( this.counter < 145) context.drawImage( this.text_radmars2, 224, 317 );
        else if( this.counter < 150) context.drawImage( this.text_radmars1, 224, 317 );
        else if( this.counter < 155) context.drawImage( this.text_radmars2, 224, 317 );
        else if( this.counter < 160) context.drawImage( this.text_radmars1, 224, 317 );
        else if( this.counter < 165) context.drawImage( this.text_radmars2, 224, 317 );
        else context.drawImage( this.text_radmars1, 224, 317 );

        if( this.counter < 100) context.drawImage( this.glasses1, 249, 229*(this.counter/100) );
        else if( this.counter < 105) context.drawImage( this.glasses2, 249, 229 );
        else if( this.counter < 110) context.drawImage( this.glasses3, 249, 229 );
        else if( this.counter < 115) context.drawImage( this.glasses4, 249, 229 );
        else context.drawImage( this.glasses1, 249, 229 );*/
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
    }
});

//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
