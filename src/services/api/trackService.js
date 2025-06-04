import trackData from '../mockData/tracks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const trackService = {
  async getAll() {
    await delay(300)
    return [...trackData]
  },

  async getById(id) {
    await delay(200)
    const track = trackData.find(t => t.id === id)
    return track ? { ...track } : null
  },

  async create(trackData) {
    await delay(400)
    const newTrack = {
      ...trackData,
      id: Date.now().toString(),
    }
    return { ...newTrack }
  },

  async update(id, trackData) {
    await delay(300)
    const updatedTrack = {
      ...trackData,
      id,
    }
    return { ...updatedTrack }
  },

  async delete(id) {
    await delay(250)
    return { success: true, id }
  }
}

export default trackService