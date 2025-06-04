import React from 'react';

      const ProgressBar = ({
        min = 0,
        max = 100,
        value,
        onChange,
        className = '',
        ...props
      }) => {
        return (
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className={`h-1 bg-gray-700 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary ${className}`}
            {...props}
          />
        );
      };

      export default ProgressBar;