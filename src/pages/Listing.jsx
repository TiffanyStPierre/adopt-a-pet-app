import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/shareIcon.svg';

export default function Listing() {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data());
                setLoading(false);
            }
        }

        fetchListing();
    }, [navigate, params.listingId])

    if (loading) {
        return <Spinner />;
    }

    if (!listing) {
        return <p>Sorry, no listing was found.</p>
    }

    return (
        <main>
            <div className='listing-details'>
                <h2 className='listing-name'>{listing.name}</h2>
                <p className='listing-location'>{listing.city}, {listing.province}</p>
                <img
                    src={listing.imgUrls[0]}
                    alt={listing.name}
                    className='pet-listing-img'
                />
                <p className='listing-age'>{`${listing.age} year old ${listing.type}`}</p>
                <p className='listing-fee'>{`Adoption fee: $${listing.fee}`}</p>
                <p className='listing-description'>{listing.description}</p>
            </div>

            <div className='listing-page-buttons'>
                <div className='share-link-container'>
                    <div className='share-icon-div' onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareLinkCopied(true);
                        setTimeout(() => {
                            setShareLinkCopied(false);
                        }, 2000)
                    }}>
                        <img src={shareIcon} alt='Share icon' />
                        <p>Share Listing</p>
                    </div>

                    {shareLinkCopied && <p className='link-copied'>Link Copied!</p>}
                </div>

                {auth.currentUser?.uid !== listing.userRef && <Link to={`/contact/${listing.userRef}?listingName=${listing.name}?listingId=${params.listingId}`}
                    className='btn-dark link-btn btn contact-btn'>
                    Contact Lister
                </Link>}
            </div>
        </main>
    )
}