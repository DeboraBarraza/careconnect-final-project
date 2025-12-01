import React from "react";

type ErrorMessageProps = {
  message: string;
  className?: string;
};

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  return (
    <p className={`text-sm text-red-400 ${className ?? ""}`.trim()}>
      {message}
    </p>
  );
}
