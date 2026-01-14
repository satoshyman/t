
import React from 'react';

export const COLORS = {
  primary: '#00f2ff',
  secondary: '#7000ff',
  accent: '#ff00d4',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

export const OLOLogo: React.FC<{ size?: number; className?: string; active?: boolean }> = ({ size = 100, className = "", active = false }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
      <defs>
        <linearGradient id="oloGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: COLORS.primary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: COLORS.secondary, stopOpacity: 1 }} />
        </linearGradient>
        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={active ? "5" : "2"} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Dynamic Background Pulse */}
      {active && (
        <circle cx="50" cy="50" r="45" fill="none" stroke={COLORS.primary} strokeWidth="0.5" opacity="0.2" className="animate-ping" style={{ animationDuration: '2s' }} />
      )}

      {/* Outer Technical Ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <path 
        d="M 50 2 A 48 48 0 0 1 98 50" 
        fill="none" 
        stroke={COLORS.primary} 
        strokeWidth="2" 
        strokeLinecap="round"
        className={`${active ? 'animate-spin' : ''}`}
        style={{ animationDuration: '3s', transformOrigin: 'center' }}
      />
      
      {/* Middle Fragmented Ring */}
      <circle 
        cx="50" cy="50" r="40" 
        fill="none" 
        stroke="url(#oloGradient)" 
        strokeWidth="3" 
        strokeDasharray="10 20 40 10"
        className={`${active ? 'animate-spin' : ''}`}
        style={{ animationDuration: active ? '5s' : '15s', animationDirection: 'reverse', transformOrigin: 'center' }}
      />
      
      {/* Core Hexagon-ish Shape Background */}
      <path 
        d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z" 
        fill="rgba(0, 0, 0, 0.4)" 
        stroke="rgba(255,255,255,0.1)" 
        strokeWidth="1"
      />
      
      {/* Energy Core */}
      <circle 
        cx="50" 
        cy="50" 
        r="22" 
        fill="url(#oloGradient)" 
        opacity={active ? "0.3" : "0.1"} 
        className={active ? "animate-pulse" : ""} 
      />
      
      {/* Main Brand Text */}
      <text 
        x="50" 
        y="58" 
        textAnchor="middle" 
        fill="white" 
        fontSize="22" 
        fontWeight="900" 
        style={{ filter: 'url(#logoGlow)', fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}
      >
        OLO
      </text>
      
      {/* Floating Sparkles */}
      {active && (
        <>
          <circle cx="20" cy="30" r="1.5" fill="white" className="animate-pulse">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="70" r="1.5" fill="white" className="animate-pulse">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  </div>
);

export const DEFAULT_CONFIG = {
  miningRate: 10,
  miningDuration: 3600,
  referralReward: 1,
  taskReward: 1,
  minWithdrawal: 10,
  conversionRate: 10, // 10 OLO = 1 USDT
};
