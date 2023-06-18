import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase.config';
import visibilityIcon from '../assets/visibilityIcon.svg';
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const { name, email, password } = formData;

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: name
            });

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            navigate('/')

        } catch (error) {
            toast.error('Unable to create account. Please try again.');
            console.log(error);
        }
    }

    return (
        <div className='page-container'>
            <h2>Sign Up</h2>
            <form className='sign-in-form' onSubmit={onSubmit}>
            <label className='form-label'> Name:
                    <br></br>
                    <input
                        className='name-input form-input'
                        type='name'
                        id='name'
                        value={name}
                        onChange={onChange}
                    />
                </label>
                <label className='form-label'> Email:
                    <br></br>
                    <input
                        className='email-input form-input'
                        type='email'
                        id='email'
                        value={email}
                        onChange={onChange}
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

                <button className='sign-in-button btn-dark btn'>Sign Up</button>
            </form>

            <OAuth />
            <div className='sign-in-page-links'>
                <Link to='/forgot-password' className='forgot-password-link'>
                    Forgot Password
                </Link>
                <Link to='/sign-in' className='sign-up-link'>
                    Click Here to Sign In Instead
                </Link>
            </div>
        </div>
    )
}