import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 400, height = 120 }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.png"
        alt="SabaySell"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
