import { IonCard, IonCardContent, IonLabel, IonIcon, IonButton } from '@ionic/react';
import React, { Component } from 'react';
import { cashOutline, beakerOutline, closeOutline } from 'ionicons/icons';

import { Material } from '../types';
import materialsService from '../services/materials'
import { Grid } from '@material-ui/core';
import ConfirmationDialog from './ConfirmationDialog';
import MaterialFormModal from './MaterialFormModal';

interface MaterialListState {
  data: Material[] | undefined
  confirmationDialog: boolean
  /**
   * This saves an array index when going to make a change.
   */
  tempKey: number
  showForm: boolean
}

export interface MaterialListProps {
  /**
   * When a item is clicked this function is emited
   */
  selected?: Function
  /**
   * When this is true, can delete and edit items
   */
  readOnly?: boolean

  saveSuccessHandler?: Function
}

export default class MaterialsList extends Component<MaterialListProps, MaterialListState> {

  constructor(props: MaterialListProps) {
    super(props)
    this.state = {
      data: undefined,
      confirmationDialog: false,
      showForm: false,
      tempKey: -1
    }
  }

  loadMaterials() {
    materialsService.get().then(({data}) => {
      data
        ? this.setState({data})
        : this.setState({data: []})
    })
  }

  removeMaterial(key:number) {
    materialsService.remove(key).then((res) => {
      this.loadMaterials()
      this.setState({tempKey: -1})
    })
  }

  componentDidMount() {
    this.loadMaterials()
  }

  dialogCloseHandle(data: any) {
    if (data.ok && this.state.tempKey >= 0) this.removeMaterial(this.state.tempKey)
    if (data.hide) this.setState({ confirmationDialog: false})
  }

  render() {
    const { data } = this.state
    const { selected, readOnly } = this.props

    return (
      <div className="materialsList">
        {data && data.map((material: Material, key:number) => (
          <IonCard
            className="ion-no-margin materialsListItem"
            key={key}
            onClick={() => selected ? selected(material) : undefined}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item className="grow1">
                <IonCardContent onClick={() => this.setState({ showForm: true, tempKey: key }) }>
                  <IonLabel className="title"><strong>{material.name}</strong></IonLabel>
                  <ul className="details">
                    <li>
                      <IonIcon src={cashOutline} className="icon" />
                      ${parseFloat(material.price).toFixed(2)}
                    </li>
                    <li>
                      <IonIcon src={beakerOutline} className="icon" />
                      {material.count} {material.measure}
                    </li>
                  </ul>
                </IonCardContent>
              </Grid>
              {!readOnly && (
                <Grid item>
                  <IonButton 
                    color="danger"
                    fill="clear"
                    onClick={() => this.setState({ confirmationDialog: true, tempKey: key })}>
                    <IonIcon slot="icon-only" src={closeOutline} />
                  </IonButton>
                </Grid>
              )}
            </Grid>
          </IonCard>
        ))}
        {!data?.length && (
          <div className="ion-text-center">
            <h1>¡Valla!</h1>
            <h2 className="ion-color-primary">
              <IonLabel color="medium">No has agregado ningún material o ingrediente.</IonLabel>
            </h2>
            {!readOnly && (
              <h4><IonLabel color="medium">Agrega el primero presionando el boton "+"</IonLabel></h4>
            )}
          </div>
        )}
        {!readOnly && (
          <ConfirmationDialog
            message="¿Seguro que desea eliminar este ingrediente?"
            isShow={this.state.confirmationDialog}
            onClose={(data:any) => this.dialogCloseHandle(data)} />
        )}
        {!readOnly && this.state.showForm && (
          <MaterialFormModal
            edit={this.state.tempKey}
            showModal={this.state.showForm}
            onDimiss={() => this.setState({showForm: false, tempKey: -1})}
            onFormSuccess={this.props.saveSuccessHandler ? this.props.saveSuccessHandler: () => {}}
          />
        )}
      </div>
    )
  }
}