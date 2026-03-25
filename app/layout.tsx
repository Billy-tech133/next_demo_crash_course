import type { Metadata } from 'next';
import { Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';
import LightRays from '@/components/LightRays';

import { NextFont } from 'next/dist/compiled/@next/font';
import Navbar from '@/components/Navbar';

const schibstedGrostesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
});

const martianMono = Martian_Mono({ variable: '--font-martian-mono' });

export const metadata: Metadata = {
  title: 'DevEvent',
  description: "The hub for every dev event you musn't miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${schibstedGrostesk.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col min-h-screen">
        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
