import React from 'react';
      import TrackCard from '../molecules/TrackCard';
      import TrackListItem from '../molecules/TrackListItem';

      const TrackLibrary = ({
        tracks,
        viewMode,
        playerState,
        playTrack,
        handleContextMenu,
        formatTime,
        nowPlayingExpanded,
      }) => {
        return (
          <div className={`flex-1 p-6 ${nowPlayingExpanded ? 'mr-80' : 'mr-0'} transition-all duration-300`}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracks.map(track => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isPlaying={playerState?.isPlaying}
                    isCurrentTrack={playerState?.currentTrack?.id === track.id}
                    onClick={playTrack}
                    onContextMenu={handleContextMenu}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tracks.map(track => (
                  <TrackListItem
                    key={track.id}
                    track={track}
                    isPlaying={playerState?.isPlaying}
                    isCurrentTrack={playerState?.currentTrack?.id === track.id}
                    onClick={playTrack}
                    onContextMenu={handleContextMenu}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>
        );
      };

      export default TrackLibrary;