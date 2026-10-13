import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

/** Isotipo de AquaTech: la "Λ" del logo */
export const LogoMark: React.FC<IconProps> = ({ size = 28, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20 4 L37 36 H28.6 L20 19.6 L11.4 36 H3 Z" />
  </svg>
);

interface LogoProps {
  tone?: 'dark' | 'light';
  className?: string;
}

/** Logo horizontal: isotipo + AQUATECH / SOLUTIONS */
export const Logo: React.FC<LogoProps> = ({ tone = 'dark', className = '' }) => {
  const ink = tone === 'dark' ? 'text-ink' : 'text-white';
  const sub = tone === 'dark' ? 'text-graphite' : 'text-white/70';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={30} className={ink} />
      <span className="flex flex-col leading-none">
        <span className={`font-headline text-[19px] font-bold tracking-[0.04em] ${ink}`}>AQUATECH</span>
        <span className={`mt-1 text-[9.5px] font-medium tracking-[0.42em] ${sub}`}>SOLUTIONS</span>
      </span>
    </span>
  );
};

export const WhatsAppIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.56.93.95-3.47-.23-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42a9.36 9.36 0 0 1 6.66 2.76 9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.42 9.42m8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.51 5.66L.62 23.25l5.65-1.48a11.3 11.3 0 0 0 5.78 1.47h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a21 21 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.15H7.92v2.94h2.54V21z" />
  </svg>
);
