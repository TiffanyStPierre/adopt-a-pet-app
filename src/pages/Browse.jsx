import { useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

export default function Browse() {

    const [selectedPet, setSelectedPet] = useState('all');
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState(null);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);
    const [lastListingNumber, setLastListingNumber] = useState(0);

    const fetchListings = async () => {
        try {
            // Get reference
            const listingsRef = collection(db, 'listings');

            // Create a query
            const q = query(
                listingsRef,
                where('type', '==', { selectedPet }.selectedPet),
                orderBy('timestamp', 'desc'),
                limit(8)
            );

            const q2 = query(
                listingsRef,
                orderBy('timestamp', 'desc'),
                limit(8)
            );

            // Execute query
            let querySnap;

            if (selectedPet === 'all') {
                querySnap = await getDocs(q2);
            } else {
                querySnap = await getDocs(q);
            }

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastVisible);

            const lastNumber = querySnap.docs.length;
            setLastListingNumber(lastNumber);

            console.log(lastListingNumber);
            console.log(lastFetchedListing);

            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            })

            setListings(listings);
            setLoading(false);


        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error('Could not retrieve pets. Please try again.');
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        fetchListings();
    }

    const onFetchMoreListings = async () => {
        try {
            // Get reference
            const listingsRef = collection(db, 'listings');

            // Create a query
            const q = query(
                listingsRef,
                where('type', '==', { selectedPet }.selectedPet),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(8)
            );

            const q2 = query(
                listingsRef,
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(8)
            );

            // Execute query
            let querySnap;

            if (selectedPet === 'all') {
                querySnap = await getDocs(q2);
            } else {
                querySnap = await getDocs(q);
            }

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastVisible);

            const lastNumber = querySnap.docs.length;
            setLastListingNumber(lastNumber);

            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            })

            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);


        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error('Could not retrieve pets. Please try again.');
        }
    }


    return (
        <div>
            <h2>Browse Adoptable Pets</h2>
            <form onSubmit={onSubmit}>
                <label>
                    Choose a pet type:
                    <select name='petType'
                        value={selectedPet}
                        onChange={e => setSelectedPet(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="smallAnimal">Small Animal</option>
                        <option value="reptile">Reptile</option>
                    </select>
                </label>
                <button type='submit'>Get Pets</button>
            </form>
            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <section>
                    <ul className='browse-listings-cards'>
                        {listings.map((listing) => (
                            <ListingItem
                                listing={listing.data}
                                id={listing.id}
                                key={listing.id}
                            />
                        ))}
                    </ul>
                </section>
            ) : (
                <p>No listings found.</p>
            )}
            <br/>
            <br/>
            {lastListingNumber > 7 ?
                <p className='load-more btn-dark' onClick={onFetchMoreListings}>Load More Pets</p>
                : <p></p>
            }
        </div>
    )
}