import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

export default function Home() {

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            // Get reference
            const listingsRef = collection(db, 'listings');

            // Create a query
            const q = query(
                listingsRef,
                orderBy('timestamp', 'desc'),
                limit(3)
            );

            // Execute query
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            })

            setListings(listings);
            setLoading(false);
            console.log(listings);
        }

        fetchListings();
    }, [])

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <h2>Check Out Our Featured Pets</h2>
            <ul className='browse-listings-cards'>
                {listings.map((listing) => (
                    <ListingItem
                        listing={listing.data}
                        id={listing.id}
                        key={listing.id}
                    />
                ))}
            </ul>

            <p>We facilitate responsible pet adoption by providing both individuals and rescue organizations a platform to post adoptable pet photos and information</p>
            <p>Potential pet adopters can browse or search our adoptable pet listings to find their new forever furry family member.</p>
            <Link to='/browse' className='btn-dark'>View adoptable pets</Link>
        </div>
    )
}