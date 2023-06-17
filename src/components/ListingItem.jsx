import { Link } from 'react-router-dom';
import {ReactComponent as DeleteIcon} from '../assets/deleteIcon.svg';
import {ReactComponent as EditIcon} from '../assets/editIcon.svg';

export default function ListingItem({ listing, id, onDelete, onEdit }) {
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

            {onDelete && (
                <DeleteIcon
                    className='remove-icon'
                    fill='rgb(231, 76, 60)'
                    onClick={() => onDelete(listing.id, listing.name, listing.imgUrls)}
                />
            )}

            {onEdit && (
                <EditIcon
                    className='edit-icon'
                    onClick={() => onEdit(id)}
                
                />
            )}
        </li>
    )
}