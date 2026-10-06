# Ashofah dino mascot

Original human-in-a-dinosaur-costume pixel character created for Ashofah World.
The website renders the same pixel maps from `lib/dino-sprites.json` as crisp SVG
frames; poses follow movement and jumping in the game arena, with waving greetings
on the opening screen, profile and contact sections.

PNG sprite sheets are transparent and use 32 × 32 pixels per frame, arranged
horizontally. Import into Piskel as a sprite sheet with that frame size.

- `idle.png`: one resting frame.
- `walk.png`: four frames, 160 ms per frame.
- `jump.png`: one airborne frame; movement comes from the game physics.
- `wave.png`: four frames, 250 ms per frame.

GIF files preview each pose. Keep SVG rendering and exported sheets in sync when
editing the pixel maps. Reduced-motion visitors see the first frame of each pose.
