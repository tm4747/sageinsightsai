// src/components/Layout.js
import { Outlet } from 'react-router-dom';
import './Layout.css'; // optional styling

const Layout = () => {
  return (
    <div className="layout">
      <main>
        <Outlet /> {/* This renders the current child route */}
      </main>
    </div>
  );
}
export default Layout;