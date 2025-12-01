import type { FC } from "react";

type LoadingSpinnerProps = {
  label?: string;
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ label }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin"
        aria-hidden="true"
      />
      {label && <span>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
