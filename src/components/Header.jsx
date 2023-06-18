import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from './Navbar';
import { ReactComponent as PawIcon } from '../assets/paw-icon.svg';
import pawsImg from '../assets/header-paws.webp';
export default function Header() {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }

    return (
        <div>
            {user == null ?
                <ul className='header-button-list'>

                    <li className='header-button btn-dark btn' onClick={() => navigate('/sign-up')}>
                        Sign Up
                    </li>
                    <li className='header-button btn-light btn' onClick={() => navigate('/sign-in')}>
                        Log In
                    </li>
                </ul>
                :
                <ul className='header-button-list'>
                    <li className='header-button btn-dark btn' onClick={() => navigate('/profile')}>
                        View Profile
                    </li>
                    <li className='header-button btn-light btn' onClick={onLogout}>
                        Log Out
                    </li>
                </ul>}
            <div className='header-h1'>
                <h1 onClick={() => navigate('/')}>Adopt-A-Pet</h1>
            </div>
            <div className='paw-prints'>
                <div className='paw-prints-cover'>
                </div>
            </div>
            <Navbar />
        </div>
    )
}