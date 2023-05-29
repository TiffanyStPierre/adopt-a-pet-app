import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import{db} from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {toast} from 'react-toastify';
import {v4 as uuidv4} from 'uuid';

export default function CreateListing() {
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

        if(images.length !== 1) {
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

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
        setLoading(false);
        toast.success('Your listing has been saved');
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
            <h2>List Your Pet</h2>
            <form onSubmit={onSubmit}>
                <label>Pet Name
                    <input
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='40'
                        minLength='2'
                        required
                    />
                </label>
                <label>
                    Pet Type
                    <select name='listingPetType'
                        value={selectedPet}
                        id='type'
                        onChange={onMutate}
                        required
                    >
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="smallAnimal">Small Animal</option>
                        <option value="reptile">Reptile</option>
                    </select>
                </label>
                <label>Pet Age (years)
                    <input
                        type='number'
                        id='age'
                        min='0'
                        max='25'
                        value={age}
                        onChange={onMutate}
                        required
                    />
                </label>
                <label>City
                    <input
                        type='text'
                        id='city'
                        value={city}
                        onChange={onMutate}
                        maxLength='50'
                        minLength='5'
                        required
                    />
                </label>
                <label>
                    Province
                    <select name='listingProvince'
                        value={selectedProvince}
                        id='province'
                        onChange={onMutate}
                        required
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
                <label>Adoption Fee
                    <input
                        type='number'
                        id='fee'
                        min='0'
                        max='500'
                        value={fee}
                        onChange={onMutate}
                        required
                    />
                </label>
                <label>Pet Description
                    <input
                        type='text'
                        id='description'
                        value={description}
                        onChange={onMutate}
                        maxLength='600'
                        minLength='25'
                        required
                    />
                </label>
                <label>Upload Pet Photo (max 1)
                    <input
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='1'
                    accept='.jpg, .png, .jpeg, .webp'
                    required
                    />
                </label>
                <button type='submit' className='btn-dark'>
                    Create Pet Listing
                </button>
            </form>
        </main>
    )
}