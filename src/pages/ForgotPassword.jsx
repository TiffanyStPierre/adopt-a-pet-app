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
            <form onSubmit={onSubmit}>
                <input
                    type='email'
                    className='email-input'
                    placeholder='email'
                    id='email'
                    value={email}
                    onChange={onChange}
                />
                <Link className='forgot-password-link' to='/sign-in'>
                    Go to sign in page
                </Link>

                <button className='reset-button btn-dark'>Send Reset Link</button>
            </form>
        </div>
    )
}