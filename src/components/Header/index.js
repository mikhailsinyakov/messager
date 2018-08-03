'use strict';

import React from 'react';
import {Link} from 'react-router-dom';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAppName: true
        };
        this.prevScrollY = 0;
        this.headerRef = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll() {
        const { showAppName } = this.state;
        const headerElem = this.headerRef.current;
        const halfHeaderHeight = headerElem.getBoundingClientRect().height / 2;
        if (window.scrollY - halfHeaderHeight > 0 && this.state.showAppName) {
            this.setState({showAppName: false});
        }
        else if (window.scrollY - halfHeaderHeight < 0 && !this.state.showAppName) {
            this.setState({showAppName: true});
        }

        if (window.scrollY > this.prevScrollY && window.scrollY > halfHeaderHeight) {
            headerElem.style.visibility = 'hidden';
        }
        else {
            headerElem.style.visibility = 'visible';
        }
        this.prevScrollY = window.scrollY;
    }

    componentDidMount() {
        window.onscroll = this.handleScroll;
        const headerHeight = this.headerRef.current.getBoundingClientRect().height;
        this.props.setHeaderHeight(headerHeight);
        window.onresize = () => {
            const headerHeight = this.headerRef.current.getBoundingClientRect().height;
            this.props.setHeaderHeight(headerHeight);
        }
    }

    componentDidUpdate() {
        const headerHeight = this.headerRef.current.getBoundingClientRect().height;
        this.props.setHeaderHeight(headerHeight);
    }

    componentWillUnmount() {
        window.onscroll = null;
    }

    render() {
        const { username, friendRequestsInfo, numUnreadMessages } = this.props;
        const numWaitingUsers = friendRequestsInfo.usersWaitingForAnswer.length;
        const areWaitingUsers = !!numWaitingUsers;


        const appName = <h1>Мессенджер</h1>;

        const login = (
            <ul>
                <li><Link to='/login'>Войти</Link></li>
                <li><Link to='/signup'>Зарегистрироваться</Link></li>
            </ul>
        );

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
                { username ? links : login }
            </nav>
        );
        const headerClassName = !this.state.showAppName ? 'onlyNav' : undefined;

        return (
            <header ref={this.headerRef} className={headerClassName}>
                {this.state.showAppName && appName}
                {nav}
            </header>
        );
    }
    
}