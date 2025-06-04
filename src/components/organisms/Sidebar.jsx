import React from 'react';
      import { motion } from 'framer-motion';
      import { toast } from 'react-toastify';
      import ApperIcon from '../ApperIcon';
      import Button from '../atoms/Button';
      import Title from '../atoms/Title';
      import Text from '../atoms/Text';

      const Sidebar = ({
        playlists,
        setShowPlaylistModal,
        sidebarExpanded,
        setSidebarExpanded,
      }) => {
        return (
          <motion.div
            className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-30 transition-all duration-300 ${
              sidebarExpanded ? 'w-64' : 'w-16'
            } lg:w-64 lg:relative lg:z-auto`}
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <ApperIcon name="Music" size={24} className="text-primary" />
                <Title type="h1" className={`text-xl gradient-text ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
                  SonicFlow
                </Title>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/20 text-primary" icon="Home" iconSize={20}>
                  <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Home</span>
                </Button>

                <Button
                  onClick={() => toast.info("Advanced search coming soon!")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
                  icon="Search"
                  iconSize={20}
                >
                  <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Search</span>
                </Button>

                <Button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400" icon="Library" iconSize={20}>
                  <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Your Library</span>
                </Button>
              </nav>

              {/* Playlists */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <Text type="h3" className={`text-sm font-semibold text-gray-400 uppercase tracking-wide ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
                    Playlists
                  </Text>
                  <Button
                    onClick={() => setShowPlaylistModal(true)}
                    className="p-1 hover:bg-gray-800 rounded"
                    icon="Plus"
                    iconSize={16}
                    iconClassName="text-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  {playlists.map(playlist => (
                    <Button
                      key={playlist.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300"
                      icon="ListMusic"
                      iconSize={16}
                    >
                      <span className={`text-left truncate ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
                        {playlist.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Navigation */}
              <div className="mt-8 space-y-2">
                <Button
                  onClick={() => toast.info("History tracking coming soon!")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
                  icon="Clock"
                  iconSize={20}
                >
                  <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Recently Played</span>
                </Button>

                <Button
                  onClick={() => toast.info("Liked songs coming soon!")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
                  icon="Heart"
                  iconSize={20}
                >
                  <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Favorites</span>
                </Button>
              </div>
            </div>

            {/* Sidebar toggle for mobile */}
            <Button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="absolute top-4 -right-12 lg:hidden bg-gray-800 p-2 rounded-r-lg"
              icon="Menu"
              iconSize={20}
            />
          </motion.div>
        );
      };

      export default Sidebar;