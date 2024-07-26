class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    render(towers, enemies, bullets, path) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPath(path);
        this.drawCastle(path[path.length - 1]);
        
        towers.forEach(tower => this.drawTower(tower));
        enemies.forEach(enemy => this.drawEnemy(enemy));
        bullets.forEach(bullet => this.drawBullet(bullet));
    }

    drawPath(path) {
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 20;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();
    }

    drawCastle(position) {
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(position.x - 25, position.y - 50, 50, 100);
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(position.x - 15, position.y + 10, 30, 40);
    }

    drawTower(tower) {
        this.ctx.fillStyle = tower.type.color;
        this.ctx.fillRect(tower.x - 10, tower.y - 10, 20, 20);

        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, tower.type.range, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.stroke();

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(tower.x - 15, tower.y - 20, 30, 5);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(tower.x - 15, tower.y - 20, (tower.health / 100) * 30, 5);
    }

    drawEnemy(enemy) {
        this.ctx.fillStyle = enemy.color;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(enemy.x - 15, enemy.y - 15 - enemy.size, 30, 5);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(enemy.x - 15, enemy.y - 15 - enemy.size, (enemy.health / enemy.maxHealth) * 30, 5);
    }

    drawBullet(bullet) {
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
