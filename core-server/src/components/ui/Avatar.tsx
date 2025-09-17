import { hexToRgba } from "@/lib/colorhex-generator";

interface Props {
  colorHex?: string | null;
  children?: React.ReactElement;
}

export default function Avatar({ colorHex, children }: Props) {
  return (
    <div
      className={`relative flex rounded-full w-10 h-10 items-center justify-center shadow-md ${
        !colorHex && "bg-primary/10"
      }`}
      style={
        colorHex
          ? { backgroundColor: hexToRgba(colorHex, 0.7) }
          : {}
      }
    >
      {children}
    </div>
  );
}
