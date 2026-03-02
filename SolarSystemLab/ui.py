import pygame
from settings import (
    WIDTH, HEIGHT, CENTER, COLORS, BUTTON_TEXTS, STAR_COUNT
)


class Button:
    def __init__(self, x, y, width, height, text, action):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.action = action
        self.hovered = False

    def draw(self, surface, font):
        color = (60, 60, 120) if self.hovered else (40, 40, 90)
        pygame.draw.rect(surface, color, self.rect)
        pygame.draw.rect(surface, (150, 150, 255), self.rect, 2)

        text_surface = font.render(self.text, True, (255, 255, 255))
        text_rect = text_surface.get_rect(center=self.rect.center)
        surface.blit(text_surface, text_rect)

    def is_clicked(self, pos):
        return self.rect.collidepoint(pos)

    def update_hover(self, mouse_pos):
        self.hovered = self.rect.collidepoint(mouse_pos)


class UI:
    def __init__(self):
        self.font_large = pygame.font.SysFont("arial", 28, bold=True)
        self.font_medium = pygame.font.SysFont("arial", 18)
        self.font_small = pygame.font.SysFont("arial", 14)

        self.buttons = {
            "start": Button(20, 20, 140, 40, BUTTON_TEXTS["start"], "start"),
            "pause": Button(20, 70, 140, 40, BUTTON_TEXTS["pause"], "pause"),
            "speed_up": Button(20, 120, 140, 40, BUTTON_TEXTS["speed_up"], "speed_up"),
            "speed_down": Button(20, 170, 140, 40, BUTTON_TEXTS["speed_down"], "speed_down"),
            "reset": Button(20, 220, 140, 40, BUTTON_TEXTS["reset"], "reset"),
            "mute": Button(20, 270, 140, 40, BUTTON_TEXTS["mute"], "mute"),
            "toggle_orbits": Button(20, 320, 140, 40, BUTTON_TEXTS["toggle_orbits"], "toggle_orbits"),
        }

        self.selected_object = None
        self.info_panel_visible = False
        self.info_panel_alpha = 0

    def draw_buttons(self, surface, mouse_pos):
        for button in self.buttons.values():
            button.update_hover(mouse_pos)
            button.draw(surface, self.font_small)

    def handle_button_click(self, pos):
        for key, button in self.buttons.items():
            if button.is_clicked(pos):
                return button.action
        return None

    def draw_title(self, surface):
        title_text = "Interactive Solar System Laboratory"
        title_surface = self.font_large.render(title_text, True, COLORS["text"])
        title_rect = title_surface.get_rect(center=(WIDTH // 2, 30))
        surface.blit(title_surface, title_rect)

    def draw_orbits(self, surface, planets, sun, show_orbits):
        if not show_orbits:
            return

        for planet in planets:
            pygame.draw.circle(surface, COLORS["orbit_line"], CENTER, planet.orbit_radius, 1)

    def draw_info_panel(self, surface, selected_obj):
        if selected_obj is None:
            return

        panel_width = 380
        panel_height = 300
        panel_x = WIDTH - panel_width - 20
        panel_y = 80

        panel_rect = pygame.Rect(panel_x, panel_y, panel_width, panel_height)
        pygame.draw.rect(surface, COLORS["panel_bg"], panel_rect)
        pygame.draw.rect(surface, COLORS["panel_border"], panel_rect, 2)

        title_text = self.font_medium.render(selected_obj.name, True, (255, 255, 255))
        surface.blit(title_text, (panel_x + 15, panel_y + 15))

        info_text = selected_obj.info
        lines = info_text.split("\n")
        y_offset = 50
        for line in lines:
            if line.strip():
                text_surface = self.font_small.render(line.strip(), True, (200, 200, 200))
                surface.blit(text_surface, (panel_x + 15, panel_y + y_offset))
                y_offset += 22

        detail_y = panel_y + 180
        pygame.draw.line(surface, COLORS["panel_border"], (panel_x + 10, detail_y), (panel_x + panel_width - 10, detail_y), 1)

        details_title = self.font_small.render("Key Facts:", True, (255, 255, 150))
        surface.blit(details_title, (panel_x + 15, detail_y + 10))

        detail_y += 35
        for detail in selected_obj.details[:3]:
            detail_surface = self.font_small.render("• " + detail, True, (200, 200, 200))
            surface.blit(detail_surface, (panel_x + 20, detail_y))
            detail_y += 22

    def draw_planet_name(self, surface, planet, mouse_pos):
        if planet.is_mouse_over(mouse_pos):
            pos = planet.position()
            name_surface = self.font_small.render(planet.name, True, COLORS["glow"])
            name_rect = name_surface.get_rect(center=(pos[0], pos[1] - planet.size - 20))
            surface.blit(name_surface, name_rect)

    def draw_sun_name(self, surface, sun, mouse_pos):
        if sun.is_mouse_over(mouse_pos):
            pos = sun.position()
            name_surface = self.font_small.render(sun.name, True, COLORS["glow"])
            name_rect = name_surface.get_rect(center=(pos[0], pos[1] - sun.size - 25))
            surface.blit(name_surface, name_rect)

    def draw_time_scale(self, surface, time_scale, paused):
        status_text = "⏸ PAUSED" if paused else "▶ RUNNING"
        status_surface = self.font_small.render(status_text, True, (255, 200, 0))
        scale_text = self.font_small.render(f"Speed: {time_scale:.1f}x", True, (200, 200, 200))

        surface.blit(status_surface, (WIDTH - 200, 20))
        surface.blit(scale_text, (WIDTH - 200, 45))

    def set_selected_object(self, obj):
        self.selected_object = obj

    def clear_selection(self):
        self.selected_object = None
