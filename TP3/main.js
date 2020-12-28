//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}  

var app = {};

//Include additional files here
serialInclude(
    [
        '../lib/CGF.js',
        '../lib/CGFOBJModel.js',
        '../lib/CGFResourceReader.js',
        'Stack.js',
        'XMLscene.js',
        'MyInterface.js',
        'scene-graph/primitives/MyTriangle.js',
        'scene-graph/primitives/MyRectangle.js',
        'scene-graph/primitives/MyCylinder.js',
        'scene-graph/primitives/MySphere.js',
        'scene-graph/primitives/MyTorus.js',
        'scene-graph/primitives/Plane.js',
        'scene-graph/primitives/Patch.js',
        'scene-graph/primitives/Barrel.js',
        'scene-graph/keyframes/MyShader.js',
        'scene-graph/keyframes/Keyframe.js',
        'scene-graph/keyframes/Animation.js',
        'scene-graph/keyframes/KeyframeAnimation.js',
        'scene-graph/keyframes/MySpriteSheet.js',
        'scene-graph/keyframes/MySpriteText.js',
        'scene-graph/keyframes/MySpriteAnimation.js',
        'scene-graph/GameboardSetup.js',
        'scene-graph/PiecesSetup.js',
        'scene-graph/Node.js',
        'scene-graph/MySceneGraph.js',
        'server/Server.js',
        'logic/BoardCell.js',
        'logic/GameBoard.js',
        'logic/GameState.js',
        'logic/Orchestrator.js',
        'logic/PassiveOrchestrator.js',
        'logic/PieceStack.js',
        'logic/PieceStackView.js',
        'logic/RoomPieceStackView.js',
        'logic/GameMove.js',
        'logic/GameSequence.js',
        'logic/PlayerMoveState.js',
        'logic/Button.js',
        'logic/UserInterface.js',

main=function(){
    app = new CGFapplication(document.getElementById('drawingBoard'));
    app.init();
    startMenu();

    document.getElementById('play-button').addEventListener('click', () => {

        let gameMode;
        if(document.getElementById('PvP').checked){
            gameMode = document.getElementById('PvP').value;
        }else if(document.getElementById('PvC').checked){
            gameMode = document.getElementById('PvC').value;
        }else if(document.getElementById('CvC').checked){
            gameMode = document.getElementById('CvC').value;
        }
        
        let level = document.getElementById('level').value;

        this.document.getElementById('menu').style.display = 'none';

        startGame(gameMode, level);
    });

    document.getElementById('info-button').addEventListener('click', ()=>{
        document.getElementById('menu').style.display = 'none';
        document.getElementById('info-text').style.display = 'block';
    });
    document.getElementById('exit-info').addEventListener('click', ()=>{
        document.getElementById('menu').style.display = 'block';
        document.getElementById('info-text').style.display = 'none';
    });

}

]);

function startMenu(){
    var backgroundScene = new XMLscene(null);
    app.setScene(backgroundScene);
    var backgroundOrchestrator = new PassiveOrchestrator(backgroundScene, 'space.xml');
    app.run();
}

function startGame(gameMode, level){
	// Standard application, scene and interface setup
    var gameInterface = new MyInterface();
    var gameScene = new XMLscene(gameInterface);

    app.setScene(gameScene);
    app.setInterface(gameInterface);

    gameInterface.setActiveCamera(gameScene.camera);

	// create and load graph, and associate it to scene. 
    // Check console for loading errors
    var orchestrator = new Orchestrator(gameScene, ['room.xml', 'iss.xml'], gameMode, level);
}
