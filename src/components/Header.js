'use strict';

import React from 'react';
import {Link} from 'react-router-dom';

export default function Header (props) {

    const appName = <h1>Мессенджер</h1>;
    const login = (
        <ul>
            <li><Link to='/login'>Войти</Link></li>
            <li><Link to='/signup'>Зарегистрироваться</Link></li>
        </ul>
    );

    const links = (
        <ul>
            <li><Link to='/settings'>Настройки</Link></li>
            <li><a href='/logout'>Выйти</a></li>
        </ul>
    );

    const nav = (
        <nav>
            {props.updated ? props.username ? links 
                                        : login
                            : null}
        </nav>
    );

    return (
        <header>
            {appName}
            {nav}
        </header>
    )
}