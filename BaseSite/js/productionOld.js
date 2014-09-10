//Other

//handle win message

//set up the final treasure fights with RPGEnum.GetTreasureHero(); //each enum will have a property (used as treasure hero) (higher level same weapons as the game)
//set up the two boss fights (get resource pictures is about it) - these can be repeated indefinitely - only change the flag when complete

//get some attack sounds rolling

//give a text display on victory before kicking out of fight screen - talk about win/loss gained xp - delay before kicking out (wait for button push to leave)
//this will be the same text display as dialogs
//set up at least 4 textbox dialogs (will draw like a fightscreen) starting house (instructions), after town (the healer has been kidnapped), healer house (get the healer), after Final Boss
//this creates a story
//victory screen

//rpg character choice screen

//refactor (change all draw items to return items, let the calling class decide the zorder)
//refactor (guarantee that all global variables are communicating with other areas - remove if not)
//refactor (RPGAttack needs alot of work)
//refactor (want methods to return items, not work with inside of them ie gets in display)

//nRangedStartPositionX, nRangedEndPositionX
//nMeleeEndPositionX, nMeleeStartPositionX
//set these in rpg attack as local variables

var RPGGame = new function () {
    //Game Variables
    var nFPS, nExperiencePoints;
    var npcCharacterObject, heroCharacterObject;
    var strMainCharacterType, strMovementMap;
    var bGameStarted, bMovementFlag, bAtTreasure;
    var bGrassland, bBadland, bBeach, bForest, bMountain, bTown, bCastle, bHealerHouse, bMainCharacterHouse;
    var bGrasslandFinalTreasure, bBadlandFinalTreasure, bBeachFinalTreasure, bForestFinalTreasure, bMountainFinalTreasure;
    var bTownFinalTreasure, bCastleFinalTreasure, bHealerHouseFinalTreasure, bMainCharacterHouseFinalTreasure;

    //HTML and EaselJS Stage objects
    var stage, rpgCanvas, collisionContext, mainCharacter, mainCharacterMini, mainCharacterDisplay;
    var terrain, terrainMiniMap, terrainMiniMapBorder, staticImage, staticImageBorder, treasureSet;
    var fightTextDisplay, heroFightDisplay, npcFightDisplay;
    var heroFightCharacterAnimation, npcFightCharacterAnimation;

    //UI variables
    var bIsChromeOrFireFox, dAnimationSpeedOffset;
    var smallFont, font, largeFont, lightFontColor, darkFontColor;
    var dMapScale, dMiniMapScale;
    var nStaticImageInset;

    //Position Variables
    var nLastX, nLastY;
    var dCharacterStartPointX, dCharacterStartPointY, dCharacterPointX, dCharacterPointY;
    var dSavedCharacterPointX, dSavedCharacterPointY, dMainMapSavedCharacterPointX, dMainMapSavedCharacterPointY;
    var nScreenWidth, nScreenHeight, nScreenCenterX, nScreenCenterY, nBackgroundWidth, nBackgroundHeight;

    //Battle Variables
    var attackMovementObject, attackWeapon;
    var strFightTextDisplay, nEnemyMonsterType;
    var bAttackAnimationInProgress, bEnemyAttackAnimationInProgress;
    var nFightRound, nMeleeAttackOffset, nRangeAttackOffset, nAttackFrameOne, nAttackFrameTwo, nAttackFrameThree;

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

        this.MapColors = {
            BADLANDRGB: { 0: 139, 1: 69, 2: 19 },
            BEACHRGB: { 0: 253, 1: 245, 2: 230 },
            FORESTRGB: { 0: 0, 1: 100, 2: 0 },
            GRASSLANDRGB: { 0: 50, 1: 205, 2: 50 },
            MOUNTAINRGB: { 0: 105, 1: 105, 2: 105 },
            FINALTERRAINTREASURERGB: { 0: 0, 1: 0, 2: 255 }
        }

        this.MapTypes = {
            MOVEMENT: "movement",
            FIGHTSCREEN: "fightScreen",
            DIALOG: "dialog"
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

        this.UIButtonActions = {
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

        this.freezeEnums = function () {
            if (Object.freeze) {
                Object.freeze(RPGEnums.MovementMaps);
                Object.freeze(RPGEnums.CharacterTypes);
                Object.freeze(RPGEnums.Animations);
                Object.freeze(RPGEnums.MapColors);
                Object.freeze(RPGEnums.MapTypes);
                Object.freeze(RPGEnums.RPGSounds);
                Object.freeze(RPGEnums.Bitmaps);
                Object.freeze(RPGEnums.UIButtonTypes);
                Object.freeze(RPGEnums.UIButtonActions);
            }
        }
    }

    //*****************************RPG GLOBALS*******************************

    var RPGGlobals = new function () {

        this.init = function () {

            strMovementMap = RPGEnums.MovementMaps.TERRAIN;
            strMainCharacterType = RPGEnums.CharacterTypes.MALETHIEF;
            nExperiencePoints = 0;

            //set ui Variables
            smallFont = "20px Haettenschweiler";
            font = "28px Haettenschweiler";
            largeFont = "34px Haettenschweiler";
            lightFontColor = "#CCC";
            darkFontColor = "darkSlateGray";

            //set display variables
            RPGDisplay.setScreenVariables();

            //set game play variables
            bGameStarted = false;
            bMovementFlag = false;
            bAtTreasure = false;

            //set terrain positions and treasure completions
            bGrassland = true, bBadland = false, bBeach = false, bForest = false, bMountain = false, bTown = false;
            bCastle = false, bHealerHouse = false, bMainCharacterHouse = false;

            bGrasslandFinalTreasure = false, bBadlandFinalTreasure = false, bBeachFinalTreasure = false, bForestFinalTreasure = false;
            bMountainFinalTreasure = false, bTownFinalTreasure = false, bCastleFinalTreasure = false, bHealerHouseFinalTreasure = false;
            bMainCharacterHouseFinalTreasure = false;

            //set fight variables
            bAttackAnimationInProgress = false;
            bEnemyAttackAnimationInProgress = false;

            nFightRound = 0;
            strFightTextDisplay = "";
            nAttackFrameOne = -1;
            nAttackFrameTwo = -1;
            nAttackFrameThree = -1;
            nMeleeAttackOffset = 50;
            nRangeAttackOffset = 50;

            nEnemyMonsterType = 0;

            RPGAttack.init();
            RPGMovement.init();
        }

        this.setPositionVariables = function () {

            //set up the background width
            nBackgroundWidth = terrain.image.width * dMapScale - mainCharacter.regX;
            nBackgroundHeight = terrain.image.height * dMapScale - mainCharacter.regY;

            //top left and dead center
            if (dCharacterPointX <= nScreenCenterX && dCharacterPointY <= nScreenCenterY) {
                terrain.x = 0;
                terrain.y = 0;
                mainCharacter.x = dCharacterPointX;
                mainCharacter.y = dCharacterPointY;
            }

            //top right
            if (dCharacterPointX > nScreenCenterX && dCharacterPointY < nScreenCenterY) {
                //map will not go offscreen
                if ((dCharacterPointX + nScreenCenterX) < nBackgroundWidth) {
                    terrain.x = -(dCharacterPointX - nScreenCenterX);
                    mainCharacter.x = -(dCharacterPointX - nScreenCenterX) + dCharacterPointX;
                }
                    //map will go offscreen
                else {
                    terrain.x = -(nBackgroundWidth - nScreenWidth);
                    mainCharacter.x = -(nBackgroundWidth - nScreenWidth) + dCharacterPointX;
                }

                terrain.y = 0;
                mainCharacter.y = dCharacterPointY;
            }

            //bottom left
            if (dCharacterPointX < nScreenCenterX && dCharacterPointY > nScreenCenterY) {
                //map will not go offscreen
                if ((dCharacterPointY + nScreenCenterY) < nBackgroundHeight) {
                    terrain.y = -(dCharacterPointY - nScreenCenterY);
                    mainCharacter.y = -(dCharacterPointY - nScreenCenterY) + dCharacterPointY;
                }
                    //map will go offscreen
                else {
                    terrain.y = -(nBackgroundHeight - nScreenHeight);
                    mainCharacter.y = -(nBackgroundHeight - nScreenHeight) + dCharacterPointY;
                }

                terrain.x = 0;
                mainCharacter.x = dCharacterPointX;
            }

            //bottom right
            if (dCharacterPointX > nScreenCenterX && dCharacterPointY > nScreenCenterY) {
                //map will not go offscreen
                if ((dCharacterPointX + nScreenCenterX) < nBackgroundWidth) {
                    terrain.x = -(dCharacterPointX - nScreenCenterX);
                    mainCharacter.x = -(dCharacterPointX - nScreenCenterX) + dCharacterPointX;
                }
                    //map will go offscreen
                else {
                    terrain.x = -(nBackgroundWidth - nScreenWidth);
                    mainCharacter.x = -(nBackgroundWidth - nScreenWidth) + dCharacterPointX;
                }

                //map will not go offscreen
                if ((dCharacterPointY + nScreenCenterY) < nBackgroundHeight) {
                    terrain.y = -(dCharacterPointY - nScreenCenterY);
                    mainCharacter.y = -(dCharacterPointY - nScreenCenterY) + dCharacterPointY;
                }
                    //map will go offscreen
                else {
                    terrain.y = -(nBackgroundHeight - nScreenHeight);
                    mainCharacter.y = -(nBackgroundHeight - nScreenHeight) + dCharacterPointY;
                }
            }

            //set the character as stationary
            nLastX = mainCharacter.x;
            nLastY = mainCharacter.y;

            //keep the treasure map in the right position
            if (strMovementMap.indexOf(RPGEnums.MovementMaps.TERRAIN) == 0) {
                treasureSet.x = terrain.x;
                treasureSet.y = terrain.y;
            }

            //set the positon of the mini map character
            mainCharacterMini.x = dCharacterStartPointX * dMiniMapScale / dMapScale;
            mainCharacterMini.y = dCharacterStartPointY * dMiniMapScale / dMapScale;
        }

        this.clearTerrainType = function () {
            bBadland = false;
            bBeach = false;
            bForest = false;
            bGrassland = false;
            bMountain = false;
        }

        this.getTerrainFightScreen = function () {
            if (bBadland == true)
                return RPGEnums.Bitmaps.BADLANDFIGHT;
            else if (bBeach == true)
                return RPGEnums.Bitmaps.BEACHFIGHT;
            else if (bForest == true)
                return RPGEnums.Bitmaps.FORESTFIGHT;
            else if (bGrassland == true) {
                if (bTown != true)
                    return RPGEnums.Bitmaps.GRASSLANDFIGHTONE;
                else
                    return RPGEnums.Bitmaps.GRASSLANDFIGHTTWO;
            }
            else if (bMountain == true)
                return RPGEnums.Bitmaps.MOUNTAINFIGHT;
        }

        this.getRandomFightSong = function () {
            var nRandomSongChance = Math.floor((Math.random() * 2) + 1);

            switch (nRandomSongChance) {
                case 0:
                    return RPGEnums.RPGSounds.GENERICFIGHT;
                    break;
                case 1:
                    return RPGEnums.RPGSounds.TOWNFIGHT;
                    break;
                case 2:
                    return RPGEnums.RPGSounds.CASTLEFIGHT;
                    break;
                default:
                    alert("Not all cases caught in RPGGlobals.getRandomFightSong() : " + nRandomSongChance);
                    break;
            }
        }

        this.getRandomFightCharacter = function () {
            var nRandomFightChance = Math.floor(Math.random() * 39);

            //Entire Charset
            //var nRandomFightChance = Math.floor(Math.random() * 8) + 8;

            //Charset and specific character
            //var nTestSheet = 2;
            //var nCharacter = 4;
            //var nRandomFightChance = (7 * (nTestSheet - 1)) + nCharacter;

            nEnemyMonsterType = nRandomFightChance;

            return (RPGEnums.MonsterTypes[nEnemyMonsterType]);
        }
    }

    //*****************************DISPLAY*******************************

    var RPGDisplay = new function () {

        this.clearScreen = function () {
            stage.removeChild(terrain);
            stage.removeChild(terrainMiniMap);
            stage.removeChild(terrainMiniMapBorder);

            stage.removeChild(treasureSet);

            stage.removeChild(mainCharacter);
            stage.removeChild(mainCharacterMini);
            stage.removeChild(mainCharacterDisplay);
        }

        this.clearStaticImage = function () {
            stage.removeChild(staticImage);
            stage.removeChild(staticImageBorder);

            stage.removeChild(heroFightCharacterAnimation);
            stage.removeChild(npcFightCharacterAnimation);

            stage.removeChild(heroFightDisplay);
            stage.removeChild(npcFightDisplay);

            //UI Buttons are removed when nFightRound == -1 so on "Run" and "Leave Battle Map"

            stage.removeChild(fightTextDisplay);
            stage.removeChild(attackWeapon);
            stage.removeChild(attackMovementObject);
        }

        this.setScreenVariables = function () {
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

            nStaticImageInset = 20;

            rpgCanvas.width = window.innerWidth;
            rpgCanvas.height = window.innerHeight;
            nScreenWidth = rpgCanvas.width;
            nScreenHeight = rpgCanvas.height;
            nScreenCenterX = nScreenWidth / 2;
            nScreenCenterY = nScreenHeight / 2;

            if (nScreenWidth > 800)
                dMiniMapScale = .12;
            else
                dMiniMapScale = .08;
        }

        this.getCharacterAnimation = function (strCharacterType, dCharacterStartPointX, dCharacterStartPointY, scale, startAnimation, dAnimationSpeed) {

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
                character = new createjs.Sprite(spriteSheet, startAnimation);

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
                    frames: { width: tempBitmap.image.width / 12, height: tempBitmap.image.height / 8/*, regX: 72, regY: 64 */ },
                    // animations 0-11, loop always, framerate
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
                character = new createjs.Sprite(spriteSheet, startAnimation);

                //set the registry of this as the center of the item
                character.regX = tempBitmap.image.width / 24;
                character.regY = tempBitmap.image.height / 16 + 4;
            }


            //set the scale
            character.scaleX = scale;
            character.scaleY = scale;

            character.x = dCharacterStartPointX;
            character.y = dCharacterStartPointY;



            //handle image size changes

            if (bCharacterType == true) {

                switch (strCharacterType) {
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                        character.scaleY = scale * 1.1;
                        //if facing right this character sits low
                        if (strMainCharacterType == strCharacterType)
                            character.y += 6;
                        else
                            character.y += 2;
                        break;

                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        character.y -= 1;
                        break;

                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        character.y += 4;
                        break;

                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                        character.scaleY = scale * 1.05;
                        character.y -= 3;
                        break;

                    case RPGEnums.CharacterTypes.MALETHIEF:
                        character.scaleY = scale * 1.1;
                        //if facing right this character sits low
                        if (strMainCharacterType == strCharacterType)
                            character.y += 3;
                        break;

                    default:
                        break;
                }
            }

            return character;

        }

        this.getTerrain = function (terrainMap, dMapScale) {
            //load the images for terrain
            var terrainCollisions = new createjs.Bitmap(queue.getResult(terrainMap + "Collisions"));
            terrain = new createjs.Bitmap(queue.getResult(terrainMap));

            //set up the main map
            terrain.scaleX = dMapScale;
            terrain.scaleY = dMapScale;

            //set up a collision image for pixel checks
            var collisionCanvas = document.createElement("canvas");

            collisionCanvas.width = terrain.image.width;
            collisionCanvas.height = terrain.image.height;
            collisionCanvas.getContext("2d").drawImage(terrainCollisions.image, 0, 0, terrain.image.width, terrain.image.height);
            collisionContext = collisionCanvas.getContext("2d");
        }

        this.getMiniMap = function (terrainMap) {
            //set up the mini map
            terrainMiniMap = new createjs.Bitmap(queue.getResult(terrainMap));

            terrainMiniMap.scaleX = dMiniMapScale;
            terrainMiniMap.scaleY = dMiniMapScale;
            terrainMiniMap.x = 0;
            terrainMiniMap.y = 0;

            //add mini map border
            terrainMiniMapBorder = new createjs.Shape();
            terrainMiniMapBorder.graphics.beginFill("gray").beginStroke("black").drawRoundRect(-5, -5, terrainMiniMap.image.width * dMiniMapScale + 10, terrainMiniMap.image.height * dMiniMapScale + 10, 5);

            //draw main character for minimap
            mainCharacterMini = new createjs.Shape();
            mainCharacterMini.graphics.beginFill("gray").beginRadialGradientStroke(["white", "black"], [0, 1], 0, 0, 0, 0, 30, 130).drawCircle(0, 0, 2.5);
        }

        this.getStaticImage = function (strStaticImage, strStaticImageType) {

            staticImage = new createjs.Bitmap(queue.getResult(strStaticImage));

            nCurrentWidth = staticImage.image.width;
            nDesiredWidth = rpgCanvas.width - nStaticImageInset * 2;
            nCurrentHeight = staticImage.image.height;
            nDesiredHeight = rpgCanvas.height - nStaticImageInset * 2;

            staticImage.scaleX = nDesiredWidth / nCurrentWidth;
            staticImage.scaleY = nDesiredHeight / nCurrentHeight;

            staticImage.x = rpgCanvas.width / 2;
            staticImage.y = rpgCanvas.height / 2;
            staticImage.regX = staticImage.image.width / 2;
            staticImage.regY = staticImage.image.height / 2;

            //add border
            staticImageBorder = new createjs.Shape();
            staticImageBorder.graphics.beginFill("silver").beginRadialGradientStroke(["white", "black"], [0, 1], 0, 0, 0, 0, 30, 130).drawRoundRect(nStaticImageInset / 2, nStaticImageInset / 2, rpgCanvas.width - nStaticImageInset, rpgCanvas.height - nStaticImageInset, 5);

            stage.addChild(staticImageBorder);
            stage.addChild(staticImage);
        }

        this.getCharacterDisplay = function (strCharacterType, strCharacterDisplayType) {

            switch (strCharacterDisplayType) {
                case RPGEnums.MapTypes.MOVEMENT:
                    mainCharacterDisplay = new CharacterDisplay(strCharacterType, strCharacterDisplayType);
                    //added in initMovementMap() for z-axis setting
                    break;

                case RPGEnums.MapTypes.FIGHTSCREEN:
                    if (strCharacterType == strMainCharacterType) {
                        heroFightDisplay = new CharacterDisplay(strCharacterType, strCharacterDisplayType);
                        heroFightDisplay.x += (nStaticImageInset * 2);
                        heroFightDisplay.y -= ((terrainMiniMap.image.height * dMiniMapScale) - nStaticImageInset - 5);
                        stage.addChild(heroFightDisplay);
                    }
                    else {
                        npcFightDisplay = new CharacterDisplay(strCharacterType, strCharacterDisplayType);
                        npcFightDisplay.x = (nScreenWidth - (terrainMiniMap.image.width * dMiniMapScale + 15) - (nStaticImageInset));
                        npcFightDisplay.y -= ((terrainMiniMap.image.height * dMiniMapScale) - nStaticImageInset - 5);
                        stage.addChild(npcFightDisplay);
                    }
                    break;

                default:
                    alert("Not all cases caught in RPGDisplay.getCharacterDisplay() : " + strCharacterDisplayType);
                    break;
            }
        }
        //Character Display Prototype
        this.CharacterDisplay = (function () {

            var CharacterDisplay = function (strCharacterType, strCharacterDisplayType) {
                this.initialize(strCharacterType, strCharacterDisplayType);
            }

            var m_CharacterDisplay = CharacterDisplay.prototype = new createjs.Container(); // inherit from Container

            m_CharacterDisplay.strCharacterType;
            m_CharacterDisplay.strCharacterDisplayType;
            m_CharacterDisplay.healthText;
            m_CharacterDisplay.characterObject;

            m_CharacterDisplay.Container_initialize = m_CharacterDisplay.initialize;

            m_CharacterDisplay.initialize = function (strCharacterType, strCharacterDisplayType) {
                this.Container_initialize();

                var characterDisplayBorder, characterBorder, character;
                var strLabel, levelText, damageText, armorText;
                var nWidth, nHeight, nDisplayPointX, nDisplayPointY;
                var nStartPointCol1X, nStartPointCol2X, nStartPointCol3X, nStartPointRow1Y, nStartPointRow2Y, nStartPointRow3Y;

                var bIsAMainCharacter = RPGEnums.isAMainCharacterType(strCharacterType);

                this.strCharacterType = strCharacterType;
                this.strCharacterDisplayType = strCharacterDisplayType;

                nWidth = terrainMiniMap.image.width * dMiniMapScale + 15;
                nHeight = 66;

                //initially set this for large screens
                nStartPointCol1X = 5;
                nStartPointCol2X = 54;
                nStartPointCol3X = 145;
                nStartPointRow1Y = 13;
                nStartPointRow2Y = 17;

                var xpText, xpBarBorder, xpBarCompletion;
                var tinyFont, tempFont = font;
                var nStartPointXPBarX, nStartPointXPBarY, nXPBarWidth, nXPBarHeight;

                //create the border
                characterDisplayBorder = new createjs.Shape();
                characterDisplayBorder.graphics.beginFill("dimgray").beginStroke("black").drawRoundRect(-10, terrainMiniMap.image.height * dMiniMapScale + 5, nWidth, nHeight, 8);

                //CHARACTER DISPLAY IF LARGE ENOUGH
                if (nScreenWidth > 800) {
                    //add character if large enough
                    characterBorder = new createjs.Shape();
                    characterBorder.graphics.beginFill("silver").beginStroke("black").drawRoundRect(5, terrainMiniMap.image.height * dMiniMapScale + 9, 43, nHeight - 8, 4);

                    character = createDisplayCharacter(strCharacterType, strCharacterDisplayType);

                    //handle image size changes

                    if (bIsAMainCharacter == true) {
                        if (strCharacterType == RPGEnums.CharacterTypes.MALEWARRIOR) {
                            character.x = nStartPointCol1X;
                            character.y = terrainMiniMap.image.height * dMiniMapScale + 15;
                        }
                        else if (strCharacterType == RPGEnums.CharacterTypes.FEMALEWARRIOR) {
                            character.x = nStartPointCol1X + 4;
                            character.y = terrainMiniMap.image.height * dMiniMapScale + 19;
                        }
                        else if (strCharacterType == RPGEnums.CharacterTypes.FEMALEMAGE) {
                            character.x = nStartPointCol1X;
                            character.y = terrainMiniMap.image.height * dMiniMapScale + 16;
                        }
                        else {
                            character.x = nStartPointCol1X + 3;
                            character.y = terrainMiniMap.image.height * dMiniMapScale + 15;
                        }
                    }
                    else {
                        character.x = nStartPointCol1X - 1;
                        character.y = terrainMiniMap.image.height * dMiniMapScale + 6;
                    }

                }
                else {
                    //otherwise change the variables to only show the text objects
                    tempFont = smallFont;
                    nStartPointCol2X = 10;
                    nStartPointCol3X = 85;
                    nStartPointRow2Y = 20;
                }

                this.characterObject = ((bIsAMainCharacter == true) ? heroCharacterObject : npcCharacterObject);

                //TEXT
                strLabel = "Level " + this.characterObject.nLevel;
                levelText = new createjs.Text(strLabel, tempFont, lightFontColor);
                levelText.textBaseline = "bottom";
                levelText.textAlign = "left";
                levelText.x = nStartPointCol2X;
                levelText.y = terrainMiniMap.image.height * dMiniMapScale + nStartPointRow1Y + levelText.getMeasuredHeight();

                strLabel = "Health: " + this.characterObject.nHealth;
                this.healthText = new createjs.Text(strLabel, tempFont, lightFontColor);
                this.healthText.textBaseline = "bottom";
                this.healthText.textAlign = "left";
                this.healthText.x = nStartPointCol2X;
                this.healthText.y = terrainMiniMap.image.height * dMiniMapScale + nStartPointRow2Y + levelText.getMeasuredHeight() + this.healthText.getMeasuredHeight();


                strLabel = "Dmg: " + this.characterObject.nMinDamage + "-" + this.characterObject.nMaxDamage;
                damageText = new createjs.Text(strLabel, tempFont, lightFontColor);
                damageText.textBaseline = "bottom";
                damageText.textAlign = "left";
                damageText.x = nStartPointCol3X;
                damageText.y = terrainMiniMap.image.height * dMiniMapScale + nStartPointRow1Y + levelText.getMeasuredHeight();

                strLabel = "Armor: " + this.characterObject.nArmor;
                armorText = new createjs.Text(strLabel, tempFont, lightFontColor);
                armorText.textBaseline = "bottom";
                armorText.textAlign = "left";
                armorText.x = nStartPointCol3X;
                armorText.y = terrainMiniMap.image.height * dMiniMapScale + nStartPointRow2Y + levelText.getMeasuredHeight() + this.healthText.getMeasuredHeight();


                //TODO here

                //XP BAR TEXT
                tinyFont = "10px Impact";
                if (strCharacterDisplayType == RPGEnums.MapTypes.MOVEMENT) {
                    strLabel = "XP";
                }
                else {
                    strLabel = "HEALTH";
                }
                xpText = new createjs.Text(strLabel, tinyFont, lightFontColor);
                xpText.textBaseline = "bottom";
                xpText.textAlign = "left";
                xpText.x = nStartPointCol2X;
                xpText.y = this.healthText.y + xpText.getMeasuredHeight() + (nScreenWidth <= 800 ? 7 : 4);

                //XP BAR OR HEALTH GRAPHIC
                nStartPointXPBarX = nStartPointCol2X + xpText.getMeasuredWidth() + (nScreenWidth <= 800 ? 5 : 3);
                nStartPointXPBarY = (nScreenWidth <= 800 ? this.healthText.y + 4 : this.healthText.y + 2);
                nXPBarWidth = nWidth - nStartPointCol2X - 20 - xpText.getMeasuredWidth() - 3;
                nXPBarHeight = (nScreenWidth <= 800 ? 11 : 9);

                xpBarBorder = new createjs.Shape();
                xpBarBorder.graphics.beginFill("silver").beginStroke("black").drawRoundRect(nStartPointXPBarX, nStartPointXPBarY, nXPBarWidth, nXPBarHeight, 8);

                xpBarCompletion = new createjs.Shape();
                if (strCharacterDisplayType == RPGEnums.MapTypes.MOVEMENT) {
                    xpBarCompletion.graphics.beginFill("darkSlateGray").beginStroke("black").drawRoundRect(nStartPointXPBarX, nStartPointXPBarY, nXPBarWidth * .75, nXPBarHeight, 8);
                }
                else {
                    xpBarCompletion.graphics.beginFill("red").beginStroke("black").drawRoundRect(nStartPointXPBarX, nStartPointXPBarY, nXPBarWidth * .75, nXPBarHeight, 8);
                }

                //add the character if a large enough screen
                if (nScreenWidth > 800) {
                    this.addChild(characterDisplayBorder, characterBorder, character, levelText, this.healthText, damageText, armorText, xpText, xpBarBorder, xpBarCompletion);
                }
                    //otherwise only add the text and XP bar
                else {
                    this.addChild(characterDisplayBorder, levelText, this.healthText, damageText, armorText, xpText, xpBarBorder, xpBarCompletion);
                }

                this.mouseChildren = false;
            }

            function createDisplayCharacter(strCharacterType, strCharacterDisplayType) {
                var tempMainCharacter = new createjs.Bitmap(queue.getResult(strCharacterType));
                var character, data, spriteSheet;

                switch (strCharacterDisplayType) {
                    case RPGEnums.MapTypes.MOVEMENT:
                    case RPGEnums.MapTypes.FIGHTSCREEN:

                        var bIsAMainCharacter = RPGEnums.isAMainCharacterType(strCharacterType);
                        character = RPGDisplay.getCharacterAnimation(strCharacterType, 0, 0, ((bIsAMainCharacter == true) ? 1.8 : 1.9), RPGEnums.Animations.RUNDOWN, .035);

                        //set the registry of this as the top left
                        character.regX = 0;
                        character.regY = 0;
                        break;

                    default:
                        alert("Not all cases caught in CharacterDisplay.handleTick() : " + strCharacterDisplayType);
                        break;
                }


                return character;
            }

            m_CharacterDisplay.updateHealth = function (nHealthChange) {
                var tempFont;
                var nSavedX = this.healthText.x;
                var nSavedY = this.healthText.y;

                this.removeChild(this.healthText);
                this.characterObject.nHealth = this.characterObject.nHealth + nHealthChange;
                var strLabel = "Health: " + ((this.characterObject.nHealth >= 0) ? this.characterObject.nHealth : 0);

                if (nScreenWidth <= 800)
                    tempFont = smallFont;
                else
                    tempFont = font;

                this.healthText = new createjs.Text(strLabel, tempFont, lightFontColor);
                this.healthText.textBaseline = "bottom";
                this.healthText.textAlign = "left";
                this.healthText.x = nSavedX;
                this.healthText.y = nSavedY;

                this.addChild(this.healthText);
            }

            window.CharacterDisplay = CharacterDisplay;
        }());

        this.getTreasureMap = function () {
            treasureSet = new TreasureSet();
        }
        //Treasure Chest Prototype
        this.TreasureSet = (function () {

            var TreasureNames = {
                //Movement Maps
                BADLAND: "badland",
                BEACH: "beach",
                FOREST: "forest",
                GRASSLAND: "grassLand",
                MOUNTAIN: "mountain",

                //Unique fights
                CASTLE: "castle",
                TOWN: "town",

                //Dialogs
                MAINCHARACTERHOUSE: "mainCharacterHouse",
                HEALERHOUSE: "healerHouse"
            }

            var TreasureSet = function () {
                this.initialize();
            }

            var m_TreasureSet = TreasureSet.prototype = new createjs.Container(); // inherit from Container

            m_TreasureSet.Container_initialize = m_TreasureSet.initialize;

            m_TreasureSet.initialize = function () {
                if (Object.freeze)
                    Object.freeze(TreasureNames);

                this.Container_initialize();

                var nSize = 26;

                //terrain treasures
                var badlandTreasure = new Treasure(TreasureNames.BADLAND, 1877, 958, nSize, nSize, true);
                this.addChild(badlandTreasure);

                var beachTreasure = new Treasure(TreasureNames.BEACH, 2364, 346, nSize, nSize, true);
                this.addChild(beachTreasure);

                var forestTreasure = new Treasure(TreasureNames.FOREST, 1499, 505, nSize, nSize, true);
                this.addChild(forestTreasure);

                var grasslandTreasure = new Treasure(TreasureNames.GRASSLAND, 848, 1117, nSize, nSize, true);
                this.addChild(grasslandTreasure);

                var mountainTreasure = new Treasure(TreasureNames.MOUNTAIN, 1203, 235, nSize, nSize, true);
                this.addChild(mountainTreasure);

                //Unique Fights
                var town = new Treasure(TreasureNames.TOWN, 1400, 712, 140, 150, false);
                this.addChild(town);

                var castle = new Treasure(TreasureNames.CASTLE, 2349, 900, 139, 125, false);
                this.addChild(castle);

                //dialogs
                var mainCharacterHouse = new Treasure(TreasureNames.MAINCHARACTERHOUSE, 398, 407, 82, 47, false);
                this.addChild(mainCharacterHouse);

                var healerHouse = new Treasure(TreasureNames.HEALERHOUSE, 2300, 1019, 53, 67, false);
                this.addChild(healerHouse);

                this.mouseChildren = true;
            }

            window.TreasureSet = TreasureSet;

            (function () {

                var Treasure = function (strType, nPositionX, nPositionY, nWidth, nHeight, bVisible) {
                    this.initialize(strType, nPositionX, nPositionY, nWidth, nHeight, bVisible);
                }

                var m_Treasure = Treasure.prototype = new createjs.Container(); // inherit from Container

                m_Treasure.strType;
                m_Treasure.bVisible;
                m_Treasure.background;

                m_Treasure.Container_initialize = m_Treasure.initialize;

                m_Treasure.initialize = function (strType, nPositionX, nPositionY, nWidth, nHeight, bVisible) {
                    this.Container_initialize();
                    var background;

                    this.strType = strType;
                    this.bVisible = bVisible;

                    if (bVisible == true) {
                        background = new createjs.Shape();

                        background.graphics.beginFill("black").beginStroke("silver").drawRoundRect(0, 0, nWidth, nHeight, 7);
                        background.x = nPositionX - nWidth / 2;
                        background.y = nPositionY - nHeight / 2;
                        background.regX = 0;
                        background.regY = 0;
                        background.setBounds(background.x,                      //x
                                             background.y,                      //y
                                             nWidth,                            //width
                                             nHeight)                           //height
                        background.addEventListener("tick", handleTick);

                        var bitmapInset = 8;
                        var bitmap = new createjs.Bitmap(queue.getResult(RPGEnums.Bitmaps.TREASURECHEST));
                        bitmap.scaleX = Math.max((nWidth - bitmapInset) / bitmap.image.width, (nHeight - bitmapInset) / bitmap.image.height);
                        bitmap.scaleY = Math.max((nWidth - bitmapInset) / bitmap.image.width, (nHeight - bitmapInset) / bitmap.image.height);
                        bitmap.x = nPositionX - 12;
                        bitmap.y = nPositionY - 9;

                        this.addChild(background, bitmap);
                    }
                    else {
                        background = new createjs.Shape();
                        background.graphics.beginFill("transparent").drawRoundRect(0, 0, nWidth, nHeight, 10);
                        background.x = nPositionX;
                        background.y = nPositionY;
                        background.regX = 0;
                        background.regY = 0;
                        background.setBounds(background.x,  //x
                                             background.y,  //y
                                             nWidth,        //width
                                             nHeight)       //height
                        background.addEventListener("tick", handleTick);
                        this.addChild(background);
                    }

                    this.mouseChildren = false;
                }

                function handleTick(event) {
                    var target = event.currentTarget;

                    var boundingBox = target.getBounds();

                    if (dCharacterPointX >= boundingBox.x && dCharacterPointX <= boundingBox.x + boundingBox.width && dCharacterPointY >= boundingBox.y && dCharacterPointY <= boundingBox.y + boundingBox.height) {
                        switch (target.parent.strType) {
                            //Treasure Terrain Maps
                            case TreasureNames.BADLAND:
                                RPGGlobals.clearTerrainType();
                                bBadland = true;

                                if (bBadlandFinalTreasure == false) {
                                    dMainMapSavedCharacterPointX = dCharacterPointX;
                                    dMainMapSavedCharacterPointY = dCharacterPointY;

                                    strMovementMap = RPGEnums.MovementMaps.BADLAND;
                                    initMovementMap(strMovementMap, true);

                                    bBadlandFinalTreasure = true;
                                }
                                break;

                            case TreasureNames.BEACH:
                                RPGGlobals.clearTerrainType();
                                bBeach = true;

                                if (bBeachFinalTreasure == false) {
                                    dMainMapSavedCharacterPointX = dCharacterPointX;
                                    dMainMapSavedCharacterPointY = dCharacterPointY;

                                    strMovementMap = RPGEnums.MovementMaps.BEACH;
                                    initMovementMap(strMovementMap, true);

                                    bBeachFinalTreasure = true;
                                }
                                break;

                            case TreasureNames.FOREST:
                                RPGGlobals.clearTerrainType();
                                bForest = true;

                                if (bForestFinalTreasure == false) {
                                    dMainMapSavedCharacterPointX = dCharacterPointX;
                                    dMainMapSavedCharacterPointY = dCharacterPointY;

                                    strMovementMap = RPGEnums.MovementMaps.FOREST;
                                    initMovementMap(strMovementMap, true);

                                    bForestFinalTreasure = true;
                                }
                                break;

                            case TreasureNames.GRASSLAND:
                                RPGGlobals.clearTerrainType();
                                bGrassland = true;

                                if (bGrasslandFinalTreasure == false) {
                                    dMainMapSavedCharacterPointX = dCharacterPointX;
                                    dMainMapSavedCharacterPointY = dCharacterPointY;

                                    strMovementMap = RPGEnums.MovementMaps.GRASSLAND;
                                    initMovementMap(strMovementMap, true);

                                    bGrasslandFinalTreasure = true;
                                }
                                break;

                            case TreasureNames.MOUNTAIN:
                                RPGGlobals.clearTerrainType();
                                bMountain = true;

                                if (bMountainFinalTreasure == false) {
                                    dMainMapSavedCharacterPointX = dCharacterPointX;
                                    dMainMapSavedCharacterPointY = dCharacterPointY;

                                    strMovementMap = RPGEnums.MovementMaps.MOUNTAIN;
                                    initMovementMap(strMovementMap, true);

                                    bMountainFinalTreasure = true;
                                }
                                break;

                                //Unique Fights
                            case TreasureNames.TOWN:
                                bTown = true;

                                if (bTownFinalTreasure == false) {

                                    initFightScreen(RPGEnums.Bitmaps.TOWNFIGHT);

                                    bTownFinalTreasure = true;
                                }
                                break;
                            case TreasureNames.CASTLE:
                                bCastle = true;

                                if (bCastleFinalTreasure == false) {

                                    initFightScreen(RPGEnums.Bitmaps.CASTLEFIGHT);

                                    bCastleFinalTreasure = true;
                                }
                                break;

                                //Dialogs
                            case TreasureNames.MAINCHARACTERHOUSE:
                                bMainCharacterHouse = true;

                                if (bMainCharacterHouseFinalTreasure == false) {

                                    initDialog(RPGEnums.Bitmaps.HEALERHOUSECUTSCENE);

                                    bMainCharacterHouseFinalTreasure = true;
                                }
                                break;
                            case TreasureNames.HEALERHOUSE:
                                bHealerHouse = true;

                                if (bHealerHouseFinalTreasure == false) {

                                    initDialog(RPGEnums.Bitmaps.HEALERHOUSECUTSCENE);

                                    bHealerHouseFinalTreasure = true;
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }

                window.Treasure = Treasure;
            }());
        }());

        this.getFightTextDisplay = function () {

            var nCurrentFrame = Math.max(nAttackFrameOne, nAttackFrameTwo, nAttackFrameThree);

            //allow for one round of attack before displaying
            if (nCurrentFrame == 1 || nCurrentFrame == nFPS + 1) {
                stage.removeChild(fightTextDisplay);

                fightTextDisplay = new createjs.Text(strFightTextDisplay, largeFont, lightFontColor);

                fightTextDisplay.x = nScreenCenterX;
                fightTextDisplay.y = nScreenCenterY - fightTextDisplay.getMeasuredHeight();

                fightTextDisplay.textBaseline = "bottom";
                fightTextDisplay.textAlign = "center";

                stage.addChild(fightTextDisplay);
            }
        }

        this.getRPGButton = function (label, color, x, y, strType) {
            var button = new RPGButton(label, color, strType);

            //set the center position this item
            button.x = x;
            button.y = y;

            //get the width of the button as the width of the text item
            var width = button.text.getMeasuredWidth() + button.nOffsetX;
            var height = button.text.getMeasuredHeight() + button.nOffsetY;

            //set the registry of this as the center of the item
            button.regX = width / 2;
            button.regY = height / 2;

            stage.addChild(button);
        }
        //RPG Button Prototype
        this.RPGButton = (function () {

            var bAttackTwoAllowed, bAttackThreeAllowed;

            var RPGButton = function (strAction, color, strType) {
                this.initialize(strAction, color, strType);
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
            m_RPGButton
            m_RPGButton.Container_initialize = m_RPGButton.initialize;
            m_RPGButton.initialize = function (strAction, color, strType) {
                this.Container_initialize();

                this.strAction = strAction;
                this.strType = strType;

                if (strType == RPGEnums.UIButtonTypes.TIMED) {
                    var strActionTemp;

                    switch (strAction) {
                        case RPGEnums.UIButtonActions.ATTACKONE:
                            strActionTemp = getSpecialAttackOne();
                            break;
                        case RPGEnums.UIButtonActions.ATTACKTWO:
                            strActionTemp = getSpecialAttackTwo();
                            break;
                        case RPGEnums.UIButtonActions.ATTACKTHREE:
                            strActionTemp = getSpecialAttackThree();
                            break;
                        case RPGEnums.UIButtonActions.RUN:
                            strActionTemp = strAction;
                            break;
                        default:
                            alert("Not all cases caught in RPGButton.initialize()")
                            break;
                    }

                    this.text = new createjs.Text(strActionTemp, font, darkFontColor);
                }
                else
                    this.text = new createjs.Text(strAction, font, darkFontColor);

                this.text.textBaseline = "middle";
                this.text.textAlign = "center";

                var width = this.text.getMeasuredWidth() + this.nOffsetX;
                var height = this.text.getMeasuredHeight() + this.nOffsetY;

                background = new createjs.Shape();
                background.graphics.beginFill(color).beginRadialGradientStroke(["black", "dimGray"], [0, 1], width / 2, height, height, width / 2, 0, 0).drawRoundRect(0, 0, width, height, 10);

                this.text.x = width / 2 + 1;
                this.text.y = height / 2 - 1;

                this.addEventListener("click", handleClick);
                this.addEventListener("tick", handleTick);

                this.addChild(background, this.text);

                //clicking children of the button (background & label) dispatches the click event with the button as the target instead of the child that was clicked
                this.mouseChildren = true;
            }

            function handleClick(event) {
                var target = event.currentTarget;

                switch (target.strAction) {
                    case RPGEnums.UIButtonActions.STARTGAME:
                        //start the game
                        bGameStarted = true;
                        bMovementFlag = true;
                        stage.removeChild(event.currentTarget);
                        break;

                    case RPGEnums.UIButtonActions.LEAVEBATTLEMAP:
                    case RPGEnums.UIButtonActions.RUN:
                        if (bAttackAnimationInProgress == false) {
                            nFightRound = -1;
                            RPGAttack.endFight();
                        }
                        break;

                    case RPGEnums.UIButtonActions.ATTACKONE:
                        if (bAttackAnimationInProgress == false) {
                            bAttackAnimationInProgress = true;
                            nFightRound++;

                            //this is caught on tick and will animate the attack
                            nAttackFrameOne = 0;
                            nAttackFrameTwo = -1;
                            nAttackFrameThree = -1;
                        }
                        break;

                    case RPGEnums.UIButtonActions.ATTACKTWO:

                        if (bAttackTwoAllowed == true && bAttackAnimationInProgress == false) {
                            bAttackAnimationInProgress = true;
                            target.nLastAttackTwo = nFightRound;

                            //this is caught on tick and will animate the attack
                            nAttackFrameOne = -1;
                            nAttackFrameTwo = 0;
                            nAttackFrameThree = -1;
                        }

                        break;

                    case RPGEnums.UIButtonActions.ATTACKTHREE:

                        if (bAttackThreeAllowed == true && bAttackAnimationInProgress == false) {
                            bAttackAnimationInProgress = true;
                            target.nLastAttackThree = nFightRound;

                            //this is caught on tick and will animate the attack
                            nAttackFrameOne = -1;
                            nAttackFrameTwo = -1;
                            nAttackFrameThree = 0;
                        }

                        break;

                    default:
                        alert("Not all switch cases caught in FlashingButton.handleClick() : " + target.strAction);
                        break;
                }
            }

            function handleTick(event) {
                var target = event.currentTarget;

                //Clear all Buttons
                if (nFightRound == -1) {
                    stage.removeChild(event.currentTarget);
                }
                    //Or Handle drawing all Buttons
                else {
                    switch (target.strType) {
                        case RPGEnums.UIButtonTypes.FLASHING:
                            target.alpha = Math.cos(target.count++ * 0.04) * 0.2 + 0.8;
                            break;

                        case RPGEnums.UIButtonTypes.TIMED:
                            if (bAttackAnimationInProgress == false) {
                                if (target.strAction == RPGEnums.UIButtonActions.ATTACKONE || target.strAction == RPGEnums.UIButtonActions.RUN) {
                                    //these events are always available if done animating
                                    target.alpha = 1;
                                }

                                if (target.strAction == RPGEnums.UIButtonActions.ATTACKTWO) {
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

                                if (target.strAction == RPGEnums.UIButtonActions.ATTACKTHREE) {
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
                }
            }

            function getSpecialAttackOne() {
                switch (strMainCharacterType) {
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
                switch (strMainCharacterType) {
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
                switch (strMainCharacterType) {
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
    }

    //*****************************ATTACK*******************************

    var RPGAttack = new function () {
        var nMageRandom;
        var bEnemyRangeAttack;

        var bAttackMovementObjectCreated, bEnemyAttackMovementObjectCreated, bAttackWeaponCreated;

        this.init = function () {
            //fight variables
            bAttackMovementObjectCreated = false;
            bEnemyAttackMovementObjectCreated = false;
            bAttackWeaponCreated = false;
        }

        this.drawSpecialAttackOne = function () {

            nAttackFrameOne++;

            if (nAttackFrameOne >= nFPS) {
                gotoNPCAttack();
            }
            else {

                switch (strMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:


                        var nMeleeStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nMeleeEndPositionX = npcFightCharacterAnimation.x - nMeleeAttackOffset;

                        if (nAttackFrameOne < nFPS * .2) {
                            if (bAttackWeaponCreated == false) {
                                setAttackRound(false);

                                drawAttackWeapon(RPGEnums.Bitmaps.WARRIORSWORD);
                                bAttackWeaponCreated = true;
                            }
                        }
                        else if (nAttackFrameOne < nFPS * .4) {
                            drawExaggeratedMovementX(heroFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .2, nFPS * .2, nAttackFrameOne);
                            drawExaggeratedMovementX(attackWeapon, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .2, nFPS * .2, nAttackFrameOne);
                        }
                        else if (nAttackFrameOne < nFPS * .6) {
                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .2);
                            drawSmoothMovementX(attackWeapon, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .2);
                        }
                        else if (nAttackFrameOne < nFPS * .8) {
                            drawExaggeratedMovementX(heroFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .6, nFPS * .2, nAttackFrameOne);
                            drawExaggeratedMovementX(attackWeapon, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .6, nFPS * .2, nAttackFrameOne);
                        }
                        else {
                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .2);
                            drawSmoothMovementX(attackWeapon, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .2);
                        }

                        break;

                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:

                        var nRangedStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nRangedEndPositionX = nScreenCenterX + nMeleeAttackOffset + ((bEnemyRangeAttack == true) ? nRangeAttackOffset : 0) - 25;

                        if (bAttackMovementObjectCreated == false) {
                            setAttackRound(true);

                            drawAttackMovementObject(RPGEnums.SpriteTypes.MAGEDEATHBALL, true);
                            bAttackMovementObjectCreated = true;
                        }

                        if (nAttackFrameOne > nFPS * .2 && nAttackFrameOne < nFPS * .9) {

                            if (nAttackFrameOne == nFPS * .4) {
                                attackMovementObject.scaleX = 1.2;
                                attackMovementObject.scaleY = 1.2;
                                attackMovementObject.y -= 4;
                            }
                            else if (nAttackFrameOne == nFPS * .5) {
                                attackMovementObject.scaleX = 1.4;
                                attackMovementObject.scaleY = 1.4;
                                attackMovementObject.y -= 4;
                            }

                            drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX, nFPS * .2, nFPS * .7, nAttackFrameOne);
                        }

                        break;

                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:

                        var nMeleeStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nMeleeEndPositionX = npcFightCharacterAnimation.x - nMeleeAttackOffset;

                        if (nAttackFrameOne < nFPS * .4) {
                            if (bAttackWeaponCreated == false) {
                                setAttackRound(false);

                                drawAttackWeapon(RPGEnums.Bitmaps.THIEFSWORD);
                                bAttackWeaponCreated = true;
                            }
                        }
                        else if (nAttackFrameOne < nFPS * .6) {
                            drawExaggeratedMovementX(heroFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .4, nFPS * .2, nAttackFrameOne);
                            drawExaggeratedMovementX(attackWeapon, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * .4, nFPS * .2, nAttackFrameOne);
                        }
                        else {
                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .42);
                            drawSmoothMovementX(attackWeapon, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .42);
                        }

                        break;

                    default:
                        alert("Not all cases caught in drawSpecialAttackOne()");
                        break;
                }
            }
        }

        this.drawSpecialAttackTwo = function () {

            var nMeleeStartPositionX = nScreenCenterX - nMeleeAttackOffset;
            var nMeleeEndPositionX = npcFightCharacterAnimation.x - nMeleeAttackOffset;

            nAttackFrameTwo++;

            if (nAttackFrameTwo >= nFPS) {
                gotoNPCAttack();
            }
            else {
                switch (strMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:

                        var nRangedStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nRangedEndPositionX = nScreenCenterX + nMeleeAttackOffset + ((bEnemyRangeAttack == true) ? nRangeAttackOffset : 0) - 15;

                        if (nAttackFrameTwo == 1) {
                            setAttackRound(true);
                        }

                        if (bAttackWeaponCreated == false) {
                            drawAttackWeapon(RPGEnums.Bitmaps.BOW);
                            bAttackWeaponCreated = true;
                        }

                        if (bAttackMovementObjectCreated == false) {
                            drawAttackMovementObject(RPGEnums.Bitmaps.ARROW, true);
                            bAttackMovementObjectCreated = true;
                        }

                        if (nAttackFrameTwo > nFPS * .2 && nAttackFrameTwo < nFPS * .9) {
                            drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX, nFPS * .2, nFPS * .7, nAttackFrameTwo);
                        }

                        break;

                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:

                        if (nAttackFrameTwo == 1) {
                            setAttackRound(true);
                        }

                        if (bAttackMovementObjectCreated == false) {
                            drawAttackMovementObject(RPGEnums.SpriteTypes.MAGEFIREATTACK, true);
                            bAttackMovementObjectCreated = true;
                        }

                        if (nAttackFrameTwo == nFPS * .25)
                            attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATEBOTTOMMIDDLE);
                        else if (nAttackFrameTwo == nFPS * .5)
                            attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATETOPMIDDLE);
                        else if (nAttackFrameTwo == nFPS * .75)
                            attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATETOP);

                        break;

                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:

                        var nRangedStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nRangedEndPositionX = nScreenCenterX + nMeleeAttackOffset + ((bEnemyRangeAttack == true) ? nRangeAttackOffset : 0) - 25;

                        if (nAttackFrameTwo == 1) {
                            setAttackRound(true);
                        }

                        if (bAttackMovementObjectCreated == false) {
                            drawAttackMovementObject(RPGEnums.SpriteTypes.HEROTHROWINGKNIFE, true);
                            bAttackMovementObjectCreated = true;
                        }

                        if (nAttackFrameTwo > nFPS * .2 && nAttackFrameTwo < nFPS * .8) {
                            if (nAttackFrameTwo == nFPS * .25)
                                attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATE);

                            drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX, nFPS * .2, nFPS * .6, nAttackFrameTwo);
                        }

                        if (nAttackFrameTwo == nFPS * .85)
                            attackMovementObject.gotoAndPlay(RPGEnums.Animations.STOP);

                        break;

                    default:
                        alert("Not all cases caught in drawSpecialAttackTwo()");
                        break;
                }
            }
        }

        this.drawSpecialAttackThree = function () {
            nAttackFrameThree++;

            if (nAttackFrameThree >= nFPS) {
                gotoNPCAttack();
            }
            else {

                switch (strMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:

                        var nMeleeStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                        var nMeleeEndPositionX = npcFightCharacterAnimation.x - nMeleeAttackOffset;

                        if (nAttackFrameThree < nFPS * .3) {
                            if (bAttackWeaponCreated == false) {
                                setAttackRound(false);

                                drawAttackWeapon(RPGEnums.Bitmaps.WARRIORSWORD);
                                bAttackWeaponCreated = true;
                            }

                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeStartPositionX, nMeleeStartPositionX - nMeleeAttackOffset * 4, nFPS * .3);
                            drawSmoothMovementX(attackWeapon, nMeleeStartPositionX, nMeleeStartPositionX - nMeleeAttackOffset * 4, nFPS * .3);
                        }
                        else if (nAttackFrameThree < nFPS * .7) {

                            if (nAttackFrameThree == nFPS * .35)
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.SPIN);

                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeStartPositionX - nMeleeAttackOffset * 4, nMeleeEndPositionX, nFPS * .4);
                            drawSmoothMovementX(attackWeapon, nMeleeStartPositionX - nMeleeAttackOffset * 4, nMeleeEndPositionX, nFPS * .4);
                            drawParabolicMovementY(heroFightCharacterAnimation, npcFightCharacterAnimation.y, 200, nFPS * .3, nFPS * .4, nAttackFrameThree);
                            drawParabolicMovementY(attackWeapon, npcFightCharacterAnimation.y, 200, nFPS * .3, nFPS * .4, nAttackFrameThree);
                        }
                        else if (nAttackFrameThree < nFPS * .9) {
                            if (nAttackFrameThree == nFPS * .8)
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNRIGHT);

                            drawParabolicMovementY(heroFightCharacterAnimation, npcFightCharacterAnimation.y, 80, nFPS * .7, nFPS * .2, nAttackFrameThree);
                            drawParabolicMovementY(attackWeapon, npcFightCharacterAnimation.y, 80, nFPS * .7, nFPS * .2, nAttackFrameThree);
                        }
                        else if (nAttackFrameThree < nFPS) {
                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                            drawSmoothMovementX(attackWeapon, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                        }

                        break;

                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:

                        if (bAttackWeaponCreated == false) {
                            setAttackRound(true);

                            drawAttackWeapon(RPGEnums.Bitmaps.CLOUD);
                            bAttackWeaponCreated = true;
                        }

                        if (bAttackMovementObjectCreated == false) {
                            drawAttackMovementObject(RPGEnums.Bitmaps.LIGHTNINGBOLT);
                            bAttackMovementObjectCreated = true;
                        }

                        if (nAttackFrameThree == nFPS * .2) {
                            stage.removeChild(attackMovementObject);
                        }
                        else if (nAttackFrameThree == nFPS * .4) {
                            drawAttackMovementObject(RPGEnums.Bitmaps.LIGHTNINGBOLT);
                        }
                        else if (nAttackFrameThree == nFPS * .6) {
                            stage.removeChild(attackMovementObject);
                        }
                        else if (nAttackFrameThree == nFPS * .65) {
                            drawAttackMovementObject(RPGEnums.Bitmaps.LIGHTNINGBOLT);
                        }
                        else if (nAttackFrameThree == nFPS * .75) {
                            stage.removeChild(attackMovementObject);
                        }
                        else if (nAttackFrameThree == nFPS * .8) {
                            drawAttackMovementObject(RPGEnums.Bitmaps.LIGHTNINGBOLT);
                        }

                        break;

                    case RPGEnums.CharacterTypes.MALETHIEF:
                    case RPGEnums.CharacterTypes.FEMALETHIEF:

                        var nCharSetOffset = ((bIsMainCharacterType == true) ? 0 : 0);

                        if (bAttackWeaponCreated == false) {
                            setAttackRound(false);

                            drawAttackWeapon(RPGEnums.Bitmaps.THIEFSWORD);
                            bAttackWeaponCreated = true;
                        }

                        if (nAttackFrameThree > nFPS * .1 && nAttackFrameThree < nFPS * .3) {
                            if (nAttackFrameThree == nFPS * .1 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNLEFT);
                                heroFightCharacterAnimation.y -= 3;
                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x + nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree < nFPS * .4) {
                            if (nAttackFrameThree == nFPS * .3 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNRIGHT);
                                if (strMainCharacterType == RPGEnums.CharacterTypes.MALETHIEF)
                                    heroFightCharacterAnimation.y += 3;

                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            var bIsMainCharacterType = RPGEnums.isAMainCharacterType();
                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x - nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree < nFPS * .5) {
                            if (nAttackFrameThree == nFPS * .4 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNLEFT);
                                heroFightCharacterAnimation.y -= 3;
                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x + nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree < nFPS * .7) {
                            if (nAttackFrameThree == nFPS * .5 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNRIGHT);
                                heroFightCharacterAnimation.y += 3;
                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x - nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree < nFPS * .8) {
                            if (nAttackFrameThree == nFPS * .7 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNLEFT);
                                heroFightCharacterAnimation.y -= 3;
                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x + nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree < nFPS * .9) {
                            if (nAttackFrameThree == nFPS * .8 + 1) {
                                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNRIGHT);
                                heroFightCharacterAnimation.y += 3;
                                attackWeapon.scaleX = -attackWeapon.scaleX;
                            }

                            heroFightCharacterAnimation.x = npcFightCharacterAnimation.x - nMeleeAttackOffset + nCharSetOffset;
                            attackWeapon.x = heroFightCharacterAnimation.x;
                        }
                        else if (nAttackFrameThree >= nFPS * .9) {
                            var nMeleeStartPositionX = nScreenCenterX - nMeleeAttackOffset;
                            var nMeleeEndPositionX = npcFightCharacterAnimation.x - nMeleeAttackOffset + nCharSetOffset;

                            drawSmoothMovementX(heroFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                            drawSmoothMovementX(attackWeapon, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                        }


                        break;

                    default:
                        alert("Not all cases caught in drawSpecialAttackThree()");
                        break;
                }
            }
        }

        var gotoNPCAttack = function () {
            if (bAttackMovementObjectCreated == true) {
                stage.removeChild(attackMovementObject);
                bAttackMovementObjectCreated = false;
            }

            //if (bAttackWeaponCreated == true) {
            //    stage.removeChild(attackWeapon);
            //    bAttackWeaponCreated = false;
            //}

            if (npcCharacterObject.nHealth <= 0) {
                RPGAttack.endFight();
                return;
            }
            else if (heroCharacterObject.nHealth <= 0) {
                RPGAttack.endFight();
                return;
            }

            if (bEnemyAttackAnimationInProgress == false)
                handleAttack(false);

            bEnemyAttackAnimationInProgress = true;
            drawEnemyAttack();
        }

        this.endFight = function () {
            nAttackFrameOne = -1;
            nAttackFrameTwo = -1;
            nAttackFrameThree = -1;

            bEnemyAttackAnimationInProgress = false;
            bAttackAnimationInProgress = false;
            bAttackWeaponCreated = false;
            bEnemyAttackMovementObjectCreated = false;

            //if the hero is still alive and did not run
            if (heroFightDisplay.characterObject.nHealth > 0 && nFightRound != -1) {
                nFightRound = -1;
                nExperiencePoints += 100;

                if (bAtTreasure == true) {
                    strMovementMap = RPGEnums.MovementMaps.TERRAIN;
                    bAtTreasure = false;
                }

                initMovementMap(strMovementMap, false);
            }
            //hero died
            else if (heroFightDisplay.characterObject.nHealth <= 0 && nFightRound != -1) {
                nFightRound = -1;
                strMovementMap = RPGEnums.MovementMaps.TERRAIN;
                bAtTreasure = false;

                initMovementMap(strMovementMap, true);
            }
            //hero ran
            else {
                nFightRound = -1;

                if (bAtTreasure == true) {
                    strMovementMap = RPGEnums.MovementMaps.TERRAIN;
                    bAtTreasure = false;
                }

                initMovementMap(strMovementMap, false);
            }
        }

        var handleAttack = function (bIsHero) {
            var nDamageDone, nMinDamage, nMaxDamage, nCritChance, nMissChance, nTargetArmor;

            if (bIsHero == true) {
                nMinDamage = heroCharacterObject.nMinDamage;
                nMaxDamage = heroCharacterObject.nMaxDamage;
                nCritChance = 10 + heroCharacterObject.nLevel;
                nMissChance = 5;
                nTargetArmor = npcCharacterObject.nArmor;
            }
            else {
                nMinDamage = npcCharacterObject.nMinDamage;
                nMaxDamage = npcCharacterObject.nMaxDamage;
                nCritChance = 5 + npcCharacterObject.nLevel;
                nMissChance = 10;
                nTargetArmor = heroCharacterObject.nArmor;
            }

            //attack two ignores armor
            if (nAttackFrameTwo >= 0)
                nTargetArmor = 0;

            var nRandom = Math.floor((Math.random() * 100) + 1);

            //hit
            if (nRandom < 100 - nMissChance) {
                nDamageDone = Math.floor((Math.random() * (nMaxDamage - nMinDamage)) + nMinDamage) - nTargetArmor;

                //crit check
                nRandom = Math.floor((Math.random() * 100) + 1);
                if (nRandom < nCritChance) {
                    nDamageDone = Math.floor(nDamageDone * 1.5);
                }

                //attack three does triple damage
                if (nAttackFrameThree >= 0)
                    nDamageDone = nDamageDone * 3;

                if (bIsHero == true)
                    strFightTextDisplay = 'You ' + ((nRandom < nCritChance) ? 'Smash ' : 'Attack ') + 'the Enemy\n\nAnd Do ' + nDamageDone + ' Damage';
                else
                    strFightTextDisplay = 'The Enemy ' + ((nRandom < nCritChance) ? 'Crits ' : 'Attacks ') + 'You\n\nAnd Does ' + nDamageDone + ' Damage';
            }
            //miss
            else {
                nDamageDone = 0;

                if (bIsHero == true)
                    strFightTextDisplay = 'You Attack the Enemy\n\nAnd Miss';
                else
                    strFightTextDisplay = 'The Enemy Attacks You\n\nAnd Misses';
            }

            if (bIsHero == true)
                npcFightDisplay.updateHealth(-nDamageDone);
            else
                heroFightDisplay.updateHealth(-nDamageDone);

        }

        var drawEnemyAttack = function () {
            var nCurrentFrame = Math.max(nAttackFrameOne, nAttackFrameTwo, nAttackFrameThree);

            //Enemy Turns will take half the length
            if (nCurrentFrame >= nFPS * 1.5) {
                if (bAttackWeaponCreated == true) {
                    stage.removeChild(attackWeapon);
                    bAttackWeaponCreated = false;
                }

                if (bEnemyAttackMovementObjectCreated == true) {
                    stage.removeChild(attackMovementObject);
                    bEnemyAttackMovementObjectCreated = false;
                }

                heroFightCharacterAnimation.x = nStaticImageInset * 6;
                npcFightCharacterAnimation.x = nScreenWidth - nStaticImageInset * 6;
                heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNDOWN);
                npcFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNDOWN);
                nAttackFrameOne = -1;
                nAttackFrameTwo = -1;
                nAttackFrameThree = -1;

                bAttackAnimationInProgress = false;
                bEnemyAttackAnimationInProgress = false;

                stage.removeChild(fightTextDisplay);

                if (npcCharacterObject.nHealth <= 0)
                    RPGAttack.endFight();
                else if (heroCharacterObject.nHealth <= 0)
                    RPGAttack.endFight();
            }
            else {
                var nMainMeleeAttackOffset;

                if (strMainCharacterType.indexOf("Mage") != -1 || nAttackFrameTwo > 0) {
                    nMainMeleeAttackOffset = nRangeAttackOffset - 5;
                }
                else {
                    nMainMeleeAttackOffset = 5;
                }

                if (bEnemyRangeAttack == true) {
                    var nRangedStartPositionX = nScreenCenterX + nMeleeAttackOffset;
                    var nRangedEndPositionX = nScreenCenterX - nMeleeAttackOffset - nMainMeleeAttackOffset;

                    switch (RPGEnums.MonsterTypes.properties[nEnemyMonsterType].type) {
                        case "W":
                            //Warrior Enemy Spear
                            if (bEnemyAttackMovementObjectCreated == false) {
                                drawAttackMovementObject(RPGEnums.Bitmaps.SPEAR, false);
                                bEnemyAttackMovementObjectCreated = true;
                            }

                            if (nCurrentFrame > nFPS * 1.1 && nCurrentFrame < nFPS * 1.4) {
                                drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX + 15, nFPS * 1.1, nFPS * .3, nCurrentFrame);
                                drawParabolicMovementY(attackMovementObject, npcFightCharacterAnimation.y, 25, nFPS * 1.1, nFPS * .3, nCurrentFrame)
                            }
                            break;
                        case "T":
                            //Thief Enemy Throwing Knife
                            if (bEnemyAttackMovementObjectCreated == false) {
                                drawAttackMovementObject(RPGEnums.SpriteTypes.ENEMYTHROWINGKNIFE, false);
                                bEnemyAttackMovementObjectCreated = true;
                            }

                            if (nCurrentFrame > nFPS * 1.1 && nCurrentFrame < nFPS * 1.4) {
                                if (nCurrentFrame == nFPS * 1.1 + 1)
                                    attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATE);

                                drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX, nFPS * 1.1, nFPS * .3, nCurrentFrame);
                            }

                            if (nCurrentFrame == nFPS * 1.45)
                                attackMovementObject.gotoAndPlay(RPGEnums.Animations.STOP);
                            break;
                        case "M":
                            if (nMageRandom == 1) {
                                //Mage Enemy IceBall
                                if (bEnemyAttackMovementObjectCreated == false) {
                                    drawAttackMovementObject(RPGEnums.SpriteTypes.MAGEICEBALL, false);
                                    bEnemyAttackMovementObjectCreated = true;
                                }

                                if (nCurrentFrame > nFPS * 1.1) {

                                    if (nCurrentFrame == nFPS * 1.2) {
                                        attackMovementObject.scaleX = 1.2;
                                        attackMovementObject.scaleY = 1.2;
                                        attackMovementObject.y -= 4;
                                    }
                                    else if (nCurrentFrame == nFPS * 1.25) {
                                        attackMovementObject.scaleX = 1.4;
                                        attackMovementObject.scaleY = 1.4;
                                        attackMovementObject.y -= 4;
                                    }

                                    drawExaggeratedMovementX(attackMovementObject, nRangedStartPositionX, nRangedEndPositionX, nFPS * 1.1, nFPS * .4, nCurrentFrame);
                                }
                            }
                            else {
                                //Mage Enemy IceAttack
                                if (bEnemyAttackMovementObjectCreated == false) {
                                    drawAttackMovementObject(RPGEnums.SpriteTypes.MAGEICEATTACK, false);
                                    bEnemyAttackMovementObjectCreated = true;
                                }

                                if (nCurrentFrame == nFPS * 1.1)
                                    attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATEBOTTOMMIDDLE);
                                else if (nCurrentFrame == nFPS * 1.2)
                                    attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATETOPMIDDLE);
                                else if (nCurrentFrame == nFPS * 1.3)
                                    attackMovementObject.gotoAndPlay(RPGEnums.Animations.ANIMATETOP);
                            }
                            break;

                        default:
                            alert("Not all cases caught in drawEnemyAttack() Ranged:" + RPGEnums.MonsterTypes.properties[nEnemyMonsterType].type);
                            break;
                    }
                }
                else {
                    var nMeleeStartPositionX = nScreenCenterX + nMeleeAttackOffset;
                    var nMeleeEndPositionX = nScreenCenterX - nMainMeleeAttackOffset;

                    switch (RPGEnums.MonsterTypes.properties[nEnemyMonsterType].type) {
                        case "W":
                            //Warrior Enemy Double Strike
                            if (nCurrentFrame < nFPS * 1.15) {
                                drawExaggeratedMovementX(npcFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS, nFPS * .15, nCurrentFrame);
                            }
                            else if (nCurrentFrame < nFPS * 1.25) {
                                drawSmoothMovementX(npcFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                            }
                            else if (nCurrentFrame < nFPS * 1.4) {
                                drawExaggeratedMovementX(npcFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * 1.25, nFPS * .15, nCurrentFrame);
                            }
                            else {
                                drawSmoothMovementX(npcFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .1);
                            }
                            break;
                        case "T":
                            //Thief Enemy Slash
                            if (nCurrentFrame < nFPS * 1.15) {

                            }
                            else if (nCurrentFrame < nFPS * 1.35) {
                                drawExaggeratedMovementX(npcFightCharacterAnimation, nMeleeStartPositionX, nMeleeEndPositionX, nFPS * 1.15, nFPS * .2, nCurrentFrame);
                            }
                            else {
                                drawSmoothMovementX(npcFightCharacterAnimation, nMeleeEndPositionX, nMeleeStartPositionX, nFPS * .15);
                            }
                            break;

                        default:
                            alert("Not all cases caught in drawEnemyAttack() Melee");
                            break;
                    }
                }
            }
        }

        var setAttackRound = function (bHeroRangedAttack) {
            bAttackMovementObjectCreated = false;
            bEnemyAttackMovementObjectCreated = false;
            bAttackWeaponCreated = false;

            if (RPGEnums.MonsterTypes.properties[nEnemyMonsterType].type == "M" || Math.floor(Math.random() * 2) == 1)
                bEnemyRangeAttack = true;
            else
                bEnemyRangeAttack = false;

            nMageRandom = Math.floor(Math.random() * 2);

            var nEnemyRangeOffset = ((bEnemyRangeAttack == true) ? nRangeAttackOffset : 0);

            heroFightCharacterAnimation.x = nScreenCenterX - nMeleeAttackOffset + ((bHeroRangedAttack == true) ? -nRangeAttackOffset : 0);
            npcFightCharacterAnimation.x = nScreenCenterX + nMeleeAttackOffset + nEnemyRangeOffset;

            heroFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNRIGHT);
            npcFightCharacterAnimation.gotoAndPlay(RPGEnums.Animations.RUNLEFT);

            handleAttack(true);
        }

        var drawSmoothMovementX = function (displayObject, nStartX, nDestinationX, nFrames) {
            var nMovementSize = Math.abs(nStartX - nDestinationX) / nFrames;

            displayObject.x += (nDestinationX > displayObject.x ? nMovementSize : -nMovementSize);
        }

        var drawExaggeratedMovementX = function (displayObject, nStartX, nDestinationX, nStartFrame, nFrameCount, nCurrentFrameCount) {
            var nMovementSize = Math.abs(nStartX - nDestinationX) / nFrameCount;

            if (nCurrentFrameCount - nStartFrame < nFrameCount / 2)
                displayObject.x += (nDestinationX > displayObject.x ? nMovementSize / 2 : -nMovementSize / 2);
            else
                displayObject.x += (nDestinationX > displayObject.x ? nMovementSize * 2 : -nMovementSize * 2);
        }

        var drawParabolicMovementY = function (displayObject, nStartY, nJumpHeight, nStartFrame, nFrameCount, nCurrentFrameCount) {
            var nMovementSize = (nJumpHeight * 2) / nFrameCount;

            if (nCurrentFrameCount - nStartFrame < nFrameCount * (1 / 4))
                displayObject.y -= nMovementSize;
            else if (nCurrentFrameCount - nStartFrame < nFrameCount * (1 / 2)) {
                displayObject.y -= nMovementSize / 2;
            }
            else if (nCurrentFrameCount - nStartFrame < nFrameCount * (3 / 4)) {
                displayObject.y += nMovementSize / 2;
            }
            else
                displayObject.y += nMovementSize;
        }

        var drawAttackWeapon = function (spriteType) {

            if (npcCharacterObject.nHealth <= 0 || heroCharacterObject.nHealth <= 0)
                return;

            attackWeapon = new createjs.Bitmap(queue.getResult(spriteType));

            attackWeapon.x = heroFightCharacterAnimation.x;
            attackWeapon.y = heroFightCharacterAnimation.y;

            switch (spriteType) {
                case RPGEnums.Bitmaps.BOW:

                    attackWeapon.scaleX = .5;
                    attackWeapon.scaleY = .5;

                    attackWeapon.regX = attackWeapon.image.width / 2 - 30;
                    attackWeapon.regY = attackWeapon.image.height / 2;
                    break;

                case RPGEnums.Bitmaps.CLOUD:
                    attackWeapon.x = nScreenCenterX + 50;
                    attackWeapon.y = npcFightCharacterAnimation.y - 180;

                    attackWeapon.scaleX = 5;
                    attackWeapon.scaleY = 2;

                    attackWeapon.regX = attackWeapon.image.width / 2;
                    attackWeapon.regY = attackWeapon.image.height / 2;
                    break;

                case RPGEnums.Bitmaps.THIEFSWORD:

                    attackWeapon.scaleX = 1.1;
                    attackWeapon.scaleY = 1.1;

                    attackWeapon.regX = attackWeapon.image.width / 2 - 22;
                    attackWeapon.regY = attackWeapon.image.height / 2 - 2;

                    break;

                case RPGEnums.Bitmaps.WARRIORSWORD:

                    attackWeapon.scaleX = .8;
                    attackWeapon.scaleY = .8;

                    attackWeapon.regX = attackWeapon.image.width / 2 - 48;
                    attackWeapon.regY = attackWeapon.image.height / 2 + 5;

                    break;

                default:
                    alert("Not all cases caught in drawAttackWeapon()")
                    return;
            }

            stage.addChild(attackWeapon);
        }

        var drawAttackMovementObject = function (spriteType, bHero) {

            if (npcCharacterObject.nHealth <= 0 || heroCharacterObject.nHealth <= 0)
                return;

            switch (spriteType) {

                case RPGEnums.Bitmaps.ARROW:

                    attackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    attackMovementObject.x = ((bHero == true) ? heroFightCharacterAnimation.x : npcFightCharacterAnimation.x);
                    attackMovementObject.y = heroFightCharacterAnimation.y;
                    attackMovementObject.scaleX = .4;
                    attackMovementObject.scaleY = .4;
                    attackMovementObject.regX = attackMovementObject.image.width / 2 + ((bHero == true) ? -25 : 0);
                    attackMovementObject.regY = attackMovementObject.image.height / 2;

                    break;

                case RPGEnums.SpriteTypes.ENEMYTHROWINGKNIFE:

                    var tempAttackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    var data = {
                        images: [queue.getResult(spriteType)],
                        frames: { width: tempAttackMovementObject.image.width / 4, height: tempAttackMovementObject.image.height },
                        // animations 0-5, loop always, framerate
                        animations: {
                            animate: [0, 3, true, .24 * dAnimationSpeedOffset],
                            stop: 0
                        }
                    };
                    var spriteSheet = new createjs.SpriteSheet(data);
                    attackMovementObject = new createjs.Sprite(spriteSheet, RPGEnums.Animations.STOP);

                    //enemy only weapon
                    attackMovementObject.x = npcFightCharacterAnimation.x;
                    attackMovementObject.y = npcFightCharacterAnimation.y;
                    attackMovementObject.scaleX = 1.8;
                    attackMovementObject.scaleY = 1.8;
                    attackMovementObject.regX = tempAttackMovementObject.image.width / 8 + 5;
                    attackMovementObject.regY = tempAttackMovementObject.image.height / 2;

                    break;

                case RPGEnums.SpriteTypes.HEROTHROWINGKNIFE:

                    var tempAttackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    var data = {
                        images: [queue.getResult(spriteType)],
                        frames: { width: tempAttackMovementObject.image.width / 4, height: tempAttackMovementObject.image.height },
                        // animations 0-5, loop always, framerate
                        animations: {
                            animate: [0, 3, true, .26 * dAnimationSpeedOffset],
                            stop: 1
                        }
                    };
                    var spriteSheet = new createjs.SpriteSheet(data);
                    attackMovementObject = new createjs.Sprite(spriteSheet, RPGEnums.Animations.STOP);

                    //hero only weapon
                    attackMovementObject.x = heroFightCharacterAnimation.x;
                    attackMovementObject.y = heroFightCharacterAnimation.y;
                    attackMovementObject.scaleX = 1.5;
                    attackMovementObject.scaleY = 1.5;
                    attackMovementObject.regX = tempAttackMovementObject.image.width / 8 - 21;
                    attackMovementObject.regY = tempAttackMovementObject.image.height / 2;

                    break;

                case RPGEnums.Bitmaps.LIGHTNINGBOLT:

                    attackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    attackMovementObject.x = npcFightCharacterAnimation.x + 15;
                    attackMovementObject.y = npcFightCharacterAnimation.y - 60;

                    attackMovementObject.scaleX = 1;
                    attackMovementObject.scaleY = 1.5;

                    attackMovementObject.regX = attackMovementObject.image.width / 2;
                    attackMovementObject.regY = attackMovementObject.image.height / 2;

                    break;

                case RPGEnums.SpriteTypes.MAGEDEATHBALL:
                case RPGEnums.SpriteTypes.MAGEICEBALL:

                    var tempAttackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    var data = {
                        images: [queue.getResult(spriteType)],
                        frames: { width: tempAttackMovementObject.image.width / 3, height: tempAttackMovementObject.image.height / 2 },
                        // animations 0-5, loop always, framerate
                        animations: {
                            animate: [0, 5, true, .125 * dAnimationSpeedOffset]
                        }
                    };
                    var spriteSheet = new createjs.SpriteSheet(data);
                    attackMovementObject = new createjs.Sprite(spriteSheet, RPGEnums.Animations.ANIMATE);

                    attackMovementObject.x = ((bHero == true) ? heroFightCharacterAnimation.x : npcFightCharacterAnimation.x);
                    attackMovementObject.y = heroFightCharacterAnimation.y;

                    attackMovementObject.regX = tempAttackMovementObject.image.width / 6 + ((bHero == true) ? -20 : 10);
                    attackMovementObject.regY = tempAttackMovementObject.image.height / 4 - 4;

                    break;

                case RPGEnums.SpriteTypes.MAGEFIREATTACK:
                case RPGEnums.SpriteTypes.MAGEICEATTACK:

                    var tempAttackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    var data = {
                        images: [queue.getResult(spriteType)],
                        frames: { width: tempAttackMovementObject.image.width / 3, height: tempAttackMovementObject.image.height / 4 },
                        // animations 0-11, loop always, framerate
                        animations: {
                            animateTop: [0, 2, true, .125 * dAnimationSpeedOffset],
                            animateTopMiddle: [3, 5, true, .125 * dAnimationSpeedOffset],
                            animateBottomMiddle: [6, 8, true, .125 * dAnimationSpeedOffset],
                            animateBottom: [9, 11, true, .125 * dAnimationSpeedOffset]
                        }
                    };
                    var spriteSheet = new createjs.SpriteSheet(data);
                    attackMovementObject = new createjs.Sprite(spriteSheet, RPGEnums.Animations.ANIMATEBOTTOM);


                    attackMovementObject.x = ((bHero == true) ? npcFightCharacterAnimation.x : heroFightCharacterAnimation.x);
                    attackMovementObject.y = heroFightCharacterAnimation.y;
                    attackMovementObject.scaleX = 3;
                    attackMovementObject.scaleY = 2.2;
                    attackMovementObject.regX = tempAttackMovementObject.image.width / 6 + ((bHero == true) ? 2 : 0);
                    attackMovementObject.regY = tempAttackMovementObject.image.height / 8 + 3;

                    break;

                case RPGEnums.Bitmaps.SPEAR:

                    attackMovementObject = new createjs.Bitmap(queue.getResult(spriteType));

                    attackMovementObject.x = ((bHero == true) ? heroFightCharacterAnimation.x : npcFightCharacterAnimation.x);
                    attackMovementObject.y = heroFightCharacterAnimation.y;
                    attackMovementObject.scaleX = 1.2;
                    attackMovementObject.scaleY = 1.2;
                    attackMovementObject.regX = attackMovementObject.image.width / 2 + ((bHero == true) ? 0 : 0);
                    attackMovementObject.regY = attackMovementObject.image.height / 2;

                    break;




                default:
                    alert("Not all cases caught in drawAttackMovementObject()");
                    return;
            }

            stage.addChild(attackMovementObject);
        }

    }

    //*****************************MOVEMENT*******************************

    var RPGMovement = new function () {
        var pxColorLastR, pxColorLastG, pxColorLastB;

        this.init = function () {
            pxColorLastR = 0, pxColorLastG = 0, pxColorLastB = 0;
        }

        this.setCharacterDirection = function (event) {
            var nXDistance = Math.abs(event.stageX - mainCharacter.x);
            var nYDistance = Math.abs(event.stageY - mainCharacter.y);

            if (nXDistance < nYDistance && event.stageY < mainCharacter.y) { mainCharacter.gotoAndPlay(RPGEnums.Animations.RUNUP); }
            else if (nXDistance < nYDistance && event.stageY > mainCharacter.y) { mainCharacter.gotoAndPlay(RPGEnums.Animations.RUNDOWN); }
            else if (nXDistance > nYDistance && event.stageX < mainCharacter.x) { mainCharacter.gotoAndPlay(RPGEnums.Animations.RUNLEFT); }
            else if (nXDistance > nYDistance && event.stageX > mainCharacter.x) { mainCharacter.gotoAndPlay(RPGEnums.Animations.RUNRIGHT); }
        }

        this.checkMapMovement = function (event) {

            var nMoveX = (mainCharacter.x - nLastX);
            var nMovementSize = (nMoveX > 50 || nMoveX < -50) ? event.delta / 1000 * 115 : event.delta / 1000 * 60;

            var nX = dCharacterPointX;
            var nY = dCharacterPointY;

            if (nMoveX < -nMovementSize * 2) {
                if (checkMovementByColor(nMovementSize, "RIGHT")) {
                    //far left
                    if (nX + nMovementSize <= nScreenCenterX) {
                        mainCharacter.x += nMovementSize;
                    }
                        //middle
                    else if (nX < nBackgroundWidth - nScreenCenterX) {
                        terrain.x -= nMovementSize;
                        nLastX -= nMovementSize;
                    }
                        //far right
                    else if (nX + nMovementSize > nBackgroundWidth - nScreenCenterX) {
                        mainCharacter.x += nMovementSize;
                    }

                    mainCharacterMini.x += nMovementSize * dMiniMapScale / dMapScale;
                    dCharacterPointX += nMovementSize;

                    checkRandomFightChance();
                }
            }
            else if (nMoveX > nMovementSize * 2) {
                if (checkMovementByColor(nMovementSize, "LEFT")) {
                    //far right
                    if (nX - nMovementSize >= nBackgroundWidth - nScreenCenterX) {
                        mainCharacter.x -= nMovementSize;
                    }
                        //middle
                    else if (nX > nScreenCenterX) {
                        terrain.x += nMovementSize;
                        nLastX += nMovementSize;
                    }
                        //far left
                    else if (nX - nMovementSize < nScreenCenterX) {
                        mainCharacter.x -= nMovementSize;
                    }

                    mainCharacterMini.x -= nMovementSize * dMiniMapScale / dMapScale;
                    dCharacterPointX -= nMovementSize;

                    checkRandomFightChance();
                }
            }

            var nMoveY = (mainCharacter.y - nLastY);
            nMovementSize = (nMoveY > 75 || nMoveY < -75) ? event.delta / 1000 * 125 : event.delta / 1000 * 75;

            if (nMoveY < -nMovementSize * 2) {
                if (checkMovementByColor(nMovementSize, "UP")) {
                    //bottom
                    if (nY + nMovementSize >= nBackgroundHeight - nScreenCenterY) {
                        mainCharacter.y += nMovementSize;
                    }
                        //middle
                    else if (nY > nScreenCenterY) {
                        terrain.y -= nMovementSize;
                        nLastY -= nMovementSize;
                    }
                        //top
                    else if (nY + nMovementSize < nScreenCenterY) {
                        mainCharacter.y += nMovementSize;
                    }

                    mainCharacterMini.y += nMovementSize * dMiniMapScale / dMapScale;
                    dCharacterPointY += nMovementSize;

                    checkRandomFightChance();
                }
            }
            else if (nMoveY > nMovementSize * 2) {
                if (checkMovementByColor(nMovementSize, "DOWN")) {
                    //top
                    if (nY - nMovementSize <= nScreenCenterY) {
                        mainCharacter.y -= nMovementSize;
                    }
                        //middle
                    else if (nY < nBackgroundHeight - nScreenCenterY) {
                        terrain.y += nMovementSize;
                        nLastY += nMovementSize;
                    }
                        //bottom
                    else if (nY - nMovementSize > nBackgroundHeight - nScreenCenterY) {
                        mainCharacter.y -= nMovementSize;
                    }

                    mainCharacterMini.y -= nMovementSize * dMiniMapScale / dMapScale;
                    dCharacterPointY -= nMovementSize;

                    checkRandomFightChance();
                }
            }
            else if (!(nMoveX < -nMovementSize * 2) && !(nMoveX > nMovementSize * 2)) {
                mainCharacter.gotoAndPlay(RPGEnums.Animations.STAND);
            }

            //keep the treasure map in the right position
            treasureSet.x = terrain.x;
            treasureSet.y = terrain.y;
        }

        var checkRandomFightChance = function () {
            var nRandomFightChance = Math.floor((Math.random() * 1000) + 1);

            if (nRandomFightChance > 995) {
                var strCurrentFightScreen = RPGGlobals.getTerrainFightScreen();
                initFightScreen(strCurrentFightScreen);
            }
        }

        var setTerrainTypeByColor = function (pixelColor) {

            if (Math.abs(pixelColor[0] - pxColorLastR) > 0 || Math.abs(pixelColor[1] - pxColorLastG) > 0 || Math.abs(pixelColor[2] - pxColorLastB) > 0) {

                //Terrain
                if (RPGEnums.MapColors.BADLANDRGB[0] == pixelColor[0] && RPGEnums.MapColors.BADLANDRGB[1] == pixelColor[1] && RPGEnums.MapColors.BADLANDRGB[2] == pixelColor[2]) {
                    RPGGlobals.clearTerrainType();
                    bBadland = true;
                }

                else if (RPGEnums.MapColors.BEACHRGB[0] == pixelColor[0] && RPGEnums.MapColors.BEACHRGB[1] == pixelColor[1] && RPGEnums.MapColors.BEACHRGB[2] == pixelColor[2]) {
                    RPGGlobals.clearTerrainType();
                    bBeach = true;
                }

                else if (RPGEnums.MapColors.FORESTRGB[0] == pixelColor[0] && RPGEnums.MapColors.FORESTRGB[1] == pixelColor[1] && RPGEnums.MapColors.FORESTRGB[2] == pixelColor[2]) {
                    RPGGlobals.clearTerrainType();
                    bForest = true;
                }

                else if (RPGEnums.MapColors.GRASSLANDRGB[0] == pixelColor[0] && RPGEnums.MapColors.GRASSLANDRGB[1] == pixelColor[1] && RPGEnums.MapColors.GRASSLANDRGB[2] == pixelColor[2]) {
                    RPGGlobals.clearTerrainType();
                    bGrassland = true;
                }

                else if (RPGEnums.MapColors.MOUNTAINRGB[0] == pixelColor[0] && RPGEnums.MapColors.MOUNTAINRGB[1] == pixelColor[1] && RPGEnums.MapColors.MOUNTAINRGB[2] == pixelColor[2]) {
                    RPGGlobals.clearTerrainType();
                    bMountain = true;
                }


                    //All Final Treasure chests
                else if (RPGEnums.MapColors.FINALTERRAINTREASURERGB[0] == pixelColor[0] && RPGEnums.MapColors.FINALTERRAINTREASURERGB[1] == pixelColor[1] && RPGEnums.MapColors.FINALTERRAINTREASURERGB[2] == pixelColor[2]) {

                    dCharacterPointX = dMainMapSavedCharacterPointX;
                    dCharacterPointY = dMainMapSavedCharacterPointY;

                    bAtTreasure = true;

                    var strCurrentFightScreen = RPGGlobals.getTerrainFightScreen() + "FinalTreasure";
                    initFightScreen(strCurrentFightScreen);
                }

            }

            pxColorLastR = pixelColor[0];
            pxColorLastG = pixelColor[1];
            pxColorLastB = pixelColor[2];
        }

        var checkMovementByColor = function (nMovementSize, strDirection) {
            var bReturn = true;

            var nTop, nBottom, nLeft, nRight, nCenterX, nCenterY;
            var pixelColor;

            nTop = dCharacterPointY / dMapScale + mainCharacter.regY;
            nBottom = dCharacterPointY / dMapScale - mainCharacter.regY;
            nRight = dCharacterPointX / dMapScale + mainCharacter.regX;
            nLeft = dCharacterPointX / dMapScale - mainCharacter.regX;

            nCenterX = dCharacterPointX / dMapScale;
            nCenterY = dCharacterPointY / dMapScale;

            switch (strDirection) {
                case "UP":
                    pixelColor = collisionContext.getImageData(nCenterX, nCenterY - nMovementSize, 1, 1).data;
                    setTerrainTypeByColor(pixelColor);

                    pixelColor = collisionContext.getImageData(nRight, nTop - nMovementSize, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    pixelColor = collisionContext.getImageData(nLeft, nTop - nMovementSize, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    break;
                case "DOWN":
                    pixelColor = collisionContext.getImageData(nCenterX, nCenterY + nMovementSize, 1, 1).data;
                    setTerrainTypeByColor(pixelColor);

                    pixelColor = collisionContext.getImageData(nRight, nBottom + nMovementSize, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    pixelColor = collisionContext.getImageData(nLeft, nBottom + nMovementSize, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    break;

                case "LEFT":
                    pixelColor = collisionContext.getImageData(nCenterX - nMovementSize, nCenterY, 1, 1).data;
                    setTerrainTypeByColor(pixelColor);

                    pixelColor = collisionContext.getImageData(nLeft - nMovementSize, nTop, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    pixelColor = collisionContext.getImageData(nLeft - nMovementSize, nBottom, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    break;

                case "RIGHT":
                    pixelColor = collisionContext.getImageData(nCenterX + nMovementSize, nCenterY, 1, 1).data;
                    setTerrainTypeByColor(pixelColor);

                    pixelColor = collisionContext.getImageData(nRight + nMovementSize, nTop, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    pixelColor = collisionContext.getImageData(nRight + nMovementSize, nBottom, 1, 1).data;
                    if (pixelColor[0] == 0 && pixelColor[1] == 0 && pixelColor[2] == 0)
                        bReturn = false;
                    break;

                default:
                    alert("Not all cases caught in checkMovementByColor()");
            }

            return bReturn;
        }
    }

    //*****************************CHARACTER PROTOTYPE*******************************

    this.RPGCharacter = (function () {

        var RPGCharacter = function (strType) {
            this.initialize(strType);
        }

        var m_RPGCharacter = RPGCharacter.prototype = new createjs.Container(); // inherit from Container

        m_RPGCharacter.strType;
        m_RPGCharacter.nHealth;
        m_RPGCharacter.nMinDamage;
        m_RPGCharacter.nMaxDamage;
        m_RPGCharacter.nArmor;
        m_RPGCharacter.nLevel;

        m_RPGCharacter.Container_initialize = m_RPGCharacter.initialize;

        m_RPGCharacter.initialize = function (strType) {
            this.Container_initialize();

            var bMainCharacterType;
            bMainCharacterType = ((strType == strMainCharacterType) ? true : false);

            var strClass = getCharacterClass(bMainCharacterType);
            m_RPGCharacter.strType = strClass;

            var bElite = RPGEnums.MonsterTypes.properties[nEnemyMonsterType].elite;

            //treasure bosses and main character are always the same level
            this.nLevel = getCharacterLevel();

            //bosses are + 1
            if (bMainCharacterType == false && bElite == true) {
                this.nLevel = this.nLevel + 1;
            }
                //all random fights are 1 level below
            else if (bMainCharacterType == false && RPGEnums.isAMainCharacterType(strType) == false) {
                var nRandom = Math.floor((Math.random() * 1) + 1);

                this.nLevel = this.nLevel - nRandom;
                if (this.nLevel < 1)
                    this.nLevel = 1;
            }

            switch (strClass) {
                case "W":
                    this.nHealth = 18 * this.nLevel;
                    this.nMinDamage = 4 * this.nLevel;
                    this.nMaxDamage = 6 * this.nLevel;
                    this.nArmor = 3 * this.nLevel;
                    break;
                case "M":
                    this.nHealth = 14 * this.nLevel;
                    this.nMinDamage = 6 * this.nLevel;
                    this.nMaxDamage = 8 * this.nLevel;
                    this.nArmor = 1 * this.nLevel;
                    break;
                case "T":
                    this.nHealth = 16 * this.nLevel;
                    this.nMinDamage = 5 * this.nLevel;
                    this.nMaxDamage = 7 * this.nLevel;
                    this.nArmor = 2 * this.nLevel;
                    break;
                default:
                    alert("Not all cases caught in RPGCharacter.init()");
                    break;
            }
        }

        function handleTick(event) {

        }

        var getCharacterLevel = function () {
            return Math.floor(nExperiencePoints / 1000) + 1;
        }

        var getCharacterClass = function (bMainCharacterType) {
            var strType;

            if (bMainCharacterType == true) {
                switch (strMainCharacterType) {
                    case RPGEnums.CharacterTypes.MALEWARRIOR:
                    case RPGEnums.CharacterTypes.FEMALEWARRIOR:
                        strType = "W";
                        break;
                    case RPGEnums.CharacterTypes.MALEMAGE:
                    case RPGEnums.CharacterTypes.FEMALEMAGE:
                        strType = "M";
                        break;
                    case RPGEnums.CharacterTypes.FEMALETHIEF:
                    case RPGEnums.CharacterTypes.MALETHIEF:
                        strType = "T";
                        break;
                    default:
                        alert("Not all cases caught in RPGCharacter.getCharacterClass()");
                        break;
                }
            }
            else
                strType = RPGEnums.MonsterTypes.properties[nEnemyMonsterType].type;

            return strType;
        }

        window.RPGCharacter = RPGCharacter;
    }());


    //*****************************INITIALIZATION*******************************

    this.init = function () {
        //set up the main game canvas
        rpgCanvas = document.getElementById('RPGGameCanvas');

        //Easel JS RPG Game
        stage = new createjs.Stage(rpgCanvas);
        createRPG();
    };

    var createRPG = function () {

        RPGEnums.freezeEnums();

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

        RPGGlobals.init(false);

        // Start Preload 
        queue = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["ogg", "wav"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("fileload", handleLoadProgress);
        queue.addEventListener("complete", handleLoadCompleted);
        queue.loadManifest(manifest);

        RPGGlobals.init(false);
    }


    //*****************************SCENES*******************************

    var initMovementMap = function (strMovementMap, bNewMap) {

        bMovementFlag = false;

        dSavedCharacterPointX = dCharacterPointX;
        dSavedCharacterPointY = dCharacterPointY;

        RPGDisplay.clearScreen();
        RPGDisplay.clearStaticImage();

        RPGDisplay.setScreenVariables();

        switch (strMovementMap) {
            case RPGEnums.MovementMaps.BADLAND:
                dMapScale = 1.4;
                dCharacterScale = 2.3;

                if (bNewMap == true) {
                    dCharacterStartPointX = 55;
                    dCharacterStartPointY = 450;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINTWO, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                break;

            case RPGEnums.MovementMaps.BEACH:
                dMapScale = 1.2;
                dCharacterScale = 2;

                if (bNewMap == true) {
                    dCharacterStartPointX = 55;
                    dCharacterStartPointY = 650;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINTWO, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                break;

            case RPGEnums.MovementMaps.FOREST:
                dMapScale = 1.3;
                dCharacterScale = 2.5;

                if (bNewMap == true) {
                    dCharacterStartPointX = 55;
                    dCharacterStartPointY = 830;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINTWO, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                break;

            case RPGEnums.MovementMaps.GRASSLAND:
                dMapScale = 1;
                dCharacterScale = 2.8;

                if (bNewMap == true) {
                    dCharacterStartPointX = 55;
                    dCharacterStartPointY = nScreenCenterY;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINTWO, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                break;

            case RPGEnums.MovementMaps.MOUNTAIN:
                dMapScale = 1.2;
                dCharacterScale = 2.3;

                if (bNewMap == true) {
                    dCharacterStartPointX = 55;
                    dCharacterStartPointY = nScreenCenterY;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINTWO, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                break;

            case RPGEnums.MovementMaps.TERRAIN:
                dMapScale = 1.4;
                dCharacterScale = 1.6;

                if (bNewMap == true) {
                    dCharacterStartPointX = 511;
                    dCharacterStartPointY = 432;
                }
                else {
                    dCharacterStartPointX = dSavedCharacterPointX;
                    dCharacterStartPointY = dSavedCharacterPointY;
                }

                RPGDisplay.getTreasureMap();

                createjs.Sound.stop();
                createjs.Sound.play(RPGEnums.RPGSounds.TERRAINONE, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });

                break;

            default:
                alert("Not all cases caught in initMovementMap.");
                break;
        }

        dCharacterPointX = dCharacterStartPointX;
        dCharacterPointY = dCharacterStartPointY;

        RPGDisplay.getTerrain(strMovementMap, dMapScale);
        RPGDisplay.getMiniMap(strMovementMap);

        mainCharacter = RPGDisplay.getCharacterAnimation(strMainCharacterType, dCharacterPointX, dCharacterPointY, dCharacterScale, RPGEnums.Animations.STAND, .1);
        heroCharacterObject = new RPGCharacter(strMainCharacterType);
        RPGDisplay.getCharacterDisplay(strMainCharacterType, RPGEnums.MapTypes.MOVEMENT);

        RPGGlobals.setPositionVariables();

        //add elements in z axis order
        stage.addChild(terrain);

        if (strMovementMap.indexOf(RPGEnums.MovementMaps.TERRAIN) == 0)
            stage.addChild(treasureSet);

        stage.addChild(mainCharacter, terrainMiniMapBorder, terrainMiniMap, mainCharacterMini, mainCharacterDisplay);

        bMovementFlag = true;
    }

    var initFightScreen = function (strFightScreen) {

        stage.removeChild(mainCharacterDisplay);

        dSavedCharacterPointX = dCharacterPointX;
        dSavedCharacterPointY = dCharacterPointY;

        RPGDisplay.setScreenVariables();

        RPGDisplay.getStaticImage(strFightScreen.replace("FinalTreasure", ""));
        var strEnemyType;

        bMovementFlag = false;
        createjs.Sound.stop();

        if (strFightScreen.indexOf("FinalTreasure") != -1) {
            if (bBadland == true) {
                strEnemyType = RPGEnums.CharacterTypes.FEMALEMAGE;
                nEnemyMonsterType = 43;
            }
            else if (bBeach == true) {
                strEnemyType = RPGEnums.CharacterTypes.FEMALETHIEF;
                nEnemyMonsterType = 44;
            }
            else if (bForest == true) {
                strEnemyType = RPGEnums.CharacterTypes.FEMALEWARRIOR;
                nEnemyMonsterType = 42;
            }
            else if (bGrassland == true) {
                strEnemyType = RPGEnums.CharacterTypes.MALEWARRIOR;
                nEnemyMonsterType = 39;
            }
            else if (bMountain == true) {
                strEnemyType = RPGEnums.CharacterTypes.MALETHIEF;
                nEnemyMonsterType = 41;
            }

            createjs.Sound.play(RPGGlobals.getRandomFightSong(), { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
        }
        else {
            switch (strFightScreen) {


                case RPGEnums.Bitmaps.CASTLEFIGHT:
                    strEnemyType = RPGEnums.CharacterTypes.MALEMAGE;
                    nEnemyMonsterType = 40;//46 in enums when resource is available "castleBoss"type: "CB"
                    createjs.Sound.play(RPGEnums.RPGSounds.CASTLEFIGHT, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });

                    break;

                case RPGEnums.Bitmaps.TOWNFIGHT:
                    strEnemyType = RPGEnums.CharacterTypes.MALEMAGE;
                    nEnemyMonsterType = 40;//45 in enums when resource is available "townBoss" type: "TB"
                    createjs.Sound.play(RPGEnums.RPGSounds.TOWNFIGHT, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });

                    break;

                default:
                    strEnemyType = RPGGlobals.getRandomFightCharacter();
                    createjs.Sound.play(RPGGlobals.getRandomFightSong(), { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
                    break;
            }
        }

        heroCharacterObject = new RPGCharacter(strMainCharacterType);
        npcCharacterObject = new RPGCharacter(strEnemyType);

        RPGDisplay.getCharacterDisplay(strEnemyType, RPGEnums.MapTypes.FIGHTSCREEN);
        RPGDisplay.getCharacterDisplay(strMainCharacterType, RPGEnums.MapTypes.FIGHTSCREEN);

        npcFightCharacterAnimation = RPGDisplay.getCharacterAnimation(strEnemyType, nScreenWidth - nStaticImageInset * 6, nScreenHeight * .65, 3.2, RPGEnums.Animations.RUNDOWN, .1);
        heroFightCharacterAnimation = RPGDisplay.getCharacterAnimation(strMainCharacterType, nStaticImageInset * 6, nScreenHeight * .65, 3, RPGEnums.Animations.RUNDOWN, .1);

        stage.addChild(npcFightCharacterAnimation);
        stage.addChild(heroFightCharacterAnimation);

        initFightUI();

        //RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.LEAVEBATTLEMAP, "gray", nScreenWidth / 2, nScreenHeight / 2 - 140, RPGEnums.UIButtonTypes.FLASHING);
    }

    var initDialog = function (strDialog) {

        //always remove this as it looks bad
        stage.removeChild(mainCharacterDisplay);

        RPGDisplay.getStaticImage(strDialog);

        switch (strDialog) {

            case RPGEnums.Bitmaps.HEALERHOUSECUTSCENE:
                bMovementFlag = false;
                createjs.Sound.stop();
                RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.LEAVEBATTLEMAP, "gray", nScreenWidth / 2, nScreenHeight / 2, RPGEnums.UIButtonTypes.FLASHING);
                break;

            default:
                alert("Not all cases caught in initDialog()");
                break;
        }

    }


    //*****************************UI*******************************

    var initUIEvents = function () {
        //Any prototype objects handle their own events

        stage.on("stagemousedown", function (event) {
            if (bGameStarted == true && bMovementFlag == true) {
                RPGMovement.setCharacterDirection(event);
                nLastX = event.stageX;
                nLastY = event.stageY;
            }
        })

        //mainCharacter.on("pressmove", function (event) {
        //    // currentTarget will be the container that the event listener was added to:
        //    event.currentTarget.x = event.stageX;
        //    event.currentTarget.y = event.stageY;
        //    bMovementFlag = false;
        //});

        //mainCharacter.on("pressup", function (event) {
        //    //character position
        //    alert("PressUp" + -(nScreenCenterX - event.stageX) + ", " + -(nScreenCenterY - event.stageY));

        //    //object positioning (for out of screen items use event two)
        //    //alert("PressUp" + (event.stageX) + ", " + (event.stageY));
        //    //alert("PressUp" + (nScreenWidth + event.stageX) + ", " + (nScreenHeight + event.stageY));

        //    nLastX = event.stageX;
        //    nLastY = event.stageY;
        //    dCharacterPointX = event.stageX;
        //    dCharacterPointY = event.stageY;
        //    bMovementFlag = true;
        //})
    }

    var InitMovementUI = function () {
        RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.STARTGAME, "gray", nScreenCenterX, nScreenCenterY, RPGEnums.UIButtonTypes.FLASHING);
    }

    var initFightUI = function () {
        //battle variables
        nFightRound = 0;

        //draw the UI
        RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.ATTACKONE, "silver", nScreenCenterX / 2, nScreenHeight - nStaticImageInset * 5, RPGEnums.UIButtonTypes.TIMED);
        RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.ATTACKTWO, "silver", nScreenCenterX + nScreenCenterX / 2, nScreenHeight - nStaticImageInset * 5, RPGEnums.UIButtonTypes.TIMED);
        RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.ATTACKTHREE, "silver", nScreenCenterX, nScreenHeight - nStaticImageInset * 3, RPGEnums.UIButtonTypes.TIMED);
        RPGDisplay.getRPGButton(RPGEnums.UIButtonActions.RUN, "gray", nScreenCenterX, nStaticImageInset * 2 + 10, RPGEnums.UIButtonTypes.TIMED);
    }


    //*****************************EVENTS*******************************

    var handleLoadCompleted = function () {
        initMovementMap(strMovementMap, true);
        InitMovementUI();
        initUIEvents();
        startGameTimer();
    }

    var handleLoadProgress = function (event) {
        console.log("LOADING PERCENTAGE", queue.progress);
    }

    var startGameTimer = function () {
        createjs.Ticker.on("tick", handleTick);
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(nFPS);
    }

    var handleTick = function (event) {

        if (bGameStarted == true) {
            //character moving around
            if (bMovementFlag == true)
                RPGMovement.checkMapMovement(event);
                //fight screen or dialog
            else {
                if (nAttackFrameOne >= 0) {
                    RPGAttack.drawSpecialAttackOne();
                    RPGDisplay.getFightTextDisplay();
                }
                else if (nAttackFrameTwo >= 0) {
                    RPGAttack.drawSpecialAttackTwo();
                    RPGDisplay.getFightTextDisplay();
                }
                else if (nAttackFrameThree >= 0) {
                    RPGAttack.drawSpecialAttackThree();
                    RPGDisplay.getFightTextDisplay();
                }
            }
        }

        stage.update(event); // important!!
    }

};
