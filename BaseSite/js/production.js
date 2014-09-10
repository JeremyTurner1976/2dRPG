//screen positions should be nScreenHeight * .25
//hook up character buttons with strCharacterType as the strAction, remove the button from the initial dialog
//set the character select inside of a border, use the same logic as strMainCharacterType in RPGGame x and y
//should i set regx inside of button/percent bar, etc - yes the RPGGame should only deal with x and y

//thicker border around buttons and rounder - redo buttons entirely - should know nothing of the game
//generic RPGButton - doesnt know about the game or the stage, none of that - just objects - has enable/disable for display

//change to getSprite in display service - the CharacterFactory will handle character image specific changes
//RPGCharacter the only real object next - knows weapons, stats, and can draw alot of its own stuff, knows attacks? - prototype on stats


//needs new swords
var RPG = new function () {

    //HTML and EaselJS Stage objects
    var stage, queue, rpgCanvas, loadingBar;
    var nFPS, bIsChromeOrFireFox, dAnimationSpeedOffset;
    var nScreenWidth, nScreenHeight, nScreenCenterX, nScreenCenterY, nBackgroundWidth, nBackgroundHeight;

    //*****************************RPGENUMS*******************************

    var RPGEnums = new function () {

        this.Animations = {
            RUNUP: "runUp",
            RUNDOWN: "runDown",
            RUNLEFT: "runLeft",
            RUNRIGHT: "runRight",
            SPIN: "spin",
            STAND: "stand",

            ANIMATETOP: "animateTop",
            ANIMATETOPMIDDLE: "animateTopMiddle",
            ANIMATEBOTTOMMIDDLE: "animateBottomMiddle",
            ANIMATEBOTTOM: "animateBottom",

            ANIMATE: "animate",
            STOP: "stop"
        }

        this.Bitmaps = {
            BADLANDFIGHT: "badlandFightScreen",
            BEACHFIGHT: "beachFightScreen",
            FORESTFIGHT: "forestFightScreen",
            GRASSLANDFIGHTONE: "grasslandFightScreenOne",
            GRASSLANDFIGHTTWO: "grasslandFightScreenTwo",
            MOUNTAINFIGHT: "mountainFightScreen",

            CASTLEFIGHT: "castleFightScreen",
            TOWNFIGHT: "townFightScreen",
            HEALERHOUSECUTSCENE: "healerHouseCutscene",

            TREASURECHEST: "treasureChest",

            LIGHTNINGBOLT: "lightningBolt",
            CLOUD: "cloud",

            BOW: "bow",
            ARROW: "arrow",
            SPEAR: "spear",
            WARRIORSWORD: "warriorSword",
            THIEFSWORD: "thiefSword",

            CHARSET1: "charSetOne",
            CHARSET2: "charSetTwo",
            CHARSET3: "charSetThree",
            CHARSET4: "charSetFour",
            CHARSET5: "charSetFive"
        }

        this.CharacterTypes = {
            MALEWARRIOR: "maleWarrior",
            MALEMAGE: "maleMage",
            MALETHIEF: "maleThief",
            FEMALEWARRIOR: "femaleWarrior",
            FEMALEMAGE: "femaleMage",
            FEMALETHIEF: "femaleThief"
        }

        this.Dialogs = {
            CHARACTERSELECTDIALOG : "characterSelectDialog",
            TUTORIALDIALOG: "tutorialDialog",
            HEALERHOUSEDIALOG: "healerHouseDialog"
        }

        this.FightScenes = {
            BADLANDFIGHT: "badlandFightScreen",
            BEACHFIGHT: "beachFightScreen",
            FORESTFIGHT: "forestFightScreen",
            GRASSLANDFIGHTONE: "grasslandFightScreenOne",
            GRASSLANDFIGHTTWO: "grasslandFightScreenTwo",
            MOUNTAINFIGHT: "mountainFightScreen",

            CASTLEFIGHT: "castleFightScreen",
            TOWNFIGHT: "townFightScreen"
        }

        this.Fonts = {
            SMALLFONT : "20px Haettenschweiler",
            FONT : "28px Haettenschweiler",
            LARGEFONT : "34px Haettenschweiler",
            HUGEFONT : "48px Haettenschweiler"
            }

        this.MapColors = {
            BADLANDRGB: { 0: 139, 1: 69, 2: 19 },
            BEACHRGB: { 0: 253, 1: 245, 2: 230 },
            FORESTRGB: { 0: 0, 1: 100, 2: 0 },
            GRASSLANDRGB: { 0: 50, 1: 205, 2: 50 },
            MOUNTAINRGB: { 0: 105, 1: 105, 2: 105 },
            FINALTERRAINTREASURERGB: { 0: 0, 1: 0, 2: 255 }
        }

        this.MonsterTypes = {

            0: "charSetOne11",
            1: "charSetOne12",
            2: "charSetOne13",
            3: "charSetOne14",
            4: "charSetOne21",
            5: "charSetOne22",
            6: "charSetOne23",
            7: "charSetOne24",

            8: "charSetTwo11",
            9: "charSetTwo12",
            10: "charSetTwo13",
            11: "charSetTwo14",
            12: "charSetTwo21",
            13: "charSetTwo22",
            14: "charSetTwo23",
            15: "charSetTwo24",

            16: "charSetThree11",
            17: "charSetThree12",
            18: "charSetThree13",
            19: "charSetThree14",
            20: "charSetThree21",
            21: "charSetThree22",
            22: "charSetThree23",
            23: "charSetThree24",

            24: "charSetFour11",
            25: "charSetFour12",
            26: "charSetFour13",
            27: "charSetFour14",
            28: "charSetFour21",
            29: "charSetFour22",
            30: "charSetFour23",
            31: "charSetFour24",

            32: "charSetFive11",
            33: "charSetFive12",
            34: "charSetFive13",
            35: "charSetFive14",
            36: "charSetFive21",
            37: "charSetFive22",
            38: "charSetFive23",

            //related to the main characters (treasure bosses)
            39: "maleWarrior",
            40: "maleMage",
            41: "maleThief",
            42: "femaleWarrior",
            43: "femaleMage",
            44: "femaleThief",

            //Town Boss and Castle Boss
            45: "townBoss",
            46: "castleBoss",

            properties: {

                0: { image: this.Bitmaps.CHARSET1, type: "T", elite: false },
                1: { image: this.Bitmaps.CHARSET1, type: "T", elite: false },
                2: { image: this.Bitmaps.CHARSET1, type: "W", elite: false },
                3: { image: this.Bitmaps.CHARSET1, type: "T", elite: false },
                4: { image: this.Bitmaps.CHARSET1, type: "T", elite: false },
                5: { image: this.Bitmaps.CHARSET1, type: "W", elite: false },
                6: { image: this.Bitmaps.CHARSET1, type: "M", elite: false },
                7: { image: this.Bitmaps.CHARSET1, type: "M", elite: false },

                8: { image: this.Bitmaps.CHARSET2, type: "W", elite: false },
                9: { image: this.Bitmaps.CHARSET2, type: "M", elite: false },
                10: { image: this.Bitmaps.CHARSET2, type: "M", elite: false },
                11: { image: this.Bitmaps.CHARSET2, type: "W", elite: false },
                12: { image: this.Bitmaps.CHARSET2, type: "T", elite: false },
                13: { image: this.Bitmaps.CHARSET2, type: "T", elite: false },
                14: { image: this.Bitmaps.CHARSET2, type: "M", elite: false },
                15: { image: this.Bitmaps.CHARSET2, type: "W", elite: false },

                16: { image: this.Bitmaps.CHARSET3, type: "M", elite: false },
                17: { image: this.Bitmaps.CHARSET3, type: "W", elite: false },
                18: { image: this.Bitmaps.CHARSET3, type: "T", elite: false },
                19: { image: this.Bitmaps.CHARSET3, type: "T", elite: false },
                20: { image: this.Bitmaps.CHARSET3, type: "W", elite: false },
                21: { image: this.Bitmaps.CHARSET3, type: "M", elite: false },
                22: { image: this.Bitmaps.CHARSET3, type: "M", elite: false },
                23: { image: this.Bitmaps.CHARSET3, type: "T", elite: false },

                24: { image: this.Bitmaps.CHARSET4, type: "M", elite: false },
                25: { image: this.Bitmaps.CHARSET4, type: "W", elite: false },
                26: { image: this.Bitmaps.CHARSET4, type: "W", elite: false },
                27: { image: this.Bitmaps.CHARSET4, type: "M", elite: false },
                28: { image: this.Bitmaps.CHARSET4, type: "W", elite: false },
                29: { image: this.Bitmaps.CHARSET4, type: "T", elite: false },
                30: { image: this.Bitmaps.CHARSET4, type: "M", elite: false },
                31: { image: this.Bitmaps.CHARSET4, type: "M", elite: false },

                32: { image: this.Bitmaps.CHARSET5, type: "W", elite: false },
                33: { image: this.Bitmaps.CHARSET5, type: "W", elite: false },
                34: { image: this.Bitmaps.CHARSET5, type: "M", elite: false },
                35: { image: this.Bitmaps.CHARSET5, type: "M", elite: false },
                36: { image: this.Bitmaps.CHARSET5, type: "W", elite: false },
                37: { image: this.Bitmaps.CHARSET5, type: "T", elite: false },
                38: { image: this.Bitmaps.CHARSET5, type: "T", elite: false },

                //related to the main characters (treasure bosses)
                39: { image: this.CharacterTypes.MALEWARRIOR, type: "W", elite: false },
                40: { image: this.CharacterTypes.MALEMAGE, type: "M", elite: false },
                41: { image: this.CharacterTypes.MALETHIEF, type: "T", elite: false },
                42: { image: this.CharacterTypes.FEMALEWARRIOR, type: "W", elite: false },
                43: { image: this.CharacterTypes.FEMALETHIEF, type: "M", elite: false },
                44: { image: this.CharacterTypes.FEMALEWARRIOR, type: "T", elite: false },

                //Town Boss and Castle Boss
                45: { image: this.Bitmaps.TOWNBOSS, type: "W", elite: true },
                46: { image: this.Bitmaps.CASTLEBOSS, type: "M", elite: true }
            }
        }

        this.MovementMaps = {
            BADLAND: "badlandTerrain",
            BEACH: "beachTerrain",
            FOREST: "forestTerrain",
            GRASSLAND: "grasslandTerrain",
            MOUNTAIN: "mountainTerrain",
            TERRAIN: "terrain"
        };


        this.PrimaryColors = {
            SILVER: "silver",
            DIMGRAY: "dimGray",
            DARKSLATEGRAY: "darkSlateGray",
            BLACK: "black"
        }


        this.RPGSounds = {
            CASTLEFIGHT: "castleFightSound",
            GENERICFIGHT: "genericFightSound",
            TERRAINONE: "terrainSoundOne",
            TERRAINTWO: "terrainSoundTwo",
            TOWNFIGHT: "townFightSound"
        }


        this.SpriteTypes = {
            MAGEDEATHBALL: "mageDeathBall",
            MAGEICEBALL: "mageIceBall",
            MAGEFIREATTACK: "mageFireAttack",
            MAGEICEATTACK: "mageIceAttack",

            HEROTHROWINGKNIFE: "heroThrowingKnife",
            ENEMYTHROWINGKNIFE: "enemyThrowingKnife"
        }

        this.UIButtonEvents = {
            SELECTCHARACTER: "Select Character",
            STARTGAME: "Start Game",
            LEAVEBATTLEMAP: "Leave Battle Map",
            ATTACKONE: "Attack One",
            ATTACKTWO: "Attack Two",
            ATTACKTHREE: "Attack Three",
            RUN: "Run"
        }

        this.UIButtonTypes = {
            FLASHING: "flashing",
            STANDARD: "standard",
            TIMED: "timed"
        }

        this.isAMainCharacterType = function (strCharacterType) {
            var bCharacterType = false;
            for (var strEnumCharacterType in this.CharacterTypes) {
                if (strCharacterType == this.CharacterTypes[strEnumCharacterType]) {
                    return true;
                }
            }
            return bCharacterType;
        }


        this.isAMovementMap = function (strMovementMap) {
            var bMovementMap = false;
            for (var strEnumMovementMap in this.MovementMaps) {
                if (strMovementMap == this.MovementMaps[strEnumMovementMap]) {
                    return true;
                }
            }
            return bMovementMap;
        }


        this.freezeEnums = function () {
            if (Object.freeze) {
                Object.freeze(this.Animations);
                Object.freeze(this.Bitmaps);
                Object.freeze(this.CharacterTypes);
                Object.freeze(this.Dialogs);
                Object.freeze(this.FightScenes);
                Object.freeze(this.Fonts);
                Object.freeze(this.MapColors);
                Object.freeze(this.MonsterTypes);
                Object.freeze(this.MovementMaps);
                Object.freeze(this.PrimaryColors);
                Object.freeze(this.RPGSounds);
                Object.freeze(this.SpriteTypes);
                Object.freeze(this.UIButtonEvents);
                Object.freeze(this.UIButtonTypes);
            }
        }
    }

    //*****************************INITIALIZATION*******************************

    this.initRPG = function () {
        //set up the main game canvas
        rpgCanvas = document.getElementById('RPGGameCanvas');

        //Easel JS RPG Game
        stage = new createjs.Stage(rpgCanvas);
        RPGEnums.freezeEnums();
        setEnvironmentVariables();

        var manifest = [
          { id: RPGEnums.MovementMaps.BADLAND, src: "img/RPGResources/TerrainMaps/BadlandTerrain.png" },
          { id: RPGEnums.MovementMaps.BEACH, src: "img/RPGResources/TerrainMaps/BeachTerrain.png" },
          { id: RPGEnums.MovementMaps.FOREST, src: "img/RPGResources/TerrainMaps/ForestTerrain.png" },
          { id: RPGEnums.MovementMaps.GRASSLAND, src: "img/RPGResources/TerrainMaps/GrasslandTerrain.png" },
          { id: RPGEnums.MovementMaps.MOUNTAIN, src: "img/RPGResources/TerrainMaps/MountainTerrain.png" },
          { id: RPGEnums.MovementMaps.TERRAIN, src: "img/RPGResources/TerrainMaps/terrain.png" },

          { id: RPGEnums.MovementMaps.BADLAND + "Collisions", src: "img/RPGResources/TerrainMaps/BadlandTerrainCollisions.png" },
          { id: RPGEnums.MovementMaps.BEACH + "Collisions", src: "img/RPGResources/TerrainMaps/BeachTerrainCollisions.png" },
          { id: RPGEnums.MovementMaps.FOREST + "Collisions", src: "img/RPGResources/TerrainMaps/ForestTerrainCollisions.png" },
          { id: RPGEnums.MovementMaps.GRASSLAND + "Collisions", src: "img/RPGResources/TerrainMaps/GrasslandTerrainCollisions.png" },
          { id: RPGEnums.MovementMaps.MOUNTAIN + "Collisions", src: "img/RPGResources/TerrainMaps/MountainTerrainCollisions.png" },
          { id: RPGEnums.MovementMaps.TERRAIN + "Collisions", src: "img/RPGResources/TerrainMaps/terrainCollisions.png" },

          { id: RPGEnums.Bitmaps.BADLANDFIGHT, src: "img/RPGResources/FightScreens/BadlandFightScreen.png" },
          { id: RPGEnums.Bitmaps.BEACHFIGHT, src: "img/RPGResources/FightScreens/BeachFightScreen.png" },
          { id: RPGEnums.Bitmaps.FORESTFIGHT, src: "img/RPGResources/FightScreens/ForestFightScreen.png" },
          { id: RPGEnums.Bitmaps.GRASSLANDFIGHTONE, src: "img/RPGResources/FightScreens/GrasslandOneFightScreen.png" },
          { id: RPGEnums.Bitmaps.GRASSLANDFIGHTTWO, src: "img/RPGResources/FightScreens/GrasslandTwoFightScreen.png" },
          { id: RPGEnums.Bitmaps.MOUNTAINFIGHT, src: "img/RPGResources/FightScreens/MountainFightScreen.png" },

          { id: RPGEnums.Bitmaps.CASTLEFIGHT, src: "img/RPGResources/FightScreens/CastleFightScreen.png" },
          { id: RPGEnums.Bitmaps.TOWNFIGHT, src: "img/RPGResources/FightScreens/TownFightScreen.png" },

          { id: RPGEnums.Bitmaps.HEALERHOUSECUTSCENE, src: "img/RPGResources/CutScenes/HealerHouseCutscene.png" },

          { id: RPGEnums.CharacterTypes.FEMALEMAGE, src: "img/RPGResources/Animations/FemaleMage.png" },
          { id: RPGEnums.CharacterTypes.FEMALETHIEF, src: "img/RPGResources/Animations/FemaleThief.png" },
          { id: RPGEnums.CharacterTypes.FEMALEWARRIOR, src: "img/RPGResources/Animations/FemaleWarrior.png" },
          { id: RPGEnums.CharacterTypes.MALEMAGE, src: "img/RPGResources/Animations/MaleMage.png" },
          { id: RPGEnums.CharacterTypes.MALETHIEF, src: "img/RPGResources/Animations/MaleThief.png" },
          { id: RPGEnums.CharacterTypes.MALEWARRIOR, src: "img/RPGResources/Animations/MaleWarrior.png" },

          { id: RPGEnums.Bitmaps.TREASURECHEST, src: "img/RPGResources/Bitmaps/TreasureChest.png" },

          { id: RPGEnums.Bitmaps.BOW, src: "img/RPGResources/Bitmaps/Bow.png" },
          { id: RPGEnums.Bitmaps.ARROW, src: "img/RPGResources/Bitmaps/Arrow.png" },
          { id: RPGEnums.Bitmaps.SPEAR, src: "img/RPGResources/Bitmaps/Spear.png" },
          { id: RPGEnums.Bitmaps.THIEFSWORD, src: "img/RPGResources/Bitmaps/ThiefSword.png" },
          { id: RPGEnums.Bitmaps.WARRIORSWORD, src: "img/RPGResources/Bitmaps/WarriorSword.png" },

          { id: RPGEnums.SpriteTypes.MAGEDEATHBALL, src: "img/RPGResources/Animations/DeathBall.png" },
          { id: RPGEnums.SpriteTypes.MAGEFIREATTACK, src: "img/RPGResources/Animations/FireAttack.png" },

          { id: RPGEnums.SpriteTypes.MAGEICEBALL, src: "img/RPGResources/Animations/IceBall.png" },
          { id: RPGEnums.SpriteTypes.MAGEICEATTACK, src: "img/RPGResources/Animations/IceAttack.png" },

          { id: RPGEnums.Bitmaps.CLOUD, src: "img/RPGResources/Bitmaps/Cloud.png" },
          { id: RPGEnums.Bitmaps.LIGHTNINGBOLT, src: "img/RPGResources/Bitmaps/LightningBolt.png" },

          { id: RPGEnums.SpriteTypes.HEROTHROWINGKNIFE, src: "img/RPGResources/Animations/HeroThrowingKnife.png" },
          { id: RPGEnums.SpriteTypes.ENEMYTHROWINGKNIFE, src: "img/RPGResources/Animations/EnemyThrowingKnife.png" },

          { id: RPGEnums.Bitmaps.CHARSET1, src: "img/RPGResources/Animations/CharSetOne.png" },
          { id: RPGEnums.Bitmaps.CHARSET2, src: "img/RPGResources/Animations/CharSetTwo.png" },
          { id: RPGEnums.Bitmaps.CHARSET3, src: "img/RPGResources/Animations/CharSetThree.png" },
          { id: RPGEnums.Bitmaps.CHARSET4, src: "img/RPGResources/Animations/CharSetFour.png" },
          { id: RPGEnums.Bitmaps.CHARSET5, src: "img/RPGResources/Animations/CharSetFive.png" },

          { id: RPGEnums.RPGSounds.CASTLEFIGHT, src: "sound/RPGSounds/CastleFightScene.mp3" },
          { id: RPGEnums.RPGSounds.GENERICFIGHT, src: "sound/RPGSounds/GenericFightScene.mp3" },
          { id: RPGEnums.RPGSounds.TERRAINONE, src: "sound/RPGSounds/TerrainSoundOne.mp3" },
          { id: RPGEnums.RPGSounds.TERRAINTWO, src: "sound/RPGSounds/TerrainSoundTwo.mp3" },
          { id: RPGEnums.RPGSounds.TOWNFIGHT, src: "sound/RPGSounds/TownFightScene.mp3" }
        ];

        // Start Preload 
        queue = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["ogg","wav"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("fileload", handleLoadProgress);
        queue.addEventListener("complete", handleLoadCompleted);
        queue.loadManifest(manifest);

        //create a loading bar
        loadingBar = DisplayFactory.getPercentageBar(nScreenWidth / 4, 35, RPGEnums.PrimaryColors.SILVER, RPGEnums.PrimaryColors.DARKSLATEGRAY, 15);
        loadingBar.x = nScreenCenterX;
        loadingBar.y = nScreenCenterY;
        stage.addChild(loadingBar);
    };

    var setEnvironmentVariables = function (){
        //handle browser specific speeds
        //("Chrome")("Safari")("Opera")("Firefox")("MSIE")
        var strBrowser = navigator.userAgent;

        if (strBrowser.indexOf("Firefox") > -1 || strBrowser.indexOf("Chrome") > -1) {
            nFPS = 120;
            bIsChromeOrFireFox = true;
            dAnimationSpeedOffset = .5;
        }
        else {
            nFPS = 60;
            bIsChromeOrFireFox = false;
            dAnimationSpeedOffset = 1;
        }

        rpgCanvas.width = window.innerWidth;
        rpgCanvas.height = window.innerHeight;
        nScreenWidth = rpgCanvas.width;
        nScreenHeight = rpgCanvas.height;
        nScreenCenterX = nScreenWidth / 2;
        nScreenCenterY = nScreenHeight / 2;
    }

    //*****************************EVENTS*******************************

    var handleLoadCompleted = function () {
        stage.removeChild(loadingBar);

        RPGGame.initRPGGame();
    }

    var handleLoadProgress = function (event) {

        loadingBar.setFill(queue.progress);

        stage.update();
    }

    //*****************************SERVICES*******************************

    var CharacterFactory = new function () {
        this.characterSprite;
        this.stats;

        this.getCharacter = function (strCharacterType, strStartAnimation, dAnimationSpeed, dScale) {
            this.characterSprite = DisplayFactory.getCharacterSprite(strCharacterType, strStartAnimation, dAnimationSpeed, dScale);
            //this.stats = RPGCharacter.

            //stubs strSavedMainCharacterType

            //handle image size changes
            if (bCharacterType == true) {

                switch (strCharacterType) {
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                        characterSprite.scaleY = dScale * 1.1;
                        //if facing right this character sits low
                        if (strSavedMainCharacterType == strCharacterType)
                            characterSprite.y += 6;
                        else
                            characterSprite.y += 2;
                        break;

                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        characterSprite.y -= 1;
                        break;

                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        characterSprite.y += 4;
                        break;

                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                        characterSprite.scaleY = dScale * 1.05;
                        characterSprite.y -= 3;
                        break;

                    case RPGEnums.CharacterTypes.MALETHIEF:
                        characterSprite.scaleY = dScale * 1.1;
                        //if facing right this character sits low
                        if (strSavedMainCharacterType == strCharacterType)
                            characterSprite.y += 3;
                        break;

                    default:
                        break;
                }
            }

            return this;
        }

        this.getCharacterSprite = function () {
            return this.characterSprite;
        }

        this.changeAnimation = function (strAnimation) {
            this.characterSprite.gotoAndPlay(strAnimation);
        }
    }

    var DisplayFactory = new function () {

        this.getCharacterSprite = function (strCharacterType, strStartAnimation, dAnimationSpeed, dScale) {
            var character, data, spriteSheet, tempBitmap;
            var bCharacterType = RPGEnums.isAMainCharacterType(strCharacterType);

            //if this is a playable character type
            if (bCharacterType == true) {
                tempBitmap = new createjs.Bitmap(queue.getResult(strCharacterType));

                data = {
                    images: [queue.getResult(strCharacterType)],
                    frames: { width: tempBitmap.image.width / 12, height: tempBitmap.image.height },
                    // animations 0-11, loop always, framerate
                    animations: {
                        runUp: [0, 2, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runRight: [3, 5, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runDown: [6, 8, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runLeft: [9, 11, true, dAnimationSpeed * dAnimationSpeedOffset],
                        spin: [0, 11, true, dAnimationSpeed * 10 * dAnimationSpeedOffset],
                        stand: 7
                    }
                };

                spriteSheet = new createjs.SpriteSheet(data);
                character = new createjs.Sprite(spriteSheet, strStartAnimation);

                //set the registry of this as the center of the item
                character.regX = tempBitmap.image.width / 24;
                character.regY = tempBitmap.image.height / 2;

            }
                //otherwise this is a charset type
            else {
                //get the right two characters to find the location
                tempBitmap = new createjs.Bitmap(queue.getResult(RPGEnums.MonsterTypes.properties[nEnemyMonsterType].image));

                //get the right two characters to find the location
                var strBitmapNumber = strCharacterType.substr(strCharacterType.length - 2);

                var nCharacterRow = parseInt(strBitmapNumber.substr(0, 1), 10) - 1;
                var nCharacterColumn = parseInt(strBitmapNumber.substr(strBitmapNumber.length - 1)) - 1;

                data = {
                    images: [queue.getResult(RPGEnums.MonsterTypes.properties[nEnemyMonsterType].image)],
                    frames: { width: tempBitmap.image.width / 12, height: tempBitmap.image.height / 8 },
                    animations: {
                        runUp: [3 * nCharacterColumn + 48 * nCharacterRow, 2 + 3 * nCharacterColumn + 48 * nCharacterRow, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runRight: [12 + 3 * nCharacterColumn + 48 * nCharacterRow, 14 + 3 * nCharacterColumn + 48 * nCharacterRow, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runDown: [24 + 3 * nCharacterColumn + 48 * nCharacterRow, 26 + 3 * nCharacterColumn + 48 * nCharacterRow, true, dAnimationSpeed * dAnimationSpeedOffset],
                        runLeft: [36 + 3 * nCharacterColumn + 48 * nCharacterRow, 38 + 3 * nCharacterColumn + 48 * nCharacterRow, true, dAnimationSpeed * dAnimationSpeedOffset],
                        spin: [0, 95, true, dAnimationSpeed * 10 * dAnimationSpeedOffset],
                        stand: 25 + 3 * nCharacterColumn + 48 * nCharacterRow
                    }
                };

                spriteSheet = new createjs.SpriteSheet(data);
                character = new createjs.Sprite(spriteSheet, strStartAnimation);

                //set the registry of this as the center of the item
                character.regX = tempBitmap.image.width / 24;
                character.regY = tempBitmap.image.height / 16 + 4;
            }

            //set the scale
            character.scaleX = dScale;
            character.scaleY = dScale;

            return character;
        }

        this.getCharacterSelectView = function () {
            var characterSelectView = new CharacterSelectView();

            characterSelectView.regX = characterSelectView.nWidth / 2;
            characterSelectView.regY = characterSelectView.nHeight / 2;

            return characterSelectView;
        }
        //Character Select View Prototype
        this.CharacterSelectView = (function () {

            this.strSelectedCharacterType;

            var CharacterSelectView = function () {
                this.initialize();
            }

            var nWidth;
            var nHeight;

            var m_CharacterSelectView = CharacterSelectView.prototype = new createjs.Container(); // inherit from Container

            m_CharacterSelectView.Container_initialize = m_CharacterSelectView.initialize;
            m_CharacterSelectView.initialize = function () {
                this.Container_initialize();

                var nStartX = 0, nStartY = 0, nCount = 0;

                for (var strEnumCharacterType in RPGEnums.CharacterTypes) {
                    var characterButton = new CharacterButton(RPGEnums.CharacterTypes[strEnumCharacterType]);

                    //set up columns and rows
                    if (nCount > 0) {
                        if (nCount != 3) {
                            nStartX += characterButton.nWidth + 10;
                        }
                        else {
                            nStartX = 0;
                            nStartY = characterButton.nHeight + 10;

                            //3 columns
                            this.nWidth = characterButton.nWidth * 3 + (10 * 2);
                            //2 rows
                            this.nHeight = characterButton.nHeight * 2 + 10;
                        }
                    }

                    characterButton.x = nStartX;
                    characterButton.y = nStartY;

                    this.addChild(characterButton);

                    nCount++;
                }

                //clicking children of the button (background & label) dispatches the click event with the button as the target instead of the child that was clicked
                this.mouseChildren = true;
            }

            m_CharacterSelectView.getSelectedCharacter = function (){
                return this.strSelectedCharacterType;
            }

            var setSelectedCharacter = function (strCharacterType) {
                this.strSelectedCharacterType = strCharacterType;
            }

            window.CharacterSelectView = CharacterSelectView;

            //Character Button Prototype
            (function () {

                var CharacterButton = function (strCharacterType) {
                    this.initialize(strCharacterType);
                }

                var m_CharacterButton = CharacterButton.prototype = new createjs.Container(); // inherit from Container

                m_CharacterButton.strCharacterType;
                m_CharacterButton.animation;
                m_CharacterButton.nWidth;
                m_CharacterButton.nHeight;

                m_CharacterButton.Container_initialize = m_CharacterButton.initialize;
                m_CharacterButton.initialize = function (strCharacterType) {
                    this.Container_initialize();
                    this.nWidth = 80;
                    this.nHeight = 80;

                    this.strCharacterType = strCharacterType;

                    this.animation = DisplayFactory.getCharacterSprite(strCharacterType, RPGEnums.Animations.RUNDOWN, .05, 3);

                    var background = new createjs.Shape();
                    background.graphics.beginFill(RPGEnums.PrimaryColors.SILVER).drawRoundRect(0, 0, this.nWidth, this.nHeight, 10);

                    this.animation.x = this.nWidth / 2;
                    this.animation.y = this.nHeight / 2;

                    this.addEventListener("click", handleClick);

                    this.addChild(background, this.animation);

                    //clicking children of the button (background & label) dispatches the click event with the button as the target instead of the child that was clicked
                    this.mouseChildren = true;
                }

                function handleClick(event) {
                    var target = event.currentTarget;

                    //TODO Enlarge the selected character

                    //set the character selection
                    setSelectedCharacter(target.strCharacterType);
                }

                window.CharacterButton = CharacterButton;
            }());
        }());

        this.getBitmap = function (strBitmap, dScale) {
            var tempBitmap;
            tempBitmap = new createjs.Bitmap(queue.getResult(strBitmap));

            //set up the main map
            tempBitmap.scaleX = dScale;
            tempBitmap.scaleY = dScale;

            return tempBitmap;
        }

        this.getText = function (strTextDisplay, strFont, strFontColor) {
            var text = new createjs.Text(strTextDisplay, strFont, strFontColor);

            text.textBaseline = "bottom";
            text.textAlign = "center";
        
            return text;
        }

        this.getRPGButton = function (label, buttonColor, textColor, strType) {
            var button = new RPGButton(label, buttonColor, textColor, strType);

            //get the width of the button as the width of the text item
            var width = button.text.getMeasuredWidth() + button.nOffsetX;
            var height = button.text.getMeasuredHeight() + button.nOffsetY;

            //set the registry of this as the center of the item
            button.regX = width / 2;
            button.regY = height / 2;

            return button;
        }
        //RPG Button Prototype
        this.RPGButton = (function () {

            var bAttackTwoAllowed, bAttackThreeAllowed;

            var RPGButton = function (strAction, buttonColor, textColor, strType) {
                this.initialize(strAction, buttonColor, textColor, strType);
                bAttackTwoAllowed = false;
                bAttackThreeAllowed = false;
            }

            var m_RPGButton = RPGButton.prototype = new createjs.Container(); // inherit from Container

            m_RPGButton.strAction;
            m_RPGButton.strType;
            m_RPGButton.background;
            m_RPGButton.text;
            m_RPGButton.count = 0;
            m_RPGButton.nLastAttackTwo = 0;
            m_RPGButton.nLastAttackThree = 0;
            m_RPGButton.nOffsetX = 27;
            m_RPGButton.nOffsetY = 16;

            m_RPGButton.Container_initialize = m_RPGButton.initialize;
            m_RPGButton.initialize = function (strAction, buttonColor, textColor, strType) {
                this.Container_initialize();

                this.strAction = strAction;
                this.strType = strType;

                if (strType == RPGEnums.UIButtonTypes.TIMED) {
                    var strActionTemp;

                    switch (strAction) {
                        case RPGEnums.UIButtonEvents.ATTACKONE:
                            strActionTemp = getSpecialAttackOne();
                            break;
                        case RPGEnums.UIButtonEvents.ATTACKTWO:
                            strActionTemp = getSpecialAttackTwo();
                            break;
                        case RPGEnums.UIButtonEvents.ATTACKTHREE:
                            strActionTemp = getSpecialAttackThree();
                            break;
                        case RPGEnums.UIButtonEvents.RUN:
                            strActionTemp = strAction;
                            break;
                        default:
                            alert("Not all cases caught in RPGButton.initialize()")
                            break;
                    }

                    this.text = new createjs.Text(strActionTemp, RPGEnums.Fonts.FONT, textColor);
                }
                else
                    this.text = new createjs.Text(strAction, RPGEnums.Fonts.FONT, textColor);

                this.text.textBaseline = "middle";
                this.text.textAlign = "center";

                var width = this.text.getMeasuredWidth() + this.nOffsetX;
                var height = this.text.getMeasuredHeight() + this.nOffsetY;

                this.background = new createjs.Shape();
                this.background.graphics.beginFill(buttonColor).drawRoundRect(0, 0, width, height, 10);

                this.text.x = width / 2 + 1;
                this.text.y = height / 2 - 1;

                this.addEventListener("click", handleClick);
                this.addEventListener("tick", handleTick);

                this.addChild(this.background, this.text);

                //clicking children of the button (background & label) dispatches the click event with the button as the target instead of the child that was clicked
                this.mouseChildren = true;
            }

            function handleClick(event) {
                var target = event.currentTarget;

                RPGGame.handleButtonEvent(target.strAction);

                //switch (target.strAction) {
                //    case RPGEnums.UIButtonEvents.STARTGAME:
                //        RPGGame.handleButtonEvent(target.strAction);
                //        break;

                //    case RPGEnums.UIButtonEvents.LEAVEBATTLEMAP:
                //    case RPGEnums.UIButtonEvents.RUN:
                //        if (bAttackAnimationInProgress == false) {
                //            nFightRound = -1;
                //            RPGAttack.endFight();
                //        }
                //        break;

                //    case RPGEnums.UIButtonEvents.ATTACKONE:
                //        if (bAttackAnimationInProgress == false) {
                //            bAttackAnimationInProgress = true;
                //            nFightRound++;

                //            //this is caught on tick and will animate the attack
                //            nAttackFrameOne = 0;
                //            nAttackFrameTwo = -1;
                //            nAttackFrameThree = -1;
                //        }
                //        break;

                //    case RPGEnums.UIButtonEvents.ATTACKTWO:

                //        if (bAttackTwoAllowed == true && bAttackAnimationInProgress == false) {
                //            bAttackAnimationInProgress = true;
                //            target.nLastAttackTwo = nFightRound;

                //            //this is caught on tick and will animate the attack
                //            nAttackFrameOne = -1;
                //            nAttackFrameTwo = 0;
                //            nAttackFrameThree = -1;
                //        }

                //        break;

                //    case RPGEnums.UIButtonEvents.ATTACKTHREE:

                //        if (bAttackThreeAllowed == true && bAttackAnimationInProgress == false) {
                //            bAttackAnimationInProgress = true;
                //            target.nLastAttackThree = nFightRound;

                //            //this is caught on tick and will animate the attack
                //            nAttackFrameOne = -1;
                //            nAttackFrameTwo = -1;
                //            nAttackFrameThree = 0;
                //        }

                //        break;

                //    default:
                //        alert("Not all switch cases caught in FlashingButton.handleClick() : " + target.strAction);
                //        break;
                //}
            }

            function handleTick(event) {
                var target = event.currentTarget;

                ////Clear all Buttons
                //if (nFightRound == -1) {
                //    stage.removeChild(event.currentTarget);
                //}
                //    //Or Handle drawing all Buttons
                //else {
                    switch (target.strType) {
                        case RPGEnums.UIButtonTypes.FLASHING:
                            target.alpha = Math.cos(target.count++ * 0.04) * 0.2 + 0.8;
                            break;

                        case RPGEnums.UIButtonTypes.TIMED:
                            if (bAttackAnimationInProgress == false) {
                                if (target.strAction == RPGEnums.UIButtonEvents.ATTACKONE || target.strAction == RPGEnums.UIButtonEvents.RUN) {
                                    //these events are always available if done animating
                                    target.alpha = 1;
                                }

                                if (target.strAction == RPGEnums.UIButtonEvents.ATTACKTWO) {
                                    //attack two requires 1 regular attack
                                    if (nFightRound - target.nLastAttackTwo >= 1) {
                                        target.alpha = 1;
                                        bAttackTwoAllowed = true;
                                    }
                                    else {
                                        target.alpha = .6;
                                        bAttackTwoAllowed = false;
                                    }
                                }

                                if (target.strAction == RPGEnums.UIButtonEvents.ATTACKTHREE) {
                                    //Attack three requires 3 regular attacks
                                    if (nFightRound - target.nLastAttackThree >= 3) {
                                        target.alpha = 1;
                                        bAttackThreeAllowed = true;
                                    }
                                    else {
                                        target.alpha = .6;
                                        bAttackThreeAllowed = false;
                                    }
                                }

                            }
                                //if an animation is in progress these are always disabled
                            else {
                                target.alpha = .7;
                            }

                            break;

                        default:
                            break;
                    }
               // }
            }

            function getSpecialAttackOne() {
                switch (strSavedMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        return "Double Strike";
                        break;
                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        return "Death Orb";
                        break;
                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                        return "Slash";
                        break;
                    default:
                        alert("Not all cases caught in RPGButton.getSpecialAttackOne()");
                }
            }

            function getSpecialAttackTwo() {
                switch (strSavedMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        return "Fire Longbow";
                        break;
                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        return "Summon Flames";
                        break;
                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                        return "Throw Knife";
                        break;
                    default:
                        alert("Not all cases caught in RPGButton.getSpecialAttackTwo()");
                }
            }

            function getSpecialAttackThree() {
                switch (strSavedMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        return "Whirlwind Attack";
                        break;
                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        return "Call Lightning";
                        break;
                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                        return "Shadow Strikes";
                        break;
                    default:
                        alert("Not all cases caught in RPGButton.getSpecialAttackThree()");
                }
            }

            window.RPGButton = RPGButton;
        }());

        this.getPercentageBar = function (nWidth, nHeight, backColor, fillColor, nCornerInset) {
            var percentageBar = new PercentageBar(nWidth, nHeight, backColor, fillColor, nCornerInset);

            //set the registry of this as the center of the item
            percentageBar.regX = nWidth/2;
            percentageBar.regY = nHeight/2;

            return percentageBar;
        }
        //Percentage Bar Prototype
        this.PercentageBar = (function () {


            var PercentageBar = function (nWidth, nHeight, backColor, fillColor, nCornerInset) {
                this.initialize(nWidth, nHeight, backColor, fillColor, nCornerInset);
            }

            var m_PercentageBar = PercentageBar.prototype = new createjs.Container(); // inherit from Container

            var m_Background;
            var m_Foreground;
            var nWidth;
            var nHeight;
            var backColor;
            var fillColor;
            var nCornerInset;


            m_PercentageBar.Container_initialize = m_PercentageBar.initialize;
            m_PercentageBar.initialize = function (nWidth, nHeight, backColor, fillColor, nCornerInset) {
                this.Container_initialize();

                this.nWidth = nWidth;
                this.nHeight = nHeight;
                this.backColor = backColor;
                this.fillColor = fillColor;
                this.nCornerInset = nCornerInset;

                //XP BAR OR HEALTH GRAPHIC
                this.m_Background = new createjs.Shape();
                this.m_Background.graphics.beginFill(backColor).beginStroke(RPGEnums.PrimaryColors.BLACK).drawRoundRect(0, 0, nWidth, nHeight, nCornerInset);

                this.m_Foreground = new createjs.Shape();
                this.m_Foreground.graphics.beginFill(fillColor).beginStroke(RPGEnums.PrimaryColors.BLACK).drawRoundRect(0, 0, nWidth, nHeight, nCornerInset);

                this.addChild(this.m_Background, this.m_Foreground);

                //clicking children of the button (background & label) dispatches the click event with the button as the target instead of the child that was clicked
                this.mouseChildren = true;
            }

            //pass this the current amount/total
            m_PercentageBar.setFill = function (dPercent)
            {
                stage.removeChild(this);

                var nSavedX, nSavedY, dSavedRegX, dSavedRegY;
                nSavedX = this.m_Foreground.x;
                nSavedY = this.m_Foreground.y;
                dSavedRegX = this.m_Foreground.regX;
                dSavedRegY = this.m_Foreground.regY;

                this.removeChild(this.m_Foreground);
                this.m_Foreground = new createjs.Shape();
                this.m_Foreground.graphics.beginFill(this.fillColor).beginStroke(RPGEnums.PrimaryColors.BLACK).drawRoundRect(nSavedX, nSavedY, this.nWidth * dPercent, this.nHeight, this.nCornerInset);
                this.m_Foreground.regX = dSavedRegX;
                this.m_Foreground.regY = dSavedRegY;
                this.addChild(this.m_Foreground);

                stage.addChild(this);
            }

            window.PercentageBar = PercentageBar;
        }());
    }

    var SoundService = new function () {

        this.playLoopedSound = function (strSound){
            createjs.Sound.stop();
            createjs.Sound.play(strSound, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
        }

        this.playSoundEffect = function (strSound) {
            createjs.Sound.play(strSound, { interrupt: createjs.Sound.INTERRUPT_NONE, loop: 1 });
        }
    }

    //*****************************RPG GAME*******************************

    var RPGGame = new function () {
        //main game character
        var mainCharacter;

        //game scenes and game states
        var dialog, fightScene, movementMap, treasureMovementMap;
        var bDialog, bFightScene, bMovementMap, bTreasureMovementMap;

        this.initRPGGame = function () {
            //start timer and stage click event
            createjs.Ticker.on("tick", handleTick);
            createjs.Ticker.useRAF = true;
            createjs.Ticker.setFPS(nFPS);

            stage.on("stagemousedown", function (event) {
                if (bMovementMap == true) {
                    //RPGMovement.setCharacterDirection(event);
                    //nLastX = event.stageX;
                    //nLastY = event.stageY;
                }
            })

            //start the game
            dialog = RPGDialog.getRPGDialog(RPGEnums.Dialogs.CHARACTERSELECTDIALOG);
        }

        //*****************************EVENTS*******************************

        this.handleButtonEvent = function (strButtonEvent) {

            switch (strButtonEvent) {

                case RPGEnums.UIButtonEvents.ATTACKONE:
                    break;
                case RPGEnums.UIButtonEvents.ATTACKTWO:
                    break;
                case RPGEnums.UIButtonEvents.ATTACKTHREE:
                    break;
                case RPGEnums.UIButtonEvents.LEAVEBATTLEMAP:
                    break;
                case RPGEnums.UIButtonEvents.SELECTCHARACTER:
                    //stubbed - can pass a second param
                    mainCharacter = CharacterFactory.getCharacter(RPGEnums.CharacterTypes.MALEWARRIOR, RPGEnums.Animations.RUNDOWN, .07, 1.5);

                    dialog.clearDialog();
                    dialog = RPGDialog.getRPGDialog(RPGEnums.Dialogs.TUTORIALDIALOG);
                    break;
                case RPGEnums.UIButtonEvents.STARTGAME:
                    dialog.clearDialog();
                    movementMap = RPGMovementMap.getRPGMovementMap(RPGEnums.MovementMaps.TERRAIN, true);
                    break;
                case RPGEnums.UIButtonEvents.RUN:
                    break;
                default:
                    alert("Not all cases caught in RPGGame.handleButtonEvent()");
                    break;
            }
        }

        var handleTick = function (event) {
            if (bMovementMap == true) {
                movementMap.handleTick(event);
            }
            else if (bTreasureMovementMap == true) {
                treasureMovementMap.handleTick();
            }
            else if (bFightScene == true) {
                fightScene.handleTick(event);
            }
            else if (bDialog == true) {
                dialog.handleTick(event);
            }

            stage.update(event); // important!!
        }

        //*****************************GAME SCENES*******************************

        var RPGMovementMap = new function () {
            this.movementCharacter;
            this.movementMap;

            this.getRPGMovementMap = function (strMovementMap, bNewMap) {
                //set globals
                bDialog = false;
                bFightScene = false;
                //logic is false here!! will want to know what type of map so I can decide what saved position to place the character at
                bMovementMap = RPGEnums.isAMovementMap(strMovementMap);
                bTreasureMovementMap = !bMovementMap;

                //draw the scene
                this.movementMap = DisplayFactory.getBitmap(strMovementMap, 2.5);
                this.movementCharacter = mainCharacter.getCharacterSprite();

                this.movementMap.x = 0;
                this.movementMap.y = 0;
                this.movementCharacter.x = 100;
                this.movementCharacter.y = 100;

                stage.addChild(this.movementMap, this.movementCharacter);

                SoundService.playLoopedSound(RPGEnums.RPGSounds.TERRAINONE);

                return this;
            }

            this.clearRPGMovementMap = function () {
                stage.removeChild(this.movementCharacter);
                stage.removeChild(this.movementMap);
            }

            this.handleTick = function (event){

            }
        }

        var RPGDialog = new function () {
            this.dialogMainCharacter;
            this.dialogNPCCharacter;
            this.dialogBackground;
            this.dialogTextDisplay;
            this.dialogExitButton;
            this.dialogCharacterSelectView;

            this.getRPGDialog = function (strDialog) {
                //set globals
                bDialog = true;
                bFightScene = false;
                bMovementMap = false;
                bTreasureMovementMap = false;

                //draw the scene
                switch (strDialog) {
                    case RPGEnums.Dialogs.CHARACTERSELECTDIALOG:
                        this.dialogTextDisplay = DisplayFactory.getText("Select Your Hero", RPGEnums.Fonts.HUGEFONT, RPGEnums.PrimaryColors.SILVER);
                        this.dialogTextDisplay.x = nScreenCenterX;
                        this.dialogTextDisplay.y = nScreenHeight * .25;

                        this.dialogCharacterSelectView = DisplayFactory.getCharacterSelectView();
                        this.dialogCharacterSelectView.x = nScreenCenterX;
                        this.dialogCharacterSelectView.y = nScreenCenterY;

                        this.dialogExitButton = DisplayFactory.getRPGButton(RPGEnums.UIButtonEvents.SELECTCHARACTER, RPGEnums.PrimaryColors.DIMGRAY, RPGEnums.PrimaryColors.DARKSLATEGRAY, RPGEnums.UIButtonTypes.FLASHING);
                        this.dialogExitButton.x = nScreenCenterX;
                        this.dialogExitButton.y = nScreenHeight * .75;

                        stage.addChild(this.dialogTextDisplay, this.dialogCharacterSelectView, this.dialogExitButton);
                        break;
                    case RPGEnums.Dialogs.TUTORIALDIALOG:


                        this.dialogExitButton = DisplayFactory.getRPGButton(RPGEnums.UIButtonEvents.STARTGAME, RPGEnums.PrimaryColors.DIMGRAY, RPGEnums.PrimaryColors.DARKSLATEGRAY, RPGEnums.UIButtonTypes.FLASHING)
                        this.dialogExitButton.x = nScreenCenterX;
                        this.dialogExitButton.y = nScreenCenterY;

                        stage.addChild(this.dialogExitButton);
                        break;
                    case RPGEnums.Dialogs.HEALERHOUSEDIALOG:
                        break;
                    case RPGEnums.Dialogs.MAINCHARACTERHOUSEDIALOG:
                        break;
                    default:
                        alert("Not all cases caught in RPGDialog.initDialog()");
                        break;
                }

                return this;
            }

            this.clearDialog = function () {
                stage.removeChild(this.dialogMainCharacter);
                stage.removeChild(this.dialogNPCCharacter);
                stage.removeChild(this.dialogBackground);
                stage.removeChild(this.dialogTextDisplay);
                stage.removeChild(this.dialogExitButton);
                stage.removeChild(this.dialogCharacterSelectView);
            }

            this.handleTick = function (event){

            }
        }

        var RPGFightScene = new function () {

            this.getRPGFightScene = function (strMovementMap, bNewMap) {
                //set globals
                bDialog = false;
                bFightScene = true;
                bMovementMap = false;
                bTreasureMovementMap = false;

                //draw the scene
                return this;
            }

            this.clearFightScene = function () {

            }

            this.handleTick = function (event) {

            }
        }

    }
};
