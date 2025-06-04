import React from 'react';

      const Title = ({ children, className = '', type = 'h1' }) => {
        const Tag = type;
        return <Tag className={`font-semibold ${className}`}>{children}</Tag>;
      };

      export default Title;