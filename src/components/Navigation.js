import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./styles/Navigation.module.css";


const Navigation = ({pages, activeLinkText, toggleMenu, menuOpen, setMenuOpen}) => {
    return (
         <>
      {/* Desktop Nav */}
      <nav className={`${styles.theNav} ${styles.desktopNav}`}>
        {pages.map((page, index) => (
          <React.Fragment key={page.key}>
            {index > 0 && <span>&nbsp;|&nbsp;</span>}
            <Link
              className={page.active ? styles.activeLink : ''}
              to={page.url}
            >
              {page.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <div className={styles.mobileNav}>
        <span className="bold">{activeLinkText} </span> 
        <button className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
          {pages.map(page => (
            <Link
              key={page.key}
              className={`${styles.mobileLink} ${page.active ? `${styles.activeLink} ${styles.activeLinkMobile}` : ''}`}
              to={page.url}
              onClick={() => setMenuOpen(false)}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>
    </>
    );
}

export default Navigation;
