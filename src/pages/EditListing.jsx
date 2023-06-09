import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, getDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

export default function EditListing() {
    const [listing, setListing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        age: 0,
        city: '',
        province: '',
        description: '',
        fee: 0,
        images: [],
    });
    const [selectedPet, setSelectedPet] = useState('dog');
    const [selectedProvince, setSelectedProvince] = useState('AB');

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const params = useParams();

    //Redirect if listing is not user's listing
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('You do not have access to edit this listing');
            navigate('/');
        }
    })

    //Fetch listing to edit
    useEffect(() => {
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false);
            } else {
                navigate('/');
                toast.error('Sorry this listing no longer exists');
            }
        }

        fetchListing();
    }, [params.listingId, navigate])

    const { name, age, city, description, fee, images } = formData;

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                } else {
                    navigate('/sign-in')
                }
            });
        }

        return () => {
            isMounted.current = false;
        }

    }, [isMounted])

    if (loading) {
        return <Spinner />
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (images.length !== 1) {
            setLoading(false);
            toast.error('Only 1 image may be uploaded for each pet')
            return
        }

        // Store image in Firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                )
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false);
            toast.error('Image not uploaded. Please try again.');
            return
        })

        console.log(imgUrls);

        const formDataCopy = {
            ...formData,
            imgUrls,
            timestamp: serverTimestamp(),
            province: selectedProvince,
            type: selectedPet,
        }

        delete formDataCopy.images;

        // Update listing
        const docRef = doc(db, 'listings', params.listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success('Listing has been updated');
        navigate(`/${docRef.id}`);
    }

    const onMutate = e => {
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }

        if (e.target.id === 'type') {
            setSelectedPet(e.target.value)
        }

        if (e.target.id === 'province') {
            setSelectedProvince(e.target.value)
        }

        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.value,
            }))
        }
    }

    return (
        <main>
            <h2>Edit Your Listing</h2>
            <form onSubmit={onSubmit} className="edit-listing-form">
                <div className='edit-listing-container'>
                    <label className='edit-listing-label'>Pet Name
                        <br />
                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={onMutate}
                            maxLength='40'
                            minLength='2'
                            required
                            className='edit-listing-input'
                        />
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>
                        Pet Type
                        <br />
                        <select name='listingPetType'
                            value={selectedPet}
                            id='type'
                            onChange={onMutate}
                            required
                            className='edit-listing-input'
                        >
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="bird">Bird</option>
                            <option value="smallAnimal">Small Animal</option>
                            <option value="reptile">Reptile</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>Pet Age (years)
                        <br />
                        <input
                            type='number'
                            id='age'
                            min='0'
                            max='25'
                            value={age}
                            onChange={onMutate}
                            required
                            className='edit-listing-input'
                        />
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>City
                        <br />
                        <input
                            type='text'
                            id='city'
                            value={city}
                            onChange={onMutate}
                            maxLength='50'
                            minLength='5'
                            required
                            className='edit-listing-input'
                        />
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>
                        Province
                        <br />
                        <select name='listingProvince'
                            value={selectedProvince}
                            id='province'
                            onChange={onMutate}
                            required
                            className='edit-listing-input'
                        >
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Maintoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland</option>
                            <option value="NT">Northwest Territories</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="NU">Nunavut</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                            <option value="YT">Yukon</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>Adoption Fee
                        <br />
                        <input
                            type='number'
                            id='fee'
                            min='0'
                            max='500'
                            value={fee}
                            onChange={onMutate}
                            required
                            className='edit-listing-input'
                        />
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>Pet Description
                        <br />
                        <textarea
                            type='text'
                            id='description'
                            value={description}
                            onChange={onMutate}
                            maxLength='600'
                            minLength='25'
                            required
                            rows='10'
                            cols='60'
                            className='edit-listing-input'
                        />
                    </label>
                    <br />
                    <br />
                    <label className='edit-listing-label'>Upload Pet Photo (max 1)
                        <br />
                        <input
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='1'
                            accept='.jpg, .png, .jpeg, .webp'
                            required
                            className='edit-listing-input'
                        />
                    </label>
                </div>
                <button type='submit' className='btn-dark btn update-listing-btn'>
                    Update Listing
                </button>
            </form>
        </main>
    )
}