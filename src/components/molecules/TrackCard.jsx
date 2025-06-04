import React from 'react';
      import { motion } from 'framer-motion';
      import Image from '../atoms/Image';
      import Title from '../atoms/Title';
      import Text from '../atoms/Text';
      import Icon from '../atoms/Icon';

      const TrackCard = ({ track, isPlaying, isCurrentTrack, onClick, onContextMenu }) => {
        return (
          <motion.div
            className={`group relative bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer ${
              isCurrentTrack ? 'track-playing' : ''
            }`}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onClick(track)}
            onContextMenu={(e) => onContextMenu(e, track)}
          >
            <div className="relative mb-4">
              <Image
                src={track.albumArt}
                alt={track.album}
                className="w-full aspect-square rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                {isCurrentTrack && isPlaying ? (
                  <div className="flex items-center gap-1">
                    <div className="w-1 bg-primary equalizer-bar"></div>
                    <div className="w-1 bg-primary equalizer-bar"></div>
                    <div className="w-1 bg-primary equalizer-bar"></div>
                  </div>
                ) : (
                  <Icon name="Play" size={24} className="text-white" />
                )}
              </div>
            </div>
            <Title type="h3" className="text-sm mb-1 truncate">{track.title}</Title>
            <Text type="p" className="text-gray-400 text-xs truncate">{track.artist}</Text>
          </motion.div>
        );
      };

      export default TrackCard;