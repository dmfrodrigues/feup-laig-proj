/**
 * Orchestrator
 * @constructor
 * @param scene  		- Reference to MyScene object
 */
class Orchestrator extends CGFobject {
	constructor(scene, themes, gameMode, level, timeMode) {
        super(scene);
        this.scene.orchestrator = this;
        this.gameSequence  = new GameSequence();
        this.animator      = new Animator(this, this.gameSequence);
        this.themeSelected = 0;
        this.themeInited   = false;
        this.themes       = themes;
        this.theme        = new MySceneGraph(themes[0], this.scene);
        this.gameState    = new GameState(this.scene, this, timeMode);
        this.gameMode     = gameMode;
        this.level        = level;
        this.timeMode     = timeMode;
    }

    isComputer(player){
        switch(this.gameMode){
            case 'PvP': return false;
            case 'PvC': return (player === 2);
            case 'CvC': return true;
        }
    }

    getLevel(){
        return this.level*2-1;
    }
    getN(){
        let level = this.getLevel();
        switch(level){
            case 1: return  5;
            case 3: return  7;
            case 5: return 10;
            default: throw new Error(`Value of N for level ${level} is not specified`);
        }
    }

    initialize(){
        this.gameState.gameboard.gameboardSetup = this.theme.gameboard;
        PieceStack.pieceStackView = this.theme.pieces.view;
        PieceStack.pieceStackView.initialize();

        let orchestrator = this;
        let gamestate = this.gameState;
        if(this.isComputer(gamestate.turn)){
            this.gameState.feedbackText = "computer move"; 
            server.choose_move(
                gamestate,
                gamestate.turn,
                this.getLevel(),
                this.getN()
            )
            .then(async function (response){
                await gamestate.gameboard.move(
                    gamestate.gameboard.getCell(response.pos[0], response.pos[1]),
                    response.substacks,
                    response.dir,
                    gamestate.gameboard.getCell(response.newpos[0], response.newpos[1]),
                    gamestate.turn
                );
                orchestrator.nextTurn();
            });
        }else this.gameState.moveState.initialState();
    }

    managePick(mode, results){
        if(mode == false){
            if(results != null && results.length > 0){
                for(let i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    if(obj){
                        let id = results[i][1];
                        this.onObjectSelected(obj, id);
                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }

    async nextTurn(){
        let orchestrator = this;
        let gamestate = this.gameState;
        let response = await server.game_over(gamestate);
            if(response.isgameover)
            {
                gamestate.isGameOver   =        true;
                gamestate.feedbackText = "game over"; 
                if(orchestrator.isComputer(response.winner))
                    document.getElementById('winner').innerHTML = 'Computer ' + response.winner;
                else 
                    document.getElementById('winner').innerHTML = 'Player ' + response.winner;
                document.getElementById('game-over').style.display = 'block';
                return;
            }
            else {
                gamestate.nextTurn();
                if(this.isComputer(gamestate.turn)){
                    this.gameState.feedbackText = "computer move"; 
                    response = await server.choose_move(
                        gamestate,
                        gamestate.turn,
                        this.getLevel(),
                        this.getN()
                    );
                        await gamestate.gameboard.move(
                            gamestate.gameboard.getCell(response.pos[0], response.pos[1]),
                            response.substacks,
                            response.dir,
                            gamestate.gameboard.getCell(response.newpos[0], response.newpos[1]),
                            gamestate.turn
                        );
                        orchestrator.nextTurn();
                }else this.gameState.moveState.initialState();
            }
    }

    async onObjectSelected(obj, id){
        if(this.gameState.isGameOver) 
            return;

        if(obj.idObj == 'change-theme'){
            this.changeTheme();
        }
        else if(obj.idObj == 'main-menu'){
            location.reload();
        }
        else if(obj.idObj == 'undo' && !this.isComputer(this.gameState.turn)){
            this.gameState.moveState.initialState();
            await this.undo();
        }
        else if(10 <= id && id < 300)
            await this.gameState.moveState.updateMoveState(obj);
        else
            obj.onclick();
    }

    changeTheme(){
        this.theme.pauseAudio();
        if(!this.isComputer(this.gameState.turn))
        {   
            this.gameState.moveState.resetSubstacks();
            this.gameState.moveState.initialState();
        }
        this.themeInited = false;
        button_id = 200;
        this.themeSelected = (this.themeSelected+1)%(this.themes.length);
        this.theme = new MySceneGraph(this.themes[this.themeSelected], this.scene);
    }

    async undo(){
        await this.gameSequence.manageUndo(this.gameState);
        this.gameState.setTime();
    }

    update(t){
        this.theme.update(t);
        if(this.animator.active)
            this.animator.update(t);
        if(!this.gameState.isGameOver){
            this.gameState.updateTime(t);
            this.gameState.checkTime();
        }
    }

    setValue(value){
        for(let i in this.theme.uis)
            this.theme.uis[i].setValue(value);
    }

    display(){
        if(!this.themeInited) return;
        this.theme.display();
        this.animator.display();
        for(let i in this.theme.uis)
            this.theme.uis[i].display();
    }
}
