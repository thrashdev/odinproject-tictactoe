
function createBoard() {
    tiles = [
        // [1, 2, 3],
        // [4, 5, 6],
        // [7, 8, 9],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    function markTile(row, col, user) {
        // return board[row][col];
        const tileValue = tiles[row][col];
        const emptyTileValue = 0;

        if (tileValue === user.id) {
            return "you already marked this tile";
        }

        if (tileValue !== emptyTileValue) {
            return "this tile has been marked by a different player";
        }

        tiles[row][col] = user.id;
        win = checkWinCondition(user.id);
        return "update successful";
    }

    function checkWinCondition(userId) {
        board.forEach(row => {
            if (row.every(val => val === userId)) {
                return true;
            }
        });

        cols = [
            [
                board[0][0],
                board[0][1],
                board[0][2],
            ],
            [
                board[1][0],
                board[1][1],
                board[1][2],
            ],
            [
                board[2][0],
                board[2][1],
                board[2][2],
            ],
        ];

        cols.forEach(col => {
            if (col.every(val => val === userId)) {
                return true;
            }
        });

        crosses = [
            [
                board[0][0],
                board[1][1],
                board[2][2]
            ],
            [
                board[0][2],
                board[1][1],
                board[2][0]
            ]
        ];
    
        crosses.forEach(cross => {
            if (cross.every(val => val === userId)) {
                return true;
            }
        });

        return false;
    }

    return { tiles, markTile }
}

function gameState() {
    board = createBoard();
    users = [];

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
}

