
export default function GodzillaHead({ color = '#00E5FF' }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 200 200"
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: `drop-shadow(0 0 12px ${color})`,
      }}
    >
      <path
        d="M40 140 L60 100 L80 80 L100 70 L130 75 L150 95 L160 120 L150 130 L130 125 L100 130 L70 150 Z"
      />
      <path d="M100 110 L150 115" />
    </svg>
  )
}
