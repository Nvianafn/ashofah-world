# Ashofah World — Dino Hood

The logo follows the selected smiling human-in-a-dinosaur-hood identity. The
costume is green (`#56b870`), the human face has a warm skin tone (`#f2bd95`),
and navy (`#0c0f20`) and cream (`#fff0cb`) define the face, eye, and hood rim.
The game character uses mint (`#99efb3`) for its belly and darker green
(`#31834b`) for costume shading.

| File | Use |
| --- | --- |
| `dino-hood.svg` | Main transparent logo, 32px or larger |
| `dino-hood-small.svg` | Simplified transparent mark, 16–31px |
| `dino-hood-black.svg` | Single-color mark on light backgrounds |
| `dino-hood-white.svg` | Single-color mark on dark backgrounds |
| `icon-192.png`, `icon-512.png` | Web bookmark icons with opaque navy backgrounds |

Next.js serves browser/Apple icons from `app/icon.svg`, `app/favicon.ico`, and
`app/apple-icon.png`. The manifest uses browser display mode. Use the small
mark for the mobile header below361px and the24px footer. Keep the square
aspect ratio and16/256 of the canvas as clear space; avoid shadows or filters.

The logo is decorative next to visible brand text (`alt=""`, `aria-hidden`).
When used alone, give the surrounding control an accessible Ashofah World name.

Animated characters use `lib/dino-sprites.json`. Matching PNG/GIF sheets and
frame details are documented in `public/images/dino/README.md`.
