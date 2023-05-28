import { Link } from 'react-router-dom';

export default function ListingItem({ listing, id }) {
    return (
        <li className='pet-listing-card'>
            <Link
                to={`/${id}`}
                className='pet-listing-link'
            >
                <img
                    src={listing.imgUrls[0]}
                    alt={listing.name}
                    className='pet-listing-card-img'
                />
                <div className='pet-listing-card-text'>
                    <h3 className='pet-listing-card-name'>{listing.name}</h3>
                    <p>{`${listing.city}, ${listing.province}`}</p>
                </div>
            </Link>
        </li>
    )
}