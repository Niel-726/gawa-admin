import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatCard({ label, value, icon, change, changeLabel, color }) {
  const bgColor = color || 'var(--color-primary)';
  const isPositive = change >= 0;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
          {change !== undefined && (
            <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
              <span className="stat-card-change-icon">
                {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              </span>
              {Math.abs(change)}% {changeLabel || 'vs last month'}
            </div>
          )}
        </div>
        {icon && (
          <div className="stat-card-icon" style={{ background: `${bgColor}15`, color: bgColor }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
