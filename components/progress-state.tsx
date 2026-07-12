type ProgressStateProps = { message: string };

export function ProgressState({ message }: ProgressStateProps) {
  return (
    <div className="progress-state" role="status" aria-live="polite">
      <div className="progress-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{message}</p>
      <span className="progress-note">Creating your local preview</span>
    </div>
  );
}
