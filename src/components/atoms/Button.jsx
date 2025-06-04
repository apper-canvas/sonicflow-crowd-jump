import React from 'react';
      import ApperIcon from '../ApperIcon';

      const Button = ({
        children,
        onClick,
        className = '',
        icon,
        iconSize = 20,
        iconClassName = '',
        disabled = false,
        textClassName = '',
        ...props
      }) => {
        return (
          <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 transition-all duration-200 ${className}`}
            disabled={disabled}
            {...props}
          >
            {icon && (
              <ApperIcon
                name={icon}
                size={iconSize}
                className={iconClassName}
              />
            )}
            {children && <span className={textClassName}>{children}</span>}
          </button>
        );
      };

      export default Button;