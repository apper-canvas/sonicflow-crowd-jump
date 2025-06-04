import playerStateData from '../mockData/playerState.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const playerStateService = {
  async getAll() {
    await delay(200)
    return [...playerStateData]
  },

  async getById(id) {
    await delay(150)
    const state = playerStateData.find(s => s.id === id)
    return state ? { ...state } : null
  },

  async create(stateData) {
    await delay(300)
    const newState = {
      ...stateData,
      id: Date.now().toString(),
    }
    return { ...newState }
  },

  async update(id, stateData) {
    await delay(200)
    const updatedState = {
      ...stateData,
      id,
    }
    return { ...updatedState }
  },

  async delete(id) {
    await delay(200)
    return { success: true, id }
  }
}

export default playerStateService