import React from 'react';
      import Button from '../atoms/Button';
      import Icon from '../atoms/Icon';

      const ContextMenuItem = ({ icon, children, onClick, className = '' }) => {
        return (
          <Button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 ${className}`}
            icon={icon}
            iconSize={14}
            iconClassName="text-white"
          >
            {children}
          </Button>
        );
      };

      export default ContextMenuItem;