import React from 'react';

export default function LoginForm (props) {
    const action = `/${props.form}`;
    const confirmPasswordInput = (
        <span>
            <input type="password" name="confirmPassword" 
                    placeholder="Повторите пароль" required />
            <br/>
        </span>
    );
    const btnName = props.form == 'signup' ? 'Зарегистрироваться'
                                            : 'Войти';

    return (
        <form action={action} method="POST">
            <input type="text" name="username" placeholder="Введите имя, ник" required /><br/>
            <input type="password" name="password" placeholder="Введите пароль" required /><br/>
            {props.form == 'signup' && confirmPasswordInput}
            <button type="submit">{btnName}</button>
        </form>
    )
}