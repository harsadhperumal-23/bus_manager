import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', display: 'flex', gap: '20px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Operations</Link>
      <Link to="/performance" style={{ color: 'white', textDecoration: 'none' }}>Performance</Link>
      <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
      <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
    </nav>
  );
}
