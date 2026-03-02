document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const muteBtn = document.getElementById('muteBtn');
    const currentSlideNum = document.getElementById('currentSlideNum');
    let currentSlideIndex = 0;
    let isMuted = false;

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
        if (isMuted) {
            window.speechSynthesis.cancel();
        } else {
            narrateSlide(currentSlideIndex);
        }
    });

    const speak = (text) => {
        if (isMuted) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.cancel();
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    const narrateSlide = (index) => {
        let narrationId;
        if (index === 9) narrationId = 'closingNarration';
        else narrationId = `narration${index + 1}`;
        
        const narrationElement = document.getElementById(narrationId);
        if (narrationElement) {
            speak(narrationElement.textContent);
        }
    };

    const updateSlides = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);
        });
        currentSlideNum.textContent = currentSlideIndex + 1;
        prevBtn.disabled = currentSlideIndex === 0;
        
        if (currentSlideIndex === slides.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next ⮕';
        }

        // Trigger slide-specific initialization
        initSlide(currentSlideIndex + 1);
        // Narrate current slide
        narrateSlide(currentSlideIndex);
    };

    nextBtn.addEventListener('click', () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlides();
        } else {
            window.location.href = '/game-zone';
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    });

    // --- Slide Logic ---

    function initSlide(slideNum) {
        switch(slideNum) {
            case 1: initSlide1(); break;
            case 2: initSlide2(); break;
            case 3: initSlide3(); break;
            case 4: initSlide4(); break;
            case 5: initSlide5(); break;
            case 6: initSlide6(); break;
            case 7: initSlide7(); break;
            case 8: initSlide8(); break;
            case 9: initSlide9(); break;
        }
    }

    // Slide 1: Orbit Position Challenge
    function initSlide1() {
        const earth = document.getElementById('draggableEarth');
        const orbits = document.querySelectorAll('.orbit');
        let isDragging = false;
        let isRevolving = false;
        let angle = 0;

        earth.addEventListener('mousedown', (e) => {
            isDragging = true;
            isRevolving = false;
            earth.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const container = document.getElementById('orbitChallenge').getBoundingClientRect();
            let x = e.clientX - container.left - 12.5;
            let y = e.clientY - container.top - 12.5;
            earth.style.left = `${x}px`;
            earth.style.top = `${y}px`;
            earth.style.bottom = 'auto';
            earth.style.right = 'auto';
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            earth.style.cursor = 'grab';

            // Check if dropped near orbit 3
            const container = document.getElementById('orbitChallenge').getBoundingClientRect();
            const sunX = container.width * 0.1;
            const sunY = container.height * 0.5;
            const earthX = e.clientX - container.left;
            const earthY = e.clientY - container.top;
            
            const dist = Math.sqrt(Math.pow(earthX - sunX, 2) + Math.pow(earthY - sunY, 2));
            
            orbits.forEach(o => o.classList.remove('correct', 'wrong'));

            if (dist > 150 && dist < 200) { // Orbit 3 (Radius approx 175)
                orbits[2].classList.add('correct');
                const msg = "Earth is perfectly positioned. Not too close like Mercury or Venus. Not too far like Mars. This position makes life possible.";
                document.getElementById('narration1').textContent = msg;
                speak(msg);

                // Start Revolution
                isRevolving = true;
                const orbitRadius = 175;
                const animateRevolution = () => {
                    if (!isRevolving) return;
                    angle += 0.005;
                    const x = sunX + Math.cos(angle) * orbitRadius - 12.5;
                    const y = sunY + Math.sin(angle) * orbitRadius - 12.5;
                    earth.style.left = `${x}px`;
                    earth.style.top = `${y}px`;
                    requestAnimationFrame(animateRevolution);
                };
                animateRevolution();
            } else {
                // Find closest orbit for feedback
                let closest = -1;
                if (dist < 100) closest = 0;
                else if (dist < 150) closest = 1;
                else closest = 3;
                
                if (closest >= 0) orbits[closest].classList.add('wrong');
                const msg = "Try again! Place Earth in the 3rd orbit from the Sun.";
                document.getElementById('narration1').textContent = msg;
                speak(msg);
            }
        });
    }

    // Slide 2: Distance & Light Travel
    function initSlide2() {
        const slider = document.getElementById('distanceSlider');
        const earth = document.getElementById('simEarth');
        const beam = document.getElementById('lightBeam');
        const timer = document.getElementById('lightTimer');
        const status = document.getElementById('distanceStatus');
        const label = document.getElementById('distanceLabel');

        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            earth.style.marginLeft = `${val * 2}px`;
            beam.style.width = `${val * 2}px`;
            
            // Precise values for narration alignment
            if (val === 150) {
                label.textContent = `149.6 million km (1 AU)`;
                label.style.color = "#00ff00";
                timer.textContent = `8m 20s`;
                status.textContent = "Perfect Distance: 15°C Average Temp. Life thrives!";
                status.style.color = "#00ff00";
            } else {
                label.textContent = `${val} million km`;
                label.style.color = "#64c8ff";
                const totalSeconds = (val / 150) * 500; // 500s = 8m 20s
                const mins = Math.floor(totalSeconds / 60);
                const secs = Math.floor(totalSeconds % 60);
                timer.textContent = `${mins}m ${secs}s`;

                if (val < 100) {
                    status.textContent = "Too Close: Temperature rises above 100°C! Oceans evaporate.";
                    status.style.color = "#ff4400";
                } else if (val > 200) {
                    status.textContent = "Too Far: Temperature drops below -50°C! Surface freezes.";
                    status.style.color = "#00ffff";
                } else {
                    status.textContent = `Adjust to 150 million km to find the Goldilocks Zone!`;
                    status.style.color = "#ffb703";
                }
            }
        });
    }

    // Slide 3: How Sunlight Creates Morning -> Noon -> Evening -> Night
    function initSlide3() {
        const earth3D = document.getElementById('earth3DS3');
        const dayMap = document.querySelector('.day-map-s3');
        const nightMap = document.querySelector('.night-map-s3');
        const cityLights = document.querySelector('.city-lights-s3');
        const startBtn = document.getElementById('startRotationBtnS3');
        const stopBtn = document.getElementById('stopRotationBtnS3');
        const speedSlider = document.getElementById('rotationSpeedSlider');
        const timelineCursor = document.getElementById('timelineCursor');
        const timelinePoints = document.querySelectorAll('.timeline-point');
        
        const sunAngleNeedle = document.querySelector('.angle-needle');
        const sunAngleText = document.getElementById('sunAngleText');
        const brightnessBar = document.getElementById('brightnessBar');
        const brightnessText = document.getElementById('brightnessText');
        const tempBar = document.getElementById('tempBar');
        const tempText = document.getElementById('tempText');
        
        const cityBtns = document.querySelectorAll('.btn-city');
        const locationDots = document.querySelectorAll('.location-dot');
        const toggleAxisBtn = document.getElementById('toggleAxisTiltS3');
        const toggleShadowBtn = document.getElementById('toggleShadowModeS3');
        const shadowStick = document.getElementById('shadowStickMode');
        const experimentPanel = document.getElementById('experimentPanelS3');
        const narration = document.getElementById('narration3');

        let isRotating = false;
        let rotationProgress = 0; // 0 to 1
        let rotationSpeed = 0.01;
        let selectedCity = null;
        let axisTilt = false;
        let shadowMode = false;
        let lastTimestamp = 0;
        let animationFrameId = null;
        let currentDayState = ''; // morning, noon, evening, night

        const cities = {
            'NewYork': { lon: -74, lat: 40, dotId: 'dotNewYork' },
            'London': { lon: 0, lat: 51, dotId: 'dotLondon' },
            'India': { lon: 79, lat: 20, dotId: 'dotIndia' },
            'Australia': { lon: 133, lat: -25, dotId: 'dotAustralia' }
        };

        function updateSimulation(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const delta = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (isRotating) {
                rotationProgress = (rotationProgress + (rotationSpeed * delta / 1000)) % 1;
            }

            // Update Earth Texture Position (West to East)
            const bgPos = rotationProgress * 100;
            dayMap.style.backgroundPosition = `${bgPos}% 0%`;
            nightMap.style.backgroundPosition = `${bgPos}% 0%`;
            cityLights.style.backgroundPosition = `${bgPos}% 0%`;

            // Update Timeline
            timelineCursor.style.left = `${rotationProgress * 100}%`;
            
            // Determine state based on rotation progress
            let newState = '';
            if (rotationProgress < 0.25) newState = 'morning';
            else if (rotationProgress < 0.5) newState = 'noon';
            else if (rotationProgress < 0.75) newState = 'evening';
            else newState = 'night';

            if (newState !== currentDayState) {
                currentDayState = newState;
                updateIndicators(newState);
                updateNarration(newState);
                highlightTimeline(newState);
            }

            // Update Shadow if in mode
            if (shadowMode) {
                updateShadow();
            }

            if (isRotating || shadowMode) {
                animationFrameId = requestAnimationFrame(updateSimulation);
            }
        }

        function updateIndicators(state) {
            let angle = 0, brightness = 0, temp = 0;
            let angleLabel = '', brightLabel = '', tempLabel = '';

            switch(state) {
                case 'morning':
                    angle = -60; angleLabel = 'Low';
                    brightness = 40; brightLabel = 'Medium';
                    temp = 30; tempLabel = 'Rising';
                    earth3D.style.filter = 'sepia(0.3) saturate(1.2) brightness(0.9)';
                    break;
                case 'noon':
                    angle = 0; angleLabel = 'High (90°)';
                    brightness = 100; brightLabel = 'High';
                    temp = 90; tempLabel = 'Warmest';
                    earth3D.style.filter = 'brightness(1.1) contrast(1.1)';
                    break;
                case 'evening':
                    angle = 60; angleLabel = 'Low';
                    brightness = 40; brightLabel = 'Medium';
                    temp = 60; tempLabel = 'Cooling';
                    earth3D.style.filter = 'sepia(0.5) hue-rotate(-20deg) brightness(0.8)';
                    break;
                case 'night':
                    angle = 90; angleLabel = 'None';
                    brightness = 5; brightLabel = 'Dark';
                    temp = 10; tempLabel = 'Coolest';
                    earth3D.style.filter = 'brightness(0.4) saturate(0.8) hue-rotate(200deg)';
                    break;
            }

            sunAngleNeedle.style.transform = `rotate(${angle}deg)`;
            sunAngleText.textContent = angleLabel;
            brightnessBar.style.width = `${brightness}%`;
            brightnessText.textContent = brightLabel;
            tempBar.style.width = `${temp}%`;
            tempText.textContent = tempLabel;
        }

        function updateNarration(state) {
            let text = "";
            switch(state) {
                case 'morning':
                    text = "Morning happens when your location rotates into sunlight. Sun rises in the East.";
                    break;
                case 'noon':
                    text = "Noon occurs when your location faces the Sun directly. Light is brightest and shadows are shortest.";
                    break;
                case 'evening':
                    text = "Evening happens as your location rotates away from the Sun. Shadows stretch long again.";
                    break;
                case 'night':
                    text = "Night begins when your location turns away from the Sun. City lights illuminate and stars appear.";
                    break;
            }
            narration.textContent = text;
            speak(text);
        }

        function highlightTimeline(state) {
            timelinePoints.forEach(p => {
                p.classList.toggle('active', p.getAttribute('data-state') === state);
            });
        }

        function updateShadow() {
            const shadow = document.querySelector('.stick-shadow');
            let shadowLen = 80;
            let shadowOpacity = 0.7;

            if (rotationProgress > 0.1 && rotationProgress < 0.6) {
                const distFromNoon = Math.abs(rotationProgress - 0.35);
                shadowLen = distFromNoon * 400;
                shadowOpacity = 0.7 - distFromNoon;
                if (rotationProgress < 0.35) {
                    shadow.style.transform = `rotate(180deg) scaleX(${shadowLen/80})`;
                } else {
                    shadow.style.transform = `rotate(0deg) scaleX(${shadowLen/80})`;
                }
            } else {
                shadowOpacity = 0;
            }
            shadow.style.opacity = shadowOpacity;
        }

        cityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cityName = btn.getAttribute('data-city');
                selectedCity = cities[cityName];
                
                cityBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                locationDots.forEach(d => d.classList.remove('active'));
                const dot = document.getElementById(selectedCity.dotId);
                if (dot) {
                    dot.classList.add('active');
                    const x = 50 + (selectedCity.lon / 180) * 50;
                    const y = 50 - (selectedCity.lat / 90) * 50;
                    dot.style.left = `${x}%`;
                    dot.style.top = `${y}%`;
                }
                
                speak(`Tracking city: ${cityName}`);
            });
        });

        startBtn.addEventListener('click', () => {
            isRotating = true;
            experimentPanel.style.display = 'none';
            if (!animationFrameId) {
                lastTimestamp = performance.now();
                animationFrameId = requestAnimationFrame(updateSimulation);
            }
            speak("Starting Earth's rotation from west to east.");
        });

        stopBtn.addEventListener('click', () => {
            isRotating = false;
            experimentPanel.style.display = 'block';
            const msg = "Earth’s rotation spreads sunlight evenly. Without rotation, life would struggle to survive. One side would overheat, and the other would freeze.";
            narration.textContent = msg;
            speak(msg);
        });

        speedSlider.addEventListener('input', () => {
            rotationSpeed = parseFloat(speedSlider.value) * 0.05;
        });

        toggleAxisBtn.addEventListener('click', () => {
            axisTilt = !axisTilt;
            toggleAxisBtn.classList.toggle('on', axisTilt);
            toggleAxisBtn.textContent = axisTilt ? 'Axis Tilt: ON' : 'Axis Tilt: OFF';
            earth3D.style.transform = axisTilt ? 'rotate(23.5deg)' : 'rotate(0deg)';
            if (axisTilt) {
                speak("Axis tilt enabled. This causes different daylight lengths in northern and southern hemispheres.");
            }
        });

        toggleShadowBtn.addEventListener('click', () => {
            shadowMode = !shadowMode;
            toggleShadowBtn.classList.toggle('on', shadowMode);
            toggleShadowBtn.textContent = shadowMode ? 'Shadow Mode: ON' : 'Shadow Mode: OFF';
            shadowStick.style.display = shadowMode ? 'block' : 'none';
            if (shadowMode) {
                speak("Shadow simulation mode active. Observe how shadows change throughout the day.");
                if (!animationFrameId) {
                    lastTimestamp = performance.now();
                    animationFrameId = requestAnimationFrame(updateSimulation);
                }
            }
        });

        cityBtns[0].click();
    }

    // Slide 4: Revolution & Seasons - Tilt Controls Climate
    function initSlide4() {
        const earth = document.getElementById('earthOrbitingS4');
        const yearSlider = document.getElementById('yearSliderS4');
        const tiltSlider = document.getElementById('tiltSliderS4');
        const tiltValLabel = document.getElementById('tiltValS4');
        const narration = document.getElementById('narration4');
        
        const nAngleNeedle = document.getElementById('northAngleNeedle');
        const nDayBar = document.getElementById('northDayBar');
        const nTempBar = document.getElementById('northTempBar');
        
        const sAngleNeedle = document.getElementById('southAngleNeedle');
        const sDayBar = document.getElementById('southDayBar');
        const sTempBar = document.getElementById('southTempBar');
        
        const beamSim = document.querySelector('.incoming-light');
        const angleDesc = document.getElementById('angleDescription');
        
        const climateBtn = document.getElementById('climateGameBtnS4');
        const latBtn = document.getElementById('latConnectBtnS4');
        const climateModal = document.getElementById('climateModalS4');

        let currentMonth = 5.5; // Near end of June (0-12 range)

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January"];

        function updateSeasonSimulation() {
            // 1. Position Earth on Orbit (Elliptical)
            // June is at Month 5, should be Top (0 deg). 
            // January is at Month 0.
            // If slider is 0 (Jan), 1 (Feb), ..., 5 (June), ..., 11 (Dec), 12 (Jan)
            // We want June (5) at 0 deg.
            const angleDeg = ((currentMonth - 5 + 12) % 12) / 12 * 360;
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const a = 225; // semi-major axis
            const b = 125; // semi-minor axis
            
            const x = a * Math.cos(angleRad);
            const y = b * Math.sin(angleRad);
            
            earth.style.left = `calc(50% + ${x}px - 20px)`;
            earth.style.top = `calc(50% + ${y}px - 20px)`;

            // 2. Manage Tilt (Always pointing "Up" in space toward Polaris)
            earth.style.transform = `rotate(${currentTilt}deg)`;

            // 3. Calculate Hemisphere Impacts
            // seasonFactor: 1 at Summer (June, angleDeg=0), -1 at Winter (Dec, angleDeg=180)
            const seasonFactor = Math.cos(angleDeg * Math.PI / 180); 
            
            updateHemisphere('north', seasonFactor);
            updateHemisphere('south', -seasonFactor);
            
            // 4. Update Sun Angle Visualizer (Focus on North)
            beamSim.style.transform = `translateX(-50%) rotate(${seasonFactor * currentTilt}deg)`;
            if (Math.abs(seasonFactor) > 0.8) {
                angleDesc.textContent = seasonFactor > 0 ? "Direct rays (Summer) = Concentrated heat" : "Shallow rays (Winter) = Spread out heat";
            } else {
                angleDesc.textContent = "Equal distribution (Equinox)";
            }

            // 5. Narration & Labels
            updateNarration(Math.floor(currentMonth));
        }

        function updateHemisphere(side, factor) {
            // factor is from -1 (Winter) to 1 (Summer)
            const angleShift = factor * (currentTilt * 1.5);
            const needle = side === 'north' ? nAngleNeedle : sAngleNeedle;
            needle.style.transform = `rotate(${angleShift}deg)`;

            const dayBar = side === 'north' ? nDayBar : sDayBar;
            const dayLen = 50 + (factor * (currentTilt / 45 * 40));
            dayBar.style.width = `${dayLen}%`;

            const tempBar = side === 'north' ? nTempBar : sTempBar;
            const temp = 50 + (factor * (currentTilt / 45 * 45));
            tempBar.style.width = `${temp}%`;
        }

        function updateNarration(monthIdx) {
            let text = "";
            const monthName = months[monthIdx];
            
            if (monthIdx === 5) { // June
                text = "JUNE: The Northern Hemisphere is tilted toward the Sun. Direct sunlight and longer days create Summer!";
            } else if (monthIdx === 11) { // Dec
                text = "DECEMBER: The Northern Hemisphere is tilted away. Low angle sunlight creates Winter!";
            } else if (monthIdx === 2 || monthIdx === 8) { // Mar or Sep
                text = `${monthName.toUpperCase()}: Equinox! Sunlight hits both hemispheres equally. Equal day and night.`;
            } else {
                text = `Earth is in its orbit during ${monthName}. Watch how sunlight concentration shifts!`;
            }
            narration.textContent = text;
            // Only speak on significant changes or if user stopped dragging? 
            // For now, let's keep it simple.
        }

        yearSlider.addEventListener('input', () => {
            currentMonth = parseFloat(yearSlider.value);
            updateSeasonSimulation();
        });

        yearSlider.addEventListener('change', () => {
            updateNarration(Math.floor(currentMonth));
            speak(narration.textContent);
        });

        tiltSlider.addEventListener('input', () => {
            currentTilt = parseFloat(tiltSlider.value);
            const statusEl = document.getElementById('tiltStatusS4');
            
            if (currentTilt === 23.5) {
                tiltValLabel.textContent = `23.5° (Perfect Tilt)`;
                statusEl.textContent = "✅ Scientifically Accurate";
                statusEl.style.color = "#00ff00";
                speak("This is Earth's perfect 23.5 degree tilt. It is scientifically accurate and creates the seasons we enjoy today.");
            } else if (currentTilt === 0) {
                tiltValLabel.textContent = `0° (No Tilt)`;
                statusEl.textContent = "⚠️ No Seasons possible";
                statusEl.style.color = "#ffb703";
            } else if (currentTilt > 35) {
                tiltValLabel.textContent = `${currentTilt}° (Extreme)`;
                statusEl.textContent = "🔥 Critical: Extreme Climate!";
                statusEl.style.color = "#ff4b2b";
            } else {
                tiltValLabel.textContent = `${currentTilt}°`;
                statusEl.textContent = "Modifying climate balance...";
                statusEl.style.color = "#64c8ff";
            }
            updateSeasonSimulation();
        });

        climateBtn.addEventListener('click', () => {
            const resultBox = document.getElementById('climateResultS4');
            document.getElementById('gameTiltVal').textContent = currentTilt;
            
            let resultText = "";
            if (currentTilt === 0) {
                resultText = "No Seasons! Static climate all year. Same temperature every day.";
                resultBox.style.color = "#ffb703";
            } else if (currentTilt > 35) {
                resultText = "Extreme Seasons! Boiling hot summers and freezing winters. Life would struggle!";
                resultBox.style.color = "#ff4b2b";
            } else {
                resultText = "Mild Seasons! Perfect for liquid water and diverse life forms.";
                resultBox.style.color = "#00ff00";
            }
            
            resultBox.textContent = `Result: ${resultText}`;
            climateModal.style.display = 'block';
            speak(resultText);
        });

        latBtn.addEventListener('click', () => {
            speak("Latitude affects climate. The Equator always receives direct sunlight, while the Poles have extreme variations.");
            alert("Latitude Fact: Near the poles, you can have 24 hours of daylight in summer (Midnight Sun) and 24 hours of darkness in winter!");
        });

        // Initialize
        updateSeasonSimulation();
    }

    // Slide 5: Atmosphere & Life Shield
    function initSlide5() {
        const draggableItems = document.querySelectorAll('.toolbox-item.draggable');
        const earthModel = document.getElementById('earth-3d-model');
        const centerpiece = document.querySelector('.earth-centerpiece');
        const popup = document.getElementById('smart-info-popup');
        const popupTitle = document.getElementById('popup-title');
        const popupContent = document.getElementById('popup-content');
        const popupStats = document.getElementById('popup-stats');
        
        const statusTemp = document.getElementById('status-temp');
        const statusAtmo = document.getElementById('status-atmo');
        const statusMag = document.getElementById('status-mag');
        const statusWater = document.getElementById('status-water');
        const lifeIndicator = document.getElementById('life-indicator');
        
        const resetBtn = document.getElementById('btn-reset-earth');
        const removeBtn = document.getElementById('btn-remove-layer');

        let currentStep = 0;
        const steps = [
            'inner-core', 'outer-core', 'mantle', 'crust', 'atmosphere', 'magnetic-field', 'water'
        ];

        const layerInfo = {
            'inner-core': {
                title: "🔴 INNER CORE (Center Layer)",
                content: "Solid metal made mostly of iron and nickel. Despite extreme heat, intense pressure keeps it solid.",
                stats: "Composition: Iron (≈85%) + Nickel (≈5%)\nTemperature: ~5,400°C\nVolume: About 1% of Earth's total",
                voice: "This is Earth’s inner core. Despite extreme heat, intense pressure keeps it solid. It forms about one percent of Earth’s volume.",
                status: { temp: "~5,400°C" }
            },
            'outer-core': {
                title: "🟠 OUTER CORE",
                content: "Liquid iron and nickel. Movement in this layer generates Earth's magnetic field.",
                stats: "Thickness: ~2,200 km\nVolume: About 30% of Earth's total\nTemperature: 4,000–5,000°C",
                voice: "The outer core is liquid metal. Its motion generates Earth’s magnetic field. It makes up about thirty percent of Earth’s volume.",
                status: { temp: "~4,500°C", mag: "Generating..." }
            },
            'mantle': {
                title: "🟡 MANTLE",
                content: "Thick middle layer of silicate rock. Heat movement here drives plate tectonics.",
                stats: "Thickness: ~2,900 km\nVolume: About 84% of Earth's total\nFunction: Drives volcanoes and earthquakes",
                voice: "The mantle is Earth’s thickest layer. Heat movement here causes earthquakes and volcanoes. It makes up about eighty-four percent of Earth’s volume.",
                status: { temp: "~2,000°C" }
            },
            'crust': {
                title: "🟤 CRUST",
                content: "Thin outer shell where we live. Contains continents and ocean basins.",
                stats: "Thickness: 5–70 km\nVolume: Less than 1% of Earth's total\nSurface: Solid rock",
                voice: "The crust is the thin outer layer where we live. It makes up less than one percent of Earth’s total volume.",
                status: { temp: "15°C (Average)" }
            },
            'atmosphere': {
                title: "🌫 ATMOSPHERE",
                content: "Protective air layer that regulates temperature and supports breathing.",
                stats: "78% Nitrogen, 21% Oxygen\nProtects from UV radiation\nRegulates climate",
                voice: "The atmosphere protects Earth and supports breathing. It is mostly nitrogen and oxygen.",
                status: { atmo: "N₂, O₂ (Stable)" }
            },
            'magnetic-field': {
                title: "🧲 MAGNETIC FIELD",
                content: "Invisible shield that protects the atmosphere from solar wind.",
                stats: "Generated by outer core\nPrevents radiation damage\nDeflects solar wind",
                voice: "Earth’s magnetic field acts like a shield in space. It protects the atmosphere from harmful solar radiation.",
                status: { mag: "Active Shield" }
            },
            'water': {
                title: "💧 WATER LAYER",
                content: "Covers most of the surface. Essential for all known life.",
                stats: "Covers 71% of surface\nRegulates climate\nDrives the water cycle",
                voice: "Water covers most of Earth’s surface. It regulates temperature and supports all known life.",
                status: { water: "71%", life: "100%" }
            }
        };

        // Drag and Drop Logic
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                if (item.classList.contains('disabled')) {
                    e.preventDefault();
                    return;
                }
                item.classList.add('dragging');
                e.dataTransfer.setData('text/plain', item.dataset.component);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        centerpiece.addEventListener('dragover', (e) => {
            e.preventDefault();
            centerpiece.classList.add('drag-over');
        });

        centerpiece.addEventListener('dragleave', () => {
            centerpiece.classList.remove('drag-over');
        });

        centerpiece.addEventListener('drop', (e) => {
            e.preventDefault();
            centerpiece.classList.remove('drag-over');
            const component = e.dataTransfer.getData('text/plain');
            
            if (component === steps[currentStep]) {
                unlockLayer(component);
            } else {
                speak("Incorrect sequence! Build Earth from the inside out.");
            }
        });

        function unlockLayer(component) {
            const layer = document.getElementById(`layer-${component}`);
            layer.classList.remove('hidden');
            
            // Special animations/effects
            if (component === 'inner-core') {
                document.getElementById('heat-shimmer').classList.remove('hidden');
            } else if (component === 'outer-core') {
                // Faint magnetic field lines could appear
            } else if (component === 'atmosphere') {
                // Blue glow
            } else if (component === 'magnetic-field') {
                document.getElementById('solar-wind-effect').classList.remove('hidden');
            }

            // Update Status Panel
            const info = layerInfo[component];
            if (info.status.temp) statusTemp.textContent = info.status.temp;
            if (info.status.atmo) statusAtmo.textContent = info.status.atmo;
            if (info.status.mag) statusMag.textContent = info.status.mag;
            if (info.status.water) statusWater.textContent = info.status.water;
            if (info.status.life) lifeIndicator.style.width = info.status.life;

            // Show Popup
            popupTitle.textContent = info.title;
            popupContent.textContent = info.content;
            popupStats.innerText = info.stats;
            speak(info.voice);

            // Disable current tool, enable next
            document.getElementById(`tool-${component}`).classList.add('disabled');
            document.getElementById(`tool-${component}`).setAttribute('draggable', 'false');
            
            currentStep++;
            if (currentStep < steps.length) {
                const nextTool = document.getElementById(`tool-${steps[currentStep]}`);
                nextTool.classList.remove('disabled');
                nextTool.setAttribute('draggable', 'true');
            } else {
                // Completed!
                popupTitle.textContent = "🌍 PLANET COMPLETE!";
                popupContent.textContent = "Earth is fully formed and ready for life!";
                removeBtn.disabled = false;
            }
        }

        // Reset and Remove Logic
        resetBtn.addEventListener('click', () => {
            steps.forEach(step => {
                document.getElementById(`layer-${step}`).classList.add('hidden');
                const tool = document.getElementById(`tool-${step}`);
                if (step === 'inner-core') {
                    tool.classList.remove('disabled');
                    tool.setAttribute('draggable', 'true');
                } else {
                    tool.classList.add('disabled');
                    tool.setAttribute('draggable', 'false');
                }
            });
            
            document.getElementById('heat-shimmer').classList.add('hidden');
            document.getElementById('solar-wind-effect').classList.add('hidden');
            
            currentStep = 0;
            statusTemp.textContent = "0°C";
            statusAtmo.textContent = "None";
            statusMag.textContent = "Inactive";
            statusWater.textContent = "0%";
            lifeIndicator.style.width = "0%";
            
            popupTitle.textContent = "Welcome";
            popupContent.textContent = "Build Earth from the inside out!";
            popupStats.textContent = "";
            removeBtn.disabled = true;
        });

        removeBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                const component = steps[currentStep];
                document.getElementById(`layer-${component}`).classList.add('hidden');
                
                // Re-enable the tool for this component
                const tool = document.getElementById(`tool-${component}`);
                tool.classList.remove('disabled');
                tool.setAttribute('draggable', 'true');
                
                // Disable subsequent tools
                for (let i = currentStep + 1; i < steps.length; i++) {
                    const nextTool = document.getElementById(`tool-${steps[i]}`);
                    nextTool.classList.add('disabled');
                    nextTool.setAttribute('draggable', 'false');
                    document.getElementById(`layer-${steps[i]}`).classList.add('hidden');
                }

                // Reverse effects
                if (component === 'inner-core') document.getElementById('heat-shimmer').classList.add('hidden');
                if (component === 'magnetic-field') document.getElementById('solar-wind-effect').classList.add('hidden');

                // Evaluate effects
                evaluatePlanet();
            }
        });

        function evaluatePlanet() {
            // Find what's still active
            const hasMag = !document.getElementById('layer-magnetic-field').classList.contains('hidden');
            const hasAtmo = !document.getElementById('layer-atmosphere').classList.contains('hidden');
            const hasWater = !document.getElementById('layer-water').classList.contains('hidden');
            
            if (!hasMag && hasAtmo) {
                popupTitle.textContent = "⚠️ WARNING";
                popupContent.textContent = "Magnetic field lost! Solar wind is stripping the atmosphere.";
                speak(popupContent.textContent);
                statusMag.textContent = "Inactive";
                lifeIndicator.style.width = "20%";
            } else if (!hasAtmo) {
                popupTitle.textContent = "⚠️ WARNING";
                popupContent.textContent = "Atmosphere lost! UV radiation hits the surface. Temperature unstable.";
                speak(popupContent.textContent);
                statusAtmo.textContent = "None";
                lifeIndicator.style.width = "5%";
            } else if (!hasWater) {
                popupTitle.textContent = "⚠️ WARNING";
                popupContent.textContent = "Water lost! The planet is drying up. Life is disappearing.";
                speak(popupContent.textContent);
                statusWater.textContent = "0%";
                lifeIndicator.style.width = "10%";
            }
        }

        // Earth Rotation/Control
        let isMouseDown = false;
        let startX, startY;
        let rotX = 0, rotY = 0;
        let scale = 1;

        earthModel.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
            earthModel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            rotY += dx * 0.5;
            rotX -= dy * 0.5;
            updateEarthTransform();
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
            earthModel.style.cursor = 'grab';
        });

        // Zoom functionality
        centerpiece.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.min(Math.max(0.5, scale + delta), 2);
            updateEarthTransform();
        });

        function updateEarthTransform() {
            earthModel.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        }
    }

    // Slide 6: Gravity Explorer
    function initSlide6() {
        const objectItems = document.querySelectorAll('.object-item');
        const obj1El = document.getElementById('obj1');
        const obj2El = document.getElementById('obj2');
        const dropBtn = document.getElementById('dropBtn');
        const heightSlider = document.getElementById('heightSlider');
        const currentHeightEl = document.getElementById('currentHeight');
        const groundPlatform = document.getElementById('groundPlatformS6');
        const gravitySlider = document.getElementById('gravitySlider');
        const gravityValEl = document.getElementById('gravityVal');
        const fallTimerEl = document.getElementById('fallTimer');
        const fallSpeedEl = document.getElementById('fallSpeed');
        const airResistanceBtn = document.getElementById('airResistanceBtn');
        const noGravityBtn = document.getElementById('noGravityBtn');
        const gravityInfoPanel = document.getElementById('gravityInfoPanel');

        let selectedObjects = [];
        let gravity = 9.8;
        let height = 20;
        let airResistance = false;
        let isFalling = false;
        let firstDropDone = false;

        // Object selection
        objectItems.forEach(item => {
            item.addEventListener('click', () => {
                if (isFalling) return;
                
                const mass = parseFloat(item.dataset.mass);
                const type = item.dataset.type;
                const icon = item.dataset.icon;

                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                    selectedObjects = selectedObjects.filter(obj => obj.type !== type);
                } else {
                    if (selectedObjects.length >= 2) {
                        // Remove first selected if already 2
                        const firstType = selectedObjects[0].type;
                        document.querySelector(`.object-item[data-type="${firstType}"]`).classList.remove('selected');
                        selectedObjects.shift();
                    }
                    item.classList.add('selected');
                    selectedObjects.push({ mass, type, icon });
                }

                updateObjectsDisplay();
            });
        });

        function updateObjectsDisplay() {
            obj1El.textContent = selectedObjects[0] ? selectedObjects[0].icon : '';
            obj2El.textContent = selectedObjects[1] ? selectedObjects[1].icon : '';
            
            // Set initial positions based on height (Container height is 400px)
            const initialTop = 360 - (height * 6.6);
            obj1El.style.transition = "none";
            obj2El.style.transition = "none";
            obj1El.style.top = `${initialTop}px`;
            obj2El.style.top = `${initialTop}px`;
        }

        // Height slider
        heightSlider.addEventListener('input', () => {
            if (isFalling) return;
            height = parseInt(heightSlider.value);
            if (currentHeightEl) currentHeightEl.textContent = height;
            
            // Move ground platform visually (Ground base at 30px from bottom)
            groundPlatform.style.bottom = `${30 + (50 - height) * 3.4}px`;
            
            updateObjectsDisplay();
        });

        // Gravity slider
        gravitySlider.addEventListener('input', () => {
            gravity = parseFloat(gravitySlider.value);
            if (gravityValEl) gravityValEl.textContent = gravity.toFixed(1);
            
            if (gravity < 5) speak("Lowered gravity allows higher jumps and slower falls.");
            else if (gravity > 15) speak("Stronger gravity pulls objects faster.");
        });

        // Air Resistance toggle
        if (airResistanceBtn) {
            airResistanceBtn.addEventListener('click', () => {
                airResistance = !airResistance;
                airResistanceBtn.textContent = airResistance ? 'ON' : 'OFF';
                airResistanceBtn.classList.toggle('active', airResistance);
            });
        }

        // No Gravity button
        noGravityBtn.addEventListener('click', () => {
            gravity = 0;
            gravitySlider.value = 0;
            if (gravityValEl) gravityValEl.textContent = "0.0";
            speak("Without gravity, air and oceans would escape. Life could not survive.");
            
            // Float effect
            obj1El.style.transition = "top 5s ease-out";
            obj2El.style.transition = "top 5s ease-out";
            obj1El.style.top = "-50px";
            obj2El.style.top = "-50px";
        });

        // Drop button
        dropBtn.addEventListener('click', () => {
            if (isFalling || selectedObjects.length < 1) return;
            
            startDrop();
        });

        function startDrop() {
            isFalling = true;
            dropBtn.disabled = true;
            let startTime = performance.now();
            let duration = Math.sqrt((2 * height) / (gravity || 0.1)) * 1000;
            
            // Slow motion first time
            let timeMultiplier = firstDropDone ? 1 : 2;
            let actualDuration = duration * timeMultiplier;

            let timerInterval = setInterval(() => {
                let elapsed = (performance.now() - startTime) / 1000;
                let currentFallTime = elapsed / timeMultiplier;
                
                if (currentFallTime >= duration / 1000) {
                    currentFallTime = duration / 1000;
                    clearInterval(timerInterval);
                }
                
                if (fallTimerEl) fallTimerEl.textContent = currentFallTime.toFixed(2);
                let currentSpeed = gravity * currentFallTime;
                if (fallSpeedEl) fallSpeedEl.textContent = currentSpeed.toFixed(1);
            }, 10);

            const targetTop = 308 - (50 - height) * 3.4;

            selectedObjects.forEach((obj, index) => {
                const el = index === 0 ? obj1El : obj2El;
                let objDuration = actualDuration;
                
                if (airResistance && obj.type === 'Feather') {
                    objDuration *= 2.5;
                } else if (airResistance && obj.type === 'Apple') {
                    objDuration *= 1.2;
                }

                el.style.transition = `top ${objDuration}ms ease-in`;
                el.style.top = `${targetTop}px`;
            });

            setTimeout(() => {
                isFalling = false;
                dropBtn.disabled = false;
                
                if (!firstDropDone) {
                    firstDropDone = true;
                    gravityInfoPanel.classList.remove('hidden');
                    
                    if (!airResistance) {
                        speak("Even though their mass is different, gravity accelerates all objects equally.");
                    } else {
                        speak("Air resistance slows lightweight objects. Gravity itself remains equal.");
                    }

                    setTimeout(() => {
                        gravityInfoPanel.classList.add('hidden');
                    }, 5000);
                }
                
                // Reset positions after a delay
                setTimeout(() => {
                    if (!isFalling) updateObjectsDisplay();
                }, 2000);

            }, actualDuration * 2.5 + 500);
        }
    }

    // Slide 7: Biosphere & Connections
    function initSlide7() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        const healthVal = document.getElementById('healthValS7');
        const status = document.getElementById('biosphereStatusS7');
        
        pieces.forEach(piece => {
            piece.addEventListener('click', () => {
                piece.classList.toggle('active');
                const activePieces = document.querySelectorAll('.puzzle-piece.active').length;
                const health = activePieces * 25;
                healthVal.textContent = health + "%";
                
                if (health === 100) {
                    status.querySelector('h3').style.color = "#00ff00";
                    speak("Biosphere fully functional. Core, atmosphere, water, and sun are in perfect harmony.");
                } else if (health < 50) {
                    status.querySelector('h3').style.color = "#ff4b2b";
                } else {
                    status.querySelector('h3').style.color = "#ffb703";
                }
            });
        });
    }

    // Slide 8: EARTH WATER BALANCE SIMULATOR
    function initSlide8() {
        const dropZone = document.getElementById('earthDropZone');
        const earthModel = document.getElementById('earthModelS8');
        if (!earthModel) return;
        const earthTexture = earthModel.querySelector('.earth-texture-s8');
        const oceanLayer = earthModel.querySelector('.ocean-layer-s8');
        const iceLayer = earthModel.querySelector('.ice-layer-s8');
        const pollutionLayer = earthModel.querySelector('.pollution-layer-s8');
        const floodLayer = earthModel.querySelector('.flood-layer-s8');
        const tempGlow = earthModel.querySelector('.temp-glow-s8');
        
        const waterSlider = document.getElementById('waterLevelSlider');
        const tempSlider = document.getElementById('tempSlider');
        
        const valWaterSurf = document.getElementById('val-water-surf-live');
        const valLandSurf = document.getElementById('val-land-surf-live');
        const valGlobalTemp = document.getElementById('val-global-temp');
        const valSaltwater = document.getElementById('val-saltwater');
        const valFreshwater = document.getElementById('val-freshwater');
        const valIceCoverage = document.getElementById('val-ice-coverage');
        const valDrinkable = document.getElementById('val-drinkable');
        const valSeaLevel = document.getElementById('val-sea-level');
        const lifeBar = document.getElementById('life-stability-bar');
        const pollutionBar = document.getElementById('pollution-bar');
        const pollutionAlert = document.getElementById('pollution-alert');
        const stabilityGlowBox = document.getElementById('stability-glow-box');
        
        const statusInd = document.getElementById('surfaceStatusS8');
        const stepHint = document.getElementById('gameStepS8');

        // Target Differences
        const diffWater = document.getElementById('diff-water-surf');
        const diffLand = document.getElementById('diff-land-surf');
        const diffSalt = document.getElementById('diff-saltwater');
        const diffFresh = document.getElementById('diff-freshwater');
        const diffIce = document.getElementById('diff-ice-coverage');
        const diffDrink = document.getElementById('diff-drinkable');

        let state = {
            waterSurf: 0,
            landSurf: 0,
            saltwater: 0,
            freshwater: 0,
            iceCoverage: 0,
            drinkable: 0,
            pollution: 0,
            temp: 15,
            waterLevel: 50,
            step: 1,
            finalMsgSpoken: false
        };

        const targets = {
            waterSurf: 71,
            landSurf: 29,
            saltwater: 97,
            freshwater: 3,
            iceCoverage: 69, // % of freshwater
            drinkable: 1 // % of freshwater
        };

        const updateDiff = (element, current, target) => {
            if (!element) return;
            const diff = current - target;
            if (diff === 0) {
                element.innerText = "(Balanced)";
                element.className = "balanced";
            } else if (diff > 0) {
                element.innerText = `(Exceeded by ${diff.toFixed(1)}%)`;
                element.className = "exceeded";
            } else {
                element.innerText = `(+${Math.abs(diff).toFixed(1)}% needed)`;
                element.className = "needed";
            }
        };

        const showFloatingCounter = (x, y, text) => {
            const counter = document.createElement('div');
            counter.className = 'floating-counter';
            counter.innerText = text;
            counter.style.left = `${x}px`;
            counter.style.top = `${y}px`;
            document.body.appendChild(counter);
            setTimeout(() => counter.remove(), 1000);
        };

        const updateUI = () => {
            if (valWaterSurf) valWaterSurf.innerText = state.waterSurf + '%';
            if (valLandSurf) valLandSurf.innerText = state.landSurf + '%';
            if (valGlobalTemp) valGlobalTemp.innerText = state.temp;
            if (valSaltwater) valSaltwater.innerText = state.saltwater + '%';
            if (valFreshwater) valFreshwater.innerText = state.freshwater + '%';
            if (valIceCoverage) valIceCoverage.innerText = state.iceCoverage.toFixed(1) + '%';
            if (valDrinkable) valDrinkable.innerText = state.drinkable.toFixed(1) + '%';
            
            updateDiff(diffWater, state.waterSurf, targets.waterSurf);
            updateDiff(diffLand, state.landSurf, targets.landSurf);
            updateDiff(diffSalt, state.saltwater, targets.saltwater);
            updateDiff(diffFresh, state.freshwater, targets.freshwater);
            updateDiff(diffIce, state.iceCoverage, targets.iceCoverage);
            updateDiff(diffDrink, state.drinkable, targets.drinkable);

            // Pollution
            if (pollutionBar) pollutionBar.style.width = state.pollution + '%';
            if (state.pollution > 20) {
                pollutionAlert.classList.remove('hidden');
                earthModel.classList.add('pollution-effect');
            } else {
                pollutionAlert.classList.add('hidden');
                earthModel.classList.remove('pollution-effect');
            }

            // Calculate Life Stability
            let stability = 100;
            if (state.step === 1) {
                const waterError = Math.abs(state.waterSurf - targets.waterSurf);
                const landError = Math.abs(state.landSurf - targets.landSurf);
                stability = 100 - (waterError + landError);
            } else {
                stability -= Math.abs(state.saltwater - targets.saltwater);
                stability -= Math.abs(state.freshwater - targets.freshwater);
                stability -= state.pollution * 0.8;
                if (state.temp > 25) stability -= (state.temp - 25) * 3;
                if (state.temp < 5) stability -= (5 - state.temp) * 3;
                if (state.waterLevel > 70 || state.waterLevel < 30) stability -= 20;
            }
            stability = Math.max(0, Math.min(100, stability));
            if (lifeBar) {
                lifeBar.style.width = stability + '%';
                // Dynamic color for the meter itself
                if (stability > 80) lifeBar.style.background = "#4dff4d"; // Green
                else if (stability > 40) lifeBar.style.background = "#ffb703"; // Yellow
                else lifeBar.style.background = "#ff4b2b"; // Red
            }

            // UI Feedback Glow
            if (stabilityGlowBox) {
                stabilityGlowBox.classList.remove('pulse-green', 'pulse-red', 'pulse-yellow');
                if (stability > 80) stabilityGlowBox.classList.add('pulse-green');
                else if (stability > 40) stabilityGlowBox.classList.add('pulse-yellow');
                else stabilityGlowBox.classList.add('pulse-red');
            }

            // Visual Effects
            if (earthTexture) earthTexture.style.opacity = Math.max(0.3, (state.waterSurf + state.landSurf) / 100);
            if (oceanLayer) oceanLayer.style.background = `rgba(0, 100, 255, ${state.saltwater / 150})`;
            
            if (iceLayer) {
                const iceOpacity = state.iceCoverage / 100;
                iceLayer.style.background = `radial-gradient(circle at top, rgba(255, 255, 255, ${iceOpacity}) 0%, transparent 40%),
                                             radial-gradient(circle at bottom, rgba(255, 255, 255, ${iceOpacity}) 0%, transparent 40%)`;
                if (state.temp > 30) earthModel.classList.add('overheating-effect');
                else earthModel.classList.remove('overheating-effect');
            }
            
            if (pollutionLayer) pollutionLayer.style.background = `rgba(101, 67, 33, ${state.pollution / 100})`;
            
            if (floodLayer) {
                const floodIntensity = Math.max(0, (state.waterLevel - 50) * 2);
                floodLayer.style.boxShadow = `inset 0 0 ${floodIntensity}px rgba(0, 120, 255, 0.6)`;
                if (state.waterLevel > 70) earthModel.style.transform = `scale(${1 - (state.waterLevel - 70)/300})`; // Shrinking land visual
            } else {
                earthModel.style.transform = 'scale(1)';
            }
            
            if (tempGlow) {
                const heatIntensity = Math.max(0, (state.temp - 20) * 2);
                tempGlow.style.boxShadow = `inset 0 0 ${heatIntensity}px rgba(255, 0, 0, 0.5)`;
            }

            if (state.waterLevel < 35) earthModel.classList.add('drought-effect');
            else earthModel.classList.remove('drought-effect');

            // Sea Level Status
            if (valSeaLevel) {
                if (state.waterLevel > 65) valSeaLevel.innerText = "High (Flooding)";
                else if (state.waterLevel < 35) valSeaLevel.innerText = "Low (Drought)";
                else valSeaLevel.innerText = "Normal";
            }

            // Step Logic
            if (state.step === 1) {
                if (state.waterSurf === targets.waterSurf && state.landSurf === targets.landSurf) {
                    if (statusInd) {
                        statusInd.innerText = "Surface Balanced";
                        statusInd.classList.add('balanced');
                    }
                    if (stepHint) stepHint.innerText = "Step 2: Balance Water Types (Salt vs Fresh).";
                    if (state.saltwater === 0) { 
                        speak("Surface Balanced. Seventy-one percent of Earth’s surface is water. Twenty-nine percent is land.");
                        state.step = 2;
                        state.saltwater = 50; // Start step 2 with partial values
                        state.freshwater = 1;
                        state.iceCoverage = 30;
                        state.drinkable = 0.2;
                        speak("Most water is salty. Only three percent is freshwater.");
                    }
                }
            } else {
                if (stability === 100 && state.pollution === 0 && state.temp === 15) {
                    if (!state.finalMsgSpoken) {
                        speak("Protecting water protects life on Earth.");
                        state.finalMsgSpoken = true;
                    }
                }
            }
        };

        // Drag & Drop Handlers
        const dragItems = document.querySelectorAll('.drag-item');
        dragItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', item.dataset.type);
            });
        });

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => e.preventDefault());
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData('type');
                const x = e.clientX;
                const y = e.clientY;
                
                if (state.step === 1) {
                    if (type === 'ocean') {
                        state.waterSurf = Math.min(100, state.waterSurf + 10);
                        showFloatingCounter(x, y, "+10% Water");
                    } else if (type === 'remOcean') {
                        state.waterSurf = Math.max(0, state.waterSurf - 1);
                        showFloatingCounter(x, y, "-1% Water");
                    } else if (type === 'land') {
                        state.landSurf = Math.min(100, state.landSurf + 5);
                        showFloatingCounter(x, y, "+5% Land");
                    } else if (type === 'remLand') {
                        state.landSurf = Math.max(0, state.landSurf - 1);
                        showFloatingCounter(x, y, "-1% Land");
                    }
                    if (state.waterSurf > targets.waterSurf) speak("Warning: Too much water! Remove some to balance.");
                } else if (state.step >= 2) {
                    if (type === 'ocean') {
                        state.saltwater = Math.min(100, state.saltwater + 5);
                        showFloatingCounter(x, y, "+5% Saltwater");
                    } else if (type === 'remOcean') {
                        state.saltwater = Math.max(0, state.saltwater - 1);
                        showFloatingCounter(x, y, "-1% Saltwater");
                    } else if (type === 'fresh') {
                        state.freshwater = Math.min(10, state.freshwater + 0.5);
                        showFloatingCounter(x, y, "+0.5% Freshwater");
                    } else if (type === 'ice') {
                        state.iceCoverage = Math.min(100, state.iceCoverage + 10);
                        showFloatingCounter(x, y, "+10% Ice");
                    } else if (type === 'pollution') {
                        state.pollution = Math.min(100, state.pollution + 10);
                        state.drinkable = Math.max(0, state.drinkable - 0.1);
                        showFloatingCounter(x, y, "+10% Pollution");
                        speak("Pollution reduces the small amount of safe drinking water.");
                    }
                }
                updateUI();
            });
        }

        const resetBtn = document.getElementById('resetSimS8');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                state = {
                    waterSurf: 0,
                    landSurf: 0,
                    saltwater: 0,
                    freshwater: 0,
                    iceCoverage: 0,
                    drinkable: 0,
                    pollution: 0,
                    temp: 15,
                    waterLevel: 50,
                    step: 1,
                    finalMsgSpoken: false
                };
                if (waterSlider) waterSlider.value = 50;
                if (tempSlider) tempSlider.value = 15;
                if (statusInd) statusInd.classList.remove('balanced');
                if (stepHint) stepHint.innerText = "Step 1: Drag Ocean & Land to balance surface.";
                updateUI();
                speak("Simulator reset. Adjust land and water to match real Earth.");
            });
        }

        if (waterSlider) {
            waterSlider.addEventListener('input', (e) => {
                state.waterLevel = parseInt(e.target.value);
                if (state.waterLevel > 70 || state.waterLevel < 30) {
                    speak("Water levels must stay balanced for life to survive.");
                }
                updateUI();
            });
        }

        if (tempSlider) {
            tempSlider.addEventListener('input', (e) => {
                state.temp = parseInt(e.target.value);
                if (state.temp > 25) {
                    state.iceCoverage = Math.max(0, state.iceCoverage - (state.temp - 25) * 0.5);
                    state.waterLevel = 50 + (state.temp - 25) * 1.5;
                    speak("Higher temperatures melt ice and raise sea levels.");
                }
                updateUI();
            });
        }

        updateUI();
        speak("Welcome to the Earth Water Balance Simulator. Adjust land and water to match real Earth.");
    }

    // Slide 9: Atmospheric Composition Lab
    function initSlide9() {
        const sliderN = document.getElementById('slider-nitrogen');
        const sliderO = document.getElementById('slider-oxygen');
        const sliderC = document.getElementById('slider-co2');
        const atmoToggle = document.getElementById('atmo-toggle');
        
        const valN = document.getElementById('val-nitrogen');
        const valO = document.getElementById('val-oxygen');
        const valC = document.getElementById('val-co2');
        const totalDisplay = document.getElementById('atmo-total');
        const warning = document.getElementById('atmo-warning');
        
        const tempDisplay = document.getElementById('atmo-temp');
        const lifeBar = document.getElementById('life-bar-s9');
        const pressureBar = document.getElementById('gauge-pressure');
        const fireBar = document.getElementById('gauge-fire');
        const plantsBar = document.getElementById('gauge-plants');
        
        const glow = document.getElementById('atmo-glow');
        const clouds = document.getElementById('clouds-layer');
        const uv = document.getElementById('uv-radiation');
        const meteors = document.getElementById('meteor-strike');
        const sparks = document.getElementById('fire-sparks');
        
        const feedback = document.getElementById('atmo-feedback');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');

        let argon = 0.93;

        function updateSimulation() {
            const n = parseFloat(sliderN.value);
            const o = parseFloat(sliderO.value);
            const c = parseFloat(sliderC.value);
            const total = n + o + c + argon;

            valN.textContent = n;
            valO.textContent = o;
            valC.textContent = c.toFixed(2);
            totalDisplay.textContent = `Total: ${total.toFixed(2)}%`;

            if (Math.abs(total - 100) > 0.5) {
                warning.classList.remove('hidden');
                totalDisplay.style.color = "#ff4d4d";
            } else {
                warning.classList.add('hidden');
                totalDisplay.style.color = "#64c8ff";
            }

            updatePieChart(n, o, c, argon);

            if (!atmoToggle.checked) {
                applyVacuumEffects();
                return;
            }

            // Normal Simulation Logic
            let temp = 15;
            let life = 100;
            let pressure = (n / 78) * 100;
            let fire = (o / 21) * 10;
            let plants = (c / 0.04) * 90;

            // CO2 Effects (Global Warming)
            if (c > 1) {
                temp += (c - 0.04) * 20;
                glow.style.boxShadow = `0 0 50px rgba(255, 100, 100, 0.6)`;
                if (c > 5) life -= (c - 5) * 10;
            } else if (c < 0.01) {
                temp -= 20;
                plants = 10;
            }

            // Oxygen Effects (Fire and Breathing)
            if (o > 30) {
                fire = (o - 30) * 5 + 50;
                sparks.classList.remove('hidden');
                if (o > 50) life -= (o - 50) * 2;
            } else {
                sparks.classList.add('hidden');
            }

            if (o < 15) {
                life -= (15 - o) * 5;
            }

            // Nitrogen Effects
            if (n < 50) {
                pressure = (n / 78) * 100;
                life -= (50 - n);
            }

            // Update UI
            tempDisplay.textContent = `${temp.toFixed(1)}°C`;
            lifeBar.style.width = `${Math.max(0, Math.min(100, life))}%`;
            pressureBar.style.width = `${Math.min(100, pressure)}%`;
            fireBar.style.width = `${Math.min(100, fire)}%`;
            plantsBar.style.width = `${Math.min(100, plants)}%`;

            // Color life bar
            if (life > 80) lifeBar.style.backgroundColor = "#4dff4d";
            else if (life > 40) lifeBar.style.backgroundColor = "#ffcc00";
            else lifeBar.style.backgroundColor = "#ff4d4d";

            // Achievement check
            if (n === 78 && o === 21 && c === 0.04 && atmoToggle.checked) {
                showFeedback("Atmosphere Architect", "Perfect balance! This mixture supports life and keeps Earth stable.");
            }

            // Visual Reset from Vacuum
            uv.classList.add('hidden');
            meteors.classList.add('hidden');
            clouds.style.opacity = "0.4";
            glow.style.opacity = "1";
        }

        function applyVacuumEffects() {
            tempDisplay.textContent = "-150°C to 120°C";
            lifeBar.style.width = "0%";
            pressureBar.style.width = "0%";
            fireBar.style.width = "0%";
            plantsBar.style.width = "0%";
            
            uv.classList.remove('hidden');
            meteors.classList.remove('hidden');
            clouds.style.opacity = "0";
            glow.style.opacity = "0";
            
            showFeedback("NO ATMOSPHERE", "Without an atmosphere, Earth cannot support life. UV radiation and meteors strike the surface.");
        }

        function updatePieChart(n, o, c, a) {
            let startAngle = 0;
            
            function getPath(angle) {
                const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                startAngle += angle * 3.6;
                const x2 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                const largeArc = angle * 3.6 > 180 ? 1 : 0;
                return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            }

            document.getElementById('pie-nitrogen').setAttribute('d', getPath(n));
            document.getElementById('pie-oxygen').setAttribute('d', getPath(o));
            document.getElementById('pie-co2').setAttribute('d', getPath(c));
            document.getElementById('pie-argon').setAttribute('d', getPath(a));
        }

        function showFeedback(title, text) {
            feedbackTitle.textContent = title;
            feedbackText.textContent = text;
            feedback.classList.remove('hidden');
            speak(text);
            setTimeout(() => feedback.classList.add('hidden'), 5000);
        }

        sliderN.addEventListener('input', updateSimulation);
        sliderO.addEventListener('input', updateSimulation);
        sliderC.addEventListener('input', updateSimulation);
        atmoToggle.addEventListener('change', updateSimulation);

        updateSimulation();
    }

    // Initialize first slide
    updateSlides();
});
