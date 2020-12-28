import React, { useState } from 'react'
import { FormControl, TextField, FormHelperText } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { Material } from '../types'
import { IonButton } from '@ionic/react';

interface MaterialDialog {
  showDialog: boolean
  onClose: Function
  onSuccess: Function
  material: Material | undefined
}

const MaterialDialog: React.FC<MaterialDialog> = (props: MaterialDialog) => {
  const { showDialog, onClose, material, onSuccess } = props
  const [count, setCount] = useState<string>('')
  const [hasError, setHasError] = useState(false)

  const onSuccessHandler = () => {
    if (!count || isNaN(parseInt(count)) || parseInt(count) <= 0) {
      setHasError(true)
      return;
    }
    onSuccess({ count, material })
  }

  const onCloseHandle = () => {
    onClose()
    setCount('')
  }

  return (
    <Dialog open={showDialog} onClose={() => onCloseHandle()}>
      <DialogContent className="ion-padding">
        <p><strong>¿Que cantidad deseas usar de "{material?.name}"?</strong></p>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item className="grow1">
            <FormControl className="w100">
              <TextField
                placeholder="Ej: 1000"
                type="number"
                label="Cantidad"
                value={count}
                error={hasError}
                autoFocus
                onChange={e => setCount(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid item>
            {material?.measure}.
          </Grid>
        </Grid>
        {hasError && (<FormHelperText error={hasError}>
          La cantidad debe tener un valor numérico positivo
        </FormHelperText>)}
      </DialogContent>

      <DialogActions className="ion-padding">
        <IonButton
          fill="clear"
          shape="round"
          color="danger"
          onClick={() => onClose()}>
          Cancelar
        </IonButton>
        <IonButton
          fill="outline"
          shape="round"
          onClick={onSuccessHandler}>
          Aceptar
        </IonButton>
      </DialogActions>
    </Dialog>
  )
}

export default MaterialDialog