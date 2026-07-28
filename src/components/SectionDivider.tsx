export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden h-[2px] ${className}`}>
      <div className="rgb-gradient-line" style={{ top: 0 }} />
    </div>
  );
}
