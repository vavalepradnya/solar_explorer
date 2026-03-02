document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextBtn').addEventListener('click', () => {
        window.location.href = '/orbit-speed';
    });

    const welcomeMessage = 'Welcome to Mercury Explorer! Click next to continue learning about this fascinating planet.';
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.rate = 0.75;
    utterance.pitch = 1;
    utterance.volume = 1;
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
});
