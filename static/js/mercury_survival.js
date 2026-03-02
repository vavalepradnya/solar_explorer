document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dayBtn = document.getElementById('dayBtn');
    const nightBtn = document.getElementById('nightBtn');
    const atmosphereBtn = document.getElementById('atmosphereBtn');
    const scannerBtn = document.getElementById('scannerBtn');
    const waterBtn = document.getElementById('waterBtn');
    const resetBtn = document.getElementById('resetBtn');
    const mercury = document.getElementById('mercury');
    const atmosphere = document.getElementById('atmosphere');
    const icePoles = document.getElementById('ice-poles');
    const radar = document.getElementById('radar');
    const tempFill = document.getElementById('tempFill');
    const tempText = document.getElementById('tempText');
    const aiMessage = document.getElementById('aiMessage');
    const suitBtns = document.querySelectorAll('.suit-btn');

    // Game State
    let state = {
        mode: 'neutral', // 'day', 'night', 'neutral'
        hasAtmosphere: false,
        selectedSuit: null,
        temperature: 25,
        isWaterScanned: false,
        isMoonScanned: false
    };

    // AI Voice Simulation (Speech Synthesis)
    function speak(text) {
        console.log("AI Speaking:", text);
        aiMessage.textContent = text;
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }

    // Update Temperature UI
    function updateTemperature(newTemp) {
        console.log("Updating Temperature to:", newTemp);
        state.temperature = newTemp;
        tempText.textContent = `${newTemp}°C`;
        
        // Map -180 to 430 to 0% to 100%
        let percentage = ((newTemp + 180) / (430 + 180)) * 100;
        tempFill.style.width = `${percentage}%`;
        
        if (newTemp > 100) {
            tempFill.style.background = 'linear-gradient(to right, #fff, #f00)';
        } else if (newTemp < 0) {
            tempFill.style.background = 'linear-gradient(to right, #00f, #fff)';
        } else {
            tempFill.style.background = 'linear-gradient(to right, #00f, #fff, #f00)';
        }
    }

    // Stage 1 - Day vs Night Mode
    dayBtn.addEventListener('click', () => {
        console.log("Day Button Clicked");
        state.mode = 'day';
        mercury.style.background = 'radial-gradient(circle at 30% 30%, #ff8800, #404040)';
        mercury.classList.add('heat-wave');
        mercury.classList.remove('ice-effect');
        
        let targetTemp = state.hasAtmosphere ? 350 : 430;
        updateTemperature(targetTemp);
        
        speak("It is daytime on Mercury. Temperature is 430 degrees Celsius. There is no atmosphere to block the Sun’s heat.");
        checkSurvival();
    });

    nightBtn.addEventListener('click', () => {
        console.log("Night Button Clicked");
        state.mode = 'night';
        mercury.style.background = 'radial-gradient(circle at 30% 30%, #4facfe, #003a70)';
        mercury.classList.add('ice-effect');
        mercury.classList.remove('heat-wave');
        
        let targetTemp = state.hasAtmosphere ? -120 : -180;
        updateTemperature(targetTemp);
        
        speak("Now it is night. Without atmosphere, heat escapes quickly. The planet becomes extremely cold.");
        checkSurvival();
    });

    // Stage 2 - Atmosphere Simulation
    atmosphereBtn.addEventListener('click', () => {
        console.log("Atmosphere Button Clicked");
        state.hasAtmosphere = !state.hasAtmosphere;
        atmosphere.style.opacity = state.hasAtmosphere ? '1' : '0';
        atmosphereBtn.classList.toggle('active', state.hasAtmosphere);
        
        if (state.hasAtmosphere) {
            if (state.mode === 'day') updateTemperature(350);
            if (state.mode === 'night') updateTemperature(-120);
            speak("Atmosphere acts like a blanket. It keeps heat inside. Earth has atmosphere, so temperatures are stable. Mercury does not have one.");
        } else {
            if (state.mode === 'day') updateTemperature(430);
            if (state.mode === 'night') updateTemperature(-180);
            speak("Atmosphere removed. Temperature extremes returning.");
        }
        checkSurvival();
    });

    // Stage 3 - Survival Suit Challenge
    suitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("Suit Button Clicked:", btn.dataset.suit);
            suitBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedSuit = btn.dataset.suit;
            
            speak("Choose the correct protection. Mercury’s temperature changes are extreme.");
            checkSurvival();
        });
    });

    function checkSurvival() {
        console.log("Checking Survival - Mode:", state.mode, "Suit:", state.selectedSuit);
        if (!state.selectedSuit || state.mode === 'neutral') return;

        let works = false;
        if (state.selectedSuit === 'thermal') {
            works = true;
        } else if (state.selectedSuit === 'heat' && state.mode === 'day') {
            works = true;
        }

        mercury.classList.remove('survival-fail', 'survival-success');
        if (works) {
            mercury.classList.add('survival-success');
        } else {
            mercury.classList.add('survival-fail');
            setTimeout(() => mercury.classList.remove('survival-fail'), 1500);
        }
    }

    // Stage 4 - Moon Scanner
    scannerBtn.addEventListener('click', () => {
        console.log("Scanner Button Clicked");
        radar.style.display = 'block';
        speak("Scanning for moons around Mercury...");
        
        setTimeout(() => {
            radar.style.display = 'none';
            speak("Mercury has no moons. It is too close to the Sun’s gravity to hold one.");
        }, 3000);
    });

    // NEW STAGE - Water Discovery Mission
    waterBtn.addEventListener('click', () => {
        console.log("Water Button Clicked");
        radar.style.display = 'block';
        speak("Scanning Mercury's poles for water ice...");
        
        setTimeout(() => {
            radar.style.display = 'none';
            icePoles.style.opacity = '1';
            speak("Mercury has no liquid water. It is too hot during the day. However, scientists discovered ice in deep craters near the poles. These craters never receive sunlight. That is why the ice does not melt.");
        }, 3000);
    });

    // Reset Mission
    resetBtn.addEventListener('click', () => {
        console.log("Reset Button Clicked");
        state = {
            mode: 'neutral',
            hasAtmosphere: false,
            selectedSuit: null,
            temperature: 25,
            isWaterScanned: false,
            isMoonScanned: false
        };
        
        mercury.style.background = 'radial-gradient(circle at 30% 30%, #a0a0a0, #404040)';
        mercury.classList.remove('heat-wave', 'ice-effect', 'survival-fail', 'survival-success');
        atmosphere.style.opacity = '0';
        icePoles.style.opacity = '0';
        radar.style.display = 'none';
        updateTemperature(25);
        
        atmosphereBtn.classList.remove('active');
        suitBtns.forEach(btn => btn.classList.remove('active'));
        
        speak("Mission reset. Welcome explorer! Use the control panel to start your survival mission.");
    });
});
