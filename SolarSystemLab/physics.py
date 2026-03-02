import math
import pygame
from settings import CENTER, COLORS, SATURN_RING_RATIO


class Planet:
    def __init__(self, name, color, orbit_radius, orbit_speed, size, info, details):
        self.name = name
        self.color = color
        self.orbit_radius = orbit_radius
        self.base_speed = orbit_speed
        self.size = size
        self.angle = 0
        self.info = info
        self.details = details
        self.is_hovered = False
        self.is_saturn = name == "Saturn"
        self.has_rings = self.is_saturn

    def update(self, time_scale, paused):
        if not paused:
            self.angle += self.base_speed * time_scale

    def position(self):
        x = CENTER[0] + self.orbit_radius * math.cos(math.radians(self.angle))
        y = CENTER[1] + self.orbit_radius * math.sin(math.radians(self.angle))
        return (int(x), int(y))

    def get_distance_from_mouse(self, mouse_pos):
        return math.dist(self.position(), mouse_pos)

    def is_mouse_over(self, mouse_pos):
        return self.get_distance_from_mouse(mouse_pos) < self.size + 5

    def set_hover(self, is_hovering):
        self.is_hovered = is_hovering

    def draw(self, surface):
        pos = self.position()

        if self.is_saturn and self.has_rings:
            self._draw_saturn_rings(surface, pos)

        shadow_color = (0, 0, 0, 80)
        shadow_surface = pygame.Surface((self.size * 2.5, self.size * 2.5), pygame.SRCALPHA)
        pygame.draw.circle(
            shadow_surface,
            shadow_color,
            (self.size * 1.25, self.size * 1.25),
            self.size
        )
        surface.blit(shadow_surface, (pos[0] - self.size * 1.25, pos[1] - self.size * 1.25))

        pygame.draw.circle(surface, self.color, pos, self.size)

        glow_radius = self.size + 3
        glow_surface = pygame.Surface((glow_radius * 2, glow_radius * 2), pygame.SRCALPHA)
        glow_color = (255, 255, 100, 30)
        pygame.draw.circle(glow_surface, glow_color, (glow_radius, glow_radius), glow_radius)
        surface.blit(glow_surface, (pos[0] - glow_radius, pos[1] - glow_radius))

        if self.is_hovered:
            pygame.draw.circle(surface, COLORS["glow"], pos, self.size + 6, 2)

    def _draw_saturn_rings(self, surface, pos):
        ring_width = self.size * SATURN_RING_RATIO
        ring_height = self.size * 0.4
        pygame.draw.ellipse(
            surface,
            (220, 200, 150),
            (pos[0] - ring_width, pos[1] - ring_height, ring_width * 2, ring_height * 2),
            3
        )


class Moon:
    def __init__(self, name, color, orbit_radius, orbit_speed, size, parent_planet):
        self.name = name
        self.color = color
        self.orbit_radius = orbit_radius
        self.base_speed = orbit_speed
        self.size = size
        self.angle = 0
        self.parent_planet = parent_planet

    def update(self, time_scale, paused):
        if not paused:
            self.angle += self.base_speed * time_scale

    def position(self):
        parent_pos = self.parent_planet.position()
        x = parent_pos[0] + self.orbit_radius * math.cos(math.radians(self.angle))
        y = parent_pos[1] + self.orbit_radius * math.sin(math.radians(self.angle))
        return (int(x), int(y))

    def get_distance_from_mouse(self, mouse_pos):
        return math.dist(self.position(), mouse_pos)

    def is_mouse_over(self, mouse_pos):
        return self.get_distance_from_mouse(mouse_pos) < self.size + 3

    def draw(self, surface):
        pos = self.position()
        pygame.draw.circle(surface, self.color, pos, self.size)

        glow_surface = pygame.Surface((self.size * 2, self.size * 2), pygame.SRCALPHA)
        glow_color = (255, 255, 100, 20)
        pygame.draw.circle(glow_surface, glow_color, (self.size, self.size), self.size)
        surface.blit(glow_surface, (pos[0] - self.size, pos[1] - self.size))


class Sun:
    def __init__(self, name, color, size, info, details):
        self.name = name
        self.color = color
        self.size = size
        self.info = info
        self.details = details
        self.is_hovered = False
        self.position_val = CENTER

    def position(self):
        return self.position_val

    def get_distance_from_mouse(self, mouse_pos):
        return math.dist(self.position(), mouse_pos)

    def is_mouse_over(self, mouse_pos):
        return self.get_distance_from_mouse(mouse_pos) < self.size

    def set_hover(self, is_hovering):
        self.is_hovered = is_hovering

    def draw(self, surface):
        pos = self.position()

        glow_radius = self.size + 20
        glow_surface = pygame.Surface((glow_radius * 2, glow_radius * 2), pygame.SRCALPHA)
        for i in range(glow_radius, 0, -5):
            alpha = int(100 * (1 - i / glow_radius))
            glow_color = (255, 180, 0, alpha)
            pygame.draw.circle(glow_surface, glow_color, (glow_radius, glow_radius), i)
        surface.blit(glow_surface, (pos[0] - glow_radius, pos[1] - glow_radius))

        pygame.draw.circle(surface, self.color, pos, self.size)
        pygame.draw.circle(surface, (255, 200, 0), pos, self.size - 5)

        if self.is_hovered:
            pygame.draw.circle(surface, COLORS["glow"], pos, self.size + 8, 2)


class AsteroidBelt:
    def __init__(self, inner_radius, outer_radius, count):
        self.asteroids = []
        for _ in range(count):
            angle = (360 * _) / count + ((_ % 7) * 5)
            radius = inner_radius + ((outer_radius - inner_radius) * (_ % 3) / 3)
            self.asteroids.append({"angle": angle, "radius": radius})

    def update(self, time_scale, paused):
        if not paused:
            for asteroid in self.asteroids:
                asteroid["angle"] += 0.02 * time_scale

    def draw(self, surface):
        for asteroid in self.asteroids:
            x = CENTER[0] + asteroid["radius"] * math.cos(math.radians(asteroid["angle"]))
            y = CENTER[1] + asteroid["radius"] * math.sin(math.radians(asteroid["angle"]))
            pygame.draw.circle(surface, (120, 120, 120), (int(x), int(y)), 2)


class StarField:
    def __init__(self, width, height, star_count):
        self.stars = []
        import random
        random.seed(42)
        for _ in range(star_count):
            x = random.randint(0, width)
            y = random.randint(0, height)
            brightness = random.randint(100, 255)
            self.stars.append((x, y, brightness))

    def draw(self, surface):
        for x, y, brightness in self.stars:
            pygame.draw.circle(surface, (brightness, brightness, brightness), (x, y), 1)
