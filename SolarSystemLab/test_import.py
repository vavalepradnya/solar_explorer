import os
os.environ['SDL_VIDEODRIVER'] = 'dummy'

from settings import PLANETS_DATA, SUN_DATA, MOON_DATA, WIDTH, HEIGHT, CENTER
from physics import Planet, Sun, Moon, AsteroidBelt, StarField
from ui import UI
from voice import VoiceNarrator

print('Settings loaded successfully')
print(f'Screen: {WIDTH}x{HEIGHT}')
print(f'Planets: {len(PLANETS_DATA)}')

sun = Sun(SUN_DATA['name'], SUN_DATA['color'], SUN_DATA['size'], SUN_DATA['info'], SUN_DATA['details'])
print(f'Sun created: {sun.name} at position {sun.position()}')

planets = []
for data in PLANETS_DATA[:2]:
    p = Planet(data['name'], data['color'], data['orbit_radius'], data['orbit_speed'], data['size'], data['info'], data['details'])
    planets.append(p)
    print(f'Planet created: {p.name}')

asteroid_belt = AsteroidBelt(320, 350, 200)
print(f'Asteroid belt created with {len(asteroid_belt.asteroids)} asteroids')

star_field = StarField(WIDTH, HEIGHT, 500)
print(f'Star field created with {len(star_field.stars)} stars')

ui_obj = UI()
print(f'UI created with {len(ui_obj.buttons)} buttons')

print('All components loaded successfully!')
