class GameState {
    constructor() {
        this.money = CONFIG.INITIAL_MONEY;
        this.castleHealth = CONFIG.INITIAL_CASTLE_HEALTH;
        this.currentWave = 1;
        this.points = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.waveInProgress = false;
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers(event, data) {
        this.observers.forEach(observer => observer.update(event, data));
    }

    updateMoney(amount) {
        this.money += amount;
        this.notifyObservers('moneyUpdated', this.money);
    }

    updateCastleHealth(amount) {
        this.castleHealth += amount;
        this.notifyObservers('castleHealthUpdated', this.castleHealth);
        if (this.castleHealth <= 0) {
            this.endGame();
        }
    }

    updateWaveNumber() {
        this.currentWave++;
        this.notifyObservers('waveUpdated', this.currentWave);
    }

    updatePoints(amount) {
        this.points += amount;
        this.notifyObservers('pointsUpdated', this.points);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.notifyObservers('pauseToggled', this.isPaused);
    }

    endGame() {
        this.isGameOver = true;
        this.notifyObservers('gameOver');
    }

    startWave() {
        this.waveInProgress = true;
        this.notifyObservers('waveStarted');
    }

    endWave() {
        this.waveInProgress = false;
        this.notifyObservers('waveEnded');
    }
}
