"use client";
import '@fontsource-variable/jost';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import "@/styles/ProductsHorizontalGrid.css";

const ProductsHorizontalGrid = ({ categoryTag, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState({});
  const scrollRef = useRef(null);
  const itemRefs = useRef({});
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const router = useRouter();

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
          where('category', 'array-contains', categoryTag)
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
  }, [categoryTag]);

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

  const handleCardClick = (productId) => {
    router.push(`/product/${productId}`);
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
    <div className="products-scroll-wrapper position-relative">
      <motion.h1
        ref={headingRef}
        style={{ fontFamily: "Jost Variable", fontWeight: "400" }}
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={headingVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.9 }}
      >
        {title}
      </motion.h1>

      <button className="scroll-btn left" onClick={() => scroll('left')}>⬅</button>
      <button className="scroll-btn right" onClick={() => scroll('right')}>➡</button>

      <div className="horizontal-scroll-container" ref={scrollRef}>
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
            <motion.div
              style={{ backgroundColor: "#F7F7F7" }}
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
              <div className="card custom-card">
                {product.photo && (
                  <Image
                    style={{ backgroundColor: "#F7F7F7", width:"auto" }}
                    src={product.photo[0].url} // Firebase returns array
                    alt={product.title}
                    width={300}
                    height={300}
                    className=""
                    unoptimized
                  />
                )}
                <div className="card-body" style={{ backgroundColor: "#F7F7F7" }}>
                  <motion.h5
                    className="card-title"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: "Jost Variable"
                    }}
                    animate={visibleItems[product.id] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9 }}
                  >
                    {product.title || 'Untitled'}
                  </motion.h5>

                  <motion.p
                    animate={visibleItems[product.id] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    style={{ fontFamily: "Jost Variable" }}
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

export default ProductsHorizontalGrid;
