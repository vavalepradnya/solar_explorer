class OrbitSpeedSlide {
    constructor() {
        this.canvas = document.getElementById('orbitCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.sun = {
            x: 0,
            y: 0,
            radius: 40,
            color: '#FDB813'
        };

        this.orbits = [
            { radius: 130, name: 'Mercury Orbit', color: '#8C7853' },
            { radius: 200, name: 'Earth Orbit', color: '#4a90e2' }
        ];

        this.mercury = {
            x: 0,
            y: 0,
            radius: 10,
            color: '#8C7853',
            angle: 0,
            speed: 0.015,
            orbitRadius: 130,
            orbitsCompleted: 0,
            trail: []
        };

        this.earth = {
            x: 0,
            y: 0,
            radius: 15,
            color: '#4a90e2',
            angle: 0,
            speed: 0.006,
            orbitRadius: 200,
            orbitsCompleted: 0,
            trail: []
        };

        this.gameState = {
            isRunning: false,
            isPaused: false,
            timeElapsed: 0,
            startTime: null,
            pausedTime: 0
        };

        this.voiceMuted = false;
        this.maxTrailLength = 60;

        this.setupEventListeners();
        this.startAnimation();
        this.speak('Welcome back, astronaut. Planets closer to the Sun move faster. Let\'s compare Mercury and Earth.');
    }

    setupCanvas() {
        this.canvas.width = 520;
        this.canvas.height = 520;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.gameState.isRunning) {
            this.gameState.isRunning = true;
            this.gameState.isPaused = false;
            this.gameState.startTime = Date.now() - this.gameState.pausedTime;
            
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
            
            this.speak('Watch carefully. Mercury is moving much faster than Earth. This is because it is closer to the Sun\'s gravity.');
        }
    }

    pause() {
        if (this.gameState.isRunning) {
            this.gameState.isRunning = false;
            this.gameState.isPaused = true;
            this.gameState.pausedTime = Date.now() - this.gameState.startTime;
            
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
        }
    }

    reset() {
        this.gameState.isRunning = false;
        this.gameState.isPaused = false;
        this.gameState.timeElapsed = 0;
        this.gameState.startTime = null;
        this.gameState.pausedTime = 0;

        this.mercury.angle = 0;
        this.mercury.orbitsCompleted = 0;
        this.mercury.trail = [];

        this.earth.angle = 0;
        this.earth.orbitsCompleted = 0;
        this.earth.trail = [];

        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('timeElapsed').textContent = '0';
        document.getElementById('mercuryOrbits').textContent = '0';
        document.getElementById('earthOrbits').textContent = '0';
        document.getElementById('feedbackMessage').textContent = '';
        document.getElementById('mercurySpeedBar').style.width = '0%';
        document.getElementById('earthSpeedBar').style.width = '0%';
    }

    updatePositions() {
        if (!this.gameState.isRunning) return;

        this.gameState.timeElapsed = Math.floor((Date.now() - this.gameState.startTime) / 1000);

        const prevMercuryAngle = this.mercury.angle;
        const prevEarthAngle = this.earth.angle;

        this.mercury.angle += this.mercury.speed;
        this.earth.angle += this.earth.speed;

        if (this.mercury.angle > Math.PI * 2) {
            this.mercury.orbitsCompleted++;
            this.mercury.angle -= Math.PI * 2;
            this.speak('Amazing! Mercury completed its year in just 88 Earth days.');
        }

        if (this.earth.angle > Math.PI * 2) {
            this.earth.orbitsCompleted++;
            this.earth.angle -= Math.PI * 2;
            this.speak('Earth takes 365 days to complete one orbit. Distance affects speed in space.');
        }

        this.mercury.x = this.centerX + Math.cos(this.mercury.angle) * this.mercury.orbitRadius;
        this.mercury.y = this.centerY + Math.sin(this.mercury.angle) * this.mercury.orbitRadius;

        this.earth.x = this.centerX + Math.cos(this.earth.angle) * this.earth.orbitRadius;
        this.earth.y = this.centerY + Math.sin(this.earth.angle) * this.earth.orbitRadius;

        this.addTrail(this.mercury);
        this.addTrail(this.earth);

        this.updateUI();
    }

    addTrail(planet) {
        planet.trail.push({
            x: planet.x,
            y: planet.y,
            opacity: 1
        });

        if (planet.trail.length > this.maxTrailLength) {
            planet.trail.shift();
        }

        planet.trail.forEach((point, index) => {
            point.opacity = (index / planet.trail.length) * 0.6;
        });
    }

    updateUI() {
        document.getElementById('timeElapsed').textContent = this.gameState.timeElapsed;
        document.getElementById('mercuryOrbits').textContent = this.mercury.orbitsCompleted;
        document.getElementById('earthOrbits').textContent = this.earth.orbitsCompleted;

        const mercurySpeed = this.gameState.isRunning ? 100 : 0;
        const earthSpeed = this.gameState.isRunning ? 60 : 0;

        document.getElementById('mercurySpeedBar').style.width = mercurySpeed + '%';
        document.getElementById('earthSpeedBar').style.width = earthSpeed + '%';
    }

    startAnimation() {
        const animate = () => {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawStars();
            this.drawOrbits();
            this.drawPlanetTrails();
            this.drawSun();
            this.drawPlanets();

            this.updatePositions();

            requestAnimationFrame(animate);
        };
        animate();
    }

    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 120; i++) {
            const x = Math.sin(i * 12.9898 + this.gameState.timeElapsed * 0.01) * this.canvas.width * 0.45 + this.canvas.width * 0.5;
            const y = Math.cos(i * 78.233) * this.canvas.height * 0.45 + this.canvas.height * 0.5;
            const size = Math.sin(i * 43.614) * 1 + 0.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    drawOrbits() {
        for (let orbit of this.orbits) {
            this.ctx.strokeStyle = orbit.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, orbit.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawPlanetTrails() {
        this.drawTrail(this.mercury, '#8C7853');
        this.drawTrail(this.earth, '#4a90e2');
    }

    drawTrail(planet, color) {
        for (let i = 0; i < planet.trail.length; i++) {
            const point = planet.trail[i];
            this.ctx.fillStyle = color.replace(')', `, ${point.opacity})`).replace('rgb', 'rgba');
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawSun() {
        const sunGradient = this.ctx.createRadialGradient(this.centerX - 10, this.centerY - 10, 0, this.centerX, this.centerY, this.sun.radius);
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
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius + 10, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawPlanets() {
        this.drawPlanet(this.mercury, '#D0C0B0', '#8C7853');
        this.drawPlanet(this.earth, '#4a90e2', '#2E5C8A');
    }

    drawPlanet(planet, lightColor, darkColor) {
        const gradient = this.ctx.createRadialGradient(
            planet.x - 5, planet.y - 5, 0,
            planet.x, planet.y, planet.radius
        );
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, darkColor);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = 'rgba(100, 200, 255, 0.4)';
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        this.ctx.shadowBlur = 0;
    }

    speak(text) {
        if (this.voiceMuted) return;
        
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
    const slide = new OrbitSpeedSlide();

    setTimeout(() => {
        const container = document.querySelector('.orbit-speed-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
});
