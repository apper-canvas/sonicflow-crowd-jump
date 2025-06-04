import React from 'react';
      import { motion } from 'framer-motion';
      import Image from '../atoms/Image';
      import Title from '../atoms/Title';
      import Text from '../atoms/Text';

      const TrackListItem = ({ track, isPlaying, isCurrentTrack, onClick, onContextMenu, formatTime }) => {
        return (
          <motion.div
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer ${
              isCurrentTrack ? 'track-playing' : ''
            }`}
            whileHover={{ x: 4 }}
            onClick={() => onClick(track)}
            onContextMenu={(e) => onContextMenu(e, track)}
          >
            <Image
              src={track.albumArt}
              alt={track.album}
              className="w-12 h-12 rounded"
            />
            <div className="flex-1 min-w-0">
              <Title type="h3" className="font-medium truncate">{track.title}</Title>
              <Text type="p" className="text-gray-400 text-sm truncate">{track.artist}</Text>
            </div>
            <Text type="p" className="text-gray-400 text-sm hidden sm:block">{track.album}</Text>
            <Text type="p" className="text-gray-400 text-sm hidden md:block">{formatTime(track.duration)}</Text>
            {isCurrentTrack && isPlaying && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-primary equalizer-bar"></div>
                <div className="w-1 h-4 bg-primary equalizer-bar"></div>
                <div className="w-1 h-4 bg-primary equalizer-bar"></div>
              </div>
            )}
          </motion.div>
        );
      };

      export default TrackListItem;