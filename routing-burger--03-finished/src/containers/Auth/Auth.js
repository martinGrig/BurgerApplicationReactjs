import React, { Component } from "react";
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {updateObject, checkValidity} from '../../shared/utility';


class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your Password",
        },
        value: "",
        validation: {
          required: true,
          minLenght: 8,
        },
        valid: false,
        touched: false,
      },
    },
    isSignup: true
  };

  componentDidMount() {
    if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
        this.props.onSetAuthRedirectPath();
    }
  }

  
switchAuthModeHandler = () => {
    this.setState(prevState => {
        return {isSignup: !prevState.isSignup}
    });
}

inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      })
    });
    this.setState({controls: updatedControls});
}

submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
}

  render() {
    const formEllementArray = [];
    for (let key in this.state.controls) {
      formEllementArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    let form = formEllementArray.map(formEllement => (
        <Input 
            key={formEllement.id}
            elementType={formEllement.config.elementType}
            elementConfig={formEllement.config.elementConfig}
            value={formEllement.config.value}
            invalid={!formEllement.config.valid}
            shouldValidate={formEllement.config.validation}
            touched={formEllement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formEllement.id)}
        />
    ))

    if(this.props.loading){
        form = <Spinner />
    }

    let errorMessage = null;
    if(this.props.error){
        errorMessage = (
            <p>{this.props.error.message}</p>
        )
    }

    let authRedirect = null;
    if(this.props.isAuthenticated){
        authRedirect = <Redirect to={this.props.authRedirectPath}/>
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
            {form}
            <Button btnType='Success'>SUBMIT</Button>
        </form>
            <Button 
                clicked={this.switchAuthModeHandler}
                btnType='Danger'>
                SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
            </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath 
    }
}

const mapDispatchToProps = dispatch => {
    return{
      onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
      //onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(Auth);