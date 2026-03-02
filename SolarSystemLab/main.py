import pygame
import sys
from settings import (
    WIDTH, HEIGHT, FPS, CENTER, COLORS, PLANETS_DATA, SUN_DATA, MOON_DATA,
    INTRO_TEXT, STAR_COUNT, ASTEROID_BELT_INNER, ASTEROID_BELT_OUTER, ASTEROID_COUNT
)
from physics import Planet, Moon, Sun, AsteroidBelt, StarField
from ui import UI
from voice import VoiceNarrator


pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Solar System Lab - Realistic Edition")
clock = pygame.time.Clock()

narrator = VoiceNarrator()
ui = UI()

sun = Sun(SUN_DATA["name"], SUN_DATA["color"], SUN_DATA["size"], SUN_DATA["info"], SUN_DATA["details"])

planets = []
for planet_data in PLANETS_DATA:
    planet = Planet(
        planet_data["name"],
        planet_data["color"],
        planet_data["orbit_radius"],
        planet_data["orbit_speed"],
        planet_data["size"],
        planet_data["info"],
        planet_data["details"]
    )
    planets.append(planet)

earth = None
for planet in planets:
    if planet.name == "Earth":
        earth = planet
        break

moon = None
if earth:
    moon = Moon(MOON_DATA["name"], MOON_DATA["color"], MOON_DATA["orbit_radius"], MOON_DATA["orbit_speed"], MOON_DATA["size"], earth)

asteroid_belt = AsteroidBelt(ASTEROID_BELT_INNER, ASTEROID_BELT_OUTER, ASTEROID_COUNT)
star_field = StarField(WIDTH, HEIGHT, STAR_COUNT)

TIME_SCALE = 1.0
PAUSED = False
SHOW_ORBITS = True
MUTED = False

narrator.speak(INTRO_TEXT)

running = True
frame_count = 0

while running:
    clock.tick(FPS)
    mouse_pos = pygame.mouse.get_pos()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            action = ui.handle_button_click(event.pos)

            if action == "start":
                PAUSED = False
                narrator.speak_button_action("start")
            elif action == "pause":
                PAUSED = True
                narrator.speak_button_action("pause")
            elif action == "speed_up":
                TIME_SCALE = min(5.0, TIME_SCALE + 0.5)
                narrator.speak_button_action("speed_up")
            elif action == "speed_down":
                TIME_SCALE = max(0.5, TIME_SCALE - 0.5)
                narrator.speak_button_action("speed_down")
            elif action == "reset":
                TIME_SCALE = 1.0
                PAUSED = False
                for planet in planets:
                    planet.angle = 0
                if moon:
                    moon.angle = 0
                narrator.speak_button_action("reset")
            elif action == "mute":
                narrator.toggle_mute()
                MUTED = narrator.is_muted
                narrator.speak_button_action("mute")
            elif action == "toggle_orbits":
                SHOW_ORBITS = not SHOW_ORBITS
                narrator.speak_button_action("toggle_orbits")

            if action is None:
                sun.set_hover(False)
                for planet in planets:
                    planet.set_hover(False)

                if sun.is_mouse_over(event.pos):
                    sun.set_hover(True)
                    ui.set_selected_object(sun)
                    narrator.speak_name(sun.name)
                else:
                    for planet in planets:
                        if planet.is_mouse_over(event.pos):
                            planet.set_hover(True)
                            ui.set_selected_object(planet)
                            narrator.speak_name(planet.name)
                            break

    sun.set_hover(False)
    for planet in planets:
        planet.set_hover(False)

    if sun.is_mouse_over(mouse_pos):
        sun.set_hover(True)

    for planet in planets:
        planet.update(TIME_SCALE, PAUSED)
        if planet.is_mouse_over(mouse_pos):
            planet.set_hover(True)

    if moon:
        moon.update(TIME_SCALE, PAUSED)

    asteroid_belt.update(TIME_SCALE, PAUSED)

    screen.fill(COLORS["background"])

    star_field.draw(screen)

    ui.draw_orbits(screen, planets, sun, SHOW_ORBITS)

    asteroid_belt.draw(screen)

    sun.draw(screen)

    for planet in planets:
        planet.draw(screen)

    if moon:
        moon.draw(screen)

    ui.draw_buttons(screen, mouse_pos)
    ui.draw_title(screen)
    ui.draw_time_scale(screen, TIME_SCALE, PAUSED)

    ui.draw_sun_name(screen, sun, mouse_pos)
    for planet in planets:
        ui.draw_planet_name(screen, planet, mouse_pos)

    ui.draw_info_panel(screen, ui.selected_object)

    pygame.display.flip()

pygame.quit()
narrator.stop()
sys.exit()
