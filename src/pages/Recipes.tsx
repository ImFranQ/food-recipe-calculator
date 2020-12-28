import React, { createRef, useState } from 'react';
import './Materials.css'
import { IonPage, IonHeader, IonButtons, IonToolbar, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonToast } from '@ionic/react'
import RecipeFormModal from '../components/RecipeFormModal';
import { addOutline } from 'ionicons/icons';
import RecipeList from './../components/RecipeList';

const Materials: React.FC = () => {
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const recipesListRef = createRef<RecipeList>()


  const formSuccessHandle = (res:any) => {
    if (res.success) {
      recipesListRef.current?.loadRecipes()
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

          <IonTitle>Recetas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <RecipeList saveSuccessHandler={formSuccessHandle} ref={recipesListRef} readOnly={false}/>

        {showModal && <RecipeFormModal
          edit={-1}
          onFormSuccess={formSuccessHandle}
          showModal={showModal} onDimiss={setShowModal} />}

        {showToast && <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          position="bottom"
          duration={2000}
          buttons={[
            { side: 'end', text: 'OK', }
          ]} />}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon src={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Materials