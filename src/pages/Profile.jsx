import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Profile() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: user.displayName,
        email: user.email,
    });

    const { name, email } = formData;

    const navigate = useNavigate();

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }

    const onSubmit = async () => {
        try {
            if (user.displayName !== name) {
                //Update display name in Firebase
                await updateProfile(user, {
                    displayName: name
                });

                //Update in Firestore
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Could not update profile details. Please try again.')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <div className='profile-page'>
            <h2>My Profile</h2>
            <button className='logout btn-dark' type='button' onClick={onLogout}>Log Out</button>

            <section>
                <div>
                    <h3>Profile Details</h3>
                    <p className='change-personal-details' onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ? 'Done' : 'Change Name'}
                    </p>
                </div>
                <div className='profile-card'>
                    <form>
                        <input
                        id='name'
                        type='text'
                        className={!changeDetails ? 'profile-name' : 'profile-name-active'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                        />
                        <input
                        id='email'
                        type='text'
                        className='profile-email'
                        disabled='true'
                        value={email}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className='create-listing-link'>
                    Create A New Pet Listing
                </Link>
            </section>
        </div>
    )
}