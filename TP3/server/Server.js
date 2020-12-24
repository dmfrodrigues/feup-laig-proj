class Server {
    /**
     * Construct server from URL.
     * 
     * @param {string} url URL of server
     */
    constructor(url){
        this._url = url;
    }

    /**
     * Get resulting gameboard after performing move in a given board.
     * 
     * @param {GameBoard}   gameboard   Gameboard
     * @param {GameMove}    move        Move
     */
    move(gameboard, move){
        gameboard_json = JSON.stringify(gameboard);
        move_json      = JSON.stringify(move);
        return fetch(
            this._url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: {
                    command: 'move',
                    args: {
                        board: gameboard_json,
                        playermove: move_json
                    }
                }
            }
        );
    }

    /**
     * Get value of game state.
     * 
     * @param {GameState} gamestate Game state
     */
    value(gamestate){
        let gamestate_json = gamestate.toJSON();
        let params = {
            command: 'value',
            args: {
                gamestate: gamestate_json,
                turn: gamestate.turn
            }
        };
        return fetch(
            this._url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(params)
            }
        )
        .then((response) => response.json())
        .then((response) => response.response);
    }
}

var server = new Server('https://feup-plog-tp1-staging.herokuapp.com/');
