import React, {Component} from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummnary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENTS_PRICES = {
    cheese: 0.4,
    bacon: 0.3,
    meat: 1.2,
    salad: 0.9
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        console.log(this.props);
        axios.get('/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true});            
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);        
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map( igkey=>{
            return ingredients[igkey];
        } ).reduce((sum, el)=>{
            return sum + el;
        }, 0);
        this.setState({
            purchaseable: sum > 0
        })
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    puchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({
             purchasing: false
         })
    }

    purchaseContinueHandler = () =>{
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+ '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });

    }

    render() {
        const disabledInfo={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let OrderSummary = null;

         let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

         if(this.state.ingredients){
            burger = (
                <Aux>
                   <Burger ingredients={this.state.ingredients}/>
                   <BuildControls ingredientAdded={this.addIngredientHandler} 
                   ingredientRemoved={this.removeIngredientHandler}
                   disabled={disabledInfo}
                   purchaseable={this.state.purchaseable}
                   order={this.puchaseHandler}
                   price={this.state.totalPrice}/>
               </Aux> 
            );
            OrderSummary = <OrderSummnary 
            totalPrice={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCancel={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler}
             />;
         }

        if(this.state.loading){
            OrderSummary = <Spinner />;
        }

      return (
          <Aux>
              <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {OrderSummary}
              </Modal>
              {burger}
          </Aux>
      );
    }
}

export default withErrorHandler(BurgerBuilder, axios);