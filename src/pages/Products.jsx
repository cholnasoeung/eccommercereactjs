import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaHeadset, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  // --- Hero Slider Data ---
  const slides = [
    {
      title: "Level Up Your Gaming Setup",
      subtitle: "Get up to 40% off on premium mechanical keyboards, mice, and monitors.",
      link: "/?category=Gaming",
      btnText: "Shop Gaming",
      bg: "linear-gradient(135deg, #1e1e2d 0%, #2c3552 100%)",
      badge: "New Arrivals 2026"
    },
    {
      title: "Work & Play Without Limits",
      subtitle: "Discover the latest high-performance laptops designed for productivity and entertainment.",
      link: "/?category=Laptop",
      btnText: "Shop Laptops",
      bg: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      badge: "Top Rated"
    },
    {
      title: "Immerse Yourself in Sound",
      subtitle: "Studio-quality headphones and speakers. Feel every beat with crystal clear audio.",
      link: "/",
      btnText: "Shop Audio",
      bg: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
      badge: "Best Sellers"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);

  // --- Products Data & Logic ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products', {
      params: { search: searchQuery, category: categoryQuery, page: page, size: 8 }
    })
      .then(response => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [searchQuery, categoryQuery, page]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, categoryQuery]);

  const handleCategoryClick = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName) newParams.set('category', categoryName);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  return (
    <div className="home-container fade-in">
      
      {/* DYNAMIC HERO SLIDER */}
      {!searchQuery && !categoryQuery && (
        <>
          <div className="hero-slider-container">
            {/* The sliding track */}
            <div 
              className="hero-slider-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="hero-slide" style={{ background: slide.bg }}>
                  <div className="hero-shape shape-1"></div>
                  <div className="hero-shape shape-2"></div>
                  
                  <div className="hero-content">
                    <span className="hero-badge pulse-anim">{slide.badge}</span>
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <Link to={slide.link} className="hero-btn hover-grow">
                      {slide.btnText} <FaArrowRight className="arrow-icon" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Arrows */}
            <button className="slider-arrow left" onClick={prevSlide}><FaChevronLeft /></button>
            <button className="slider-arrow right" onClick={nextSlide}><FaChevronRight /></button>

            {/* Slider Dots */}
            <div className="slider-dots">
              {slides.map((_, index) => (
                <div 
                  key={index} 
                  className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
          </div>

          {/* PROMO FEATURES */}
          <div className="promo-features">
            <div className="promo-item hover-lift">
              <div className="promo-icon-bg"><FaTruck size={24} color="#f59e0b" /></div>
              <div>
                <h4>Fast Delivery</h4>
                <p>Within 1 hour in the city</p>
              </div>
            </div>
            <div className="promo-item hover-lift">
              <div className="promo-icon-bg"><FaShieldAlt size={24} color="#f59e0b" /></div>
              <div>
                <h4>1 Year Warranty</h4>
                <p>100% genuine products</p>
              </div>
            </div>
            <div className="promo-item hover-lift">
              <div className="promo-icon-bg"><FaHeadset size={24} color="#f59e0b" /></div>
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated customer care</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN LAYOUT */}
      <div className="page-wrapper">
        <div className="sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            <li 
              className={`category-item ${categoryQuery === '' ? 'active-category' : ''}`}
              onClick={() => handleCategoryClick('')}
            >
              All Products <span className="chevron">›</span>
            </li>
            {categories.map((cat) => (
              <li 
                key={cat.id} 
                className={`category-item ${categoryQuery === cat.name ? 'active-category' : ''}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name} <span className="chevron">›</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <div className="breadcrumb">
            Home / <span>{categoryQuery ? `Category: "${categoryQuery}"` : (searchQuery ? `Search: "${searchQuery}"` : '"All Categories"')}</span>
          </div>

          <div className="content-header">
            <h2>{searchQuery ? `Results for "${searchQuery}"` : (categoryQuery ? `${categoryQuery} Products` : 'All Products')}</h2>
          </div>

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="skeleton-card"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <h3>No products found.</h3>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '20px' }}>
                <button 
                  className="btn-add" 
                  disabled={page === 0} 
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  ← Previous
                </button>
                <span style={{ fontWeight: 'bold' }}>Page {page + 1} of {totalPages}</span>
                <button 
                  className="btn-add" 
                  disabled={page === totalPages - 1 || totalPages === 0} 
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}