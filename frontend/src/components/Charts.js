import React from 'react';

const ProgressBar = ({ value, max, color, label }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }}
        />
      </div>
      <div className="progress-percentage">{Math.round(percentage)}%</div>
    </div>
  );
};

const PieChart = ({ data, colors, title }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;
  
  return (
    <div className="pie-chart-container">
      <h4>{title}</h4>
      <div className="pie-chart">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((value, index) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const angle = (value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      <div className="pie-legend">
        {data.map((value, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: colors[index] }}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, labels, colors, title }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="bar-chart-container">
      <h4>{title}</h4>
      <div className="bar-chart">
        {data.map((value, index) => {
          const height = maxValue > 0 ? (value / maxValue) * 200 : 0;
          return (
            <div key={index} className="bar-item">
              <div className="bar-label">{value}</div>
              <div 
                className="bar" 
                style={{ 
                  height: `${height}px`,
                  backgroundColor: colors[index % colors.length]
                }}
              />
              <div className="bar-category">{labels[index]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ProgressBar, PieChart, BarChart };