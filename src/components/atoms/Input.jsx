import React from 'react';
      import Icon from './Icon';

      const Input = ({
        type = 'text',
        value,
        onChange,
        placeholder,
        className = '',
        icon,
        iconPosition = 'left',
        disabled = false,
        ...props
      }) => {
        return (
          <div className="relative">
            {icon && iconPosition === 'left' && (
              <Icon name={icon} size={16} className="absolute left-3 top-3 text-gray-400" />
            )}
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary ${
                iconPosition === 'left' ? 'pl-10' : ''
              } ${className}`}
              disabled={disabled}
              {...props}
            />
            {icon && iconPosition === 'right' && (
              <Icon name={icon} size={16} className="absolute right-3 top-3 text-gray-400" />
            )}
          </div>
        );
      };

      export default Input;