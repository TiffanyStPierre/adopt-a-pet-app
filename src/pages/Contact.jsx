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

    return (
        <div>
            <h2>Contact Listing Owner</h2>

            {lister !== null && (
                <main>
                    <div>
                        <p>Contact {lister?.name}</p>
                    </div>
                    <form>
                        <div>
                            <label>
                                Message:
                                <textarea
                                    name='message'
                                    id='message'
                                    className='text-area'
                                    value={message}
                                    onChange={onChange}
                                ></textarea>
                            </label>
                        </div>

                        <a href={`mailto:${lister.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button type='button' className='btn-dark'>Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>


    )
}