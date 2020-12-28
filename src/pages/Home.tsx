import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonLabel, IonCard, IonCardContent, IonRouterLink } from '@ionic/react';
import { Grid } from '@material-ui/core';
import { cubeOutline, receiptOutline } from 'ionicons/icons';
import React from 'react';
import './Home.css';

interface AppMenu {
  icon: string,
  name: string,
  url: string
}

const homeMenu: AppMenu[] = [
  {
    name: 'Recetas',
    icon: receiptOutline,
    url: '/repices'
  },
  {
    name: 'Materiales',
    icon: cubeOutline,
    url: '/materials'
  }
]

const Page: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <Grid container direction="column" alignItems="center">
          {homeMenu.map((item, key) => (
            <Grid item xs={6} key={key}>
              <IonRouterLink routerLink={item.url}>
                <IonCard style={{width: 140}}>
                  <IonCardContent className="ion-text-center">
                    <div className="ion-bottom-padding">
                      <IonIcon src={item.icon} className="home-item-icon" />
                    </div>
                    <IonLabel className="uppercase"><strong>{item.name}</strong></IonLabel>
                  </IonCardContent>
                </IonCard>
              </IonRouterLink>
            </Grid>
          ))}
        </Grid>
      </IonContent>
    </IonPage>
  );
};

export default Page;
