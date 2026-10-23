import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const categories = [
    "Computer", "Gaming", "Mac - Apple", "Monitor & Display", 
    "POS System", "Logitech For Business", "Interactive Displays", 
    "Computer Peripherals", "Computer Components", "Printer, Scanner & Copier"
  ];

  useEffect(() => {
    setLoading(true);
    api.get('/products', {
      params: {
        search: searchQuery,
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
  }, [searchQuery, page]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  return (
    <div className="page-wrapper">
      <div className="sidebar">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li key={index} className="category-item">
              {cat} <span>›</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="breadcrumb">
          Home / <span>{searchQuery ? `Search: "${searchQuery}"` : '"All Categories"'}</span>
        </div>

        <div className="content-header">
          <h2>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h2>
          <div className="filters">
            <select className="filter-select"><option>Brands: All</option></select>
            <select className="filter-select"><option>Sort by: Newest</option></select>
          </div>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No products found.</h3>
            <p>Try searching for something else.</p>
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
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
                style={{ opacity: page === totalPages - 1 || totalPages === 0 ? 0.5 : 1, cursor: page === totalPages - 1 || totalPages === 0 ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}