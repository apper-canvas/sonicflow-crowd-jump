import libraryStatsData from '../mockData/libraryStats.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const libraryStatsService = {
  async getAll() {
    await delay(250)
    return [...libraryStatsData]
  },

  async getById(id) {
    await delay(200)
    const stats = libraryStatsData.find(s => s.id === id)
    return stats ? { ...stats } : null
  },

  async create(statsData) {
    await delay(300)
    const newStats = {
      ...statsData,
      id: Date.now().toString(),
    }
    return { ...newStats }
  },

  async update(id, statsData) {
    await delay(250)
    const updatedStats = {
      ...statsData,
      id,
    }
    return { ...updatedStats }
  },

  async delete(id) {
    await delay(200)
    return { success: true, id }
  }
}

export default libraryStatsService