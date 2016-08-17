var Game = {};

Game.Boot = function(game) {

}; 

Game.Boot.prototype = {
    init:function () {

        this.input.maxPointers = 1; 

    }, 

    preload:function() {
        this.load.image("preloaderBar", "assets/preloader.png"); 
    },

    create:function() {
        this.state.start("Preloader"); 
    }

}
