# Ashofah dino mascot

Original human-in-a-dinosaur-costume pixel character created for Ashofah World.
The Dino Hood character matches the website logo: a long green dinosaur hood,
square cream dinosaur eye, peach human face with two eyes and a friendly smile,
and a light rim around the face opening. The costume and tail are green with
darker green shading; mint is reserved for the suit belly. The face keeps its
natural skin tone, with navy hair and outline and cream eye and hood trim.
The website renders the same pixel maps from `lib/dino-sprites.json` as crisp SVG
frames; poses follow movement and jumping in the game arena, with waving greetings
on the opening screen, profile and contact sections.

PNG sprite sheets are transparent and use 32 × 32 pixels per frame, arranged
horizontally. Import into Piskel as a sprite sheet with that frame size.
The source maps are 24 × 30 pixels, placed at x = 4, y = 1 in each exported
frame. Walking bounce frames use offsetY = -1, so every pixel stays aligned to
an integer coordinate and fits inside the 32 × 32 cell. The SVG viewBox keeps
the same aspect ratio as the previous character; game physics and controls
use the existing player dimensions.

- `idle.png`: one resting frame.
- `walk.png`: four frames, 160 ms per frame.
- `jump.png`: one airborne frame; movement comes from the game physics.
- `wave.png`: four frames, 250 ms per frame.

GIF files preview each pose. Keep SVG rendering and exported sheets in sync when
editing the pixel maps. Reduced-motion visitors see the first frame of each pose.
