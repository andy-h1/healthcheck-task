type ProgressBarProps = {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="overflow-hidden rounded-xl bg-gray-200">
      <div className="relative flex h-0.5 items-center justify-center">
        <div
          style={{ width: `${progress}%` }}
          className="absolute bottom-0 left-0 top-0 rounded-lg bg-teal-400"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
