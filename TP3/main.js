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
//Include additional files here
serialInclude(
    [
        '../lib/CGF.js',
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
        'logic/BoardCell.js',
        'logic/GameBoard.js',
        'logic/Orchestrator.js',
        'logic/PieceStack.js',
        'logic/PieceStackView.js',
        'logic/RoomPieceStackView.js',
        'logic/GameMove.js',
        'logic/GameSequence.js',
        'logic/PlayerMoveState.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// create and load graph, and associate it to scene. 
    // Check console for loading errors
    var orchestrator = new Orchestrator(myScene, 'room.xml');
	
	// start
    app.run();
}

]);