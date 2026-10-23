import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      {/* NEWSLETTER SECTION */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-content">
            <h3>Subscribe to our Newsletter</h3>
            <p>Get the latest updates on new products and upcoming sales.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* MAIN FOOTER LINKS */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Column 1: About */}
          <div className="footer-col">
            <div className="footer-logo">PTC COMPUTER</div>
            <p className="footer-about-text">
              Your one-stop shop for the latest computers, gaming gear, and accessories. We provide 100% genuine products with a 1-year warranty.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaTelegramPlane /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
            <Link to="/cart" className="footer-link">Shopping Cart</Link>
            <Link to="/login" className="footer-link">Sign In / Register</Link>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-title">Customer Care</h4>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Shipping Policy</a>
            <a href="#" className="footer-link">Returns & Refunds</a>
            <a href="#" className="footer-link">FAQ</a>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h4 className="footer-title">Contact Info</h4>
            <div className="footer-contact-item">
              <FaMapMarkerAlt color="#f59e0b" />
              <span>123 Main Street, Phnom Penh, Cambodia</span>
            </div>
            <div className="footer-contact-item">
              <FaPhoneAlt color="#f59e0b" />
              <span>+855 12 345 678</span>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope color="#f59e0b" />
              <span>support@ptccomputer.com</span>
            </div>
          </div>

        </div>
      </div>

      {/* COPYRIGHT SECTION */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>© 2026 PTC COMPUTER. All Rights Reserved.</p>
          <div className="payment-methods">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
            <FaCcPaypal size={24} />
          </div>
        </div>
      </div>
    </footer>
  );
}