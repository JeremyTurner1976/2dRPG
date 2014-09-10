
//*****************************TESTING*******************************
/*
var testDisplay;
var showTestingScreen = function (arg1, arg2, arg3, arg4) {

    stage.removeChild(testDisplay);
    var tempString = //""
                     //'nBackgroundWidth: ' + nBackgroundWidth + '     nBackgroundHeight: ' + nBackgroundHeight + '\n\n' +
                     //'nScreenWidth: ' + nScreenWidth + '     nScreenHeight: ' + nScreenHeight + '\n\n' +
                     //'nScreenCenterX: ' + nScreenCenterX + '     nScreenCenterY: ' + nScreenCenterY + '\n\n' +
                     //'dCharacterPointX: ' + Math.floor(dCharacterPointX) + '     dCharacterPointY: ' + Math.floor(dCharacterPointY)// + '\n\n' +
                     'Terrain Type: ' + RPGVariables.getTerrainFightScreen()
    //'arg1: ' + arg1 + '\n' +
    //'arg2: ' + arg2 + '\n' +
    //'arg3: ' + arg3 + '\n' +
    //'arg4: ' + arg4 + '\n'
    ;

    testDisplay = new createjs.Text(tempString, smallFont, lightFontColor);
    testDisplay.x = 25;
    testDisplay.y = nScreenHeight - testDisplay.getMeasuredHeight();
    testDisplay.textBaseline = "bottom";
    stage.addChild(testDisplay);
}
*/

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

this.MapColors = {
    BADLANDRGB: { 0: 139, 1: 69, 2: 19 },
    BEACHRGB: { 0: 253, 1: 245, 2: 230 },
    FORESTRGB: { 0: 0, 1: 100, 2: 0 },
    GRASSLANDRGB: { 0: 50, 1: 205, 2: 50 },
    MOUNTAINRGB: { 0: 105, 1: 105, 2: 105 },
    FINALTERRAINTREASURERGB: { 0: 0, 1: 0, 2: 255 }

    ////All Collision map colors
    //badlandRGB = [139, 69, 19].;
    //beachRGB = [253, 245, 230].;
    //forestRGB = [0, 100, 0].;
    //grasslandRGB = [50, 205, 50].;
    //mountainRGB = [105, 105, 105].;

    //badlandTreasureRGB = [128, 0, 0].;
    //beachTreasureRGB = [240, 230, 140].;
    //forestTreasureRGB = [152, 251, 152].;
    //grasslandTreasureRGB = [0, 255, 127].;
    //mountainTreasureRGB = [245, 245, 245].;

    //finalTerrainTreasureRGB = [0, 0, 255].;

    //townRGB = [255, 255, 0].;
    //castleRGB = [255, 165, 0].;
    //healerHouseRGB = [255, 215, 0].;
    //mainCharacterHouseRGB = [0, 0, 205].;
}


function drawAssets() {
    drawBackground("terrain");
    drawMainCharacter("maleWarrior");

    //drawRPGFlashingButton("Start Game", "gray", canvas.width / 2, canvas.height / 2);

    //drawRPGStandardButton("Standard Button", "red", canvas.width / 4, canvas.height / 4);
    //drawRPGStandardButton("Standard Button 2", "blue", canvas.width / 3, canvas.height / 3);
    
    ////use this for a ui group that can be added to the stage
    //var container = new createjs.Container();

    ////remove events
    //myBtn.off("click", listener);
    //RemoveEventListener("click");
    //displayObject.removeAllEventListeners("click"); 
    //displayObject.removeAllEventListeners();

    //// this lets our drag continue to track the mouse even when it leaves the canvas:
    // play with commenting this out to see the difference.
    //stage.mouseMoveOutside = true;

    stage.on("stagemousedown", function (event) {
        //alert("the canvas was clicked at " + event.stageX + "," + event.stageY);
        //alert("the main character is at " + mainCharacter.x + "," + mainCharacter.y);

        nLastX = event.stageX;
        nLastY = event.stageY;

        nXDistance = Math.abs(event.stageX - mainCharacter.x);
        nYDistance = Math.abs(event.stageY - mainCharacter.y);
        if (nXDistance < nYDistance && event.stageY < mainCharacter.y) { mainCharacter.gotoAndPlay("runNorth"); }
        else if (nXDistance < nYDistance && event.stageY > mainCharacter.y) { mainCharacter.gotoAndPlay("runSouth"); }
        else if (nXDistance > nYDistance && event.stageX < mainCharacter.x) { mainCharacter.gotoAndPlay("runWest"); }
        else if (nXDistance > nYDistance && event.stageX > mainCharacter.x) { mainCharacter.gotoAndPlay("runEast"); }

        //nnBackgroundWidth, nBackgroundHeight the height/width of the background image itself
        //nScreenWidth, nScreenHeight the height/width of the canvas display (window.inner dimensions on game load) 
        //nLastX, nLastY is the mouse Position pressed
        //nCanvasCenterX, nCanvasCenterY is the center of the viewport
        //dScaleX, dScaleY is the percent of the map showing in the viewport

        //alert(
        //        'nBackgroundWidth: ' + nBackgroundWidth + '     nBackgroundHeight: ' + nBackgroundHeight + '\n' +
        //        'nScreenWidth: ' + nScreenWidth + '     nScreenHeight: ' + nScreenHeight + '\n'+
        //        'nLastX: ' + nLastX + '     nLastY: ' + nLastY + '\n'+
        //        'nCanvasCenterX: ' + nCanvasCenterX + '     nCanvasCenterY: ' + nCanvasCenterY + '\n' +
        //        'dScaleX: ' + dScaleX + '     dScaleY: ' + dScaleY + '\n'
        //     );

        //alert('Equation4 (nCanvasCenterX - nLastY): ' + (nCanvasCenterX - nLastY) + '\n');
    })

    //stage.on("stagemousemove", function (event) {
    //    //console.log("stageX/Y: " + event.stageX + "," + event.stageX); // always in bounds
    //    //console.log("rawX/Y: " + event.rawX + "," + event.rawY); // could be < 0, or > width/height

    //    //mainCharacter.x = event.stageX;
    //    //mainCharacter.y = event.stageY;

    //    // make sure to redraw the stage to show the change:
    //    //stage.update();
    //});

    mainCharacter.on("pressmove", function (event) {
        // currentTarget will be the container that the event listener was added to:
        event.currentTarget.x = event.stageX;
        event.currentTarget.y = event.stageY;

        // make sure to redraw the stage to show the change unless handled on tick
        //stage.update();

        bMovementFlag = true;
    });

    mainCharacter.on("pressup", function (event) { 
        alert("PressUp" + event.stageX + ", " + event.stageY);
        //mainCharacter.alpha = .5; //see example in tick()

        nLastX = event.stageX;
        nLastY = event.stageY;
        bMovementFlag = false;
    })

    //Container.getObjectUnderPoint() returns the top most display object under the specified point.
    //Container.getObjectsUnderPoint() returns all display objects under the specified point.
    //DisplayObject.hitTest() returns true if the specified point in the display object is non-transparent.

    //holder = stage.addChild(new createjs.Container());
    //holder.x = holder.y = 150;

    //see example in tick()
    //for (var i = 0; i < 25; i++) {
    //    var shape = new createjs.Shape();
    //    shape.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 360, 100, 50)).drawCircle(0, 0, 30);
    //    shape.x = Math.random() * 300 - 150;
    //    shape.y = Math.random() * 300 - 150;
    //    holder.addChild(shape);
    //}
    ////stage.addChild(var, var, var, var, var);

    //window.onscroll = function (event) {
    //    // called when the window is scrolled.
    //    //alert("scroll event detected! " + window.pageXOffset + " " + window.pageYOffset);
    //    //mainCharacter.x += window.pageXOffset;
    //    //mainCharacter.y += window.pageYOffset;

    //    if (window.pageYOffset > nLastScrollY) {
    //        //direction = "down";
    //        mainCharacter.y = mainCharacter.y + nLastScrollY;
    //    }
    //    else if (window.pageYOffset != nLastScrollY)
    //    {
    //        //direction = "up";
    //        mainCharacter.y = mainCharacter.y - nLastScrollY;
    //    }
    //    else if (window.pageXOffset > nLastScrollX) {
    //        //direction = "right";
    //        mainCharacter.x = mainCharacter.x + nLastScrollX;
    //    }
    //    else if (window.pageXOffset != nLastScrollX) {
    //        //direction = "left";
    //        mainCharacter.x = mainCharacter.x - nLastScrollX;
    //    }

    //    nLastScrollX = window.pageXOffset;
    //    nLastScrollY = window.pageYOffset;
    //}

    //if (bBadland == true)
    //    bBadlandFinalTreasure = true;
    //if (bBeach == true)
    //    bBeachFinalTreasure = true;
    //if (bForest == true)
    //    bForestFinalTreasure = true;
    //if (bGrassland == true)
    //    bGrasslandFinalTreasure = true;
    //if (bMountain == true)
    //    bMountainFinalTreasure = true;

    //stage.update();
}

function tick(event) {
    // move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
    //mainCharacter.x -= event.delta / 1000 * 100;
    //if (mainCharacter.x < 0) { mainCharacter.x = stage.canvas.width; }

    //holder.rotation += 3;
    //var l = holder.getNumChildren();
    //for (var i = 0; i < l; i++) {
    //    var child = holder.getChildAt(i);
    //    child.alpha = .5;
    //    var pt = child.globalToLocal(stage.mouseX, stage.mouseY);
    //    if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) { child.alpha = 1; }
    //}

    //globalToLocal() must be used as it was scaled. hitTest() and localToLocal() as other options
    //var pt = mainCharacter.globalToLocal(stage.mouseX, stage.mouseY);
    //if (stage.mouseInBounds && mainCharacter.hitTest(pt.x, pt.y)) {
    //    mainCharacter.alpha = 1;
    //}

    //available tweens http://andysaia.com/blog/tweenjs/
    //not working, also css based and not promised on all browsers
    //Tween.get(mainCharacter).to({ x: stage.mouseX }, 500, Ease.linear);
    //Tween.get(mainCharacter).to({ y: stage.mousey }, 500, Ease.linear);

    //nFrameCount++;
    //if (nFrameCount % 120 == 0) {
    //}
    //if (nFrameCount > 12000)
    //    nFrameCount = 0;

    //Full Screen movement
    if (!bMovementFlag) {
        //character movement based on last or current mouse/touch position
        if (mainCharacter.x < nLastX - 2 && stage.mouseInBounds) {
            nCharacterMove = (nLastX - mainCharacter.x > 25 ? event.delta / 1000 * 90 : event.delta / 1000 * 50);

            ////if (terrain.x - nCharacterMove > 0) {
                nLastX -= nCharacterMove;
                terrain.x -= nCharacterMove;
                terrain.x -= nCharacterMove;
            ////}


            mainCharacter.x += nCharacterMove;
        }
        else if (mainCharacter.x > nLastX + 2 && stage.mouseInBounds) {
            nCharacterMove = (mainCharacter.x - nLastX > 25 ? event.delta / 1000 * 90 : event.delta / 1000 * 50);

            ////if (terrain.x + nCharacterMove > 0) {
                nLastX += nCharacterMove;
                terrain.x += nCharacterMove;
                terrain.x += nCharacterMove;
            ////}

            mainCharacter.x -= nCharacterMove;
        }

        if (mainCharacter.y < nLastY - 2 && stage.mouseInBounds) {
            nCharacterMove = (nLastY - mainCharacter.y > 25 ? event.delta / 1000 * 90 : event.delta / 1000 * 50);

            ////if(terrain.y - nCharacterMove > 0){
                nLastY -= nCharacterMove;
                terrain.y -= nCharacterMove;
                terrain.y -= nCharacterMove;
            ////}

            mainCharacter.y += nCharacterMove;
        }
        else if (mainCharacter.y > nLastY + 2 && stage.mouseInBounds) {
            nCharacterMove = (mainCharacter.y - nLastY > 25 ? event.delta / 1000 * 90 : event.delta / 1000 * 50);

            ////if (terrain.y + nCharacterMove > 0) {
                nLastY += nCharacterMove;
                terrain.y += nCharacterMove;
                terrain.y += nCharacterMove;
            ////}

        
            mainCharacter.y -= nCharacterMove;
        }
    }

    if (Math.abs(mainCharacter.x - nLastX) <= 2 && Math.abs(mainCharacter.y - nLastY) <= 2)
        mainCharacter.gotoAndPlay("stand");

    //var point = myContainer.localToGlobal(100, 100);
    //var color = stage.canvas.getContext("2d").getImageData(point.x, point.y, 1, 1);
    //var r = color[0];
    //var g = color[1];
    //var b = color[2];
    //var alpha = color[3];

    stage.update(event); // important!!
}


function drawBackground(terrainMap) {

    //canvas.width = terrain.image.width;
    //canvas.height = terrain.image.height;

    //nCurrentWidth = terrain.image.width;
    //nDesiredWidth = canvas.width;
    //nCurrentHeight = terrain.image.height;
    //nDesiredHeight = canvas.height;

    ////Scale to perfectly fit the canvas
    //terrain.scaleX = nDesiredWidth / nCurrentWidth;
    //terrain.scaleY = nDesiredHeight / nCurrentHeight;
    //terrain.scaleX = nDesiredWidth / nCurrentWidth;
    //terrain.scaleY = nDesiredHeight / nCurrentHeight;

    //scale to keep aspect ratio
    //terrain.scaleX = Math.min(nDesiredWidth / nCurrentWidth, nDesiredHeight / nCurrentHeight)*2;
    //terrain.scaleY = Math.min(nDesiredWidth / nCurrentWidth, nDesiredHeight / nCurrentHeight)*2;
    //terrain.scaleX = Math.min(nDesiredWidth / nCurrentWidth, nDesiredHeight / nCurrentHeight)*2;
    //terrain.scaleY = Math.min(nDesiredWidth / nCurrentWidth, nDesiredHeight / nCurrentHeight)*2;

    //characterDisplayBorder.graphics.beginFill("silver").beginRadialGradientStroke(["darkSlateGray", "gray"], [0, 1], 0, 0, 0, 0, 30, 130).drawRoundRect(-10, nScreenHeight - height + 10, width, height, 8);
    //characterDisplayBorder.graphics.beginFill("silver").beginRadialGradientStroke(["darkSlateGray", "gray"], [0, 1], 0, 0, 0, 0, 30, 130).drawRoundRect(nScreenWidth - width + 10, nScreenHeight - height + 10, width, height, 8);


}

function drawMainCharacter(strCharacterName) {

    //mainCharacter.paused = true;
    //mainCharacter._goto(7);

    //mainCharacter.paused = false;
    //mainCharacter._goto("runWest");

    //mainCharacter.stop();
    //mainCharacter.play();
    //mainCharacter.gotoAndPlay("runNorth");
    //mainCharacter.gotoAndPlay("stand");
    //mainCharacter.gotoAndStop("runEast");

}



function initTreasure(strMovementMap) {
    //On Screen sample
    //drawTreasure("mountain", 1195, 140, 1);

    //Off Screen sample (nMainCharacterPosition X & Y will be the # in the formula below)
    //drawTreasure("grassland", 600 * dMapScale - dMapInitialOffsetX, 795 * dMapScale - dMapInitialOffsetY, 1);

    switch (strMovementMap) {
        case "badlandTerrain":
            drawTreasure("badlandTreasure", 1362 * dMapScale - dMapInitialOffsetX, 421 * dMapScale - dMapInitialOffsetY, 1.7);
            break;

        case "beachTerrain":
            drawTreasure("beachTreasure", 1405 * dMapScale - dMapInitialOffsetX, 533 * dMapScale - dMapInitialOffsetY, 2);
            break;

        case "forestTerrain":
            drawTreasure("forestTreasure", 1411 * dMapScale - dMapInitialOffsetX, 484 * dMapScale - dMapInitialOffsetY, 2.1);
            break;

        case "grasslandTerrain":
            drawTreasure("grasslandTreasure", 1295 * dMapScale - dMapInitialOffsetX, 399 * dMapScale - dMapInitialOffsetY, 3.5);
            break;

        case "mountainTerrain":
            drawTreasure("mountainTreasure", 1359 * dMapScale - dMapInitialOffsetX, 596 * dMapScale - dMapInitialOffsetY, 2.5);
            break;

        case "terrain":
            //drawTreasure("badland", 1345 * dMapScale - dMapInitialOffsetX, 690 * dMapScale - dMapInitialOffsetY, 1);
            //drawTreasure("beach", 1694 * dMapScale - dMapInitialOffsetX, 255 * dMapScale - dMapInitialOffsetY, 1);
            //drawTreasure("forest", 1075 * dMapScale - dMapInitialOffsetX, 368 * dMapScale - dMapInitialOffsetY, 1);
            //drawTreasure("grassland", 610 * dMapScale - dMapInitialOffsetX, 805 * dMapScale - dMapInitialOffsetY, 1);
            drawTreasure("mountain", 1210, 155, 1);

            //drawTreasure("townTreasure", 1085 * dMapScale - dMapInitialOffsetX, 595 * dMapScale - dMapInitialOffsetY, 4);
            //drawTreasure("healerTreasure", 1675 * dMapScale - dMapInitialOffsetX, 770 * dMapScale - dMapInitialOffsetY, 2);
            //drawTreasure("castleTreasure", 1765 * dMapScale - dMapInitialOffsetX, 725 * dMapScale - dMapInitialOffsetY, 4);


            break;

        default:
            alert("Not all cases caught in initTreasure.");
            break;
    }
}

function drawTreasure(strTreasureName, x, y, scale) {

    //var tempTreasure = new createjs.Bitmap(queue.getResult(strTreasureName));
    tempTreasure = new createjs.Shape();

    if (strTreasureName.indexOf("Treasure") > -1)
        tempTreasure.graphics.beginFill("transparent").beginRadialGradientStroke(["white", "black"], [0, 1], 0, 0, 0, 0, 30, 130).drawCircle(0, 0, 15 * scale);
    else
        tempTreasure.graphics.beginFill("gray").beginRadialGradientStroke(["white", "black"], [0, 1], 0, 0, 0, 0, 30, 130).drawCircle(0, 0, 15 * scale);

    //var tempTreasure = new createjs.Bitmap(queue.getResult(strCharacterName));

    //set this to the middle of the canvas
    tempTreasure.x = x;
    tempTreasure.y = y;

    //set the registry of this as the center of the item
    tempTreasure.regX = 15 * scale;
    tempTreasure.regY = 15 * scale;

    ////set the scale
    //tempTreasure.scaleX = scale;
    //tempTreasure.scaleY = scale;

    //not multiplied by scale as this handles the transparency
    //tempTreasure.setBounds(tempTreasure.x + tempTreasure.image.width / 2,
    //                       tempTreasure.y + tempTreasure.image.height / 2,
    //                       tempTreasure.x - tempTreasure.image.width / 2,
    //                       tempTreasure.y - tempTreasure.image.height / 2)

    stage.addChild(tempTreasure);
}











/*UNSOLVED*/

/*
1. Full Screen Size for any screen. This almost works but when returning to the map from a treasure zone it is off
    Solution: Going to use 5 different pixel sets ie 1024 * 768 to signify what measurements to use (set a variable on the type for the return)


    var dWindowOffsetX, dWindowOffsetX;
    dWindowOffsetX = (680 - window.innerWidth / 2);
    dWindowOffsetY = (336.5 - window.innerHeight / 2);
    canvas.width = (window.innerWidth >= 1024 && window.innerWidth <= 1600) ? window.innerWidth : 1360;
    canvas.height = (window.innerHeight >= 600 && window.innerHeight <= 900) ? window.innerHeight : 673;

    if (window.innerWidth >= 800) {
        dCharacterStartPointX = (dCharacterStartPointX + dWindowOffsetX) < 0 ? dCharacterStartPointX + dWindowOffsetX / 2 : 0;
        dMapInitialOffsetX = (dMapInitialOffsetX + dWindowOffsetX) > 0 ? dMapInitialOffsetX + dWindowOffsetX: 0;
    }

    if (window.innerHeight >= 600) {
        dCharacterStartPointY = (dCharacterStartPointY + dWindowOffsetY) < 0 ? dCharacterStartPointY + dWindowOffsetY / 2 : 0;
        dMapInitialOffsetY = (dMapInitialOffsetY + dWindowOffsetY) > 0 ? dMapInitialOffsetY + dWindowOffsetY: 0;
    }
*/










//640 * 480
////Right (+)
//dMapInitialOffsetX = 185;
////Down (+)
//dMapInitialOffsetY = 186;

//800 * 600
////Right (+)
//dMapInitialOffsetX = 106;
////Down (+)
//dMapInitialOffsetY = 123;

////1024 * 768
////Left (-)
//dCharacterStartPointX = -7;
////Down (+)
//dMapInitialOffsetY = 41;

////1920 * 1080
////Left (-)
//dCharacterStartPointX = -455;
////Up (-)
//dCharacterStartPointY = -119;

////500 * 500
////Right (+)
//dMapInitialOffsetX = 254;
////Down (+)
//dMapInitialOffsetY = 173;

//1000 * 1000
////Right (+)
//dMapInitialOffsetX = 6;
////Up (-)
//dCharacterStartPointY = -77;

//1500 * 1500
////Left (-)
//dCharacterStartPointX = -247;
////Up (-)
//dCharacterStartPointY = -324;

//500 to 1000 to 1500
//xdifferences
//248 then 253

//ydifferences
//250 then 250

//so every 500 change in pixel size requires a 250 shift
//1360 - 1000 = 360   360 / 2 = 180? true it goes 180 but (-)
//1360 - 1500 = -140   -140 / 2 = -70? true it goes -70 but (+)

//so if screen size is less than 1360 go (-screensizeChange / 2)
//if screen size is greater than 1360 go (-screensizeChange / 2)

//673 - 1000 = -327   -327 / 2 = -164? true it goes -164 but close and (+)

//so if screen size is less than 673 go (-screensizeChange / 2)
//if screen size is greater than 673 go (-screensizeChange / 2)

//TODO
//implement this logic