import React from 'react';

      const Label = ({ htmlFor, children, className = '' }) => {
        return (
          <label htmlFor={htmlFor} className={`block text-sm font-medium mb-2 ${className}`}>
            {children}
          </label>
        );
      };

      export default Label;