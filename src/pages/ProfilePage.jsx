import { getAuth, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { HiArrowRightCircle } from "react-icons/hi2";
import ListingItem from '../components/ListingItem';

export default function ProfilePage() {

  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const {name, email} = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onsubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        });
        toast.success('Profile details updated');
      }
      
    } catch (error) {
      toast.error("Could not update the profile details")
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingId) {
    if(window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updateListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updateListings)
      toast.success('Successfully deleted the listing');
    }
  }

  function onEdit(listingId) {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <>
      <section>
      <h1 className="text-3xl text-center mt-6 font-bold">
       Profile & Settings
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[60%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
        </div>
        <div className="w-full md:w-[60%] lg:w-[40%] lg:ml-20">
          <form>
         
            <input
              className="w-full mb-6 rounded-3xl px-4 py-2 text-xl text-red-700 bg-white"
              type="email"
              id="email"
              value={email} disabled 
              placeholder="Email address (*)"
            />

            <input
              className={`mb-6 w-full rounded-3xl px-4 py-2 text-xl text-gray-700 bg-white ${changeDetail && "bg-red-200 focus:bg-red-200"}`}
              id="name"
              value={name} disabled={!changeDetail} onChange={onChange}
              placeholder="Full name (*)"
            />
          
            <br/>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-sm">
                <p className="mb-6">Do you want to change your name?
                  <span onClick={() => {
                      changeDetail && onsubmit();
                      setChangeDetail((prevState) => !prevState)
                    }} 
                   className="text-blue-600 hover:text-blue-700
                  transition duration-200 ease-in-out ml-3" >{changeDetail ? "Apply change" : "Update Account"}</span>
                </p>
            </div>
            <button className="w-full bg-lime-700 text-white px-7 py-3
            text-sm font-medium rounded shadow-md hover: bg-lime-800
           transition duration-150 ease-in-out hover:shadow-lg active:bg-lime-900" type="submit">
           <Link to='/sells' className='flex justify-center items-center'>
                    <HiArrowRightCircle className='mr-2 text-3xl bg-black-200 rounded-full p-1 border-2'/>
             Sell on Booking.com
            </Link>
           </button>              
          </form>
          <br></br>
          <button onClick={onLogout} className="w-full bg-red-700 text-white px-7 py-3
            text-sm font-medium uppercase rounded shadow-md hover: bg-red-800
            transition duration-150 ease-in-out hover:shadow-lg active:bg-red-900" type="submit">
            Log out</button>       
        </div>
      </div>
    </section>
    <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mb-6'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
