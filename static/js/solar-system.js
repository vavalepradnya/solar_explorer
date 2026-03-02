class SolarSystem {
    constructor() {
        this.canvas = document.getElementById('solarCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.polyfillRoundRect();
        this.animationId = null;
        this.isJourneyMode = false;
        this.currentPlanetIndex = 0;
        this.journeyInProgress = false;
        this.voiceMuted = false;
        this.hoveredPlanet = null;
        this.planetsFrozen = false;
        
        this.sun = {
            x: 0,
            y: 0,
            radius: 40,
            color: '#FDB813',
            glowColor: 'rgba(253, 184, 19, 0.4)'
        };

        this.planets = [
            {
                name: 'Mercury',
                radius: 8,
                distance: 90,
                speed: 0.04,
                color: '#8C7853',
                angle: 0,
                info: [
                    'Mercury is the smallest planet in our solar system.',
                    'It is the closest planet to the Sun.',
                    'It has no atmosphere and extreme temperature variations.',
                    'A day on Mercury is longer than its year.',
                    'It is named after the Roman messenger god.'
                ]
            },
            {
                name: 'Venus',
                radius: 12,
                distance: 130,
                speed: 0.03,
                color: '#FFC649',
                angle: 1.5,
                info: [
                    'Venus is the hottest planet with temperatures up to 465°C.',
                    'It has a thick atmosphere of carbon dioxide and sulfuric acid.',
                    'Venus rotates backwards compared to most planets.',
                    'It is the brightest planet visible from Earth.',
                    'It takes longer to rotate on its axis than to orbit the Sun.'
                ]
            },
            {
                name: 'Earth',
                radius: 13,
                distance: 180,
                speed: 0.025,
                color: '#4A90E2',
                angle: 3,
                info: [
                    'Earth is the only known planet with life.',
                    'It has one moon that controls tides in our oceans.',
                    'About 71% of Earth\'s surface is covered by water.',
                    'It takes 365.25 days to orbit the Sun.',
                    'The atmosphere protects life from harmful solar radiation.'
                ]
            },
            {
                name: 'Mars',
                radius: 10,
                distance: 230,
                speed: 0.02,
                color: '#E27B58',
                angle: 4.5,
                info: [
                    'Mars is known as the Red Planet due to iron oxide on its surface.',
                    'It has the largest volcano in the solar system called Olympus Mons.',
                    'Evidence suggests Mars once had liquid water on its surface.',
                    'It has two small moons named Phobos and Deimos.',
                    'Mars is a prime target for future human exploration.'
                ]
            },
            {
                name: 'Jupiter',
                radius: 28,
                distance: 320,
                speed: 0.01,
                color: '#C88B3A',
                angle: 1,
                hasRings: false,
                info: [
                    'Jupiter is the largest planet in our solar system.',
                    'It is a gas giant composed mainly of hydrogen and helium.',
                    'The Great Red Spot is a storm larger than Earth itself.',
                    'Jupiter has 79 known moons, including the four large Galilean moons.',
                    'It rotates faster than any other planet with a day lasting only 10 hours.'
                ]
            },
            {
                name: 'Saturn',
                radius: 24,
                distance: 420,
                speed: 0.008,
                color: '#FAD5A5',
                angle: 2.5,
                hasRings: true,
                info: [
                    'Saturn is famous for its magnificent ring system.',
                    'It is a gas giant with over 80 known moons.',
                    'Saturn is the second largest planet in our solar system.',
                    'The rings are composed of billions of ice and rock particles.',
                    'Saturn is less dense than water and would float if placed in an ocean.'
                ]
            },
            {
                name: 'Uranus',
                radius: 18,
                distance: 500,
                speed: 0.006,
                color: '#4FD0E7',
                angle: 5,
                info: [
                    'Uranus is an ice giant with a blue-green color from methane in its atmosphere.',
                    'It rotates on its side with an axial tilt of 98 degrees.',
                    'Uranus has at least 27 known moons.',
                    'It was the first planet discovered in modern times in 1781.',
                    'Wind speeds on Uranus can exceed 2100 km/h.'
                ]
            },
            {
                name: 'Neptune',
                radius: 18,
                distance: 580,
                speed: 0.005,
                color: '#4166F5',
                angle: 0.5,
                info: [
                    'Neptune is the farthest planet from the Sun in our solar system.',
                    'It is an ice giant with a deep blue color caused by methane absorption.',
                    'Neptune has the fastest winds of any planet reaching 2100 km/h.',
                    'It was discovered in 1846 based on mathematical predictions.',
                    'Neptune has 14 known moons, with Triton being the largest.'
                ]
            },
            {
                name: 'Pluto',
                radius: 11,
                distance: 650,
                speed: 0.0015,
                color: '#8B4513',
                angle: 3.5,
                info: [
                    'Pluto was discovered in 1930 and was considered the ninth planet.',
                    'It was reclassified as a dwarf planet in 2006 by the IAU.',
                    'Pluto has a thin atmosphere that freezes and falls as snow during its distant orbit.',
                    'It has five known moons, with Charon being the largest.',
                    'Pluto is the only dwarf planet in our solar system that has been visited by a spacecraft.'
                ]
            }
        ];

        this.setupCanvas();
        this.setupEventListeners();
        this.startAnimation();
    }

    polyfillRoundRect() {
        if (!this.ctx.roundRect) {
            this.ctx.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
            };
        }
    }

    setupCanvas() {
        const wrapper = document.querySelector('.canvas-wrapper');
        this.canvas.width = Math.min(1400, wrapper.clientWidth - 40);
        this.canvas.height = this.canvas.width;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const wrapper = document.querySelector('.canvas-wrapper');
        this.canvas.width = Math.min(1400, wrapper.clientWidth - 40);
        this.canvas.height = this.canvas.width;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            if (this.planetsFrozen) {
                this.resumePlanets();
            } else {
                this.startJourney();
            }
        });
        document.getElementById('stopBtn').addEventListener('click', () => this.stopJourney());
        document.getElementById('muteBtn').addEventListener('click', () => this.toggleMute());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.clearHover());
    }

    startAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawBackground();
            this.drawSun();
            this.drawOrbits();
            this.updateAndDrawPlanets();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    drawBackground() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 150; i++) {
            const x = Math.sin(i * 12.9898) * this.canvas.width * 0.5 + this.canvas.width * 0.5;
            const y = Math.cos(i * 78.233) * this.canvas.height * 0.5 + this.canvas.height * 0.5;
            const size = Math.sin(i * 43.614) * 1 + 0.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    drawSun() {
        const glow = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.sun.radius * 3);
        glow.addColorStop(0, 'rgba(253, 184, 19, 0.3)');
        glow.addColorStop(1, 'rgba(253, 184, 19, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(this.centerX - this.sun.radius * 3, this.centerY - this.sun.radius * 3, this.sun.radius * 6, this.sun.radius * 6);

        const sunGradient = this.ctx.createRadialGradient(this.centerX - 5, this.centerY - 5, 0, this.centerX, this.centerY, this.sun.radius);
        sunGradient.addColorStop(0, '#FFEB3B');
        sunGradient.addColorStop(0.5, '#FDB813');
        sunGradient.addColorStop(1, '#F57C00');
        this.ctx.fillStyle = sunGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(253, 184, 19, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.sun.radius + 3, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawOrbits() {
        this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.planets.forEach(planet => {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, planet.distance, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }

    updateAndDrawPlanets() {
        this.planets.forEach((planet, index) => {
            if (!this.isJourneyMode && !this.planetsFrozen) {
                planet.angle += planet.speed;
            }

            const x = this.centerX + Math.cos(planet.angle) * planet.distance;
            const y = this.centerY + Math.sin(planet.angle) * planet.distance;

            this.drawPlanet3D(x, y, planet);

            if (planet.hasRings) {
                this.drawSaturnRings(x, y, planet);
            }

            if (this.hoveredPlanet === index) {
                this.ctx.strokeStyle = '#64c8ff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(x, y, planet.radius + 5, 0, Math.PI * 2);
                this.ctx.stroke();
                
                if (this.planetsFrozen) {
                    this.drawArrowToPlanet(x, y, planet);
                }
            }

            if (this.isJourneyMode && this.currentPlanetIndex === index) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, planet.radius + 8, 0, Math.PI * 2);
                this.ctx.stroke();

                const orbitGradient = this.ctx.createRadialGradient(this.centerX, this.centerY, planet.distance - 2, this.centerX, this.centerY, planet.distance + 2);
                orbitGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
                orbitGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                this.ctx.strokeStyle = orbitGradient;
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, this.centerY, planet.distance, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            planet.x = x;
            planet.y = y;
        });
    }
    drawPlanet3D(x, y, planet) {
        const lightX = this.centerX - 100;
        const lightY = this.centerY - 100;
        const lightDistance = Math.sqrt((x - lightX) ** 2 + (y - lightY) ** 2);
        const lightNormX = (x - lightX) / lightDistance;
        const lightNormY = (y - lightY) / lightDistance;

        const planetGradient = this.ctx.createRadialGradient(
            x - lightNormX * planet.radius * 0.3,
            y - lightNormY * planet.radius * 0.3,
            0,
            x,
            y,
            planet.radius
        );

        if (planet.name === 'Saturn') {
            planetGradient.addColorStop(0, '#FFFACD');
            planetGradient.addColorStop(0.3, '#FFE77D');
            planetGradient.addColorStop(0.6, planet.color);
            planetGradient.addColorStop(0.85, '#9B7D4D');
            planetGradient.addColorStop(1, '#4A3C2A');
        } else if (planet.name === 'Jupiter') {
            planetGradient.addColorStop(0, '#FFD89B');
            planetGradient.addColorStop(0.4, planet.color);
            planetGradient.addColorStop(0.7, '#8B5A2B');
            planetGradient.addColorStop(1, '#3D2817');
        } else if (planet.name === 'Earth') {
            planetGradient.addColorStop(0, '#87CEEB');
            planetGradient.addColorStop(0.4, '#4A90E2');
            planetGradient.addColorStop(0.7, '#2E5C8A');
            planetGradient.addColorStop(1, '#0F2847');
        } else {
            planetGradient.addColorStop(0, this.lightenColor(planet.color, 40));
            planetGradient.addColorStop(0.4, planet.color);
            planetGradient.addColorStop(0.75, this.darkenColor(planet.color));
            planetGradient.addColorStop(1, this.darkenColor(planet.color, 30));
        }

        this.ctx.fillStyle = planetGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = `rgba(0, 0, 0, 0.3)`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        const specularX = x - lightNormX * planet.radius * 0.4;
        const specularY = y - lightNormY * planet.radius * 0.4;
        const specularGradient = this.ctx.createRadialGradient(specularX, specularY, 0, specularX, specularY, planet.radius * 0.3);
        specularGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        specularGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = specularGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        const shadowGradient = this.ctx.createRadialGradient(
            x + lightNormX * planet.radius * 0.5,
            y + lightNormY * planet.radius * 0.5,
            0,
            x,
            y,
            planet.radius
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        this.ctx.fillStyle = shadowGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSaturnRings(x, y, planet) {
        this.ctx.strokeStyle = 'rgba(218, 165, 32, 0.7)';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, planet.radius * 2.5, planet.radius * 0.9, 0.3, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(184, 134, 11, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, planet.radius * 2.3, planet.radius * 0.7, 0.3, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawArrowToPlanet(x, y, planet) {
        const arrowLength = 40;
        const arrowWidth = 15;
        
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const normX = dx / dist;
        const normY = dy / dist;
        
        const startX = x - normX * (planet.radius + 25);
        const startY = y - normY * (planet.radius + 25);
        const endX = x - normX * (planet.radius + 5);
        const endY = y - normY * (planet.radius + 5);
        
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        const angle = Math.atan2(normY, normX);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - Math.cos(angle - 0.5) * arrowWidth, endY - Math.sin(angle - 0.5) * arrowWidth);
        this.ctx.lineTo(endX - Math.cos(angle + 0.5) * arrowWidth, endY - Math.sin(angle + 0.5) * arrowWidth);
        this.ctx.closePath();
        this.ctx.fill();
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = percent;
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    darkenColor(color, amount = 30) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = -amount;
        const R = Math.max(0, (num >> 16) + amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) + amt);
        const B = Math.max(0, (num & 0x0000FF) + amt);
        return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.hoveredPlanet = null;

        for (let i = 0; i < this.planets.length; i++) {
            const planet = this.planets[i];
            const distance = Math.sqrt((mouseX - planet.x) ** 2 + (mouseY - planet.y) ** 2);

            if (distance < planet.radius + 10) {
                this.hoveredPlanet = i;
                this.showTooltip(planet);
                this.speakPlanetName(planet.name);
                break;
            }
        }
    }

    clearHover() {
        this.hoveredPlanet = null;
        document.getElementById('infoTooltip').style.display = 'none';
    }

    showTooltip(planet) {
        const tooltip = document.getElementById('infoTooltip');
        tooltip.innerHTML = `<div class="planet-name">${planet.name}</div>`;
        tooltip.style.display = 'block';
    }

    startJourney() {
        this.isJourneyMode = true;
        this.journeyInProgress = true;
        this.planetsFrozen = false;
        this.currentPlanetIndex = 0;
        document.getElementById('startBtn').disabled = true;
        this.presentPlanet();
    }

    stopJourney() {
        this.isJourneyMode = false;
        this.journeyInProgress = false;
        this.planetsFrozen = true;
        this.currentPlanetIndex = 0;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('infoTooltip').style.display = 'none';
        window.speechSynthesis.cancel();
        this.hoveredPlanet = null;
    }

    resumePlanets() {
        this.planetsFrozen = false;
        document.getElementById('startBtn').disabled = false;
    }

    presentPlanet() {
        if (!this.journeyInProgress || this.currentPlanetIndex >= this.planets.length) {
            this.stopJourney();
            return;
        }

        const planet = this.planets[this.currentPlanetIndex];
        const tooltip = document.getElementById('infoTooltip');
        let content = `<div class="planet-name">${planet.name}</div><div class="planet-info-detailed">`;

        planet.info.forEach(line => {
            content += `<div class="info-line">${line}</div>`;
        });
        content += '</div>';

        tooltip.innerHTML = content;
        tooltip.style.display = 'block';

        const fullText = `${planet.name}. ${planet.info.join(' ')}`;
        this.speak(fullText, () => {
            this.currentPlanetIndex++;
            setTimeout(() => this.presentPlanet(), 500);
        });
    }

    speakPlanetName(name) {
        if (this.voiceMuted || this.journeyInProgress) return;
        if (this.planetsFrozen) {
            const utterance = new SpeechSynthesisUtterance(name);
            utterance.rate = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    speak(text, callback) {
        if (this.voiceMuted) {
            setTimeout(callback, 1000);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = callback;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    toggleMute() {
        this.voiceMuted = !this.voiceMuted;
        const btn = document.getElementById('muteBtn');
        if (this.voiceMuted) {
            btn.classList.add('muted');
            btn.textContent = '🔇 Voice Muted';
        } else {
            btn.classList.remove('muted');
            btn.textContent = '🔊 Mute Voice';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
});
