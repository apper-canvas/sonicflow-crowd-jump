import React from 'react';

      const Text = ({ children, className = '', type = 'p' }) => {
        const Tag = type;
        return <Tag className={className}>{children}</Tag>;
      };

      export default Text;