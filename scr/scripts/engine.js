// Gerenciamento de status globais
const state = {
    view: {
        // elementos que manipulam valores na tela 
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        gameOverMessage: document.querySelector("#game-over-message"),
        gameOverText: document.querySelector("#game-over-text"),
        restartYes: document.querySelector("#restart-yes"),
        restartNo: document.querySelector("#restart-no")
    },
    values: {
        // declara os valores das variaveis
        volumeSom: 0.2,
        numSquares: 9,
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        currentLive: 3,
    },
    actions: {
        // realiza acoes do jogo
        timerId: null,
        countDownTimerId: null,
        hitBoxListeners: [], // Armazena os listeners para removê-los quando necessário
    },
};

// Função para inicializar o jogo
function initialize() {
    // limpa os temporizadores e recomeça o jogo
    startGameTimers();
    addListenerHitBox();
    hideGameOverMessage(); // esconde a mensagem de fim de jogo no começo
}

// Inicia os temporizadores
function startGameTimers() {
    // limpa os temporizadores anteriores, se houver
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);

    // inicia os novos temporizadores com a velocidade definida
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

// Função de contagem regressiva
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    // finaliza o jogo quando o tempo chegar a zero
    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        showGameOverMessage("Tempo esgotado! Seu resultado foi: " + state.values.result);
    }

    // verifica se as vidas chegaram a zero e finaliza o jogo
    if (state.values.currentLive <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        showGameOverMessage("Você perdeu todas as vidas! Seu resultado foi: " + state.values.result);
    }
}

// Função para mostrar a mensagem de Game Over
function showGameOverMessage(message) {
    state.view.gameOverText.textContent = message;
    state.view.gameOverMessage.style.display = "block"; // exibe a mensagem na tela
    showRestartButtons(); // exibe os botões de reinício
    removeHitBoxListeners(); // remove os listeners de clique
}

// Função para exibir os botões de reinício
function showRestartButtons() {
    state.view.restartYes.style.display = "inline-block";
    state.view.restartNo.style.display = "inline-block";

    // adiciona os eventos para os botões de reinício
    state.view.restartYes.addEventListener("click", restartGame);
    state.view.restartNo.addEventListener("click", endGame);
}

// Função para esconder a mensagem de fim de jogo
function hideGameOverMessage() {
    state.view.gameOverMessage.style.display = "none";
}

// Função para reiniciar o jogo
function restartGame() {
    // reseta os valores de tempo, vidas e velocidade
    state.values.currentTime = 60;
    state.values.currentLive = 3;
    state.values.result = 0;

    // atualiza a tela com os valores reiniciados
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.lives.textContent = state.values.currentLive;
    state.view.score.textContent = state.values.result;

    // limpa e reinicia os temporizadores
    clearInterval(state.actions.countDownTimerId); // Limpa o temporizador de contagem
    clearInterval(state.actions.timerId); // Limpa o temporizador do inimigo

    // recria os temporizadores
    startGameTimers();

    hideGameOverMessage(); // esconde a mensagem de fim de jogo
    initialize(); // reinicia os eventos de clique e o jogo
}

// Função para encerrar o jogo
function endGame() {
    alert("Obrigado por jogar!"); // exibe uma mensagem de despedida
    hideGameOverMessage(); // esconde a mensagem de fim de jogo
}

// Função para tocar o som
function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = state.values.volumeSom;
    audio.play();
}

// Função para definir um quadrado aleatório com o inimigo
function randomSquare() {
    state.view.squares.forEach(square => square.classList.remove("enemy"));
    let randomNumber = Math.floor(Math.random() * state.values.numSquares);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

// Função para adicionar o listener de clique nos quadrados
function addListenerHitBox() {
    state.view.squares.forEach(square => {
        let listener = () => handleSquareHit(square);
        square.addEventListener("mousedown", listener);
        state.actions.hitBoxListeners.push({ square, listener });
    });
}

// Ação que acontece quando um quadrado é clicado
function handleSquareHit(square) {
    if (square.id === state.values.hitPosition) { // se as posições do quadrado e do inimigo são iguais
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
    } else {
        state.values.currentLive--;
        state.view.lives.textContent = state.values.currentLive;
        playSound("fail");
        if (state.values.currentLive <= 0) {
            playSound("over");
            showGameOverMessage("Você perdeu todas as vidas! Seu resultado foi: " + state.values.result);
        }
    }
}

// Função para remover os listeners de clique
function removeHitBoxListeners() {
    state.actions.hitBoxListeners.forEach(({ square, listener }) => {
        square.removeEventListener("mousedown", listener);
    });
    state.actions.hitBoxListeners = []; // Limpa a lista de listeners
}

// Inicia o jogo ao carregar
initialize();
