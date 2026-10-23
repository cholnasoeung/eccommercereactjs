import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaHeadset, FaArrowRight } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  // Fetch categories from the database on load
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  // Fetch products when search, category, or page changes
  useEffect(() => {
    setLoading(true);
    api.get('/products', {
      params: {
        search: searchQuery,
        category: categoryQuery,
        page: page,
        size: 8
      }
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

  // Reset page to 0 when search or category changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, categoryQuery]);

  const handleCategoryClick = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName) {
      newParams.set('category', categoryName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="home-container">
      {/* HERO BANNER (Only show if no search/category is active) */}
      {!searchQuery && !categoryQuery && (
        <>
          <div className="hero-banner">
            <div className="hero-content">
              <span className="hero-badge">New Arrivals 2026</span>
              <h1>Level Up Your <br/> Gaming Setup</h1>
              <p>Get up to 40% off on premium mechanical keyboards, mice, and monitors.</p>
              <Link to="/?category=Gaming" className="hero-btn">
                Shop Now <FaArrowRight />
              </Link>
            </div>
          </div>

          {/* PROMO FEATURES */}
          <div className="promo-features">
            <div className="promo-item">
              <FaTruck size={30} color="#f59e0b" />
              <div>
                <h4>Fast Delivery</h4>
                <p>Within 1 hour in the city</p>
              </div>
            </div>
            <div className="promo-item">
              <FaShieldAlt size={30} color="#f59e0b" />
              <div>
                <h4>1 Year Warranty</h4>
                <p>100% genuine products</p>
              </div>
            </div>
            <div className="promo-item">
              <FaHeadset size={30} color="#f59e0b" />
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated customer care</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN LAYOUT (Sidebar + Products) */}
      <div className="page-wrapper">
        <div className="sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            <li 
              className={`category-item ${categoryQuery === '' ? 'active-category' : ''}`}
              onClick={() => handleCategoryClick('')}
              style={{ fontWeight: categoryQuery === '' ? 'bold' : 'normal', color: categoryQuery === '' ? '#f59e0b' : '#444' }}
            >
              All Products <span>›</span>
            </li>

            {categories.map((cat) => (
              <li 
                key={cat.id} 
                className="category-item"
                onClick={() => handleCategoryClick(cat.name)}
                style={{ fontWeight: categoryQuery === cat.name ? 'bold' : 'normal', color: categoryQuery === cat.name ? '#f59e0b' : '#444' }}
              >
                {cat.name} <span>›</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <div className="breadcrumb">
            Home / <span>{categoryQuery ? `Category: "${categoryQuery}"` : (searchQuery ? `Search: "${searchQuery}"` : '"All Categories"')}</span>
          </div>

          <div className="content-header">
            <h2>
              {searchQuery ? `Results for "${searchQuery}"` : (categoryQuery ? `${categoryQuery} Products` : 'All Products')}
            </h2>
            <div className="filters">
              <select className="filter-select"><option>Brands: All</option></select>
              <select className="filter-select"><option>Sort by: Newest</option></select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-warning" role="status"></div></div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <h3>No products found.</h3>
              <p>Try searching or selecting a different category.</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '20px' }}>
                <button 
                  className="btn-add" 
                  disabled={page === 0} 
                  onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
                  style={{ opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous
                </button>
                
                <span style={{ fontWeight: 'bold' }}>
                  Page {page + 1} of {totalPages}
                </span>
                
                <button 
                  className="btn-add" 
                  disabled={page === totalPages - 1 || totalPages === 0} 
                  onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
                  style={{ opacity: page === totalPages - 1 || totalPages === 0 ? 0.5 : 1, cursor: page === totalPages - 1 || totalPages === 0 ? 'not-allowed' : 'pointer' }}
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