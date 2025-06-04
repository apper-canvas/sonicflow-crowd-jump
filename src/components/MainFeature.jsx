import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import trackService from '../services/api/trackService'
import playlistService from '../services/api/playlistService'
import playerStateService from '../services/api/playerStateService'

const MainFeature = () => {
  // Core state
  const [tracks, setTracks] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [playerState, setPlayerState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // UI state
  const [viewMode, setViewMode] = useState('grid')
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const [contextMenu, setContextMenu] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [nowPlayingExpanded, setNowPlayingExpanded] = useState(false)
  
  const audioRef = useRef(null)
  const progressInterval = useRef(null)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tracksResult, playlistsResult, playerResult] = await Promise.all([
          trackService.getAll(),
          playlistService.getAll(),
          playerStateService.getAll()
        ])
        setTracks(tracksResult || [])
        setPlaylists(playlistsResult || [])
        setPlayerState(playerResult?.[0] || {
          currentTrack: null,
          isPlaying: false,
          currentTime: 0,
          volume: 0.8,
          repeatMode: 'off',
          shuffleEnabled: false,
          queue: []
        })
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load music library")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Audio management
  useEffect(() => {
    if (audioRef.current && playerState?.currentTrack) {
      audioRef.current.volume = playerState.volume || 0.8
    }
  }, [playerState?.volume, playerState?.currentTrack])

  useEffect(() => {
    if (playerState?.isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 1000)
    } else {
      clearInterval(progressInterval.current)
    }
    return () => clearInterval(progressInterval.current)
  }, [playerState?.isPlaying])

  // Player controls
  const playTrack = async (track) => {
    try {
      const updatedState = {
        ...playerState,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
      setCurrentTime(0)
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } catch (error) {
      toast.error("Failed to play track")
    }
  }

  const togglePlayPause = async () => {
    try {
      const updatedState = {
        ...playerState,
        isPlaying: !playerState.isPlaying
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
      
      if (audioRef.current) {
        if (updatedState.isPlaying) {
          audioRef.current.play()
        } else {
          audioRef.current.pause()
        }
      }
    } catch (error) {
      toast.error("Failed to toggle playback")
    }
  }

  const seekTo = async (time) => {
    try {
      const updatedState = {
        ...playerState,
        currentTime: time
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
      setCurrentTime(time)
      
      if (audioRef.current) {
        audioRef.current.currentTime = time
      }
    } catch (error) {
      toast.error("Failed to seek")
    }
  }

  const changeVolume = async (volume) => {
    try {
      const updatedState = {
        ...playerState,
        volume: volume
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
    } catch (error) {
      toast.error("Failed to change volume")
    }
  }

  const skipTrack = async (direction) => {
    const currentIndex = tracks.findIndex(t => t.id === playerState?.currentTrack?.id)
    let nextIndex
    
    if (direction === 'next') {
      nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
    }
    
    if (tracks[nextIndex]) {
      await playTrack(tracks[nextIndex])
    }
  }

  const toggleRepeat = async () => {
    const modes = ['off', 'one', 'all']
    const currentIndex = modes.indexOf(playerState.repeatMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    
    try {
      const updatedState = {
        ...playerState,
        repeatMode: nextMode
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
      toast.success(`Repeat: ${nextMode}`)
    } catch (error) {
      toast.error("Failed to toggle repeat")
    }
  }

  const toggleShuffle = async () => {
    try {
      const updatedState = {
        ...playerState,
        shuffleEnabled: !playerState.shuffleEnabled
      }
      await playerStateService.update(playerState.id || 'player-1', updatedState)
      setPlayerState(updatedState)
      toast.success(updatedState.shuffleEnabled ? "Shuffle on" : "Shuffle off")
    } catch (error) {
      toast.error("Failed to toggle shuffle")
    }
  }

  // Playlist management
  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return
    
    try {
      const newPlaylist = {
        name: newPlaylistName,
        description: newPlaylistDescription,
        tracks: [],
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        createdAt: Date.now(),
        lastModified: Date.now()
      }
      
      const created = await playlistService.create(newPlaylist)
      setPlaylists([...playlists, created])
      setNewPlaylistName('')
      setNewPlaylistDescription('')
      setShowPlaylistModal(false)
      toast.success("Playlist created successfully")
    } catch (error) {
      toast.error("Failed to create playlist")
    }
  }

  const addToPlaylist = async (playlistId, track) => {
    try {
      const playlist = playlists.find(p => p.id === playlistId)
      if (!playlist) return
      
      const updatedPlaylist = {
        ...playlist,
        tracks: [...playlist.tracks, track],
        lastModified: Date.now()
      }
      
      await playlistService.update(playlistId, updatedPlaylist)
      setPlaylists(playlists.map(p => p.id === playlistId ? updatedPlaylist : p))
      toast.success(`Added to ${playlist.name}`)
    } catch (error) {
      toast.error("Failed to add to playlist")
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleContextMenu = (e, track) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      track: track
    })
  }

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
    )
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

      {/* Left Sidebar */}
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
            <h1 className={`text-xl font-bold gradient-text ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
              SonicFlow
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/20 text-primary">
              <ApperIcon name="Home" size={20} />
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Home</span>
            </button>
            
            <button 
              onClick={() => toast.info("Advanced search coming soon!")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <ApperIcon name="Search" size={20} />
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Search</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400">
              <ApperIcon name="Library" size={20} />
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Your Library</span>
            </button>
          </nav>

          {/* Playlists */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold text-gray-400 uppercase tracking-wide ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
                Playlists
              </h3>
              <button 
                onClick={() => setShowPlaylistModal(true)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <ApperIcon name="Plus" size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-1">
              {playlists.map(playlist => (
                <button 
                  key={playlist.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 text-gray-300"
                >
                  <ApperIcon name="ListMusic" size={16} />
                  <span className={`text-left truncate ${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>
                    {playlist.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Navigation */}
          <div className="mt-8 space-y-2">
            <button 
              onClick={() => toast.info("History tracking coming soon!")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <ApperIcon name="Clock" size={20} />
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Recently Played</span>
            </button>
            
            <button 
              onClick={() => toast.info("Liked songs coming soon!")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <ApperIcon name="Heart" size={20} />
              <span className={`${sidebarExpanded ? 'block' : 'hidden'} lg:block`}>Favorites</span>
            </button>
          </div>
        </div>

        {/* Sidebar toggle for mobile */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="absolute top-4 -right-12 lg:hidden bg-gray-800 p-2 rounded-r-lg"
        >
          <ApperIcon name="Menu" size={20} />
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16 lg:ml-0">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Your Library</h2>
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400'}`}
                >
                  <ApperIcon name="Grid3x3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400'}`}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search - coming soon!"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:border-primary"
                  disabled
                />
                <ApperIcon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button onClick={() => toast.info("Settings coming soon!")}>
                <ApperIcon name="Settings" size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Track Library */}
          <div className={`flex-1 p-6 ${nowPlayingExpanded ? 'mr-80' : 'mr-0'} transition-all duration-300`}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracks.map(track => (
                  <motion.div
                    key={track.id}
                    className={`group relative bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer ${
                      playerState?.currentTrack?.id === track.id ? 'track-playing' : ''
                    }`}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => playTrack(track)}
                    onContextMenu={(e) => handleContextMenu(e, track)}
                  >
                    <div className="relative mb-4">
                      <img
                        src={track.albumArt}
                        alt={track.album}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        {playerState?.currentTrack?.id === track.id && playerState?.isPlaying ? (
                          <div className="flex items-center gap-1">
                            <div className="w-1 bg-primary equalizer-bar"></div>
                            <div className="w-1 bg-primary equalizer-bar"></div>
                            <div className="w-1 bg-primary equalizer-bar"></div>
                          </div>
                        ) : (
                          <ApperIcon name="Play" size={24} className="text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 truncate">{track.title}</h3>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {tracks.map(track => (
                  <motion.div
                    key={track.id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer ${
                      playerState?.currentTrack?.id === track.id ? 'track-playing' : ''
                    }`}
                    whileHover={{ x: 4 }}
                    onClick={() => playTrack(track)}
                    onContextMenu={(e) => handleContextMenu(e, track)}
                  >
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{track.album}</p>
                    <p className="text-gray-400 text-sm">{formatTime(track.duration)}</p>
                    {playerState?.currentTrack?.id === track.id && playerState?.isPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-primary equalizer-bar"></div>
                        <div className="w-1 h-4 bg-primary equalizer-bar"></div>
                        <div className="w-1 h-4 bg-primary equalizer-bar"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Now Playing Sidebar */}
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
                  <h3 className="text-lg font-semibold">Now Playing</h3>
                  <button onClick={() => setNowPlayingExpanded(false)}>
                    <ApperIcon name="X" size={20} className="text-gray-400 hover:text-white" />
                  </button>
                </div>

                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={playerState.currentTrack.albumArt}
                      alt={playerState.currentTrack.album}
                      className={`w-48 h-48 rounded-xl mx-auto object-cover ${
                        playerState.isPlaying ? 'animate-spin-slow' : ''
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{playerState.currentTrack.title}</h3>
                    <p className="text-gray-400">{playerState.currentTrack.artist}</p>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => toast.info("Coming soon")}
                      className="flex items-center gap-2 w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <ApperIcon name="Heart" size={16} />
                      <span>Like</span>
                    </button>

                    <div className="flex space-x-4">
                      <button 
                        onClick={() => toast.info("Lyrics display coming soon!")}
                        className="flex-1 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                      >
                        Lyrics
                      </button>
                      <button 
                        onClick={() => toast.info("Audio visualizer coming soon!")}
                        className="flex-1 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                      >
                        Visualizer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 glassmorphism border-t border-gray-800 px-4 flex items-center gap-4 z-40">
        {/* Current Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {playerState?.currentTrack ? (
            <>
              <img
                src={playerState.currentTrack.albumArt}
                alt={playerState.currentTrack.album}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0">
                <h4 className="font-medium text-sm truncate">{playerState.currentTrack.title}</h4>
                <p className="text-gray-400 text-xs truncate">{playerState.currentTrack.artist}</p>
              </div>
              <button 
                onClick={() => toast.info("Favorites coming soon!")}
                className="p-1 hover:text-red-500"
              >
                <ApperIcon name="Heart" size={16} />
              </button>
            </>
          ) : (
            <div className="text-gray-400 text-sm">No track playing</div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleShuffle}
              className={`p-1 transition-colors ${playerState?.shuffleEnabled ? 'text-primary' : 'text-gray-400'}`}
            >
              <ApperIcon name="Shuffle" size={16} />
            </button>
            
            <button 
              onClick={() => skipTrack('prev')}
              className="p-1 text-gray-300 hover:text-white"
            >
              <ApperIcon name="SkipBack" size={20} />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="bg-primary hover:bg-primary-dark p-3 rounded-full transition-all hover-scale"
              disabled={!playerState?.currentTrack}
            >
              <ApperIcon 
                name={playerState?.isPlaying ? "Pause" : "Play"} 
                size={20} 
                className="text-white" 
              />
            </button>
            
            <button 
              onClick={() => skipTrack('next')}
              className="p-1 text-gray-300 hover:text-white"
            >
              <ApperIcon name="SkipForward" size={20} />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`p-1 transition-colors ${
                playerState?.repeatMode !== 'off' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <ApperIcon name={playerState?.repeatMode === 'one' ? "Repeat1" : "Repeat"} size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={playerState?.currentTrack?.duration || 0}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer"
            />
            <span className="text-xs text-gray-400">
              {formatTime(playerState?.currentTrack?.duration || 0)}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button 
            onClick={() => toast.info("Queue management coming soon!")}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ApperIcon name="ListMusic" size={16} />
          </button>
          
          <button
            onClick={() => setNowPlayingExpanded(!nowPlayingExpanded)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ApperIcon name="Monitor" size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <ApperIcon name="Volume2" size={16} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={playerState?.volume || 0.8}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            className="fixed bg-gray-800 border border-gray-700 rounded-lg py-2 z-50 shadow-lg"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button
              onClick={() => {
                playTrack(contextMenu.track)
                setContextMenu(null)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
            >
              <ApperIcon name="Play" size={14} />
              Play
            </button>
            
            <div className="border-t border-gray-700 my-1"></div>
            
            <div className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">
              Add to Playlist
            </div>
            
            {playlists.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => {
                  addToPlaylist(playlist.id, contextMenu.track)
                  setContextMenu(null)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                {playlist.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-gray-900 rounded-xl p-6 w-96 max-w-[90vw]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-xl font-semibold mb-4">Create New Playlist</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Playlist Name</label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="My Awesome Playlist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
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
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createPlaylist}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg z-50">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-2">
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default MainFeature