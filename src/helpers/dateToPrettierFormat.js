'use strict';

export default function dateToPrettierFormat(date) {


    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    const thisDay = now.getDate();

    const addNullToNumber = num => num.toString().padStart(2, '0');
    let day;

    if (dateYear == thisYear && dateMonth == thisMonth && dateDay == thisDay) {
        day = 'Сегодня';
    }
    else if (dateYear == thisYear) {
        day = `${addNullToNumber(dateDay)}-${addNullToNumber(dateMonth + 1)}`;
    }
    else {
        day = `${addNullToNumber(dateDay)}-${addNullToNumber(dateMonth + 1)}-${dateYear}`;
    }
    
    const time = `${addNullToNumber(dateHours)}:${addNullToNumber(dateMinutes)}`;

    return `${day} ${time}`;
}