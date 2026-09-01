import logoImg from "../imports/WhatsApp_Image_2026-08-20_at_10.12.44_AM.jpeg";

interface LogoProps {
  variant?: "full" | "mark";
  onDark?: boolean;
  className?: string;
  height?: number;
}

export default function Logo({ onDark = false, className = "", height = 52 }: LogoProps) {
  if (onDark) {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "6px 10px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
      >
        <img
          src={logoImg}
          alt="Vrishabhanvi Ventures"
          style={{ height: `${height}px`, width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  // On light backgrounds: multiply blend mode makes the white JPEG background disappear,
  // leaving only the navy and gold content visible.
  return (
    <img
      src={logoImg}
      alt="Vrishabhanvi Ventures"
      className={className}
      style={{
        height: `${height}px`,
        width: "auto",
        objectFit: "contain",
        display: "block",
        mixBlendMode: "multiply",
      }}
    />
  );
}
