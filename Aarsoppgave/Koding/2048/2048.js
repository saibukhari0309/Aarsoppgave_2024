var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //Lager en div-tagg for spillet
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

let seconds = 0; // Initialiser tiden til 0
let timerInterval; // Variabel for å lagre referansen til tidtakeren

// Oppdater tiden hvert sekund
timerInterval = setInterval(updateTime, 1000);

// Funksjon for å oppdatere tiden
function updateTime() {
    seconds++; // Øk tiden med ett sekund
    let formattedTime = formatTime(seconds); // Formater tiden til minutter og sekunder
    document.getElementById('time').textContent = formattedTime; // Oppdater visningen av tiden i HTML

    // Sjekk om spilleren har nådd brikken 2048
    if (highestTileValue() >= 2048) {
        clearInterval(timerInterval); // Stopp tidtakeren
        showCongratulations(); // Vis gratulasjonsboksen
    }
    else if (isGameOver()) {
        clearInterval(timerInterval);
        showGameovers(); // Vis game over boksen
    }

}

function isGameOver() {
    // Sjekk om brettet er fullt
    if (isBoardFull()) {
        // Sjekk om det ikke er noen mulige bevegelser igjen
        if (!areMovesPossible()) {
            return true; // Spillet er over
        }
    }
    return false; // Spillet er ikke over
}

function isBoardFull() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 0) {
                return false; // Brettet er ikke fullt
            }
        }
    }
    console.log("Full")
    return true; // Brettet er fullt
}

function areMovesPossible() {
    // Simuler en bevegelse i hver retning
    return slideUp(false) || slideDown(false) || slideLeft(false) || slideRight(false);
}

// Funksjon for å vise gratulasjonsboksen
function showCongratulations() {
    document.getElementById('congrats-box').style.display = 'block'; // Vis gratulasjonsboksen
}

// Funksjon for å vise game over boksen
function showGameovers() {
    document.getElementById('game-over-box').style.display = 'block'; // Vis game over boksen
}

// Funksjon for å formatere tiden til minutter og sekunder
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60); // Beregn antall hele minutter
    let remainingSeconds = seconds % 60; // Beregn gjenværende sekunder etter hele minutter

    // Legg til ledende nuller hvis nødvendig for å opprettholde et tosifret tall for sekunder
    let formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + formattedSeconds; // Returner formatert tidsstreng
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft(makeChanges = true);
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight(makeChanges = true);
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp(makeChanges = true);
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown(makeChanges = true);
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    return row.filter(num => num != 0); // lager en ny array uten null
}

function slide(row) {
    row = filterZero(row); //bli kvitt 0 -> [2, 2, 2]

    // slide
    for (let i = 0; i < row.length - 1; i++) {
        // sjekk brikke 2
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        } // [2, 2, 2] -> [4, 0, 2 ]
    }

    row = filterZero(row); // [4, 2]

    // Legger 0-ere tilbake
    while (row.length < columns) {
        row.push(0);
    } // [4, 2, 0, 0]

    return row;
}

function slideLeft(makeChanges) {
    var hasChanged = false
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let updaterow = slide(row);
        board[r] = updaterow;
        if (JSON.stringify(row) !== JSON.stringify(updaterow)) {
            hasChanged = true
        }
        if (makeChanges) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }

    }
    return hasChanged;
}

function slideRight(makeChanges) {
    var hasChanged = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        let updaterow = slide(row);
        row.reverse();
        updaterow.reverse();
        board[r] = updaterow;
        if (JSON.stringify(row) !== JSON.stringify(updaterow)) {
            hasChanged = true
        }

        if (makeChanges) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }



    }
    return hasChanged;
}

function slideUp(makeChanges) {
    var hasChanged = false;
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
        //  column = slide(column);


        let updatecolumn = slide(column);
        if (makeChanges) {
            for (let r = 0; r < rows; r++) {
                board[r][c] = updatecolumn[r];
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }


        if (JSON.stringify(column) !== JSON.stringify(updatecolumn)) {
            hasChanged = true
        }

        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
    }
    return hasChanged;
}


function slideDown(makeChanges) {
    var hasChanged = false;
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
        column.reverse();
        // column = slide(column);
        

        let updatecolumn = slide(column);
        updatecolumn.reverse();
        column.reverse();
        if (makeChanges) {
            for (let r = 0; r < rows; r++) {
                board[r][c] = updatecolumn[r];
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }
        if (JSON.stringify(column) !== JSON.stringify(updatecolumn)) {
            hasChanged = true
        }
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

    }
    return hasChanged;
}

// Sjekk etter brikke 2048 og vis gratuleringsboksen
function checkFor2048() {
    if (highestTileValue() >= 2048) {
        document.getElementById("congrats-box").style.display = "block";
    }
}

// Hent høyeste verdi på brettet
function highestTileValue() {
    let max = 0;
    for (let row of board) {
        for (let tile of row) {
            if (tile > max) {
                max = tile;
            }
        }
    }
    return max;
}

// Legg til event listeners for knapper/lenker
document.getElementById("go-back-btn").addEventListener("click", goBack);
document.getElementById("save-score-btn").addEventListener("click", saveScore);
document.getElementById("continue-playing-btn").addEventListener("click", continuePlaying);

function goBack() {
    window.location.href = 'index.html';
}


function saveScore() {
    console.log('Score lagret: ' + score + ' Tid: ' + time);
}


function continuePlaying() {
    document.getElementById("congrats-box").style.display = "none";
    document.getElementsByName(formatTime);
}
