document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameBoard');
    const gameState = new GameState();
    const renderer = new Renderer(canvas);
    const gameLogic = new GameLogic(gameState, renderer);

    // Set up UI event listeners and game loop here

    function gameLoop() {
        gameLogic.update();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
