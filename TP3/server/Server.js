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
     * @param {List[List[Integer]]}   gameboard   Gameboard
     * @param {GameMove}    move        Move
     */
    move(gameboard, move){
        // let gameboard_json = gameboard.toJSON();
        let gameboard_json = gameboard;
        let move_json      = move.toJSON();
        let params = {
            command: 'move',
            args: {
                board: gameboard_json,
                playermove: move_json
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
        .then(function (response){
            if(!response.ok) return Promise.resolve({response: false});
            return response.json();
        })
        .then((response) => response.response);
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

    choose_move(gamestate, turn, level, n){
        let gamestate_json = gamestate.toJSON();
        let params = {
            command: 'choose_move',
            args: {
                gamestate: gamestate_json,
                turn: turn,
                level: level,
                n: n
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

    /**
     * Checks game over.
     * 
     * @param {GameState} gamestate Game state
     */
    game_over(gamestate){
        let gamestate_json = gamestate.toJSON();
        let params = {
            command: 'game_over',
            args: {
                gamestate: gamestate_json
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
