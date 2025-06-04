import React from 'react';
      import { motion, AnimatePresence } from 'framer-motion';
      import ContextMenuItem from './ContextMenuItem';
      import Text from '../atoms/Text';

      const ContextMenu = ({ contextMenu, playlists, onPlayTrack, onAddToPlaylist, onClose }) => {
        if (!contextMenu) return null;

        const { x, y, track } = contextMenu;

        return (
          <AnimatePresence>
            <motion.div
              className="fixed bg-gray-800 border border-gray-700 rounded-lg py-2 z-50 shadow-lg"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ContextMenuItem
                icon="Play"
                onClick={() => {
                  onPlayTrack(track);
                  onClose();
                }}
              >
                Play
              </ContextMenuItem>

              <div className="border-t border-gray-700 my-1"></div>

              <Text type="div" className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">
                Add to Playlist
              </Text>

              {playlists.map(playlist => (
                <ContextMenuItem
                  key={playlist.id}
                  onClick={() => {
                    onAddToPlaylist(playlist.id, track);
                    onClose();
                  }}
                >
                  {playlist.name}
                </ContextMenuItem>
              ))}
            </motion.div>
          </AnimatePresence>
        );
      };

      export default ContextMenu;