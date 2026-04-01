interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'white' | 'black';
  rounded?: boolean;
}

export default function MyButton({ label, onClick, variant = 'white', rounded = false }: ButtonProps) {
  // We define styles for each variant in an object for easy access
  const styles = {
    white: "bg-white text-black hover:bg-stone-100",
    black: "bg-[#222] text-white hover:bg-white hover:text-black",
  };

  const roundedClass = rounded ? 'rounded-lg' : '';

  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} ${roundedClass} px-10 py-4 font-mono text-[12px] tracking-[0.3em] uppercase transition-all duration-300`}
    >
      {label}
    </button>
  );
}