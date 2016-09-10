Game.Preloader = function(game) {
    this.preloaderBar = null; 
}; 

Game.Preloader.prototype = {
    preload:function() {



        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, "preloaderBar"); 

        this.preloadBar.anchor.setTo(0.5,0.5); 

        this.time.advancedTiming = true; 

        this.load.setPreloadSprite(this.preloadBar); 


        // load all assets
        this.load.tilemap("map", "assets/level1.csv"); 

        this.load.image("tileset", "assets/tileset.png"); 

        this.load.spritesheet("player", "assets/player.png", 24, 26);
        this.load.spritesheet("lavaboy", "assets/lavaboy.png", 24, 26);

        // load button spritesheet
        this.load.spritesheet("buttons", "assets/button.png", 193,71);  

        this.load.image("bird", "assets/enemy.png");

        this.load.image("nut", "assets/bullet.png");

        // particle effects
        this.load.image("explosion", "assets/explosion.png");
        this.load.image("fireParticles", "assets/fireParticles.png");
        
        // sound effects
        this.load.audio("mainmusic", "assets/mainmusic.mp3");
        this.load.audio("playerdiedsound", "assets/playerdiedsound.wav");
        this.load.audio("splash", "assets/splash.wav");
        this.load.audio("jump", "assets/jump.wav");
        this.load.audio("boost", "assets/boost.wav");
        
    }, 

    create:function() {
        this.state.start("Level1"); 
    }
}
