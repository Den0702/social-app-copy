import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function LogIn(props) {

  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');
  const [usernameErr, setUsernameErr] = useState('');
  const [passwdErr, setpasswdErr] = useState('');

  const [emptyUsernameMessage, setEmptyUsernameMessage] = useState('');
  const [passwdErrMessage, setPasswdErrMessage] = useState('');
  const [unexistUserMessage, setUnexistUserMessage] = useState('');

  function signUserIn(event) {
    event.preventDefault();

    const sentData = {
      'username': `${username}`,
      'password': `${passwd}`,
      'ttl': 300 /* czas w minutach, po którym token uzytkownika przestanie byc wazny */
    }
    axios.post(
      'https://akademia108.pl/api/social-app/user/login',
      sentData,
    )
    .then(res => {
      const resObjectFieldValue = Object.values(res.data)[0];

      if (Array.isArray(resObjectFieldValue)) {

        if (Object.entries(res.data).length === 2) {
          setpasswdErr('error');
          setUsernameErr('error');
          setPasswdErrMessage(res.data.password[0]);
          setEmptyUsernameMessage(res.data.username[0]);

        } else {

          if (Object.keys(res.data)[0] === 'password') {
            setpasswdErr('error');
            setPasswdErrMessage(res.data.password[0]);

            if (usernameErr) {
              setUsernameErr('');
              setEmptyUsernameMessage('');
            }

          } else {
            setUsernameErr('error');
            setEmptyUsernameMessage(res.data.username[0]);

            if (passwdErr) {
              setpasswdErr('');
              setPasswdErrMessage('');  
            }
          }     
        }

      } else {
        if (usernameErr) {
          setUsernameErr('');
          setEmptyUsernameMessage('');
        }
        
        if (passwdErr) {
          setpasswdErr('');
          setPasswdErrMessage('');  
        }
      }

      if (res.data.error === true) {
        setUnexistUserMessage('Używaj tylko danych predefiniowanych użytkowników!');

      } else if (unexistUserMessage) {
        setUnexistUserMessage('');
      }
      
      if (res.data.jwt_token) {
        const currentUser = res.data;
        props.saveCurrentUserData(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
        <label htmlFor="username" className={usernameErr ? 'error' : ''}>Nazwa użytkownika</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
          className={`input-item ${usernameErr ? 'error-underline' : ''}`}
        />

        <label htmlFor="passwd" className={passwdErr ? 'error' : ''}>Hasło</label>
        <input
          onChange={(e) => setPasswd(e.target.value)}
          type="password"
          id="passwd"
          className={`input-item ${passwdErr ? 'error-underline' : ''}`}
        />

        {unexistUserMessage && <p className="error message">{unexistUserMessage}</p>}
        {passwdErrMessage && <p className="error message">{passwdErrMessage}</p>}
        {emptyUsernameMessage && <p className="error message">{emptyUsernameMessage}</p>}

        <button type="submit" className="btn btn-submit">Zaloguj się</button>
      </form>
    </section>
  );
}