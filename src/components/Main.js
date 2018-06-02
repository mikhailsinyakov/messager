import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import LoginForm from './LoginForm';
import Settings from './Settings';

export default function Main (props) {

    const isLoggedInOrUnknown = props.updated ? props.username ? true 
                                                           : false
                                              : true;

    return (
        <main>
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
                <Route path='/' render={() => (
                    isLoggedInOrUnknown ? null
                                        : <Redirect to='/login'/>
                )}/>
            </Switch>
            <Route exact path='/settings' render={() => <Settings username={props.username}
                                                            sendGetRequest={props.sendGetRequest}/>}/>
        </main>
    );
}