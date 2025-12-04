import godzillaSvg from "../assets/godzilla.svg";

export default function GodzillaHead({
  size = 120,
  flip = false,
  glowColor = "#00E5FF",
}) {
  return (
    <img
      src={godzillaSvg}
      alt="Godzilla"
      width={size}
      height={size}
      className="godzilla-img"
      style={{
        transform: flip ? "scaleX(-1)" : "none", // flip if needed
        filter: `
          drop-shadow(0 0 10px ${glowColor})
          drop-shadow(0 0 20px ${glowColor})
        `,
      }}
    />
  );
}
