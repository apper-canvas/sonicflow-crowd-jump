import React from 'react';
      import Title from '../atoms/Title';
      import Input from '../atoms/Input';
      import Button from '../atoms/Button';
      import ViewModeToggle from '../molecules/ViewModeToggle';
      import { toast } from 'react-toastify';

      const LibraryHeader = ({ viewMode, setViewMode }) => {
        return (
          <header className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Title type="h2" className="text-xl">Your Library</Title>
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>

              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  placeholder="Type to search - coming soon!"
                  className="w-64"
                  icon="Search"
                  disabled
                />
                <Button onClick={() => toast.info("Settings coming soon!")} icon="Settings" iconSize={20} iconClassName="text-gray-400 hover:text-white" />
              </div>
            </div>
          </header>
        );
      };

      export default LibraryHeader;