import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1 style={{ fontSize: '4rem', color: '#e74c3c' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#3498db', textDecoration: 'underline' }}>Go to Home</Link>
    </div>
  );
};

export default PageNotFound;
