// src/components/Layout.js
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // optional styling

export default function Layout() {
  return (
    <div className="layout">
      <nav>
        <Link to="/">Home Summary</Link> | <Link to="/other">Another Tool</Link>
      </nav>
      <main>
        <Outlet /> {/* This renders the current child route */}
      </main>
    </div>
  );
}
