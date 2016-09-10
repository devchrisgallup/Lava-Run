Game.Level1 = function(game){}; 

var map; 
var layer;
var player; 
var controls = {}; 
var playerSpeed = 88;
var playerJumpCount = 0;
var jumpTimer = 0; 
var button; 
var rightButton; 
var running = true; 
var shootTime = 0; 
var nuts; 
var burstFlag = false;
var fallInToLava = false; 
var livesText;
var lives = 3;
var gameOverText; 
var playerDiedSound; 
var mainMusic;
var splash;
var jump;
var boost;
this.burst;
this.fireBurst;
this.playerX = 0;  


Game.Level1.prototype = {
    create:function (game) {
        this.stage.backgroundColor = "#00B2FF"; 
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.physics.arcade.gravity.y = 1400; 
        map = this.add.tilemap("map", 64, 64); 
        map.addTilesetImage("tileset"); 
        layer = map.createLayer(0); 
        layer.resizeWorld();
        
        // Create a custom timer
        timer = game.time.create();
        
        // sound effects
        playerDiedSound = this.game.add.audio("playerdiedsound");
        splash = this.game.add.audio("splash");
        jump = this.game.add.audio("jump");
        jump.volume = 0.2;
        boost = this.game.add.audio("boost");
        mainMusic = this.game.add.audio("mainmusic");
        mainMusic.volume = 0.2;
        mainMusic.play();
        
        // Create a delayed event 3 seconds from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 3, this.endTimer, this);

       // variables used in level
        map.setCollisionBetween(0,0); 
        map.setCollisionBetween(3,4);
        map.setTileIndexCallback(1, this.resetPlayer, this); 
        map.setTileIndexCallback(2, this.getCoin, this); 
        map.setTileIndexCallback(7, this.speedBoost, this); 
        player = this.add.sprite(100, 1100, "player"); 
        player.anchor.setTo(0.5, 0.5);  
        player.animations.add("jump",[2], 1, true); 
        player.animations.add("run",[3,4,5,6,7,8], 7, true); 
        this.physics.arcade.enable(player); 
        this.camera.follow(player); 
        player.body.collideWorldBounds = true; 
        // use this.game.height for a responsive design
        livesText = game.add.text(0,this.game.height - 35,"Score: ", {font: '32px Arial', fill:  '#fff'});
        livesText.fixedToCamera = true; 

        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            shoot: this.input.keyboard.addKey(Phaser.Keyboard.UP), 
            };
        // player can shoot a nut when the up arrow key is pressed
        nuts = game.add.group(); 
        nuts.enableBody = true; 
        nuts.physicsBodyType = Phaser.Physics.ARCADE; 
        nuts.createMultiple(5, "nut"); 
        nuts.setAll("anchor.x", 0.5); 
        nuts.setAll("anchor.y", 0.5); 
        nuts.setAll("scale.x", 0.5); 
        nuts.setAll("scale.y", 0.5); 
        nuts.setAll("outOfBoundsKill", true); 
        nuts.setAll("checkWorldBounds", true); 

        this.buildEmitter();
        this.fireBuildEmitter();
    }, 

    update: function () {

        burstFlag = false; 
        fallInToLava = false;

        this.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0; 
        
        livesText.text = "Lives: " + lives;

        if (controls.right.isDown) {
            player.animations.play("run");
            player.scale.setTo(1, 1); 
            player.body.velocity.x += playerSpeed;  
        }

        if (controls.left.isDown) {
            player.animations.play("run");
            player.scale.setTo(-1, 1); 
            player.body.velocity.x -= playerSpeed;  
        }

        if (controls.up.isDown && (player.body.onFloor() || player.body.touching.down && this.now > jumpTimer)) {
            player.body.velocity.y = -600; 
            jumpTimer = this.time.now + 750; 
            player.animations.play("jump"); 
        }

        if (controls.shoot.isDown) {
            this.shootNut(); 
        }

        if (running) {
            player.animations.play("run");
            player.scale.setTo(1, 1); 
            player.body.velocity.x += playerSpeed; 
        }

        if (burstFlag) {
            this.burst.x = player.x; 
            this.burst.y = player.y; 
            this.burst.start(true, 1000, null, 10);
        } 

        if (fallInToLava) {
            this.fireBurst.x = player.x; 
            this.fireBurst.y = player.y; 
            this.fireBurst.start(true, 1000, null, 10);
        } 
    },

    resetPlayer: function() {
        playerDiedSound.play();
        timer.start();
        fallInToLava = true;
        player.kill();
        setTimeout(
                function() {
                    timer.stop();
                    lives--;
                    player.reset(player.x - 800, player.y - 100);
                }, 2000);
 
        if (lives === 0) {
            player.kill();
            gameOverText = this.game.add.text(0, this.game.height - 65, "Game Over", {font: '32px Arial', fill:  '#fff'});
            gameOverText.fixedToCamera = true;
        }
    }, 

    getCoin: function() {
        splash.play();
        map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
        // runs the particles burst.start function that is inside of a 
        // if statement in the update loop
        burstFlag = true; 
        // speed boost
        playerSpeed += 21;
        this.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
            playerSpeed -= 21; 
        });
    }, 
    speedBoost: function() {
        boost.play();
        map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
        playerSpeed += 50;

        this.time.events.add(Phaser.Timer.SECOND * 1, function() {
            playerSpeed -= 50; 
        });    
    },
    shootNut: function() {
        if (this.time.now > shootTime) {
            nut = nuts.getFirstExists(false); 
            if (nut) {
                nut.reset(player.x,player.y); 
                nut.body.velocity.y = -600;
                shootTime = this.time.now + 900;  
            }
        }
    },
    // coin particles effects settings
    buildEmitter: function() {
        this.burst = this.add.emitter(0, 0, 80); 
        this.burst.minParticleScale = 0.3; 
        this.burst.maxParticleScale = 1.2; 
        this.burst.minParticleSpeed.setTo(-30, 30); 
        this.burst.maxParticleSpeed.setTo(30, -30); 
        this.burst.makeParticles("explosion");
    },
    // fire particles effects settings
    fireBuildEmitter: function() {
        this.fireBurst = this.add.emitter(0, 0, 80); 
        this.fireBurst.minParticleScale = 0.3; 
        this.fireBurst.maxParticleScale = 1.2; 
        this.fireBurst.minParticleSpeed.setTo(-100, 100); 
        this.fireBurst.maxParticleSpeed.setTo(100, -100); 
        this.fireBurst.makeParticles("fireParticles");
    },
    render: function () {
        if (timer.running) {
            this.game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 35, this.game.height - 30, "#fff");
        }
    },
    endTimer: function() {
        timer.stop();
    },
    formatTime: function(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }
}
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds(); 
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); 
}
// event lister set to run this function on mouse click and touchstart trigger
function touchStart(evt) {
    evt.preventDefault(); 
        if(player.body.onFloor() || player.body.touching.down && this.now > jumpTimer) {
            jump.play();
            playerJumpCount++;
            player.body.velocity.y = -600; 
            jumpTimer +=  750; 
            player.animations.play("jump"); 
        } else if(playerJumpCount < 2) {
            jump.play();
            playerJumpCount++;
            player.body.velocity.y = -400; 
            jumpTimer +=  750; 
            player.animations.play("jump");            
        } 
        // reset playerJumpCount to 0 after a 1/10 of a second
        if(playerJumpCount > 2) {
        setTimeout(function() {
                    playerJumpCount = 0; 
                }, 100);
                console.log(playerJumpCount);
        } 
}
