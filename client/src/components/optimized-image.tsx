import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  lazy?: boolean;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  lazy = true, 
  className = "",
  ...props 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={lazy ? "lazy" : "eager"}
      className={className}
      style={{ aspectRatio: `${width}/${height}` }}
      {...props}
    />
  );
}