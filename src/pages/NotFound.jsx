import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon name="Music" size={80} className="text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Track Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like this track has gone off the playlist. Let's get you back to the music.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-scale"
        >
          <ApperIcon name="Home" size={20} />
          Back to Library
        </Link>
      </div>
    </div>
  )
}

export default NotFound