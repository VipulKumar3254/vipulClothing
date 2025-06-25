import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
// import { db } from './firebase'; // make sure to import your firebase config
import { db } from '../../../firebaseConfig';
import { collection, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null); // Replace with your user context or authentication method
    const naviate= useNavigate();
      const handleClick = (product) => {
          naviate(`/product/productDesc/${product}`)
      }


       useEffect(() => {
              const auth = getAuth();
              onAuthStateChanged(auth, (user) => {
                  setUser(user ? user : null);

              });
          }, []);
  

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Fetch wishlist items
        const wishlistRef = collection(db, `users/${user.uid}/wishList`);
        const wishlistSnap = await getDocs(wishlistRef);

        const items = wishlistSnap.docs.map(doc => ({
          productId: doc.id,
          ...doc.data(),
        }));

        setWishlistItems(items);
        console.log('Wishlist items:', items);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (user && user.uid) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemoveFromWishlist = async (productId) => {
    const toastId = toast.loading('Removing from wishlist...');

    try {
      // Remove item from wishlist
      const itemRef = doc(db, `users/${user.uid}/wishList`, productId);
      await deleteDoc(itemRef);

      // Update local state
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
      toast.success('Removed successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to remove item.', { id: toastId });
      console.error('Error removing item from wishlist:', error);
    }
  }
  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Wishlist</h2>
      <div className="row">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <div onClick={()=>{ handleClick(item.productId)}}  className="col-md-3 col-sm-6 mb-4" key={item.productId}>
              <div className="card">
                <img src={item.photo} alt={item.title} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.price}</p>
                </div>
              <div className='pb-3 ms-2'>
              <button onClick={(e)=>{ e.stopPropagation(); handleRemoveFromWishlist(item.productId)}} className="btn btn-primary">remove</button>
              </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No items in your wishlist.</p>
          </div>
        )}
      </div>
      <Toaster position="bottom-left"  />
    </div>
  );
};

export default WishList;
