import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { IonCard, IonCardContent, IonIcon, IonButton, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/react';

import { Recipe, MaterialFragment } from './../types';
import recipesService from '../services/recipe'
import { closeOutline } from 'ionicons/icons';
import ConfirmationDialog from './ConfirmationDialog';
import RecipeFormModal from './RecipeFormModal';

interface RecipeListState {
  data: Recipe[] | undefined
  confirmationDialog: boolean
  /**
   * This saves an array index when going to make a change.
   */
  tempKey: number
  showForm: boolean
}

interface RecipeListProps {
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

// export default class RecipeList: React.FC<RecipeListProps> = (props: RecipeListProps) => {
export default class MaterialsList extends Component<RecipeListProps, RecipeListState> {
  constructor(props: RecipeListProps) {
    super(props)
    this.state = {
      data: undefined,
      confirmationDialog: false,
      tempKey: -1,
      showForm: false,
    }
  }

  componentDidMount() {
    this.loadRecipes()
  }

  loadRecipes() {
    recipesService.get().then(({ data }) => {
      data
        ? this.setState({ data })
        : this.setState({ data: [] })
    })
  }

  removeRecipe(key: number) {
    recipesService.remove(key).then((res) => {
      this.loadRecipes()
    })
  }

  dialogCloseHandle(data: any) {
    if (data.ok && this.state.tempKey >= 0) this.removeRecipe(this.state.tempKey)
    if (data.hide) this.setState({ confirmationDialog: false })
  }

  render() {
    const { data } = this.state
    const { selected, readOnly } = this.props

    const getPortionPrice = (recipe:Recipe): number => {
      if (!recipe.portions) return 0
      return getTotalPrice(recipe.materials) / parseInt(recipe.portions)
    }

    const getTotalPrice = (materials:MaterialFragment[]): number => {
      let results = materials.map(({ count, material }): any => (parseFloat(material.price) / parseInt(material.count) * parseInt(count)))
      if (!results.length) return 0
      return results.reduce((a, b) => a + b)
    }

    return (
      <div className="recipesList">
        {data && data.map((recipe: Recipe, key: number) => (
          <IonCard
            className="ion-no-margin recipesListItem"
            key={key}
            onClick={() => selected ? selected(recipe) : undefined}>
            <Grid container spacing={3} alignItems="center">
              <Grid item
                className="grow1"
                onClick={() => this.setState({ showForm: true, tempKey: key })}>
                <IonCardHeader>
                  <IonCardTitle>{recipe.name}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div>Porciones: {recipe.portions}</div>
                  <div>Costo por porcion: {getPortionPrice(recipe).toFixed(2)}</div>
                  <div>Costo de producción: {getTotalPrice(recipe.materials).toFixed(2)}</div>
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
              <IonLabel color="medium">No has creado ninguna receta.</IonLabel>
            </h2>
            {!readOnly && (
              <h4><IonLabel color="medium">Crea una receta presionando el boton "+"</IonLabel></h4>
            )}
          </div>
        )}
        {!readOnly && (
          <ConfirmationDialog
            message="¿Seguro que desea eliminar esta receta?"
            isShow={this.state.confirmationDialog}
            onClose={(data: any) => this.dialogCloseHandle(data)} />
        )}
        {!readOnly && this.state.showForm && <RecipeFormModal
          edit={this.state.tempKey}
          onFormSuccess={this.props.saveSuccessHandler ? this.props.saveSuccessHandler: () => {}}
          showModal={this.state.showForm}
          onDimiss={() => this.setState({ showForm: false, tempKey: -1 })} />}
      </div >
    )
  }
}
