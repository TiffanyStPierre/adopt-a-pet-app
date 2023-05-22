import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase.config';
import {toast} from 'react-toastify';
import googleIcon from '../assets/googleIcon.svg';

export default function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            //Check for user
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            //If user doesn't exist, create user in database
            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }
            navigate('/');
        } catch (error) {
            toast.error('Could not authorize with Google. Please try again or sign up with email and password.')
        }
    }

    return (
        <div className='social-login'>
            <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
            <button className='social-icon-div' onClick={onGoogleClick}>
                <img className='social-icon-img' src={googleIcon} alt='Google' />
            </button>
        </div>
    )
}