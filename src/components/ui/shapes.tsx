
import React from 'react';
import { cn } from '@/lib/utils';

interface ShapesBlobProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: keyof typeof blobColors;
  size?: 'sm' | 'md' | 'lg';
}

const blobColors = {
  'pastel-pink': 'bg-pastel-pink',
  'pastel-mint': 'bg-pastel-mint',
  'pastel-lavender': 'bg-pastel-lavender',
  'pastel-peach': 'bg-pastel-peach',
  'pastel-blush': 'bg-pastel-blush',
  'pastel-lightpink': 'bg-pastel-lightpink',
};

const blobSizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48', 
  lg: 'w-64 h-64',
};

export function ShapesBlob({
  color = 'pastel-pink',
  size = 'md',
  className,
  ...props
}: ShapesBlobProps) {
  return (
    <div 
      className={cn(
        'shape-blob animate-float',
        blobColors[color],
        blobSizes[size],
        className
      )}
      {...props}
    />
  );
}

interface ShapesWaveProps extends React.SVGAttributes<SVGElement> {
  color?: string;
}

export function ShapesWave({
  color = '#FFDEE2',
  className,
  ...props
}: ShapesWaveProps) {
  return (
    <svg 
      viewBox="0 0 1440 320" 
      className={cn('w-full', className)}
      {...props}
    >
      <path 
        fill={color} 
        fillOpacity="1" 
        d="M0,128L48,122.7C96,117,192,107,288,128C384,149,480,203,576,202.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  );
}

interface ShapesDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  dotColor?: string;
  size?: number;
  spacing?: number;
}

export function ShapesDots({
  dotColor = 'rgba(255,182,193,0.2)',
  size = 20,
  spacing = 40,
  className,
  style,
  ...props
}: ShapesDotsProps) {
  return (
    <div
      className={cn('absolute inset-0 -z-10', className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${size/2}px, transparent ${size/2}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        ...style
      }}
      {...props}
    />
  );
}
