import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const onChange = (e) => setEmail(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent.');
        } catch (error) {
            toast.error('Could not send password reset email. Please try again.');
        }
    }

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={onSubmit} className='forgot-pwd-form'>
                <label className='forgot-pwd-label'> Email Address
                    <br/>
                    <input
                        type='email'
                        className='forgot-pwd-input'
                        id='email'
                        value={email}
                        onChange={onChange}
                    />
                </label>

                <button className='reset-btn btn-dark btn'>Send Reset Link</button>

                <Link className='forgot-password-pg-link' to='/sign-in'>
                    Go to sign in page
                </Link>
            </form>
        </div>
    )
}