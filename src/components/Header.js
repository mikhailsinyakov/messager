import React from 'react';

export default function Header (props) {

    const greeting = <h1>Добро пожаловать{props.user && `, ${props.user}`}</h1>;
    const login = (
        <span>
            <button type="button" onClick={props.showLoginForm}>Войти</button>
            <button type="button" onClick={props.showSignupForm}>Зарегистрироваться</button>
        </span>
    );

    const logout = (
        <button type="button" onClick={loggingOut}>
            Выйти
        </button>
    );

    function loggingOut() {
        props.sendGetRequest('/logout')
                .then(() => location.reload())
                .catch(err => console.error(err));
    }

    const logging = (
        <p>
            {props.gotUsername ? props.user ? logout 
                                            : login 
                                : null}
        </p>
    );

    return (
        <header>
            {greeting}
            {logging}
        </header>
    )
}