import { Link } from '../context/RouterContext';

export function BrandSymbol({ size = 34 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="15" fill="#f4eee7" />
      <path
        d="M13 43V22.5C13 17.8 16.8 14 21.5 14h.5c4.7 0 8.5 3.8 8.5 8.5v19c0 4.7 3.8 8.5 8.5 8.5h.5c4.7 0 8.5-3.8 8.5-8.5V21"
        fill="none"
        stroke="#8e3d2c"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M18 32h28" stroke="#c66b3d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="32" r="5" fill="#d9a441" />
      <circle cx="46" cy="32" r="5" fill="#d9a441" />
      <circle cx="32" cy="32" r="4" fill="#f0c789" stroke="#8e3d2c" strokeWidth="2" />
    </svg>
  );
}

export function BrandWordmark({
  theme = 'auto',
  compact = false,
}: {
  theme?: 'auto' | 'dark';
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link href="/" className="brand-compact" aria-label="HR Shakti home">
        <BrandSymbol size={32} />
      </Link>
    );
  }

  const textClass =
    theme === 'dark'
      ? 'brand-wordmark-text brand-wordmark-text--on-dark'
      : 'brand-wordmark-text';
  const accentClass =
    theme === 'dark'
      ? 'brand-wordmark-accent brand-wordmark-accent--on-dark'
      : 'brand-wordmark-accent';

  return (
    <Link href="/" className="brand" aria-label="HR Shakti home">
      <BrandSymbol size={34} />
      <span className={textClass}>
        HR <b className={accentClass}>SHAKTI</b>
      </span>
    </Link>
  );
}
