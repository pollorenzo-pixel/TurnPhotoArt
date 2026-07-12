type BeforeAfterComparisonProps = {
  imageUrl: string;
  split: number;
  onSplitChange: (value: number) => void;
};

export function BeforeAfterComparison({ imageUrl, split, onSplitChange }: BeforeAfterComparisonProps) {
  return (
    <div className="comparison">
      <div className="comparison-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Your original uploaded photo" />
        <div className="playful-layer" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Local playful style preview" />
          <span className="doodle doodle-star">✦</span>
          <span className="doodle doodle-heart">♥</span>
          <span className="doodle doodle-loop" />
        </div>
        <div className="comparison-line" style={{ left: `${split}%` }} aria-hidden="true"><span /></div>
        <span className="comparison-label label-before">Original</span>
        <span className="comparison-label label-after">Playful preview</span>
      </div>
      <label className="comparison-control">
        <span>Slide to compare</span>
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(event) => onSplitChange(Number(event.target.value))}
          aria-label="Show more or less of the playful preview"
        />
      </label>
    </div>
  );
}
