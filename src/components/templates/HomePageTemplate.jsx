import React, { useState, useEffect, useRef } from 'react';
      import { toast } from 'react-toastify';
      import Sidebar from '../organisms/Sidebar';
      import LibraryHeader from '../organisms/LibraryHeader';
      import TrackLibrary from '../organisms/TrackLibrary';
      import MainPlayerBar from '../organisms/MainPlayerBar';
      import NowPlayingSidebar from '../organisms/NowPlayingSidebar';
      import NewPlaylistModal from '../organisms/NewPlaylistModal';
      import ContextMenu from '../molecules/ContextMenu';
      import ApperIcon from '../ApperIcon';

      import trackService from '../../services/api/trackService';
      import playlistService from '../../services/api/playlistService';
      import playerStateService from '../../services/api/playerStateService';

      const HomePageTemplate = () => {
        // Core state
        const [tracks, setTracks] = useState([]);
        const [playlists, setPlaylists] = useState([]);
        const [playerState, setPlayerState] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        // UI state
        const [viewMode, setViewMode] = useState('grid');
        const [showPlaylistModal, setShowPlaylistModal] = useState(false);
        const [newPlaylistName, setNewPlaylistName] = useState('');
        const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
        const [contextMenu, setContextMenu] = useState(null);
        const [currentTime, setCurrentTime] = useState(0);
        const [sidebarExpanded, setSidebarExpanded] = useState(false);
        const [nowPlayingExpanded, setNowPlayingExpanded] = useState(false);

        const audioRef = useRef(null);
        const progressInterval = useRef(null);

        // Load data
        useEffect(() => {
          const loadData = async () => {
            setLoading(true);
            try {
              const [tracksResult, playlistsResult, playerResult] = await Promise.all([
                trackService.getAll(),
                playlistService.getAll(),
                playerStateService.getAll()
              ]);
              setTracks(tracksResult || []);
              setPlaylists(playlistsResult || []);
              setPlayerState(playerResult?.[0] || {
                currentTrack: null,
                isPlaying: false,
                currentTime: 0,
                volume: 0.8,
                repeatMode: 'off',
                shuffleEnabled: false,
                queue: []
              });
            } catch (err) {
              setError(err.message);
              toast.error("Failed to load music library");
            } finally {
              setLoading(false);
            }
          };
          loadData();
        }, []);

        // Audio management
        useEffect(() => {
          if (audioRef.current && playerState?.currentTrack) {
            audioRef.current.volume = playerState.volume || 0.8;
          }
        }, [playerState?.volume, playerState?.currentTrack]);

        useEffect(() => {
          if (playerState?.isPlaying) {
            progressInterval.current = setInterval(() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
              }
            }, 1000);
          } else {
            clearInterval(progressInterval.current);
          }
          return () => clearInterval(progressInterval.current);
        }, [playerState?.isPlaying]);

        // Player controls
        const playTrack = async (track) => {
          try {
            const updatedState = {
              ...playerState,
              currentTrack: track,
              isPlaying: true,
              currentTime: 0
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);
            setCurrentTime(0);

            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          } catch (error) {
            toast.error("Failed to play track");
          }
        };

        const togglePlayPause = async () => {
          try {
            const updatedState = {
              ...playerState,
              isPlaying: !playerState.isPlaying
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);

            if (audioRef.current) {
              if (updatedState.isPlaying) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
            }
          } catch (error) {
            toast.error("Failed to toggle playback");
          }
        };

        const seekTo = async (time) => {
          try {
            const updatedState = {
              ...playerState,
              currentTime: time
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);
            setCurrentTime(time);

            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
          } catch (error) {
            toast.error("Failed to seek");
          }
        };

        const changeVolume = async (volume) => {
          try {
            const updatedState = {
              ...playerState,
              volume: volume
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);
          } catch (error) {
            toast.error("Failed to change volume");
          }
        };

        const skipTrack = async (direction) => {
          const currentIndex = tracks.findIndex(t => t.id === playerState?.currentTrack?.id);
          let nextIndex;

          if (direction === 'next') {
            nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
          } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
          }

          if (tracks[nextIndex]) {
            await playTrack(tracks[nextIndex]);
          }
        };

        const toggleRepeat = async () => {
          const modes = ['off', 'one', 'all'];
          const currentIndex = modes.indexOf(playerState.repeatMode);
          const nextMode = modes[(currentIndex + 1) % modes.length];

          try {
            const updatedState = {
              ...playerState,
              repeatMode: nextMode
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);
            toast.success(`Repeat: ${nextMode}`);
          } catch (error) {
            toast.error("Failed to toggle repeat");
          }
        };

        const toggleShuffle = async () => {
          try {
            const updatedState = {
              ...playerState,
              shuffleEnabled: !playerState.shuffleEnabled
            };
            await playerStateService.update(playerState.id || 'player-1', updatedState);
            setPlayerState(updatedState);
            toast.success(updatedState.shuffleEnabled ? "Shuffle on" : "Shuffle off");
          } catch (error) {
            toast.error("Failed to toggle shuffle");
          }
        };

        // Playlist management
        const createPlaylist = async () => {
          if (!newPlaylistName.trim()) return;

          try {
            const newPlaylist = {
              name: newPlaylistName,
              description: newPlaylistDescription,
              tracks: [],
              coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
              createdAt: Date.now(),
              lastModified: Date.now()
            };

            const created = await playlistService.create(newPlaylist);
            setPlaylists([...playlists, created]);
            setNewPlaylistName('');
            setNewPlaylistDescription('');
            setShowPlaylistModal(false);
            toast.success("Playlist created successfully");
          } catch (error) {
            toast.error("Failed to create playlist");
          }
        };

        const addToPlaylist = async (playlistId, track) => {
          try {
            const playlist = playlists.find(p => p.id === playlistId);
            if (!playlist) return;

            const updatedPlaylist = {
              ...playlist,
              tracks: [...playlist.tracks, track],
              lastModified: Date.now()
            };

            await playlistService.update(playlistId, updatedPlaylist);
            setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p));
            toast.success(`Added to ${playlist.name}`);
          } catch (error) {
            toast.error("Failed to add to playlist");
          }
        };

        const formatTime = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        const handleContextMenu = (e, track) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            track: track
          });
        };

        useEffect(() => {
          const handleClickOutside = () => setContextMenu(null);
          document.addEventListener('click', handleClickOutside);
          return () => document.removeEventListener('click', handleClickOutside);
        }, []);

        if (loading) {
          return (
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin-slow mb-4">
                  <ApperIcon name="Music" size={60} className="text-primary" />
                </div>
                <p className="text-gray-400">Loading your music library...</p>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-black text-white flex relative">
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={playerState?.currentTrack?.audioUrl}
              onEnded={() => skipTrack('next')}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            />

            <Sidebar
              playlists={playlists}
              setShowPlaylistModal={setShowPlaylistModal}
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-16 lg:ml-0">
              <LibraryHeader viewMode={viewMode} setViewMode={setViewMode} />

              {/* Content Area */}
              <div className="flex-1 flex">
                <TrackLibrary
                  tracks={tracks}
                  viewMode={viewMode}
                  playerState={playerState}
                  playTrack={playTrack}
                  handleContextMenu={handleContextMenu}
                  formatTime={formatTime}
                  nowPlayingExpanded={nowPlayingExpanded}
                />

                <NowPlayingSidebar
                  playerState={playerState}
                  nowPlayingExpanded={nowPlayingExpanded}
                  setNowPlayingExpanded={setNowPlayingExpanded}
                />
              </div>
            </div>

            <MainPlayerBar
              playerState={playerState}
              currentTime={currentTime}
              togglePlayPause={togglePlayPause}
              skipTrack={skipTrack}
              toggleShuffle={toggleShuffle}
              toggleRepeat={toggleRepeat}
              seekTo={seekTo}
              changeVolume={changeVolume}
              formatTime={formatTime}
              nowPlayingExpanded={nowPlayingExpanded}
              setNowPlayingExpanded={setNowPlayingExpanded}
            />

            <ContextMenu
              contextMenu={contextMenu}
              playlists={playlists}
              onPlayTrack={playTrack}
              onAddToPlaylist={addToPlaylist}
              onClose={() => setContextMenu(null)}
            />

            <NewPlaylistModal
              showPlaylistModal={showPlaylistModal}
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              newPlaylistDescription={newPlaylistDescription}
              setNewPlaylistDescription={setNewPlaylistDescription}
              createPlaylist={createPlaylist}
              setShowPlaylistModal={setShowPlaylistModal}
            />

            {error && (
              <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg z-50">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="ml-2">
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
            )}
          </div>
        );
      };

      export default HomePageTemplate;