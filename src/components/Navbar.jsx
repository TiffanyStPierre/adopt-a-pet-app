import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div className='navbar-container'>
            <ul className='navbar-list'>
                <li className='navbar-list-item' onClick={() => navigate('/browse')}>
                    Browse Pets
                </li>
                <li className='navbar-list-item' onClick={() => navigate('/create-listing')}>
                    List Your Pet
                </li>
                <li className='navbar-list-item' onClick={() => navigate('/how-it-works')}>
                    How It Works
                </li>
            </ul>
        </div>
    )
}