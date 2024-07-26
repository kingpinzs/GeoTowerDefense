class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 100;
        this.cooldown = 0;
    }

    update(enemies) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return null;
        }

        const closestEnemy = this.findClosestEnemy(enemies);
        if (closestEnemy) {
            this.cooldown = this.type.fireRate;
            return new Bullet(this.x, this.y, closestEnemy, this.type.damage);
        }

        return null;
    }

    findClosestEnemy(enemies) {
        return enemies.reduce((closest, enemy) => {
            const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            return (distance < closest.distance && distance <= this.type.range) ? { enemy, distance } : closest;
        }, { distance: Infinity }).enemy;
    }
}

class Enemy {
    constructor(startX, startY, path, wave) {
        this.x = startX;
        this.y = startY;
        this.path = path;
        this.pathIndex = 0;
        this.health = 100 + (wave - 1) * 20;
        this.maxHealth = this.health;
        this.speed = 0.5 + (wave - 1) * 0.1;
        this.size = 5 + Math.min(5, wave - 1);
        this.color = wave % 2 === 0 ? 'darkred' : 'red';
    }

    move() {
        const targetPoint = this.path[this.pathIndex + 1];
        if (!targetPoint) return true;

        const dx = targetPoint.x - this.x;
        const dy = targetPoint.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            this.pathIndex++;
            return this.pathIndex === this.path.length - 1;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }

        return false;
    }
}

class Bullet {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
    }

    move() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > CONFIG.BULLET_SPEED) {
            this.x += (dx / distance) * CONFIG.BULLET_SPEED;
            this.y += (dy / distance) * CONFIG.BULLET_SPEED;
            return false;
        }

        return true;
    }
}
