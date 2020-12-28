import { Plugins } from '@capacitor/core'
import { Recipe } from '../types';

const { Storage } = Plugins

const serviceName = 'recipes'

const getStorage = () => Storage.get({ key: serviceName })
const setStorage = (value: { [key: string]: any }) => Storage.set({ key: serviceName, value: JSON.stringify(value) })

interface RecipesResponse {
  data: any
  success?: boolean
}

export default {
  create: async (body: Recipe): Promise<RecipesResponse> => {
    let resp = await getStorage()
    let data: Recipe[] = resp.value ? JSON.parse(resp.value) : []
    data.push(body)
    return setStorage(data).then(_ => ({ success: true, data: undefined }))
  },
  get: (): Promise<RecipesResponse> => {
    return getStorage().then(res => ({ data: JSON.parse(res.value || '') }))
  },
  find: async (id: number): Promise<RecipesResponse> => {
    let resp = await getStorage()
    let data: Recipe[] = resp.value ? JSON.parse(resp.value) : []
    return new Promise((resolve, rejected) => {

      if (id >= 0) return resolve({
        data: data.filter((_, nKey) => nKey === id).shift()
      })
      rejected({
        message: 'id is missing'
      })
    })
  },
  remove: async (key: number): Promise<RecipesResponse> => {
    let resp = await getStorage()
    let data: Recipe[] = resp.value ? JSON.parse(resp.value) : []

    data = data.filter((_, nKey) => nKey !== key)
    return setStorage(data).then(_ => ({ success: true, data: undefined }))
  },
  update: async (key: number, body: Recipe) => {
    let resp = await getStorage()
    let data: Recipe[] = resp.value ? JSON.parse(resp.value) : []

    data = data.map((recipe, nKey) => {
      if (nKey === key) return body
      return recipe
    })
    return setStorage(data).then(_ => ({ success: true, data: undefined }))
  }
}