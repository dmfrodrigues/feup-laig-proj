class GameState extends CGFobject {
    constructor(scene, orchestrator){
        super(scene);
        this._scene = scene;
        this._orchestrator = orchestrator;

        this._gameboard = new GameBoard(this._scene);
        this.turn = 1;

        this.moveState = new PlayerMoveState(this);

        this.value = 0.0;
    }

    get gameboard(){ return this._gameboard; }
    get turn     (){ return this._turn     ; }
    set turn(turn){
        this._turn = turn;
        this._gameboard.setTurn(turn);
    }

    nextTurn(){
        this.turn = (this.turn === 1 ? 2 : 1);
        this.updateValue();
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
