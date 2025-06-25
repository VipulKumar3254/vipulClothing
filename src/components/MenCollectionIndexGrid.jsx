import "@fontsource/archivo"

import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { motion } from 'framer-motion';
import '../css/MenCollectionIndexGrid.css';
import { useNavigate } from 'react-router-dom';

const MenCollectionIndexGrid = ({categoryTag,title}) => {
  console.log("from mens collection",categoryTag);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState({});
  const scrollRef = useRef(null);
  const itemRefs = useRef({});

  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const navigate= useNavigate();

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => setHeadingVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (headingRef.current) headingObserver.observe(headingRef.current);
    return () => headingObserver.disconnect();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('category', 'array-contains',categoryTag)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const scrollContainer = scrollRef.current;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [collection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-id');
          setVisibleItems(prev => ({
            ...prev,
            [id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.3 }
    );

    Object.values(itemRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products]);

  const handleCardClick = (product) => {
        navigate(`/product/productDesc/${product}`)

  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mt-3 products-scroll-wrapper position-relative">
      <motion.h1
        ref={headingRef} style={{fontFamily:"archivo"}}
        className="mb-4 text-uppercase text-center fw-medium"
        initial={{ opacity: 0, y: -20 }}
        animate={headingVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.9 }}
      >
       {title}
      </motion.h1>

      <button className="scroll-btn left" onClick={() => scroll('left')}>
        ⬅
      </button>
      <button className="scroll-btn right" onClick={() => scroll('right')}>
        ➡
      </button>

      <div className="horizontal-scroll-container  " ref={scrollRef}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <motion.div 
              key={idx}
              className="product-card-wrapper"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
            >
              <div className="card h-100 custom-card placeholder-card">
                <div className="card-img-top placeholder-img"></div>
                <div className="card-body">
                  <div className="placeholder-text mb-2"></div>
                  <div className="placeholder-text short"></div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          products.map((product, index) => (
            <motion.div style={{backgroundColor:"#F7F7F7"}}
              key={product.id}
              className="product-card-wrapper"
              ref={el => itemRefs.current[product.id] = el}
              data-id={product.id}
              onClick={() => handleCardClick(product.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="card h-100 custom-card">
                {product.photo && (
                  <img style={{backgroundColor:"#F7F7F7"}}
                    src={product.photo}
                    alt={product.title}
                    className="card-img-top img-fluid"
                  />
                )}
                <div className="card-body" style={{backgroundColor:"#F7F7F7"}}>
                  <motion.h5
                    className="card-title"
                    animate={visibleItems[product.id] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9 }}
                  >
                    {product.title || 'Untitled'}
                  </motion.h5>
                  <motion.p
                    animate={visibleItems[product.id] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                  >
                    Rs. {product.price}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenCollectionIndexGrid;
