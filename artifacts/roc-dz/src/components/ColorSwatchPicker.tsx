interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const COLOR_OPTIONS = [
  { label: "Noir", hex: "#1C1C1E" },
  { label: "Silver", hex: "#A8A8A8" },
  { label: "Blanc", hex: "#F0F0F0" },
  { label: "Or", hex: "#D4AF37" },
  { label: "Bleu", hex: "#2563EB" },
  { label: "Rouge", hex: "#DC2626" },
  { label: "Vert", hex: "#16A34A" },
  { label: "Violet", hex: "#7C3AED" },
  { label: "Rose", hex: "#EC4899" },
  { label: "Gris", hex: "#6B7280" },
  { label: "Bronze", hex: "#A0522D" },
  { label: "Bleu Nuit", hex: "#1E3A5F" },
];

export function ColorSwatchPicker({ value, onChange, className = "" }: ColorSwatchPickerProps) {
  const selected = COLOR_OPTIONS.find(c => c.label === value);

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map(color => (
          <button
            key={color.label}
            type="button"
            title={color.label}
            onClick={() => onChange(color.label)}
            className="relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
            style={{
              backgroundColor: color.hex,
              borderColor: value === color.label ? "#e91e8c" : "transparent",
              boxShadow: value === color.label ? `0 0 0 2px #e91e8c, 0 0 8px rgba(233,30,140,0.5)` : "0 0 0 1px rgba(255,255,255,0.15)",
            }}
          >
            {value === color.label && (
              <span
                className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
              >
                ✓
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("")}
          title="Aucune couleur"
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs text-muted-foreground transition-all hover:scale-110 ${!value ? "border-primary text-primary" : "border-white/20"}`}
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          ✕
        </button>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground mt-1">
          Couleur sélectionnée : <span className="font-semibold" style={{ color: selected?.hex ?? "#fff" }}>{value}</span>
        </p>
      )}
    </div>
  );
}
