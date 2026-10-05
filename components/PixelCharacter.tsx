export function PixelCharacter({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-character ${className}`}
      viewBox="0 0 24 32"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill="#29223e" d="M7 1h10v2h3v10H4V4h3z" />
      <path fill="#a493ec" d="M7 2h10v2h2v6H5V5h2z" />
      <path fill="#eac1a0" d="M7 7h10v8H7z" />
      <path fill="#fff0cb" d="M8 7h8v2H8z" />
      <path fill="#282039" d="M8 10h3v2H8zm6 0h3v2h-3zm-4 4h5v1h-5z" />
      <path fill="#7560b6" d="M6 15h12v2h3v9H3v-9h3z" />
      <path fill="#a493ec" d="M6 16h12v9H6z" />
      <path fill="#d6c9ff" d="M9 16h1v5H9zm5 0h1v5h-1z" />
      <path fill="#5b478c" d="M8 23h8v2H8z" />
      <path fill="#eac1a0" d="M2 23h4v4H2zm16 0h4v4h-4z" />
      <path fill="#303650" d="M6 26h5v4H6zm7 0h5v4h-5z" />
      <path fill="#fff0cb" d="M4 30h7v2H4zm9 0h7v2h-7z" />
    </svg>
  );
}
