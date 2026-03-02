import pyttsx3
import threading


class VoiceNarrator:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
        self.engine.setProperty('volume', 0.9)
        self.is_muted = False
        self.current_text = ""
        self.is_speaking = False

    def speak(self, text, priority="normal"):
        if self.is_muted:
            return

        if text == self.current_text and self.is_speaking:
            return

        self.current_text = text
        self.is_speaking = True

        def speak_async():
            try:
                self.engine.stop()
                self.engine.say(text)
                self.engine.runAndWait()
            finally:
                self.is_speaking = False

        thread = threading.Thread(target=speak_async, daemon=True)
        thread.start()

    def speak_name(self, name):
        if not self.is_muted:
            self.speak(name, priority="high")

    def speak_button_action(self, action):
        if not self.is_muted:
            actions = {
                "start": "Simulation started.",
                "pause": "Simulation paused.",
                "speed_up": "Increasing orbital velocity.",
                "speed_down": "Reducing orbital velocity.",
                "reset": "System reset.",
                "mute": "Voice disabled.",
                "toggle_orbits": "Orbit display toggled."
            }
            if action in actions:
                self.speak(actions[action])

    def mute(self):
        self.is_muted = True
        self.engine.stop()

    def unmute(self):
        self.is_muted = False

    def toggle_mute(self):
        if self.is_muted:
            self.unmute()
        else:
            self.mute()

    def stop(self):
        self.engine.stop()
        self.is_speaking = False

    def set_rate(self, rate):
        self.engine.setProperty('rate', max(50, min(300, rate)))

    def set_volume(self, volume):
        self.engine.setProperty('volume', max(0, min(1, volume)))
