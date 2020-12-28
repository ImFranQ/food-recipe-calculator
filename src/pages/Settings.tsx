import React from 'react';
import './Materials.css'
import { IonPage, IonHeader, IonToolbar, IonContent} from '@ionic/react'
import { IonButtons, IonMenuButton, IonTitle, } from '@ionic/react'

const Settings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        
      </IonContent>
    </IonPage>
  )
}

export default Settings