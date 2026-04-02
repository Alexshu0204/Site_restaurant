import type { ReactNode } from 'react';

interface ButtonProps {
  label: ReactNode;
  onClick?: () => void;
  variant?: 'white' | 'black';
  rounded?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function MyButton({
  label,
  onClick,
  variant = 'white',
  rounded = false,
  disabled = false,
  className = '',
  ariaLabel,
}: ButtonProps) {
  // We define styles for each variant in an object for easy access
  const styles = {
    white: 'bg-white text-black hover:bg-stone-300',
    black: 'bg-[#222] text-white hover:bg-white hover:text-black',
  };

  const roundedClass = rounded ? 'rounded-lg' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${styles[variant]} ${roundedClass} px-10 py-4 font-mono text-[12px] tracking-[0.3em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {label}
    </button>
  );
}