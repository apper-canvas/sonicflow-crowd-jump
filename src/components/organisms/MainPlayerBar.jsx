import React from 'react';
      import { toast } from 'react-toastify';
      import Button from '../atoms/Button';
      import Icon from '../atoms/Icon';
      import Image from '../atoms/Image';
      import ProgressBar from '../atoms/ProgressBar';
      import Text from '../atoms/Text';
      import Title from '../atoms/Title';

      const MainPlayerBar = ({
        playerState,
        currentTime,
        togglePlayPause,
        skipTrack,
        toggleShuffle,
        toggleRepeat,
        seekTo,
        changeVolume,
        formatTime,
        nowPlayingExpanded,
        setNowPlayingExpanded,
      }) => {
        return (
          <div className="fixed bottom-0 left-0 right-0 h-20 glassmorphism border-t border-gray-800 px-4 flex items-center gap-4 z-40">
            {/* Current Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {playerState?.currentTrack ? (
                <>
                  <Image
                    src={playerState.currentTrack.albumArt}
                    alt={playerState.currentTrack.album}
                    className="w-12 h-12 rounded"
                  />
                  <div className="min-w-0">
                    <Title type="h4" className="text-sm truncate">{playerState.currentTrack.title}</Title>
                    <Text type="p" className="text-gray-400 text-xs truncate">{playerState.currentTrack.artist}</Text>
                  </div>
                  <Button
                    onClick={() => toast.info("Favorites coming soon!")}
                    className="p-1 hover:text-red-500"
                    icon="Heart"
                    iconSize={16}
                  />
                </>
              ) : (
                <Text type="div" className="text-gray-400 text-sm">No track playing</Text>
              )}
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleShuffle}
                  className={`p-1 transition-colors ${playerState?.shuffleEnabled ? 'text-primary' : 'text-gray-400'}`}
                  icon="Shuffle"
                  iconSize={16}
                />

                <Button
                  onClick={() => skipTrack('prev')}
                  className="p-1 text-gray-300 hover:text-white"
                  icon="SkipBack"
                  iconSize={20}
                />

                <Button
                  onClick={togglePlayPause}
                  className="bg-primary hover:bg-primary-dark p-3 rounded-full transition-all hover-scale"
                  disabled={!playerState?.currentTrack}
                  icon={playerState?.isPlaying ? "Pause" : "Play"}
                  iconSize={20}
                  iconClassName="text-white"
                />

                <Button
                  onClick={() => skipTrack('next')}
                  className="p-1 text-gray-300 hover:text-white"
                  icon="SkipForward"
                  iconSize={20}
                />

                <Button
                  onClick={toggleRepeat}
                  className={`p-1 transition-colors ${
                    playerState?.repeatMode !== 'off' ? 'text-primary' : 'text-gray-400'
                  }`}
                  icon={playerState?.repeatMode === 'one' ? "Repeat1" : "Repeat"}
                  iconSize={16}
                />
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full">
                <Text type="span" className="text-xs text-gray-400">{formatTime(currentTime)}</Text>
                <ProgressBar
                  min="0"
                  max={playerState?.currentTrack?.duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Text type="span" className="text-xs text-gray-400">
                  {formatTime(playerState?.currentTrack?.duration || 0)}
                </Text>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Button
                onClick={() => toast.info("Queue management coming soon!")}
                className="p-2 text-gray-400 hover:text-white"
                icon="ListMusic"
                iconSize={16}
              />

              <Button
                onClick={() => setNowPlayingExpanded(!nowPlayingExpanded)}
                className="p-2 text-gray-400 hover:text-white"
                icon="Monitor"
                iconSize={16}
              />

              <div className="flex items-center gap-2">
                <Icon name="Volume2" size={16} className="text-gray-400" />
                <ProgressBar
                  min="0"
                  max="1"
                  step="0.01"
                  value={playerState?.volume || 0.8}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        );
      };

      export default MainPlayerBar;