import { InputField } from "../types"

export const inputFieldHandle = (event: any, state: InputField, setState: Function) => {
  const { value } = event.target

  if (event.type === 'change' || event.type === 'click') setState((state: any) => ({ ...state, value }))

  if (event.type === 'keyup' || event.type === 'blur') {
    state.value === ''
      ? setState((state: any) => ({ ...state, valid: false, errMessage: 'Este campo es requerido', dirty: true }))
      : setState((state: any) => ({ ...state, valid: true, errMessage: '', dirty: true }))
  }

  if (event.type === 'focus') setState((state: any) => ({ ...state, focusOut: false, errMessage: '' }))

  if (event.type === 'blur' && state.value === '')
    setState((state: any) => ({ ...state, focusOut: true, errMessage: 'Este campo es requerido' }))
}