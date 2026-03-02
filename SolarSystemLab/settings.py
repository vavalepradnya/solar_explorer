import pygame

pygame.init()

WIDTH, HEIGHT = 1600, 1000
FPS = 60

CENTER = (WIDTH // 2, HEIGHT // 2)

COLORS = {
    "background": (5, 5, 15),
    "sun": (255, 180, 0),
    "mercury": (169, 169, 169),
    "venus": (255, 198, 73),
    "earth": (100, 149, 237),
    "mars": (188, 39, 50),
    "jupiter": (210, 180, 140),
    "saturn": (222, 184, 135),
    "uranus": (175, 238, 238),
    "neptune": (72, 61, 139),
    "moon": (200, 200, 200),
    "pluto": (139, 69, 19),
    "orbit_line": (50, 50, 80),
    "glow": (255, 255, 100),
    "text": (255, 255, 255),
    "panel_bg": (20, 20, 40),
    "panel_border": (120, 120, 255),
}

PLANETS_DATA = [
    {
        "name": "Mercury",
        "color": COLORS["mercury"],
        "orbit_radius": 100,
        "orbit_speed": 0.04,
        "size": 5,
        "distance_km": "57.9 million km",
        "info": (
            "Mercury is the closest planet to the Sun.\n"
            "It completes one orbit in 88 Earth days.\n"
            "It has no significant atmosphere.\n"
            "Temperatures range from 430°C to -180°C.\n"
            "One Mercury day lasts 59 Earth days."
        ),
        "details": [
            "Smallest planet",
            "Fastest orbit",
            "No atmosphere",
            "Extreme temperatures",
            "No moons"
        ]
    },
    {
        "name": "Venus",
        "color": COLORS["venus"],
        "orbit_radius": 150,
        "orbit_speed": 0.03,
        "size": 9,
        "distance_km": "108.2 million km",
        "info": (
            "Venus is similar in size to Earth.\n"
            "It is the hottest planet due to greenhouse effect.\n"
            "Surface temperatures reach 460°C.\n"
            "It rotates in the opposite direction to most planets.\n"
            "One Venus day is longer than its year."
        ),
        "details": [
            "Earth-size planet",
            "Thick greenhouse atmosphere",
            "460°C surface temperature",
            "Retrograde rotation",
            "No moons"
        ]
    },
    {
        "name": "Earth",
        "color": COLORS["earth"],
        "orbit_radius": 210,
        "orbit_speed": 0.025,
        "size": 10,
        "distance_km": "149.6 million km",
        "info": (
            "Earth is the third planet from the Sun.\n"
            "It is the only known planet that supports life.\n"
            "Seventy percent of its surface is covered with water.\n"
            "It has a protective atmosphere rich in oxygen and nitrogen.\n"
            "Earth has one natural satellite, the Moon."
        ),
        "details": [
            "Habitable zone",
            "Liquid water",
            "24-hour rotation",
            "365-day orbit",
            "One Moon"
        ]
    },
    {
        "name": "Mars",
        "color": COLORS["mars"],
        "orbit_radius": 280,
        "orbit_speed": 0.02,
        "size": 7,
        "distance_km": "227.9 million km",
        "info": (
            "Mars is known as the Red Planet.\n"
            "It has the largest volcano, Olympus Mons.\n"
            "A Martian year lasts 687 Earth days.\n"
            "It has two small moons, Phobos and Deimos.\n"
            "Scientists believe water once flowed on its surface."
        ),
        "details": [
            "Red iron oxide surface",
            "Thin atmosphere",
            "2 moons",
            "Possible ancient water",
            "Cold desert world"
        ]
    },
    {
        "name": "Jupiter",
        "color": COLORS["jupiter"],
        "orbit_radius": 380,
        "orbit_speed": 0.012,
        "size": 20,
        "distance_km": "778.5 million km",
        "info": (
            "Jupiter is the largest planet in the Solar System.\n"
            "It is a gas giant made mainly of hydrogen and helium.\n"
            "It rotates once every 10 hours.\n"
            "The Great Red Spot is a massive storm lasting centuries.\n"
            "Jupiter has more than 90 known moons."
        ),
        "details": [
            "Gas giant",
            "11 times Earth's diameter",
            "10-hour rotation",
            "Great Red Spot",
            "Many moons"
        ]
    },
    {
        "name": "Saturn",
        "color": COLORS["saturn"],
        "orbit_radius": 480,
        "orbit_speed": 0.009,
        "size": 18,
        "distance_km": "1.434 billion km",
        "info": (
            "Saturn is famous for its spectacular ring system.\n"
            "It is composed mainly of hydrogen and helium.\n"
            "Saturn takes 29 Earth years to orbit the Sun.\n"
            "Its rings are made of ice and rock particles.\n"
            "Saturn has over 80 moons."
        ),
        "details": [
            "Ring system",
            "Gas giant",
            "Low density",
            "29-year orbit",
            "Many moons"
        ]
    },
    {
        "name": "Uranus",
        "color": COLORS["uranus"],
        "orbit_radius": 570,
        "orbit_speed": 0.006,
        "size": 14,
        "distance_km": "2.873 billion km",
        "info": (
            "Uranus is an ice giant.\n"
            "It rotates on its side at an angle of 98 degrees.\n"
            "It takes 84 Earth years to orbit the Sun.\n"
            "Its atmosphere contains methane.\n"
            "Uranus has 27 known moons."
        ),
        "details": [
            "Ice giant",
            "Sideways rotation",
            "Methane atmosphere",
            "84-year orbit",
            "27 moons"
        ]
    },
    {
        "name": "Neptune",
        "color": COLORS["neptune"],
        "orbit_radius": 660,
        "orbit_speed": 0.004,
        "size": 15,
        "distance_km": "4.495 billion km",
        "info": (
            "Neptune is the farthest major planet from the Sun.\n"
            "It takes 165 Earth years to complete one orbit.\n"
            "Neptune has the fastest winds in the Solar System.\n"
            "It appears deep blue due to methane gas.\n"
            "It has 14 known moons."
        ),
        "details": [
            "Ice giant",
            "165-year orbit",
            "Fast winds",
            "Deep blue color",
            "14 moons"
        ]
    },
    {
        "name": "Pluto",
        "color": COLORS["pluto"],
        "orbit_radius": 730,
        "orbit_speed": 0.002,
        "size": 4,
        "distance_km": "5.913 billion km",
        "info": (
            "Pluto is classified as a dwarf planet.\n"
            "It resides in the Kuiper Belt.\n"
            "It has five known moons.\n"
            "Pluto's orbit is highly elliptical.\n"
            "It was reclassified in 2006."
        ),
        "details": [
            "Dwarf planet",
            "Kuiper Belt object",
            "5 moons",
            "248-year orbit",
            "Reclassified in 2006"
        ]
    }
]

SUN_DATA = {
    "name": "Sun",
    "color": COLORS["sun"],
    "size": 45,
    "info": (
        "The Sun is a G-type main sequence star.\n"
        "It contains 99.8% of the Solar System mass.\n"
        "Its diameter is 1.39 million kilometers.\n"
        "Nuclear fusion converts hydrogen into helium.\n"
        "The Sun's gravity controls all planetary motion."
    ),
    "details": [
        "Type: G2V Main Sequence Star",
        "Diameter: 1.39 million km",
        "Surface Temperature: 5,500°C",
        "Core Temperature: 15 million °C",
        "Contains 99.8% of Solar System mass"
    ]
}

MOON_DATA = {
    "name": "Moon",
    "color": COLORS["moon"],
    "orbit_radius": 40,
    "orbit_speed": 0.1,
    "size": 3,
    "info": "The Moon is Earth's only natural satellite.",
    "parent": "Earth"
}

INTRO_TEXT = (
    "Welcome to the Interactive Solar System Laboratory.\n"
    "At the center lies the Sun, the star that powers our planetary system.\n"
    "Around it, nine planets travel in elliptical orbits, guided by gravity.\n"
    "Move your cursor over any planet to explore.\n"
    "Click on a planet to discover detailed scientific information."
)

BUTTON_TEXTS = {
    "start": "▶ Start",
    "pause": "⏸ Pause",
    "speed_up": "⏩ Speed Up",
    "speed_down": "⏪ Slow Down",
    "reset": "🔁 Reset",
    "mute": "🔇 Mute",
    "toggle_orbits": "🌓 Toggle Orbits"
}

STAR_COUNT = 500

SATURN_RING_RATIO = 1.8

ASTEROID_BELT_INNER = 320
ASTEROID_BELT_OUTER = 350
ASTEROID_COUNT = 200
