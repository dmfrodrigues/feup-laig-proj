class GameState extends CGFobject {
    constructor(scene, orchestrator, timeMode){
        super(scene);
        this._scene = scene;
        this._orchestrator = orchestrator;

        this._gameboard = new GameBoard(this._scene);
        this.turn = 1;

        this.moveState = new PlayerMoveState(scene, this);

        this.value = 0.0;
        this.isGameOver = false;
        this.round = 1;
        this.gametime = 0;
        this.feedbackText = "none";
        this.timeMode = timeMode;
        this.lastTime = 0;
        this.timeLeft = 0;
        this.setTime(this.timeMode);
    }

    setTime(){
        this.lastTime = this.gametime;
        switch (this.timeMode) {
            case 'sandbox':
                this.timeLeft = 0;
                break;
            case 'standard':
                this.timeLeft = 300;
                break;
            case 'blitz':
                this.timeLeft = 60;
                break;
            default:
                break;
        }
    }

    checkTime(){
        if(this.timeMode != 'sandbox' && this.timeLeft <= 0){
            this.isGameOver   =        true;
            this.feedbackText = "game over"; 
            if(this._orchestrator.isComputer(this.turn % 2 + 1))
                document.getElementById('winner').innerHTML = 'Computer ' + (this.turn % 2 + 1);
            else 
                document.getElementById('winner').innerHTML = 'Player ' + (this.turn % 2 + 1);
            document.getElementById('game-over').style.display = 'block';
            return true;
        }
        return false;
    }

    updateTime(t){
        this.gametime = this._scene.time;
        if(this.timeMode != 'sandbox'){
            this.timeLeft -= t - this.lastTime;
            this.lastTime = t;
        }

        if(this.timeLeft < 0) this.timeLeft = 0;
    }

    get gameboard(){ return this._gameboard; }
    get turn     (){ return this._turn     ; }
    set turn(turn){
        this._turn = turn;
        if(this._orchestrator.isComputer(this._turn)) this._gameboard.setTurn(null);
        else                                          this._gameboard.setTurn(turn);
    }
    get orchestrator(){ return this._orchestrator; }

    nextTurn(){
        this.turn = (this.turn === 1 ? 2 : 1);
        this.updateValue();
        this.setTime();
        if(this.turn === 1) this.round++;
    }

    async updateValue(){
        let value = await server.value(this);
        this._orchestrator.setValue(value);
    }

    toJSON(){
        return {
            board: this._gameboard.toJSON(),
            turn: this._turn
        }
    }

    display(){
        this._gameboard.display();
    }
}
