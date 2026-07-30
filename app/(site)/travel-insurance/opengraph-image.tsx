import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const alt = 'Future Fly — Travel Insurance Hub';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Dot colours are brightened for legibility on the dark OG canvas.
const PROVIDERS = [
  { label: 'PassportCard', color: '#FF556B' },
  { label: 'Harel', color: '#5AA0F5' },
  { label: 'Migdal', color: '#5C8AF0' },
  { label: 'Clal', color: '#38C6F7' },
];

export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), 'public/new-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'radial-gradient(60% 60% at 85% 0%, #1c2c56 0%, #0a1330 45%, #070c1c 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 800 }}>
              <div style={{ color: '#EEF2FB' }}>Future</div>
              <div style={{ color: '#E1B665', marginLeft: '10px' }}>Fly</div>
            </div>
            <div style={{ fontSize: '22px', color: '#9BA7C6' }}>
              מבית Future Insurance · futureins.co.il
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 600,
              color: '#E1B665',
              letterSpacing: '3px',
            }}
          >
            TRAVEL INSURANCE HUB
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '62px',
              fontWeight: 800,
              color: '#EEF2FB',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            Smart travel cover, matched to your trip
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {PROVIDERS.map((p) => (
            <div
              key={p.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '28px',
                fontWeight: 700,
                color: '#EEF2FB',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  background: p.color,
                }}
              />
              {p.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
