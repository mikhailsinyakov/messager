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

    const { username, friendRequestsInfo, numUnreadMessages } = props;
    const numWaitingUsers = friendRequestsInfo.usersWaitingForAnswer.length;
    const areWaitingUsers = !!numWaitingUsers;

    const links = (
        <ul>
            <li><Link to={`/users/${username}/info`} >Моя страница</Link></li>
            <li>
                <Link to={`/users/${username}/friends`}>
                    Мои друзья {areWaitingUsers && `(${numWaitingUsers})`}
                </Link>
            </li>
            <li>
                <Link to={`/users/${username}/dialogs`}>
                    Сообщения {!!numUnreadMessages && `(${numUnreadMessages})`}
                </Link>
            </li>
            <li><Link to={`/users/${username}/settings`} >Настройки</Link></li>
            <li><Link to='/users'>Поиск</Link></li>
            <li><a href='/api/logout'>Выйти</a></li>
        </ul>
    );

    const nav = (
        <nav>
            { props.username ? links : login }
        </nav>
    );

    return (
        <header>
            {appName}
            {nav}
        </header>
    )
}