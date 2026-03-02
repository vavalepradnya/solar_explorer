class DragDropOrbitGame {
    constructor() {
        this.canvas = document.getElementById('orbitGameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.sun = {
            x: this.centerX,
            y: this.centerY,
            radius: 35,
            color: '#FDB813'
        };

        this.orbits = [
            { radius: 100, name: 'Orbit 1 - Closest', targetOrbit: true, color: 'rgba(100, 200, 255, 0.3)' },
            { radius: 150, name: 'Orbit 2', targetOrbit: false, color: 'rgba(100, 200, 255, 0.2)' },
            { radius: 200, name: 'Orbit 3', targetOrbit: false, color: 'rgba(100, 200, 255, 0.15)' },
            { radius: 250, name: 'Orbit 4', targetOrbit: false, color: 'rgba(100, 200, 255, 0.1)' }
        ];

        this.mercury = {
            x: this.centerX - 120,
            y: this.centerY + 80,
            radius: 12,
            color: '#8C7853',
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            originalX: 0,
            originalY: 0
        };

        this.gameState = {
            isCorrect: false,
            hoveredOrbit: null,
            showSuccess: false
        };

        this.mercury.originalX = this.mercury.x;
        this.mercury.originalY = this.mercury.y;

        this.setupEventListeners();
        this.startAnimation();
        this.speak('Welcome astronaut! Drag Mercury into the correct orbit. Remember, Mercury is the closest planet to the Sun.');
    }

    setupCanvas() {
        this.canvas.width = 360;
        this.canvas.height = 360;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isPointInMercury(x, y)) {
            this.mercury.isDragging = true;
            this.mercury.offsetX = x - this.mercury.x;
            this.mercury.offsetY = y - this.mercury.y;
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.mercury.isDragging) {
            this.mercury.x = x - this.mercury.offsetX;
            this.mercury.y = y - this.mercury.offsetY;

            this.gameState.hoveredOrbit = this.checkOrbitHover();
        } else {
            this.gameState.hoveredOrbit = null;
        }
    }

    handleMouseUp(e) {
        if (this.mercury.isDragging) {
            this.mercury.isDragging = false;
            this.checkIfCorrect();
        }
    }

    handleMouseLeave(e) {
        this.mercury.isDragging = false;
        this.gameState.hoveredOrbit = null;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (this.isPointInMercury(x, y)) {
            this.mercury.isDragging = true;
            this.mercury.offsetX = x - this.mercury.x;
            this.mercury.offsetY = y - this.mercury.y;
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.mercury.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        this.mercury.x = x - this.mercury.offsetX;
        this.mercury.y = y - this.mercury.offsetY;

        this.gameState.hoveredOrbit = this.checkOrbitHover();
    }

    handleTouchEnd(e) {
        e.preventDefault();
        if (this.mercury.isDragging) {
            this.mercury.isDragging = false;
            this.checkIfCorrect();
        }
    }

    isPointInMercury(x, y) {
        const dx = x - this.mercury.x;
        const dy = y - this.mercury.y;
        return Math.sqrt(dx * dx + dy * dy) < this.mercury.radius + 10;
    }

    checkOrbitHover() {
        for (let orbit of this.orbits) {
            const distance = Math.hypot(this.mercury.x - this.centerX, this.mercury.y - this.centerY);
            const orbitDistance = Math.abs(distance - orbit.radius);
            
            if (orbitDistance < 40) {
                return orbit;
            }
        }
        return null;
    }

    checkIfCorrect() {
        const distance = Math.hypot(this.mercury.x - this.centerX, this.mercury.y - this.centerY);
        const correctOrbit = this.orbits.find(o => o.targetOrbit);
        const orbitDistance = Math.abs(distance - correctOrbit.radius);

        if (orbitDistance < 30) {
            this.gameState.isCorrect = true;
            this.gameState.showSuccess = true;
            this.showFeedback('success', '✨ Correct! Mercury is the closest planet to the Sun.');
            this.speak('Excellent! Mercury is the first planet.');
            document.getElementById('nextBtn').disabled = false;

            this.animateMercuryToOrbit(correctOrbit.radius);
        } else {
            this.gameState.isCorrect = false;
            this.showFeedback('error', '❌ Try again! Mercury is the closest planet.');
            this.speak('Not quite. Try placing it closer to the Sun.');
            this.animateReturnMercury();
        }
    }

    animateMercuryToOrbit(targetRadius) {
        const startAngle = Math.atan2(this.mercury.y - this.centerY, this.mercury.x - this.centerX);
        const frames = 30;
        let frame = 0;

        const animate = () => {
            frame++;
            const progress = Math.min(frame / frames, 1);

            const currentX = this.mercury.x;
            const currentY = this.mercury.y;
            const distance = Math.hypot(currentX - this.centerX, currentY - this.centerY);

            const newDistance = distance + (targetRadius - distance) * progress;
            this.mercury.x = this.centerX + Math.cos(startAngle) * newDistance;
            this.mercury.y = this.centerY + Math.sin(startAngle) * newDistance;

            if (frame < frames) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    animateReturnMercury() {
        const frames = 20;
        let frame = 0;
        const startX = this.mercury.x;
        const startY = this.mercury.y;

        const animate = () => {
            frame++;
            const progress = frame / frames;

            this.mercury.x = startX + (this.mercury.originalX - startX) * progress;
            this.mercury.y = startY + (this.mercury.originalY - startY) * progress;

            if (frame < frames) {
                requestAnimationFrame(animate);
            } else {
                this.mercury.x = this.mercury.originalX;
                this.mercury.y = this.mercury.originalY;
            }
        };
        animate();
    }

    reset() {
        this.mercury.x = this.mercury.originalX;
        this.mercury.y = this.mercury.originalY;
        this.mercury.isDragging = false;
        this.gameState.isCorrect = false;
        this.gameState.showSuccess = false;
        this.gameState.hoveredOrbit = null;
        document.getElementById('feedbackMessage').innerHTML = '';
        document.getElementById('feedbackMessage').classList.remove('success', 'error');
        document.getElementById('taskInfo').textContent = 'Drag Mercury to the closest orbit around the Sun!';
    }

    showFeedback(type, message) {
        const feedbackEl = document.getElementById('feedbackMessage');
        feedbackEl.innerHTML = message;
        feedbackEl.className = `feedback-message ${type}`;
    }

    startAnimation() {
        const animate = () => {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawStars();
            this.drawOrbits();
            this.drawSun();
            this.drawMercury();

            requestAnimationFrame(animate);
        };
        animate();
    }

    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 150; i++) {
            const x = Math.sin(i * 12.9898) * this.canvas.width * 0.5 + this.canvas.width * 0.5;
            const y = Math.cos(i * 78.233) * this.canvas.height * 0.5 + this.canvas.height * 0.5;
            const size = Math.sin(i * 43.614) * 1 + 0.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    drawOrbits() {
        for (let i = 0; i < this.orbits.length; i++) {
            const orbit = this.orbits[i];
            const isHovered = this.gameState.hoveredOrbit === orbit;

            if (isHovered && !this.gameState.isCorrect) {
                this.ctx.strokeStyle = 'rgba(100, 255, 100, 0.6)';
                this.ctx.lineWidth = 3;
            } else if (this.gameState.isCorrect && orbit.targetOrbit) {
                this.ctx.strokeStyle = 'rgba(100, 255, 100, 0.8)';
                this.ctx.lineWidth = 3;
            } else {
                this.ctx.strokeStyle = orbit.color;
                this.ctx.lineWidth = 2;
            }

            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, orbit.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawSun() {
        const sunGradient = this.ctx.createRadialGradient(
            this.centerX - 10, this.centerY - 10, 0,
            this.centerX, this.centerY, this.sun.radius
        );
        sunGradient.addColorStop(0, '#FFEB3B');
        sunGradient.addColorStop(0.4, '#FDB813');
        sunGradient.addColorStop(1, '#FF8C00');

        this.ctx.fillStyle = sunGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius + 12, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius + 18, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawMercury() {
        const gradient = this.ctx.createRadialGradient(
            this.mercury.x - 4, this.mercury.y - 4, 0,
            this.mercury.x, this.mercury.y, this.mercury.radius
        );
        gradient.addColorStop(0, '#D0C0B0');
        gradient.addColorStop(1, '#8C7853');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.mercury.x, this.mercury.y, this.mercury.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.mercury.x, this.mercury.y, this.mercury.radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.75;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.cancel();
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DragDropOrbitGame();

    setTimeout(() => {
        const container = document.querySelector('.mercury-game-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
});
