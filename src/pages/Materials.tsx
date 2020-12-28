import React, { createRef, useState } from 'react';
import './Materials.css'
import {
  IonPage, IonHeader, IonButtons, IonToolbar, IonMenuButton, IonTitle, IonContent,
  IonIcon, IonFab, IonFabButton, IonToast
} from '@ionic/react'

import { addOutline } from 'ionicons/icons'
import MaterialFormModal from '../components/MaterialFormModal';
import MaterialsList from '../components/MaterialsList';

const Materials: React.FC = () => {

  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const materialListref = createRef<MaterialsList>()


  const formSuccessHandle = (res:any) => {
    if (res.success) {
      materialListref.current?.loadMaterials()
      setToastMessage('Material guardado exitosamente')
      setShowToast(true)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Materiales / Ingredientes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <MaterialsList saveSuccessHandler={formSuccessHandle} ref={materialListref} readOnly={false} />
        
        {showModal && (
          <MaterialFormModal
            edit={-1}
            showModal={showModal}
            onDimiss={setShowModal}
            onFormSuccess={formSuccessHandle} />
        )}

        {showToast && (<IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          position="bottom"
          duration={2000}
          buttons={[
            { side: 'end', text: 'OK', }
          ]}
        />)}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() =>  setShowModal(true)}>
            <IonIcon src={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Materials