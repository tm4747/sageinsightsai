import { useState, useRef, useEffect } from 'react';
import styles from './styles/UserProfile.module.css';
import SettingsModal from './modals/SettingsModal';
import { deleteUserData } from '../lib/AWSHelper';
import ConfirmModal from './modals/ConfirmModal';

const UserProfile = ({ userName = "User", uuid = "", cleanUpUserData }) => {
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);
  

  /*** DELETES DATA IN DYNAMO DB and user fields in Layout.js */
  const handleDeleteLoggedInUserData = async () => {
    if(!uuid)
      return null;
    try {
      await deleteUserData(uuid);
      cleanUpUserData();
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }
  
  const handleDelete = () => {
    setShowConfirm(true);
  }

  const confirmDelete = () => {
    handleDeleteLoggedInUserData();
    setShowConfirm(false);
  }

  const closeDropdownMenu = () => {
    setClosing(true);
    setTimeout(() => {
    setDropdownMenuOpen(false);
    setClosing(false);
    }, 500); // match fadeOut duration
  }

    const toggleMenu = () => {
    if (dropdownMenuOpen) {
       closeDropdownMenu();
    } else {
        setDropdownMenuOpen(true);
    }
    };
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdownMenu();
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
      {dropdownMenuOpen && (
        <div className={`${styles.dropdown} ${closing ? styles.fadeOut : ''}`}>
            <div className={styles.userInfo}>{userName}</div>
            <div className={styles.menuItem} onClick={()=>setModalOpen(true)}>Settings</div>
            <div className={styles.menuItem} onClick={handleDelete}>Delete My Data</div>
        </div>
        )}
        {modalOpen ? <SettingsModal /> : ""}
        <ConfirmModal
          isVisible={showConfirm}
          message="Are you sure you want to delete your stored data?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
    </div>
  );
};

export default UserProfile;
