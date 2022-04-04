import React, { Component } from "react";
import '../css/SignUp.css';
import axios from 'axios';

class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            loginError: '',
            email: '',
            emailError: '',
            passwd: '',
            passwdError: '',
            confirmPasswd: '',
            confirmPasswdError: ''
        }
    }

    handleUserLogin = (e) => {
        this.setState(() => {
            return { login: e.target.value }
        })
    }

    handleUserEmail = (e) => {
        this.setState(() => {
            return { email: e.target.value }
        })
    }

    handleUserPasswd = (e) => {
        this.setState(() => {
            return { passwd: e.target.value }
        })
    }

    handleConfirmPasswd = (e) => {
        this.setState(() => {
            return { confirmPasswd: e.target.value }
        })
    }

    validateForm = (event) => {
        event.preventDefault();

        this.setState((currentState) => {
            if (!currentState.login) {
                return { loginError: 'Podaj nazwę użytkownika' }

            } else if (currentState.login.trim().length < 4) {
                return { loginError: 'Nazwa użytkownika powinna się składać z minimum 4 symboli' }
            }
            else if (currentState.loginError){
                currentState.loginError = ''; //czyscimy error po przeładowaniu
            }
        });

        this.setState((currentState) => {
            if (!currentState.email) {
                return { emailError: 'Podaj adres email' }

            } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(currentState.email.trim())) {
                return { emailError: 'Niepoprawny adres email' }
            }
            else if (currentState.emailError){
                currentState.emailError = '';
            }
        });

        this.setState((currentState) => {
            currentState.passwdError = '';

            //dorobić w sprawdzeniu hasła, czy składa się ono z co najmniej 1 cyfry
            if (currentState['passwd'] !== '') {
                const arrFromPasswd = Array.from(currentState['passwd']);
                let passwdCorrect = false;

                if (arrFromPasswd.length >= 6) {
                    for (const char of arrFromPasswd) {
                        if (!(char === '!' || char === '#' || char === '@' || char === '$' || char === '%')) {
                            continue;
                        } else {
                            passwdCorrect = true;
                            break;//zeby nie wykonywac niepotrzebnych iteracji
                        }
                    }
                    if (!passwdCorrect) {
                        return { passwdError: 'Niewystarczająco mocne hasło! (musi zawierać !, #, @, $ lub %)' }
                    }
                } else {
                    return {passwdError: 'Hasło jest za krótkie! (min 6 znaków)'}
                }

            } else {
                return { passwdError: 'Podaj hasło!' }
            }
        })

        this.setState((currentState) => {      
            if (!currentState.confirmPasswd) {
                return { confirmPasswdError: 'Potwierdź hasło!' }
                
            } else if (currentState.passwd !== currentState.confirmPasswd 
                        && !currentState.passwdError) {
                return { confirmPasswdError: 'Podane hasła się nie zgadzają!' }
                
            } else if (currentState.confirmPasswdError){
                return {confirmPasswdError: ''}
            }
        })    
        
        /* this.areDataOk(); */
    }

    componentDidUpdate() {
        let dataReadyToBeSent = false;
        let inputs = [];
        let nonEmptyInputsCount = 0;
        let errors = [];
        let nonEmptyErrorsCount = 0;

        for (const [key, value] of Object.entries(this.state)) {
            if (key.includes('Error')) {
                errors.push(value);
            } else {
                inputs.push(value);
            }
        }
        
        inputs.forEach(input => {
            //jezeli input nie jest pusty
            if (input) {
               nonEmptyInputsCount++;
            } 
        });
        
        if(nonEmptyInputsCount === inputs.length) {
            dataReadyToBeSent = true;
        }

        errors.forEach(error => {
            //jezeli error nie jest pusty (zawiera komunikat błędu)
            if (error) {
                dataReadyToBeSent = false;;
            }
        })

        if (dataReadyToBeSent) {
            this.signUserUp();
        }
    }

 /*    componentDidUpdate() {
        if (this.state.login &&
            this.state.email &&
            this.state.passwd &&
            this.state.confirmPasswd &&
            !this.state.loginError &&
            !this.state.emailError &&
            !this.state.passwdError &&
            !this.state.confirmPasswdError
        ) {
            this.signUserUp();
        }
    } */

    signUserUp = () => {
        console.log('signUserUp()');

        const userData = {
            username: this.state.login,
            password: this.state.passwd,
            email: this.state.email
        }

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        axios.post(
            'https://akademia108.pl/api/social-app/user/signup',
            JSON.stringify(userData),
            axiosConfig)
            .then(res => console.log("RESPONSE RECEIVED", res))
            .catch(err => console.log("AXIOS ERROR", err))
    }

    render() {
        return (
            <section className="sign-up">
                <form
                    className="signup-form"
                    ref={elem => this._formElem = elem}
                    action=""
                    onSubmit={this.validateForm}
                >
                    <label htmlFor="login" className={this.state.loginError ? 'error' : ''}>Nazwa użytkownika</label>
                    <input
                        onChange={this.handleUserLogin}
                        type="text" id="login"
                        className={`input-item ${this.state.loginError ? 'error' : ''}`}
                    />

                    <label htmlFor="email" className={this.state.emailError ? 'error' : ''}>Adres email</label>
                    <input
                        onChange={this.handleUserEmail}
                        type="email"
                        id="email"
                        className={`input-item ${this.state.emailError ? 'error' : ''}`}
                    />

                    <label htmlFor="passwd" className={this.state.passwdError ? 'error' : ''}>Hasło</label>
                    <input
                        onChange={this.handleUserPasswd}
                        type="password" id="passwd"
                        className={`input-item ${this.state.passwdError ? 'error' : ''}`}
                    />

                    <label htmlFor="confirm-passwd" className={this.state.confirmPasswdError ? 'error' : ''}>Potwierdzenie hasła</label>
                    <input
                        onChange={this.handleConfirmPasswd}
                        type="password" id="confirm-passwd"
                        className={`input-item ${this.state.confirmPasswdError ? 'error' : ''}`}
                    />

                    {!(this.state.loginError === '') && <p>{this.state.loginError}</p>}
                    {!(this.state.emailError === '') && <p>{this.state.emailError}</p>}
                    {!(this.state.passwdError === '') && <p>{this.state.passwdError}</p>}
                    {!(this.state.confirmPasswdError === '') && <p>{this.state.confirmPasswdError}</p>}

                    <button type="submit" className="btn btn-submit">Zarejestruj się</button>
                </form>
            </section>
        );
    }
}

export default SignUp;