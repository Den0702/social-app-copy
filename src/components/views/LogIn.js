import React, {useState, useEffect} from "react";
import axios from "axios";
import '../../css/Login.css';
import { Navigate } from "react-router-dom";

export default function LogIn(props) {

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [passwd, setPasswd] = useState('');
    const [passwdError, setPasswdError] = useState('');

    const [unexistUserMessage, setUnexistUserMessage] = useState('');
    
/*     useEffect(() => {
        document.body.style.backgroundColor = "#1ba4ce";
        
        //kiedy bedziemy sie przelaczac na inny komponent, to to spowoduje, ze background-color stanie sie null'em 
        return () => {
            document.body.style.backgroundColor = null;
            console.log('Login unmount');
        }
    }, []) */

    function signUserIn(event) {
        event.preventDefault();

        const sentData = {
            'username': `${username}`,
            'password': `${passwd}`,
            'ttl': 300 /* czas w minutach, po którym token uzytkownika przestanie byc wazny */
        }

        const axiosConfig = {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }

        axios.post(
            'https://akademia108.pl/api/social-app/user/login', 
            sentData, 
            axiosConfig
        )
        .then(res => {
            console.log(res);

            /* if (!(typeof(res.data.username) === 'object') && !(typeof(res.data.password) === 'object')) { */
                
            if (Array.isArray(res.data.username)) {
                setUsernameError(res.data.username[0]);
            }
            if (Array.isArray(res.data.password)) {
                setPasswdError(res.data.password[0]);

            } 
            
            if (res.data.error) {
                setUnexistUserMessage('Nie ma takiego użytkownika. Używaj tylko tych predefiniowanych')

            } else if (!Array.isArray(res.data.username) && !Array.isArray(res.data.password)) {
                const currentUser = res.data;
                props.saveCurrentUserData(currentUser);//zeby zapisac obiekt uzytkownika do stanu w App         
                localStorage.setItem('currentUser', JSON.stringify(currentUser));//i jednoczesnie zapisac do localStorage
            }
        })
        .catch(error => console.log(`The signUserIn's query caused this error: ${error}`));
        
    }

    return (
        <section className="login">
            {/* przekierowanie do strony glownej po zalogowaniu */}
            {props.currentUserProp && <Navigate to="/" />}
            
            <form
                className="form login-form" 
                action=""
                onSubmit={(e) => signUserIn(e)}
            >
                <label htmlFor="username" className={usernameError ? 'error' : ''}>Nazwa użytkownika</label>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" 
                    id="username"
                    className={`input-item ${usernameError ? 'error' : ''}`}
                />

                <label htmlFor="passwd" className={passwdError ? 'error' : ''}>Hasło</label>
                <input
                    onChange={(e) => setPasswd(e.target.value)}
                    type="password" 
                    id="passwd"
                    className={`input-item ${passwdError ? 'error' : ''}`}
                />

                {usernameError && <p>{usernameError}</p>}
                {passwdError && <p>{passwdError}</p>}
                {!usernameError && !passwdError && unexistUserMessage && <p>{unexistUserMessage}</p>} 
                <button type="submit" className="btn btn-submit">Zaloguj się</button>
            </form>
        </section>
    );
}