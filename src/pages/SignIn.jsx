import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import visibilityIcon from '../assets/visibilityIcon.svg';
import OAuth from '../components/OAuth';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (userCredential.user) {
                navigate('/')
            }
        } catch (error) {
            toast.error('Incorrect user credentials. Please try again');
        }
    }

    return (
        <div className='page-container'>
            <h2>Sign In</h2>
            <div className='demo-sign-in'>
                <p className='demo-sign-in-header'>Demo Account Sign In Credentials:</p>
                <p className='demo-sign-in-info'>Email: demo@adopt-a-pet.com</p>
                <p className='demo-sign-in-info'>Password: demo1234</p>
            </div>
            <form className='sign-in-form' onSubmit={onSubmit}>
                <label className='form-label'> Email:
                    <br></br>
                    <input
                        className='email-input form-input'
                        type='email'
                        value={email}
                        onChange={onChange}
                        id='email'
                    />
                </label>
                <label className='password-label form-label'> Password:
                    <br></br>
                    <div className='password-input-container'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='password-input form-input'
                            id='password'
                            value={password}
                            onChange={onChange}
                        />
                        <img
                            className='show-password'
                            src={visibilityIcon}
                            alt='show password'
                            width='22px'
                            height='22px'
                            onClick={() => setShowPassword((prevState) => !prevState)}
                        />
                    </div>
                </label>

                <button className='sign-in-button btn-dark'>Sign In</button>
            </form>

            <OAuth />
            <div className='sign-in-page-links'>
                <Link to='/forgot-password' className='forgot-password-link'>
                    Forgot Password
                </Link>
                <Link to='/sign-up' className='sign-up-link'>
                    Click Here to Sign Up Instead
                </Link>
            </div>
        </div>
    )
}