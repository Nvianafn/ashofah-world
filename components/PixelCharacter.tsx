import sprites from "@/lib/dino-sprites.json";

export type DinoPose = keyof typeof sprites.poses;

export function PixelCharacter({ className = "", pose = "idle" }: { className?: string; pose?: DinoPose }) {
  return (
    <svg
      className={`pixel-character ${className}`}
      data-pose={pose}
      viewBox="0 -4.5 24 34.5"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {sprites.poses[pose].map((frame, index) => (
        <g className={`dino-frame dino-frame-${index}`} key={`${pose}-${index}`}>
          {frame.rows.flatMap((row, y) =>
            Array.from(row).flatMap((color, x) => color === "." ? [] : [
              <rect key={`${x}-${y}`} x={x} y={y + frame.offsetY} width="1" height="1"
                fill={sprites.colors[color as keyof typeof sprites.colors]} />,
            ]),
          )}
        </g>
      ))}
    </svg>
  );
}
