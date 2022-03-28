import React, { Component } from "react";
import '../css/SignUp.css';

class SignUp extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            login: '',
            email: '',
            passwd: '',
            cpasswd: '', 
        }
    }

    saveUserLogin = (e) => {
        this.setState({
            login: e.target
        })
    }
    
    saveUserMail = (e) => {
        this.setState({
            email: e.target
        })
    }

    saveUserPasswd = (e) => {
        this.setState({
            passwd: e.target
        })
    }

    saveCPasswd = (e) => {
        this.setState({
            cpasswd: e.target
        })
    }

    validateForm = (event) => {
        event.preventDefault();

        const formFields = this._formElem.getElementsByTagName('input');
        const allFilled = true;

        let errors = this._divErrors;
        errors.innerHTML = '';//czyscimy ekran od wczesnie wypisanych bledow

        for (const field of formFields) {
            if (field.value.trim() === '') {
                errors.innerHTML += `Pole nie może być puste<br/>`;
                field.classList.add('error');
            }
        }

        const arrFromPasswd = Array.from(this.state.passwd);
        let passwdCorrect = false;

        if ( !(this.state.login.classList.contains('error'))
            && this.state.login.value.trim().length < 4 ) {
            errors.innerHTML += `Za krótka nazwa użytkownika<br/>`;

        }
        if ( !(this.state.email.classList.contains('error'))
            && !this.state.email.value.trim().includes('@') ) {
            errors.innerHTML += `Niepoprawny adres email<br/>`;
        }

        if ( !(this.state.passwd.classList.contains('error')) ) {
            for (const char of arrFromPasswd) {
                if (!(char === '!' || char === '#' || char === '@' || char === '$' || char === '%')) {
                    continue;
                } else {
                    passwdCorrect = true;
                    return;
                }
            }
            if (!passwdCorrect) {
                errors.innerHTML += `Niewystarczająco mocne hasło!<br/>`;
            }
        }

    }


    render() {
        console.log(this.state);

        return (
            <section >
                <form 
                    className="signup-form"
                    ref={elem => this._formElem = elem} 
                    action="" 
                    onSubmit={this.validateForm}
                >
                        <label htmlFor="login">Nazwa użytkownika</label>
                        <input onChange={this.saveUserLogin} type="text" id="login" className="input-item" />

                        <label htmlFor="email">Adres email</label>
                        <input onChange = {this.saveUserMail} type="text" id="email" className="input-item"/>

                        <label htmlFor="passwd">Hasło</label>
                        <input onChange = {this.saveUserPasswd} type="text" id="passwd" className="input-item"/>

                        <label htmlFor="confirm-passwd">Potwierdzenie hasła</label>
                        <input onChange = {this.saveCPasswd} type="text" id="confirm-passwd" className="input-item"/>

                        <button type="submit">Zarejestruj się</button>
                
                        <div ref={elem => this._divErrors = elem} className="errors"></div>
                </form>
            </section>
        );
    }
}

export default SignUp;