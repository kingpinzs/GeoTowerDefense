class GameLogic {
    constructor(gameState, renderer) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.towers = [];
        this.enemies = [];
        this.bullets = [];
        this.currentPath = [];
    }

    update() {
        if (this.gameState.isGameOver || this.gameState.isPaused) return;

        this.updateTowers();
        this.updateEnemies();
        this.updateBullets();

        this.renderer.render(this.towers, this.enemies, this.bullets, this.currentPath);
    }

    updateTowers() {
        this.towers.forEach(tower => {
            const bullet = tower.update(this.enemies);
            if (bullet) this.bullets.push(bullet);
        });
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            const reachedEnd = enemy.move();
            if (reachedEnd) {
                this.gameState.updateCastleHealth(-10);
                return false;
            }
            if (enemy.health <= 0) {
                this.gameState.updateMoney(10);
                this.gameState.updatePoints(10);
                return false;
            }
            return true;
        });
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            const hit = bullet.move();
            if (hit) {
                const hitEnemy = this.enemies.find(enemy => 
                    Math.abs(enemy.x - bullet.x) < enemy.size && Math.abs(enemy.y - bullet.y) < enemy.size
                );
                if (hitEnemy) {
                    hitEnemy.health -= bullet.damage;
                }
                return false;
            }
            return true;
        });
    }

    startWave() {
        if (!this.gameState.waveInProgress) {
            this.gameState.startWave();
            this.spawnEnemies();
        }
    }

    spawnEnemies() {
        let enemiesSpawned = 0;
        const spawnInterval = setInterval(() => {
            if (this.gameState.isGameOver) {
                clearInterval(spawnInterval);
                return;
            }
            this.spawnEnemy();
            enemiesSpawned++;
            if (enemiesSpawned >= CONFIG.ENEMIES_PER_WAVE) {
                clearInterval(spawnInterval);
                this.gameState.endWave();
            }
        }, CONFIG.ENEMY_SPAWN_INTERVAL);
    }

    spawnEnemy() {
        const startPoint = this.currentPath[0];
        this.enemies.push(new Enemy(startPoint.x, startPoint.y, this.currentPath, this.gameState.currentWave));
    }

    addTower(x, y, type) {
        if (this.gameState.money >= type.cost && !this.isOnPath(x, y)) {
            this.towers.push(new Tower(x, y, type));
            this.gameState.updateMoney(-type.cost);
        }
    }

    isOnPath(x, y) {
        return this.currentPath.some((point, index) => {
            if (index === this.currentPath.length - 1) return false;
            const nextPoint = this.currentPath[index + 1];
            const distToSegment = this.distanceToLineSegment(x, y, point.x, point.y, nextPoint.x, nextPoint.y);
            return distToSegment < CONFIG.PATH_WIDTH;
        });
    }

    distanceToLineSegment(x, y, x1, y1, x2, y2) {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) param = dot / len_sq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
