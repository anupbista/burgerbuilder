import React, { Component } from 'react';

import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component{

    componentWillUpdate(){
        console.log("[OrderSummary] Update");
    }

    render(){

        const ingredientsSummary = Object.keys(this.props.ingredients)
                .map( igKey => {
                    return <li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}</li>
                } );

        return (
        <Aux>
            <h3>Your Order</h3>
            <h4>Price: Rs: {this.props.totalPrice.toFixed(2)}</h4>
            <p>Delicious Burger with following ingredients:</p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p>Continue to Checkout ?</p>
            <Button btnType="Danger" clicked={this.props.purchaseCancel}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinue}>CONTINUE</Button>
        </Aux>
        );
    }
}

export default OrderSummary;