import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/UserProfile.module.css';
import SettingsModal from './modals/SettingsModal';

const UserProfile = ({ userName = "User" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dropdownRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
 

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
    setMenuOpen(false);
    setClosing(false);
    }, 500); // match fadeOut duration
  }

    const toggleMenu = () => {
    if (menuOpen) {
       closeMenu();
    } else {
        setMenuOpen(true);
    }
    };
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.profileArea}>
        <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
        <button className={styles.menuButton} onClick={toggleMenu}>⋮</button>
      </div>
      {menuOpen && (
        <div className={`${styles.dropdown} ${closing ? styles.fadeOut : ''}`}>
            <div className={styles.userInfo}>{userName}</div>
            <div className={styles.menuItem} onClick={()=>setModalOpen(true)}>Settings</div>
            <div className={styles.menuItem}>Sign Out</div>
        </div>
        )}
        {modalOpen ? <SettingsModal /> : ""}
    </div>
  );
};

export default UserProfile;
