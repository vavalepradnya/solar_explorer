class GravityWeightSlide {
    constructor() {
        this.GRAVITY_RATIO = 0.38;
        this.voiceMuted = false;
        this.setupEventListeners();
        this.startWelcomeNarration();
    }

    setupEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculate());
        document.getElementById('resetCalcBtn').addEventListener('click', () => this.resetCalculation());
        document.getElementById('weightInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
    }

    startWelcomeNarration() {
        const welcomeText = 'Welcome astronaut! Did you know your weight changes on different planets? That is because of gravity.';
        this.speak(welcomeText);
    }

    calculate() {
        const weightInput = document.getElementById('weightInput');
        const weight = parseFloat(weightInput.value);

        if (!weight || weight <= 0 || weight > 150) {
            this.speak('Please enter a valid weight between 20 and 150 kilograms.');
            return;
        }

        this.speak('Now calculating your weight on Mercury...');
        
        const mercuryWeight = Math.round((weight * this.GRAVITY_RATIO) * 10) / 10;
        const difference = Math.round((weight - mercuryWeight) * 10) / 10;

        setTimeout(() => {
            this.displayResults(weight, mercuryWeight, difference);
            this.animateMercuryAvatar();
            this.showExplanation();
            
            setTimeout(() => {
                const resultText = `Amazing! You are ${difference} kilograms lighter on Mercury. Mercury has weaker gravity — only 38 percent of Earth's gravity. That is why you weigh less. Weight depends on gravity. Mass stays the same. Only gravity changes your weight.`;
                this.speak(resultText);
            }, 500);
        }, 1500);
    }

    displayResults(earthWeight, mercuryWeight, difference) {
        const resultsSection = document.getElementById('resultsSection');
        document.getElementById('resultEarthWeight').textContent = `${earthWeight} kg`;
        document.getElementById('resultMercuryWeight').textContent = `${mercuryWeight} kg`;
        document.getElementById('resultDifference').textContent = `${difference} kg lighter`;

        document.getElementById('earthWeightDisplay').querySelector('.weight-value').textContent = `${earthWeight} kg`;
        document.getElementById('mercuryWeightDisplay').querySelector('.weight-value').textContent = `${mercuryWeight} kg`;

        resultsSection.style.display = 'block';
    }

    showExplanation() {
        const explanationPanel = document.getElementById('explanationPanel');
        explanationPanel.style.display = 'block';
    }

    animateMercuryAvatar() {
        const mercuryAvatar = document.getElementById('mercuryAvatar');
        mercuryAvatar.style.animation = 'none';
        
        setTimeout(() => {
            mercuryAvatar.style.animation = '';
        }, 10);

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                mercuryAvatar.style.transform = 'translateY(-30px)';
                setTimeout(() => {
                    mercuryAvatar.style.transform = 'translateY(0)';
                }, 200);
            }, i * 400);
        }
    }

    resetCalculation() {
        document.getElementById('weightInput').value = '';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('explanationPanel').style.display = 'none';
        
        document.getElementById('earthWeightDisplay').querySelector('.weight-value').textContent = '—';
        document.getElementById('mercuryWeightDisplay').querySelector('.weight-value').textContent = '—';
        
        this.speak('Calculation reset. Enter a new weight to explore!');
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
    new GravityWeightSlide();

    setTimeout(() => {
        const container = document.querySelector('.gravity-weight-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
});
