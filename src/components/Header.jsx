import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { ReactComponent as PawIcon } from '../assets/paw-icon.svg';

export default function Header() {
    const navigate = useNavigate();

    return (
        <div>
            <ul className='header-button-list'>
                <li className='header-button btn-dark' onClick={() => navigate('/sign-up')}>
                    Sign Up
                </li>
                <li className='header-button btn-light' onClick={() => navigate('/sign-in')}>
                    Log In
                </li>
            </ul>
            <div className='header-h1'>
                <h1 onClick={() => navigate('/')}>Adopt-A-Pet</h1>
            </div>
            <div className='paw-prints'>
                <PawIcon />
            </div>
            <Navbar />
        </div>
    )
}