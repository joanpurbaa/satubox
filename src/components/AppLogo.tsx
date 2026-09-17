import Image from "next/image";

interface AppLogoProps {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

export default function AppLogo({ src, name, size, className = "" }: AppLogoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <Image
        src={src}
        alt={`Logo ${name}`}
        fill
        sizes={size ? `${size}px` : "(min-width: 640px) 64px, 40px"}
        className="object-contain"
      />
    </span>
  );
}
