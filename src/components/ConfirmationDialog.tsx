import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { IonButton } from '@ionic/react';

interface ConfirmationDialogProps {
  isShow: boolean
  onClose: Function
  message?: string,
  okText?: string
  cancelText?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { isShow, onClose, message, okText, cancelText} = props
  
  const closeDialog = (options:any = {}) => {
    onClose({ hide: true, ...options})
  }

  return (
    <Dialog open={isShow} onClose={closeDialog}>
      <DialogTitle>Confimación</DialogTitle>
      <DialogContent>{message ? message: '¿Seguro que desea realizar esta accion?' }</DialogContent>
      <DialogActions>
        <IonButton
          fill="clear"
          shape="round"
          color="danger"
          onClick={() => closeDialog({ok: false})}>
          {cancelText ? cancelText : 'Cancelar'}
        </IonButton>
        <IonButton
          fill="outline"
          shape="round"
          onClick={() => closeDialog({ok: true})}>
          {okText ? okText : 'Aceptar'}
        </IonButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog