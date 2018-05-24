import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import LoginForm from './LoginForm';

export default function Main (props) {

    const isLoggedInOrUnknown = props.updated ? props.user ? true 
                                                           : false
                                              : true;

    return (
        <main>
            <Route exact path='/' render={() => (
                isLoggedInOrUnknown ? null
                                    : <Redirect to='/login'/>
            )}/>
            <Switch>
                <Route exact path='/login' render={() => (
                    !isLoggedInOrUnknown ? (<LoginForm formType='login'
                                                        getUsername={props.getUsername}/>)
                                            : <Redirect to='/'/>
                )}/>
                <Route exact path='/signup' render={() => (
                    !isLoggedInOrUnknown ? (<LoginForm formType='signup'
                                                        getUsername={props.getUsername}/>)
                                            : <Redirect to='/'/>
                )}/>
            </Switch>
        </main>
    );
}