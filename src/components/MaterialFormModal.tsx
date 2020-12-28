import React, { useEffect, useState } from 'react'
import { IonModal, IonButton, IonToolbar, IonHeader, IonButtons, IonTitle, IonContent, IonIcon } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import { TextField, Select, FormControl, MenuItem, InputLabel, makeStyles, Theme, createStyles, Grid } from '@material-ui/core'
import materialsService from '../services/materials';
import { Material, InputField } from './../types';
import { inputFieldHandle } from '../utils/common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      marginBottom: theme.spacing(1),
      width: '100%'
    }
  }),
);

interface MaterialFormProps {
  showModal: boolean
  onDimiss: Function
  onFormSuccess: Function
  edit: number
}

const MaterialFormModal: React.FC<MaterialFormProps> = (props: MaterialFormProps) => {
  const { showModal, onDimiss, onFormSuccess, edit } = props
  const fieldInitialState: InputField = { value: '', valid: false, dirty: false, errMessage: '', focusOut: false }
  
  const classes = useStyles();
  
  const [isSubmited, setIsSubmited] = useState(false)
  const [nameField, setNameField] = useState(fieldInitialState)
  const [countField, setCountField] = useState(fieldInitialState)
  const [priceField, setPriceField] = useState(fieldInitialState)
  const [measureField, setMeasureField] = useState({ ...fieldInitialState, value: 'gr'})

  const isValidForm = () => {
    return nameField.value !== ''
      && measureField.value !== ''
      && priceField.value !== ''
      && countField.value !== ''
  }

  const submitForm = () => {
    setIsSubmited(true)

    let data:Material = {
      name: nameField.value,
      measure: measureField.value,
      price: priceField.value,
      count: countField.value
    }
    let request = edit < 0 ? materialsService.create(data) : materialsService.update(edit, data)
    
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

  const closeModal = () => {
    onDimiss(false)
  }

  useEffect(() => {
    materialsService.find(edit).then((res: any) => {
      setCountField((data) => ({ ...data, value: res.data.count }))
      setNameField((data) => ({ ...data, value: res.data.name }))
      setMeasureField((data) => ({ ...data, value: res.data.measure }))
      setPriceField((data) => ({ ...data, value: res.data.price }))
    })
  }, [setCountField, setNameField, setMeasureField, setPriceField, edit])

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>
              <IonIcon slot="icon-only" src={arrowBack}/>
            </IonButton>
          </IonButtons>

          <IonTitle>Agregar material</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <FormControl className={classes.formControl}>
          <TextField
            placeholder="Ej: Cajas, Huevos, Azucar, etc..."
            value={nameField.value}
            label="Nombre"
            name="name"
            autoFocus={true}
            error={!nameField.valid && (nameField.dirty || nameField.focusOut)}
            helperText={nameField.valid ? '': nameField.errMessage}
            onFocus={e => inputFieldHandle(e, nameField, setNameField)}
            onBlur={e => inputFieldHandle(e, nameField, setNameField)}
            onKeyUp={e => inputFieldHandle(e, nameField, setNameField)}
            onChange={e => inputFieldHandle(e, nameField, setNameField)} />
        </FormControl>

        <FormControl className={classes.formControl}>
          <TextField
            placeholder="1000.50"
            type="number"
            label="Price"
            name="price"
            value={priceField.value}
            error={!priceField.valid && (priceField.dirty || priceField.focusOut)}
            helperText={priceField.valid ? '' : priceField.errMessage}
            onFocus={e => inputFieldHandle(e, priceField, setPriceField)}
            onBlur={e => inputFieldHandle(e, priceField, setPriceField)}
            onKeyUp={e => inputFieldHandle(e, priceField, setPriceField)}
            onChange={e => inputFieldHandle(e, priceField, setPriceField)} />
        </FormControl>
        
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <TextField
                placeholder="900"
                value={countField.value}
                type="number"
                label="Cantidad"
                name="count"
                error={!countField.valid && (countField.dirty || countField.focusOut)}
                helperText={countField.valid ? '' : countField.errMessage}
                onFocus={e => inputFieldHandle(e, countField, setCountField)}
                onBlur={e => inputFieldHandle(e, countField, setCountField)}
                onKeyUp={e => inputFieldHandle(e, countField, setCountField)}
                onChange={e => inputFieldHandle(e, countField, setCountField)} />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl
              className={classes.formControl}>
              <InputLabel>Medida</InputLabel>
              <Select
                name="measure"
                value={measureField.value}
                onChange={e => inputFieldHandle(e, measureField, setMeasureField)}>
                <MenuItem value="ml">Mililitros</MenuItem>
                <MenuItem value="gr">Gramos</MenuItem>
                <MenuItem value="u">Unidades</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

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

export default MaterialFormModal