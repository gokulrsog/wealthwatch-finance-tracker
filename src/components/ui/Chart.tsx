import React from 'react';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  className?: string;
}

export const BarChart = React.memo<BarChartProps>(({ data, height = 200, className }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 space-y-2">
              <div 
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500 ease-out",
                  item.color || "bg-accent-500"
                )}
                style={{ 
                  height: `${heightPercent}%`,
                  minHeight: item.value > 0 ? '4px' : '0px'
                }}
              />
              <span className="text-xs text-neutral-600 text-center break-words">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

BarChart.displayName = 'BarChart';

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
  className?: string;
  color?: string;
}

export const LineChart = React.memo<LineChartProps>(({ 
  data, 
  height = 200, 
  className,
  color = "stroke-accent-500" 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range > 0 ? ((maxValue - item.value) / range) * 80 + 10 : 50;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className={cn("relative", className)} style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Area under curve */}
        {data.length > 1 && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#lineGradient)"
            className={color.replace('stroke-', 'text-')}
          />
        )}
        
        {/* Line */}
        {data.length > 1 && (
          <polyline
            points={points}
            fill="none"
            strokeWidth="2"
            className={cn(color, "transition-all duration-300")}
          />
        )}
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = range > 0 ? ((maxValue - item.value) / range) * 80 + 10 : 50;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              className={cn(color.replace('stroke-', 'fill-'), "transition-all duration-300")}
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-neutral-500 mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
});

LineChart.displayName = 'LineChart';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  size?: number;
  className?: string;
  centerText?: string;
  centerValue?: string;
}

export const DonutChart = React.memo<DonutChartProps>(({ 
  data, 
  size = 200, 
  className,
  centerText,
  centerValue 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  let currentAngle = 0;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          height={size}
          width={size}
          className="transform -rotate-90"
        >
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {data.map((item, index) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -currentAngle * circumference;
            currentAngle += item.value / total;
            
            return (
              <circle
                key={index}
                stroke={item.color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={size / 2}
                cy={size / 2}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        
        {(centerText || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <div className="text-2xl font-bold text-neutral-900">{centerValue}</div>
            )}
            {centerText && (
              <div className="text-sm text-neutral-500">{centerText}</div>
            )}
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-neutral-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

DonutChart.displayName = 'DonutChart';