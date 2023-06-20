import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

export default function Contact() {

    const [message, setMessage] = useState('');
    const [lister, setLister] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useParams();

    useEffect(() => {
        const getLister = async () => {
            const docRef = doc(db, 'users', params.listerId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLister(docSnap.data());
            } else {
                toast.error('Could not get lister contact information')
            }
        }

        getLister();
    }, [params.listerId])

    const onChange = e => setMessage(e.target.value);
    const onClick = e => document.getElementById('message').value = '';

    return (
        <div>
            <h2>Contact Listing Owner</h2>

            {lister !== null && (
                <main className='contact-page'>
                    <div>
                        <p className='contact-name'>{`Contact ${lister?.name} about ${searchParams.get('listingName')}`}</p>
                    </div>
                    <form>
                        <div>
                            <label className='contact-message-label'>
                                Message:
                                <br />
                                <textarea
                                    name='message'
                                    id='message'
                                    className='text-area contact-message-text'
                                    value={message}
                                    onChange={onChange}
                                    autoFocus
                                    required
                                    cols='60'
                                    rows='15'
                                ></textarea>
                            </label>
                        </div>

                        <a href={`mailto:${lister.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button type='button' className='btn-dark btn contact-btn' onClick={onClick}>Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>


    )
}