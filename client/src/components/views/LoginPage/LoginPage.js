import React, {useState} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch()

    //email state
    const [Email, setEmail] = useState("")
    //password state
    const [Password, setPassword] = useState("")

    //value change handler
    const onEmaileHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }

        // 로그인 성공하면 '/' 페이지로 이동
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert("Error")
                }
            })
        
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height:'100vh'
        }}>
            <form style={{
                display: 'flex', flexDirection: 'column'
            }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmaileHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>login</button>
            </form>
        </div>
    )
}

export default LoginPage
