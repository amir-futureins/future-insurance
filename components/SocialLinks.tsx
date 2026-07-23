import { Facebook, Instagram, Linkedin } from 'lucide-react';

/**
 * SocialLinks — minimalist Facebook / Instagram / LinkedIn icon row.
 * URLs are pulled from public env vars (set them in Vercel) with a '#' default,
 * so the icons render cleanly even before the profiles are wired.
 */
const SOCIALS = [
  { label: 'Facebook', Icon: Facebook, href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#' },
  { label: 'Instagram', Icon: Instagram, href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#' },
  { label: 'LinkedIn', Icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#' },
];

export default function SocialLinks({
  variant = 'footer',
  className = '',
}: {
  variant?: 'footer' | 'drawer';
  className?: string;
}) {
  const item =
    variant === 'drawer'
      ? 'grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/20 hover:text-gold-bright'
      : 'grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-navy transition-colors hover:border-gold/40 hover:text-gold-deep';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIALS.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={item}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </a>
      ))}
    </div>
  );
}
