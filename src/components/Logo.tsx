import logoImg from "../imports/WhatsApp_Image_2026-08-20_at_10.12.44_AM.jpeg";

interface LogoProps {
  variant?: "full" | "mark";
  onDark?: boolean;
  className?: string;
  height?: number;
}

export default function Logo({ onDark = false, className = "", height = 52 }: LogoProps) {
  if (onDark) {
    // White rounded pill so logo colours stay true on dark backgrounds
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "5px 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          display: "inline-flex",
        }}
      >
        <img
          src={logoImg}
          alt="Vrishabhanvi Ventures"
          style={{ height: `${height}px`, width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  // Light background — multiply removes the white JPEG bg
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
