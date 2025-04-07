const playerId = 1

function createBoard() {
    tiles = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    /**
     * 
     * @param {number} userId 
     * @returns {boolean}
     */
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
    let board = createBoard();
    const renderer = createRenderer(markTile);

    const users = [];
    let currentUser = users[0];

    function init() {
        const btnNewRound = document.querySelector(".btn-new-round");
        btnNewRound.addEventListener("click", reset);
        renderer.drawInit();
    }

    const uf = function userFactory(name) {
        let id = 1;
        function newUser(name) {
            return { name, id: id++ };
        }
        return { newUser };

    }();

    function addUserToBoard(user) {
        if (users.length >= 2) {
            return "all player slots are filled";
        }

        users.push(user);
    }

    function setCurrentUser(u) {
        currentUser = u;
    }

    function markTile(row, col) {
        let user = currentUser;
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
        let newUserId = user.id === 2 ? 0 : 1;
        let newUser = users[newUserId];
        setCurrentUser(newUser);
        win = board.checkWinCondition(user.id);
        if (win) {
            return `${user.name} has won!`;
        }

        if(!board.tiles.some(row => row.some(el => el === 0))) {
            console.log(board.tiles);
            console.log(typeof(board.tiles));
            return "Tie!";
        }
    }


    function registerPlayers() {
        const dialog = document.getElementById("register-players-dialog");
        dialog.showModal();


        const dialogBtn = document.querySelector("#register-players-dialog button");
        dialogBtn.addEventListener("click", () => {
            const x = document.getElementById("player-1-name").value;
            const y = document.getElementById("player-2-name").value;

            savePlayerNames(x, y);
            users.push(uf.newUser(x));
            users.push(uf.newUser(y));
            const [user1, user2] = users;

            addUserToBoard(user1);
            addUserToBoard(user2);
            setCurrentUser(user1);
            dialog.close();
        });

        function savePlayerNames(p1Name, p2Name) {
            const p1NameBox = document.querySelector(".player-1 > p");
            p1NameBox.textContent = p1Name;

            const p2NameBox = document.querySelector(".player-2 > p");
            p2NameBox.textContent = p2Name;
        }
    }

    function reset() {
        board = createBoard();
        currentUser = users[0];
        renderer.redraw();       
    }

    return { markTile, init, registerPlayers };
}

/**
 * 
 * @param {function} markTileCallback 
 * @returns 
 */
function createRenderer(markTileCallback) {
    const winModal = document.getElementById("dialog-win-modal");
    const registerPlayersModal = document.getElementById("register-players-dialog");
    const modals = [winModal, registerPlayersModal]

    function drawInit() {
        const winModal = document.getElementById("dialog-win-modal");
        const winMessage = document.getElementById("win-message");
        winModal.addEventListener("win", (e) => {
            winMessage.textContent = e.detail;
            winModal.showModal();
        });

        const tileElems = makeTileElems();
        const gridElem = document.querySelector(".game-board");
        tileElems.forEach(el => gridElem.appendChild(el));
        registerPlayersModal.showModal();
    }
    
    function makeTileElems() {
        const tileElems = []
        for (let i = 0; i < 9; i++) {
            let col = i % 3;
            let row = Math.floor(i / 3)
            tileElems.push(makeTile(row, col));
        }
        tileElems.forEach(el => el.addEventListener("click", (e) => {
            let col = Number(e.target.attributes["col"].nodeValue);
            let row = Number(e.target.attributes["row"].nodeValue);
            const hasWonMessage = markTileCallback(row, col);
            if (hasWonMessage !== undefined) {
                const winEvent = new CustomEvent("win", {
                    detail: hasWonMessage
                });
                winModal.dispatchEvent(winEvent);
            }
        }));
        return tileElems;
    }

    function redraw() {
        modals.forEach(modal => modal.close());
        const tileElems = makeTileElems();
        const gridElem = document.querySelector(".game-board");
        gridElem.replaceChildren(...tileElems);
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


    return { drawInit, markTile, redraw }
}



x = state();
x.init();
x.registerPlayers();