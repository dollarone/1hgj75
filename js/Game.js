var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        var sky = this.game.add.sprite(0, 0, 'sky');
        sky.scale.setTo(2,1);


        this.player = this.game.add.sprite(40, 200, 'mikael');
        this.player.frame = 1; 

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);
        this.game.camera.setSize(this.game.world.width, this.game.world.height);
        this.game.world.setBounds(0, 0, 1000, 400);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 600;
        this.player.anchor.setTo(0.5);
        this.player.body.collideWorldBounds = false;

        this.game.camera.follow(this.player);

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0,1], 10, true);
        this.player.animations.add('right', [0,1], 10, true);
        this.crateAnim = this.player.animations.add('crate', [2,3,2], 10, false);

        this.tiles = this.game.add.group();
        this.tiles.enableBody = true;

        this.dollars = this.game.add.group();
        this.dollars.enableBody = true;


        //  Finally some stars to collect
        
        this.lavaGen = this.game.add.group();

        this.lava = this.game.add.group();
        this.lava.enableBody = true;

        this.water = this.game.add.group();
        this.water.enableBody = true;


        this.music = this.game.add.audio('music');
        this.music.loop = true;
//        this.music.play();
        this.timeout = 0;

        //  The score
        this.scoreText = this.game.add.text(16, 200-32, '', { fontSize: '22px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        this.score = 0;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;
        this.direction = 1;
//        this.showDebug = true; 
        this.createLevel1();
    },


    createLevel1: function() {
        for(var i = 0; i < 1000; i+=32) {
            this.createWaterTile(i, 368);
            this.createWaterTile(i, 368+32);
            this.createWaterTile(i, 368+64);
            if (i >400)
                    this.createGrassTile(i, 300);

        }
        this.createGrassTile(32, 300);
        this.createGrassTile(64, 300);

        this.createGrassTile(364, 350);
        this.createGrassTile(364+32, 350);

        this.createWallTile(864, 300-32);
        this.createWallTile(864+32, 300-32);
        this.createWallTile(864, 300-32-32);
        this.createWallTile(864+32, 300-32-32);

        this.createWallTile(864, 300-32-32-32);
        this.createWallTile(864+32, 300-32-32-32);

        this.createWallTile(864, 300-32-32-32-32);
        this.createWallTile(864+32, 300-32-32-32-32);

        this.createWallTile(864, 300-32-32-32-32-32);
        this.createWallTile(864+32, 300-32-32-32-32-32);

        this.createWallTile(864, 300-32-32-32-32-32-32);
        this.createWallTile(864+32, 300-32-32-32-32-32-32);
        this.createDollar(864+32, 300-32-32-32-32-32-32-32);

    },

    createWaterTile: function(x,y) {
        var star = this.water.create(x,y, 'tiles');
        star.body.gravity.y = 0
        star.body.bounce.y = 0;
        star.frame = 0;
        star.anchor.setTo(0);
        //setSize(width, height, offsetX, offsetY)
        //this.star.body.setSize(9, 9, 3, 5);
        //this.star.dangerous = true;
        star.friction = 2;
        star.animations.add('wobble', [0,1], 3, true);
        star.animations.play('wobble');

    },

   createDollar: function(x,y) {
        var star = this.dollars.create(x,y, 'dollar');
        star.body.gravity.y = 0
        star.body.bounce.y = 0;
        star.frame = 0;
        star.anchor.setTo(0);
        //setSize(width, height, offsetX, offsetY)
        //this.star.body.setSize(9, 9, 3, 5);
        //this.star.dangerous = true;
        star.friction = 2;

    },

    createLava: function(x,y) {
        var star = this.lava.create(x, y, 'tiles');
        star.body.gravity.y = 200;
        star.body.bounce.y = 1;
        star.frame = 2;
        star.anchor.setTo(0);
        
        star.body.setSize(12, 12, 3, 5);
        star.dangerous = true;

    },

    createGrassTile: function(x,y ) {
        var star = this.tiles.create(x,y, 'tiles');
        star.frame = 3;
        star.anchor.setTo(0);
        star.body.immovable = true;
        star.body.drag.x = 1;
    },

    createGrassDeathTile: function(x,y ) {
        var star = this.tiles.create(x,y, 'tiles');
        star.frame = 5;
        star.anchor.setTo(0);
    },

    createWallTile: function(x,y ) {
        var star = this.tiles.create(x,y, 'tiles');
        star.frame = 7;
        star.anchor.setTo(0);
        star.body.immovable = true;
    },

    createCrate: function(x,y ) {
        var star = this.tiles.create(x + 16*this.direction,y-2, 'tiles');
        star.frame = 4;
        star.body.gravity.y = 100;
        star.anchor.setTo(0);
        star.body.velocity.x = 50 * this.direction;
        star.body.friction = 0.3;
        this.player.animations.play('crate');
    },

    createLavaGen: function(x,y ) {
        var star = this.tiles.create(x,y, 'tiles');
        star.frame = 6;
        star.anchor.setTo(0);
        this.lavaGen.add(star);
    },

    melt: function(waterTile, lavaTile) {
        lavaTile.destroy();
    },

    float: function(waterTile, crateTile) {
        crateTile.body.gravity.y = 0;
        if (crateTile.y > waterTile.y-15) {
            crateTile.body.velocity.y = 0;//-1;
        }

    },

    update: function() {
        this.timer++;
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.tiles);
        this.game.physics.arcade.collide(this.tiles, this.tiles);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.dollars, this.win, null, this);
        this.game.physics.arcade.overlap(this.player, this.lava, this.death, null, this);
        this.game.physics.arcade.overlap(this.water, this.lava, this.melt, null, this);
        this.game.physics.arcade.overlap(this.water, this.tiles, this.float, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.scale.setTo(-1, 1);
            this.player.body.velocity.x = -150;
            this.direction = -1;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.scale.setTo(1, 1);
            this.player.body.velocity.x = 150;
            this.direction = 1;

            this.player.animations.play('right');
        }
        else 
        {
            //  Stand still
      //      this.player.animations.stop();


            if (this.player.animations.currentAnim != null && this.player.animations.frame != 2 && this.player.animations.frame != 3)
            this.player.frame = 1;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -300;
        }
        if (this.timeout > 0) {
            this.timeout--;
        }
        if (this.timeout == 0 && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.createCrate(this.player.x, this.player.y);
            this.timeout = 100;
        }


        if (this.player.y > this.game.world.height) {
            this.death();
        }

    },

    win: function() {
        this.scoreText.text = "Congrats. You found the Dollar! You win!";
    },

    death: function() {
        this.player.x = 40;
        this.player.y =  200;
    },

    collectStar : function(player, star) {
        
        // Removes the star from the screen
        star.kill();
        if (star.dangerous) {
            player.kill();
        }

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },


    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },


    render: function() {

        if (this.showDebug) {
            
            this.game.debug.body(this.player);
        }
    },

};