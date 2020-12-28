export interface Material{
  name: string
  measure: string
  count: string
  price: string
  [key: string]: any
}

export interface MaterialFragment{
  material: Material
  count: string
}

export interface Recipe {
  name: string
  materials: MaterialFragment[],
  portions: string
  [key: string]: any
}

export interface InputField {
  value: string
  valid: boolean
  dirty: boolean
  errMessage: string
  focusOut: boolean
}