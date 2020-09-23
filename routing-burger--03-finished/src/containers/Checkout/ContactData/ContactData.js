import React, { Component } from "react";
import { connect } from 'react-redux';
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';


class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP",
        },
        value: "",
        validation: {
          required: true,
          minLenght: 6,
          maxLenght: 6,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        validation: {},
        valid: true,
      },
    },
    formIsValid: false,
    //loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    //this.setState({ loading: true });
    const formData = {};
    for (let formEllementIdentifier in this.state.orderForm) {
      formData[formEllementIdentifier] = this.state.orderForm[
        formEllementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
    };
    this.props.onOrderBurger(order);
    // axios
    //   .post("/orders.json", order)
    //   .then((response) => {
    //     this.setState({ loading: false });
    //     this.props.history.push("/");
    //   })
    //   .catch((error) => {
    //     this.setState({ loading: false });
    //   });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) return isValid;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    // if(rules.minLenght){
    //     isValid = value.lenght >= 6 && isValid;
    // }
    // if(rules.maxLenght){
    //     isValid = value.lenght <= 6 && isValid;
    // }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
    };
    const updatedFormEllement = {
      ...updatedOrderForm[inputIdentifier],
    };
    updatedFormEllement.value = event.target.value;
    updatedFormEllement.valid = this.checkValidity(
      updatedFormEllement.value,
      updatedFormEllement.validation
    );
    updatedFormEllement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormEllement;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formEllementArray = [];
    for (let key in this.state.orderForm) {
      formEllementArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formEllementArray.map((formEllement) => (
          <Input
            key={formEllement.id}
            elementType={formEllement.config.elementType}
            elementConfig={formEllement.config.elementConfig}
            value={formEllement.config.value}
            invalid={!formEllement.config.valid}
            shouldValidate={formEllement.config.validation}
            touched={formEllement.config.touched}
            changed={(event) =>
              this.inputChangedHandler(event, formEllement.id)
            }
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
  return{
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
