import React, {useState} from "react";
import axios from "axios";
import '../css/Login.css';
import { Navigate } from "react-router-dom";

export default function LogIn(props) {

    const [username, setUsername] = useState('');
    const [usernameEmpty, setUsernameError] = useState(false);

    const [passwd, setPasswd] = useState('');
    const [passwdEmpty, setPasswdError] = useState(false);
    
    //const ttl = 3600;/* czas, po którym użytkownik zostanie automatycznie wylogowany */
    
    function signUserIn(event) {
        event.preventDefault();

        const sendData = {
            'username': `${username}`,
            'password': `${passwd}`,
            //'ttl': `${ttl}`
        }

        const axiosConfig = {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }

        axios.post(
            'https://akademia108.pl/api/social-app/user/login', 
            sendData, 
            axiosConfig
        )
        .then(res => {
            console.log(res);

            if (!(typeof(res.data.username) === 'object') && !(typeof(res.data.password) === 'object')) {
                const currentUser = res.data;

                props.saveCurrentUserData(currentUser);//zeby zapisac obiekt uzytkownika do stanu w App         
                localStorage.setItem('currentUser', JSON.stringify(currentUser));//i jednoczesnie zapisac do localStorage
            } else {
                /* jesli jest komunikat w odpowiedzi z serwera o tym, ze pole username jest puste */
                if (typeof(res.data.username) === 'object') {
                    setUsernameError(true);
                }
                /* -- || --, ze pole password jest puste */
                if(typeof(res.data.password) === 'object') {
                    setPasswdError(true);
                }
            }
        })
        .catch(error => console.log(error));
        
    }

    //let timerID = setTimeout(props.signUserOut, ttl)

    return (
        <section className="login">
            {props.currentUser && <Navigate to="/" />}
            
            <form
                className="form login-form" 
                action=""
                onSubmit={(e) => signUserIn(e)}
            >
                <label htmlFor="username" className={usernameEmpty ? 'error' : ''}>Nazwa użytkownika</label>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" 
                    id="username"
                    className={`input-item ${usernameEmpty ? 'error' : ''}`}
                />

                <label htmlFor="passwd" className={passwdEmpty ? 'error' : ''}>Hasło</label>
                <input
                    onChange={(e) => setPasswd(e.target.value)}
                    type="text" 
                    id="passwd"
                    className={`input-item ${passwdEmpty ? 'error' : ''}`}
                />

                {usernameEmpty && <p>Proszę podać nazwę użytkownika</p>}
                {passwdEmpty && <p>Proszę podać hasło</p>}
                
                {/* <Link to="/signup">Rejestracja</Link> -czy mozna */}
                <button type="submit" className="btn btn-submit">Zaloguj się</button>
            </form>
        </section>
    );
}