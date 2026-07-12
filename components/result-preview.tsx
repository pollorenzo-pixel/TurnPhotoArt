import { Download, RotateCcw } from "lucide-react";
import { BeforeAfterComparison } from "@/components/before-after-comparison";

type ResultPreviewProps = {
  imageUrl: string;
  split: number;
  onSplitChange: (value: number) => void;
  onDownload: () => void;
  onReset: () => void;
  isExporting: boolean;
  exportError: string;
};

export function ResultPreview(props: ResultPreviewProps) {
  return (
    <section className="result-section" id="result" aria-labelledby="result-title">
      <div className="section-kicker"><span /> Your preview is ready</div>
      <div className="result-heading">
        <div>
          <h2 id="result-title">A little more colour. A lot more character.</h2>
          <p>Interactive style preview — full AI artwork coming in the next phase</p>
        </div>
        <span className="local-badge">Local preview</span>
      </div>
      <BeforeAfterComparison imageUrl={props.imageUrl} split={props.split} onSplitChange={props.onSplitChange} />
      {props.exportError ? <p className="result-error" role="alert">{props.exportError}</p> : null}
      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={props.onDownload} disabled={props.isExporting} aria-busy={props.isExporting}>
          <Download size={19} aria-hidden="true" /> {props.isExporting ? "Preparing preview…" : "Download preview"}
        </button>
        <button className="button button-secondary" type="button" onClick={props.onReset}>
          <RotateCcw size={18} aria-hidden="true" /> Try another photo
        </button>
      </div>
    </section>
  );
}
