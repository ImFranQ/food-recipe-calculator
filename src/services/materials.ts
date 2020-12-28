import { Plugins } from '@capacitor/core'
import { Material } from './../types';

const { Storage } = Plugins

const serviceName = 'materials'

const getStorage = () => Storage.get({ key: serviceName })
const setStorage = (value:{[key:string]:any}) => Storage.set({ key: serviceName, value: JSON.stringify(value) })

interface MaterialsResponse {
  data: any
  success?: boolean
}

export default {
  create: async (body: Material): Promise<MaterialsResponse> => {
    let resp = await getStorage()
    let data: Material[] = resp.value ? JSON.parse(resp.value) : []
    data.push(body)
    return setStorage(data).then(_ => ({success: true, data: undefined}))
  },
  get: (): Promise<MaterialsResponse> => {
    return getStorage().then(res => ({ data: JSON.parse(res.value || '')}))
  },
  find: async (id: number): Promise<MaterialsResponse> => {
    let resp = await getStorage()
    let data: Material[] = resp.value ? JSON.parse(resp.value) : []
    return new Promise((resolve, rejected) => {

      if (id >= 0) return resolve({
        data: data.filter((_, nKey) => nKey === id).shift()
      })
      rejected({
        message: 'id is missing'
      })
    })
  },
  remove: async (key: number): Promise<MaterialsResponse> => {
    let resp = await getStorage()
    let data: Material[] = resp.value ? JSON.parse(resp.value) : []

    data = data.filter((_, nKey) => nKey !== key)
    return setStorage(data).then(_ => ({ success: true, data: undefined }))
  },
  update: async (key: number, body: Material) => {
    let resp = await getStorage()
    let data: Material[] = resp.value ? JSON.parse(resp.value) : []

    data = data.map((material, nKey) => {
      if(nKey === key) return body
      return material
    })
    return setStorage(data).then(_ => ({ success: true, data: undefined }))
  }
}