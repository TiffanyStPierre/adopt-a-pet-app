import {Link} from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h2>Check Out Our Featured Pets</h2>

            <p>We facilitate responsible pet adoption by providing both individuals and rescue organizations a platform to post adoptable pet photos and information</p>
            <p>Potential pet adopters can browse or search our adoptable pet listings to find their new forever furry family member.</p>
            <Link to='/browse' className='btn-dark'>View adoptable pets</Link>
        </div>
    )
}