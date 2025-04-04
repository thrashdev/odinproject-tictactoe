function createBoard() {
    tiles = [
        // [1, 2, 3],
        // [4, 5, 6],
        // [7, 8, 9],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];


    function checkWinCondition(userId) {
        let found = tiles.some(row => row.every(val => val === userId));
        if (found) {
            return true;
        }

        cols = [
            [
                tiles[0][0],
                tiles[1][0],
                tiles[2][0],
            ],
            [
                tiles[0][1],
                tiles[1][1],
                tiles[2][1],
            ],
            [
                tiles[0][2],
                tiles[1][2],
                tiles[2][2],
            ],
        ];

        found = cols.some(col => col.every(val => val === userId));
        if (found) {
            return true;
        }

        crosses = [
            [
                tiles[0][0],
                tiles[1][1],
                tiles[2][2]
            ],
            [
                tiles[0][2],
                tiles[1][1],
                tiles[2][0]
            ]
        ];
    
        found = crosses.some(cross => cross.every(val => val === userId));
        if (found) {
            return true;
        }

        return false;
    }

    return { tiles, checkWinCondition };
}

function state() {
    const board = createBoard();
    const renderer = createRenderer(markTile);
    renderer.drawInit();

    const users = [];


    const uf = function userFactory(name) {
        let id = 1;
        function newUser(name) {
            return { name, id: id++ };
        }
        return { newUser };

    }();

    function addUserToBoard(name) {
        if (users.length >= 2) {
            return "all player slots are filled";
        }

        users.push(uf.newUser(name));
    }

    function markTile(row, col, u) {
        let user = {name: "Bob", id: 2};
        const tileValue = tiles[row][col];
        const emptyTileValue = 0;

        if (tileValue === user.id) {
            return "you already marked this tile";
        }

        if (tileValue !== emptyTileValue) {
            return "this tile has been marked by a different player";
        }

        tiles[row][col] = user.id;
        renderer.markTile(row, col, user.id);
        win = board.checkWinCondition(user.id);
        if (win) {
            return `${user.name} has won!`;
        }
        return "update successful";
    }

    return {addUserToBoard, markTile};
}


function createRenderer(markTileCallback) {
    function drawInit() {
        const tileElems = []
        for(let i = 0;i < 9; i++) {
            let col = i % 3;
            let row = Math.floor(i / 3)
            tileElems.push(makeTile(row, col));
        }            

        tileElems.forEach(el => el.addEventListener("click", (e) => {
            let col = Number(e.target.attributes["col"].nodeValue)
            let row = Number(e.target.attributes["row"].nodeValue)
            let result = markTileCallback(row, col, 1)
            console.log(result);
            
            
        }));
        const gridElem = document.querySelector(".game-board");
        
        tileElems.forEach(el => gridElem.appendChild(el));
    }

    function makeTile(row, col) {
        const tile = document.createElement("div");
        tile.classList.add("tile", "unmarked");
        tile.setAttribute("row", row);
        tile.setAttribute("col", col);

        return tile;
    }

    function markTile(row, col, user_id) {
        const elem = document.querySelector(`.tile[row="${row}"][col="${col}"]`);
        elem.classList.replace("unmarked", `marked-player-${user_id}`)
    }


    return {drawInit, markTile}
}

const dialog = document.getElementById("register-players-dialog");
dialog.showModal();
x = state();
