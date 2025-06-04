import React from 'react';
      import { motion, AnimatePresence } from 'framer-motion';
      import Title from '../atoms/Title';
      import Label from '../atoms/Label';
      import Input from '../atoms/Input';
      import Button from '../atoms/Button';

      const NewPlaylistModal = ({
        showPlaylistModal,
        newPlaylistName,
        setNewPlaylistName,
        newPlaylistDescription,
        setNewPlaylistDescription,
        createPlaylist,
        setShowPlaylistModal,
      }) => {
        return (
          <AnimatePresence>
            {showPlaylistModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div
                  className="bg-gray-900 rounded-xl p-6 w-96 max-w-[90vw]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Title type="h3" className="text-xl mb-4">Create New Playlist</Title>

                  <div className="space-y-4">
                    <div>
                      <Label>Playlist Name</Label>
                      <Input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="My Awesome Playlist"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label>Description (Optional)</Label>
                      <textarea
                        value={newPlaylistDescription}
                        onChange={(e) => setNewPlaylistDescription(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                        placeholder="A collection of my favorite songs..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setShowPlaylistModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createPlaylist}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg"
                    >
                      Create
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        );
      };

      export default NewPlaylistModal;