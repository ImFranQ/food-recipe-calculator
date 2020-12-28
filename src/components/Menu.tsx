import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, } from '@ionic/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { bookmarkOutline, cubeOutline, homeOutline, receiptOutline } from 'ionicons/icons';
import './Menu.css';

interface MenuLink {
  url: string;
  title: string;
  src: string
}

const appPages: MenuLink[] = [
  {
    title: 'Inicio',
    url: '/home',
    src: homeOutline,
  },
  {
    title: 'Recetas',
    url: '/repices',
    src: receiptOutline
  },
  {
    title: 'Materiales',
    url: '/materials',
    src: cubeOutline
  },
];

const account: MenuLink[] = [
  {
    title: 'Configuracón',
    url: '/settings',
    src: cubeOutline
  },
]

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Inbox</IonListHeader>
          <IonNote>hi@ionicframework.com</IonNote>

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" src={appPage.src} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Account</IonListHeader>
          {account.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" src={appPage.src} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
