'use strict';

import React from 'react';

export default function UserInfo (props) {
    const { username, firstName, lastName, phoneNumber,
        city, birthDate, aboutYourself, onlineUsers} = props;

    const isUserOnline = (() => !!onlineUsers.filter(user => user == username).length)();

    return (
        <div className="user-data">
            <img className="user-avatar" src={`/public/photos/${username}-avatar.jpg`}
                onError={e => e.target.src = '/public/photos/placeholder.png'}/>
            {isUserOnline && <span className='online'>Online</span>}
            <div className="user-info">
                <p><span className="name">Ник:</span>{username}</p>
                {firstName && <p><span className="name">Имя:</span>{firstName}</p>}
                {lastName && <p><span className="name">Фамилия:</span>{lastName}</p>}
                {phoneNumber && <p><span className="name">Номер телефона:</span>{phoneNumber}</p>}
                {city && <p><span className="name">Город:</span>{city}</p>}
                {birthDate && <p><span className="name">Дата рождения:</span>{birthDate}</p>}
                {aboutYourself && <p><span className="name">О себе:</span>{aboutYourself}</p>}
            </div>
        </div>
    );
}