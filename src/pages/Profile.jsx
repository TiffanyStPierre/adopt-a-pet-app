import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { toast } from 'react-toastify';

export default function Profile({ listing }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: user.displayName,
        email: user.email,
    });

    const { name, email } = formData;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));

            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchUserListings();
    }, [auth.currentUser.uid])

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

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            await deleteDoc(doc(db, 'listings', listingId));
            const updatedListings = listings.filter((listing) =>
                listing.id !== listingId);
            setListings(updatedListings);
            toast.success('Successfully deleted listing')
        }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

    return (
        <div className='profile-page'>
            <h2>My Profile</h2>

            <section>

                <div className='profile-card'>
                    <h3>Profile Details</h3>
                    <form className='profile-form-data'>
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
                            disabled={true}
                            value={email}
                        />
                    </form>
                    <div className='profile-update-buttons'>
                        <p className='profile-update-btn btn btn-light' onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails((prevState) => !prevState)
                        }}>
                            {changeDetails ? 'Done' : 'Update Name'}
                        </p>
                        <button
                            onSubmit={onSubmit}
                            className='btn btn-dark profile-update-btn'
                        >Save Changes
                        </button>
                    </div>
                </div>

                {!loading && listings?.length > 0 && (
                    <div className='profile-listings-container'>
                        <p className='profile-listings-header'>My Listings</p>
                        <ul className='profile-listings'>
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id, listing.imgUrls)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
                <div className='profile-listing-buttons'>
                    <Link to='/create-listing' className='profile-listing-btn btn-dark btn link-btn'>
                        Create New Listing
                    </Link>
                    <button className='btn-light btn profile-listing-btn' type='button' onClick={onLogout}>Log Out</button>
                </div>
            </section>
        </div>
    )
}