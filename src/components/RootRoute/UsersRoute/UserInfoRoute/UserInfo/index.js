'use strict';

import React from 'react';

export default function UserInfo (props) {
    const { username, firstName, lastName, phoneNumber,
        city, birthDate, aboutYourself, isUserOnline} = props;

    return (
        <div id="userInfo">
            <img src={`/public/photos/${username}-avatar.jpg`}
                height={200}
                onError={e => e.target.src = '/public/photos/placeholder.png'}/>
            {isUserOnline && <p>Online</p>}
            <p><b>Ник:</b> {username}</p>
            {firstName && <p><b>Имя:</b> {firstName}</p>}
            {lastName && <p><b>Фамилия:</b> {lastName}</p>}
            {phoneNumber && <p><b>Номер телефона:</b> {phoneNumber}</p>}
            {city && <p><b>Город:</b> {city}</p>}
            {birthDate && <p><b>Дата рождения:</b> {birthDate}</p>}
            {aboutYourself && <p><b>О себе:</b> {aboutYourself}</p>}
        </div>
    );
}