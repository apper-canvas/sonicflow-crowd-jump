import playlistData from '../mockData/playlists.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const playlistService = {
  async getAll() {
    await delay(300)
    return [...playlistData]
  },

  async getById(id) {
    await delay(200)
    const playlist = playlistData.find(p => p.id === id)
    return playlist ? { ...playlist } : null
  },

  async create(playlistData) {
    await delay(400)
    const newPlaylist = {
      ...playlistData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      lastModified: Date.now()
    }
    return { ...newPlaylist }
  },

  async update(id, playlistData) {
    await delay(300)
    const updatedPlaylist = {
      ...playlistData,
      id,
      lastModified: Date.now()
    }
    return { ...updatedPlaylist }
  },

  async delete(id) {
    await delay(250)
    return { success: true, id }
  }
}

export default playlistService