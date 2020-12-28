import React, { useEffect, useState } from 'react'
import { IonModal, IonButton, IonToolbar, IonHeader, IonButtons, IonTitle, IonContent, IonIcon, IonList, IonListHeader, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonNote } from '@ionic/react'
import { addOutline, arrowBack, closeOutline } from 'ionicons/icons'
import { TextField, FormControl, makeStyles, Theme, createStyles, Grid, FormHelperText } from '@material-ui/core'

import MaterialListModal from './MaterialsListModal';
import { MaterialFragment, Recipe, InputField } from '../types';
import { inputFieldHandle } from '../utils/common';
import recipeService from '../services/recipe'

interface FormErrorstate {
  [key: string]: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginBottom: theme.spacing(1),
      width: '100%'
    }
  }),
);

export interface RecipeFormModalProps {
  showModal: boolean
  onDimiss: Function
  onFormSuccess: Function
  edit: number
}

const RecipeFormModal: React.FC<RecipeFormModalProps> = (props: RecipeFormModalProps) => {

  const fieldInitialState: InputField = { value: '', valid: false, dirty: false, errMessage: '', focusOut: false }
  const { showModal, onDimiss, edit, onFormSuccess } = props

  const classes = useStyles();

  const [isSubmited, setIsSubmited] = useState(false)
  const [showMaterials, setShowMaterials] = useState(false)

  const [nameField, setNameField] = useState<InputField>(fieldInitialState)
  const [portionsField, setPortionsField] = useState<InputField>(fieldInitialState)
  const [materialsField, setMaterialsField] = useState<MaterialFragment[]>([])

  const isValidForm = (): boolean => {
    return (
      nameField.value !== ''
      && portionsField.value !== ''
      && materialsField.length > 0
    )
  }

  const submitForm = () => {
    setIsSubmited(true)

    let data: Recipe = {
      materials: materialsField,
      name: nameField.value,
      portions: portionsField.value
    }

    let request = edit < 0 ? recipeService.create(data) : recipeService.update(edit, data)

    request
      .then(res => {
        onFormSuccess(res)
        closeModal()
        setIsSubmited(false)
      })
      .catch(err => {
        console.error(err);
        setIsSubmited(false)
      })
  }

  useEffect(() => {
    recipeService.find(edit).then((res: any) => {
      setMaterialsField((data) => (res.data.materials))
      setNameField((data) => ({ ...data, value: res.data.name }))
      setPortionsField((data) => ({ ...data, value: res.data.portions }))
    })
  }, [setMaterialsField, setNameField, setPortionsField, edit])

  const closeModal = () => {
    onDimiss(false)
  }

  const onSuccessHandle = (fragment: MaterialFragment) => {
    addToMaterials(fragment)
  }

  const addToMaterials = (fragment: MaterialFragment) => {
    setMaterialsField([...materialsField, fragment])
  }

  const removeMaterial = (key:number) => {
    setMaterialsField([...materialsField.filter((_, mKey) => mKey !== key)])
  }

  const getPortionPrice = (): number => {
    if (!portionsField.value) return 0
    return getTotalPrice() / parseInt(portionsField.value)
  }

  const getTotalPrice = (): number => {
    let results = materialsField.map(({ count, material }):any => (parseFloat(material.price) / parseInt(material.count) * parseInt(count)))
    if(!results.length) return 0
    return results.reduce((a, b) => a + b)
  }

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>
              <IonIcon slot="icon-only" src={arrowBack} />
            </IonButton>
          </IonButtons>

          <IonTitle>Agregar receta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <FormControl className={classes.formControl}>
          <TextField
            placeholder="Galletas"
            value={nameField.value}
            label="Nombre de la receta"
            name="name"
            autoFocus={true}
            error={!nameField.valid && (nameField.dirty || nameField.focusOut)}
            helperText={nameField.valid ? '' : nameField.errMessage}
            onBlur={e => inputFieldHandle(e, nameField, setNameField)}
            onFocus={e => inputFieldHandle(e, nameField, setNameField)}
            onKeyUp={e => inputFieldHandle(e, nameField, setNameField)}
            onChange={e => inputFieldHandle(e, nameField, setNameField)} />
        </FormControl>

        <FormControl className={classes.formControl}>
          <TextField
            placeholder="Ej: 100"
            value={portionsField.value}
            label="Porciones"
            name="portions"
            type="number"
            error={!portionsField.valid && (portionsField.dirty || portionsField.focusOut)}
            helperText={portionsField.valid ? '' : portionsField.errMessage}
            onBlur={e => inputFieldHandle(e, portionsField, setPortionsField)}
            onFocus={e => inputFieldHandle(e, portionsField, setPortionsField)}
            onKeyUp={e => inputFieldHandle(e, portionsField, setPortionsField)}
            onChange={e => inputFieldHandle(e, portionsField, setPortionsField)} />
          {!portionsField.errMessage && <FormHelperText>Porciones obtenientes de la receta</FormHelperText> }
        </FormControl>

        <IonList>
          <IonListHeader className="recipeMaterialTitle">Ingredientes</IonListHeader>
          {materialsField.map(({material, count}, key):any => (
            <IonCard className="" key={key}>
              <Grid container spacing={3} alignItems="center">
                <Grid item className="grow1">
                  <IonCardHeader>
                    <IonCardTitle>{material.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div>Uso: {count} {material.measure}</div>
                    <div>Costo: {(parseFloat(material.price) / parseInt(material.count) * parseInt(count)).toFixed(2)}</div>
                  </IonCardContent>
                </Grid>
                <Grid item>
                  <IonButton color="danger" fill="clear" onClick={() => removeMaterial(key)}>
                    <IonIcon slot="icon-only" src={ closeOutline } />
                  </IonButton>
                </Grid>
              </Grid>
            </IonCard>
          ))}
          <IonButton
            className="ion-margin-top"
            expand="full"
            fill="outline"
            color="medium"
            shape="round"
            onClick={() => setShowMaterials(true)}>
            <IonIcon slot="start" src={ addOutline }/>
            Agregar ingrediente
          </IonButton>

          <MaterialListModal
            showModal={showMaterials}
            onDimiss={() => setShowMaterials(false)}
            onSuccess={onSuccessHandle} />
        </IonList>

        <IonList>
          <IonListHeader className="recipeMaterialTitle">Costo de producción</IonListHeader>
          <div><IonNote>Costo por porción: { getPortionPrice().toFixed(2) }</IonNote></div>
          <div><IonNote>Costo de producción (total): { getTotalPrice().toFixed(2) }</IonNote></div>
        </IonList>

        <IonButton
          expand="full"
          shape="round"
          onClick={submitForm}
          disabled={!isValidForm() || isSubmited}>
          Guardar
        </IonButton>

      </IonContent>
    </IonModal>
  )
}

export default RecipeFormModal