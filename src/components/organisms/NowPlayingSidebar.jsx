import React from 'react';
      import { motion, AnimatePresence } from 'framer-motion';
      import Title from '../atoms/Title';
      import Button from '../atoms/Button';
      import Icon from '../atoms/Icon';
      import Image from '../atoms/Image';
      import Text from '../atoms/Text';
      import { toast } from 'react-toastify';

      const NowPlayingSidebar = ({ playerState, nowPlayingExpanded, setNowPlayingExpanded }) => {
        return (
          <AnimatePresence>
            {nowPlayingExpanded && playerState?.currentTrack && (
              <motion.div
                className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 p-6 z-20"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <Title type="h3" className="text-lg">Now Playing</Title>
                  <Button onClick={() => setNowPlayingExpanded(false)} icon="X" iconSize={20} iconClassName="text-gray-400 hover:text-white" />
                </div>

                <div className="text-center">
                  <div className="relative mb-6">
                    <Image
                      src={playerState.currentTrack.albumArt}
                      alt={playerState.currentTrack.album}
                      className={`w-48 h-48 rounded-xl mx-auto ${
                        playerState.isPlaying ? 'animate-spin-slow' : ''
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <Title type="h3" className="text-lg mb-2">{playerState.currentTrack.title}</Title>
                    <Text type="p" className="text-gray-400">{playerState.currentTrack.artist}</Text>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => toast.info("Coming soon")}
                      className="flex items-center gap-2 w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                      icon="Heart"
                      iconSize={16}
                    >
                      Like
                    </Button>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => toast.info("Lyrics display coming soon!")}
                        className="flex-1 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                      >
                        Lyrics
                      </Button>
                      <Button
                        onClick={() => toast.info("Audio visualizer coming soon!")}
                        className="flex-1 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                      >
                        Visualizer
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      };

      export default NowPlayingSidebar;