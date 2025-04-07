
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
        'absolute -z-10 blur-3xl opacity-20 rounded-full animate-float',
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

interface ShapesCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: keyof typeof circleColors;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline';
}

const circleColors = {
  'pastel-pink': {
    filled: 'bg-pastel-pink',
    outline: 'border-pastel-pink bg-transparent'
  },
  'pastel-mint': {
    filled: 'bg-pastel-mint',
    outline: 'border-pastel-mint bg-transparent'
  },
  'pastel-lavender': {
    filled: 'bg-pastel-lavender',
    outline: 'border-pastel-lavender bg-transparent'
  },
  'pastel-peach': {
    filled: 'bg-pastel-peach',
    outline: 'border-pastel-peach bg-transparent'
  },
  'pastel-blush': {
    filled: 'bg-pastel-blush',
    outline: 'border-pastel-blush bg-transparent'
  },
  'pastel-lightpink': {
    filled: 'bg-pastel-lightpink',
    outline: 'border-pastel-lightpink bg-transparent'
  },
};

const circleSizes = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export function ShapesCircle({
  color = 'pastel-pink',
  size = 'md',
  variant = 'filled',
  className,
  ...props
}: ShapesCircleProps) {
  return (
    <div
      className={cn(
        'rounded-full border-2 absolute -z-10',
        circleColors[color][variant],
        circleSizes[size],
        variant === 'outline' ? 'border-2' : 'border-0',
        className
      )}
      {...props}
    />
  );
}

interface ShapesTriangleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const triangleSizes = {
  sm: 'w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px]',
  md: 'w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px]',
  lg: 'w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px]',
};

export function ShapesTriangle({
  color = 'rgba(255,222,226,0.5)',
  size = 'md',
  className,
  ...props
}: ShapesTriangleProps) {
  return (
    <div
      className={cn(
        'absolute -z-10',
        triangleSizes[size],
        className
      )}
      style={{
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
      {...props}
    />
  );
}

export function ShapesDecoration({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative z-0', className)} {...props}>
      <ShapesBlob 
        color="pastel-blush" 
        size="lg" 
        className="left-[10%] top-[20%]" 
      />
      <ShapesBlob 
        color="pastel-lavender" 
        size="md" 
        className="right-[15%] top-[40%]" 
      />
      <ShapesCircle 
        color="pastel-mint" 
        variant="outline"
        size="sm" 
        className="left-[25%] top-[65%] animate-float" 
      />
      <ShapesCircle 
        color="pastel-peach" 
        size="sm" 
        className="right-[30%] top-[20%] animate-float" 
        style={{ animationDelay: '1s' }}
      />
      <ShapesTriangle 
        color="rgba(255,222,226,0.4)" 
        size="sm" 
        className="left-[40%] top-[30%] animate-float" 
        style={{ animationDelay: '1.5s' }}
      />
      <ShapesDots 
        dotColor="rgba(255,182,193,0.15)" 
        size={12} 
        spacing={60} 
      />
    </div>
  );
}
