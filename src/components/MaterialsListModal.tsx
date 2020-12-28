import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonButton, IonIcon, IonButtons, IonTitle, IonContent } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import MaterialList from './MaterialsList'
import { Material, MaterialFragment } from '../types';
import MaterialDialog from './MaterialDialog';

export interface MaterialsListModalProps {
  showModal: boolean
  onDimiss: Function
  onSuccess: Function
}

const MaterialListModal: React.FC<MaterialsListModalProps> = (props: MaterialsListModalProps) => {
  const { showModal, onDimiss, onSuccess } = props

  const [showDialog, setShowDialog] = useState(false)
  const [materialSelected, setMaterialSelected] = useState<Material>()

  const selectedHandle = (m:Material) => {
    setMaterialSelected(m)
    setShowDialog(true)
  }

  const onSuccessHandle = (fragment:MaterialFragment) => {
    setShowDialog(false)
    onDimiss(false)
    onSuccess(fragment)
  }

  return (
    <IonModal isOpen={showModal} cssClass='my-custom-class'>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onDimiss(false)}>
              <IonIcon slot="icon-only" src={arrowBack} />
            </IonButton>
          </IonButtons>

          <IonTitle>Seleccionar ingrediente</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      {showDialog && (
        <MaterialDialog
          material={materialSelected}
          showDialog={showDialog}
          onClose={() => setShowDialog(false)}
          onSuccess={onSuccessHandle}/>
      )}
      
      <IonContent fullscreen className="ion-padding">
        <MaterialList readOnly={true} selected={(m: Material) => selectedHandle(m) }/>
      </IonContent>
    </IonModal>
  )
}

export default MaterialListModal;