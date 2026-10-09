const WORDS = [
  "Timeless",
  "Bold",
  "You",
  "Core Collection",
  "Heritage Collection",
  "Men",
  "Women",
  "Kids",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="border-y border-line bg-ink py-5 overflow-hidden select-none">
      <div className="flex w-max animate-marquee gap-0">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="display text-2xl md:text-3xl text-white/90 px-6">
                  {w}
                </span>
                <span className="text-gold text-xl">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
