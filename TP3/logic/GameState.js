class GameState extends CGFobject {
    constructor(scene, orchestrator){
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
