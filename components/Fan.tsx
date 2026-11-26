// Original tail-feather fan motif (pure SVG so it also renders inside the OG card).
type Props = { size?: number; spin?: boolean };

const BANDS = ["#7A1E2C", "#C2471F", "#E08A2E", "#E8B04A"];

export function Fan({ size = 220, spin = false }: Props) {
  const feathers = 11;
  const items = [] as React.ReactElement[];
  for (let i = 0; i < feathers; i++) {
    const angle = -80 + (160 / (feathers - 1)) * i;
    items.push(
      <g key={i} transform={`rotate(${angle} 100 100)`}>
        <path d="M100 100 C86 70 88 22 100 6 C112 22 114 70 100 100Z" fill={BANDS[0]} />
        <path d="M100 100 C90 74 91 38 100 24 C109 38 110 74 100 100Z" fill={BANDS[1]} />
        <path d="M100 100 C94 80 94 54 100 42 C106 54 106 80 100 100Z" fill={BANDS[2]} />
        <path d="M100 100 C97 86 97 70 100 60 C103 70 103 86 100 100Z" fill={BANDS[3]} />
      </g>
    );
  }
  return (
    <svg
      width={size}
      height={size / 2 + 12}
      viewBox="0 0 200 112"
      aria-hidden="true"
      className={spin ? "fan fan--spin" : "fan"}
    >
      {items}
      <circle cx="100" cy="100" r="13" fill="#2A1810" />
      <circle cx="100" cy="100" r="5" fill="#E8B04A" />
    </svg>
  );
}
