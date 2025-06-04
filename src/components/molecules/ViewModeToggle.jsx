import React from 'react';
      import Button from '../atoms/Button';
      import Icon from '../atoms/Icon';

      const ViewModeToggle = ({ viewMode, setViewMode }) => {
        return (
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <Button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400'}`}
              icon="Grid3x3"
              iconSize={16}
            />
            <Button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400'}`}
              icon="List"
              iconSize={16}
            />
          </div>
        );
      };

      export default ViewModeToggle;