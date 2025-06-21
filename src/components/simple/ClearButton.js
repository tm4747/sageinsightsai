import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./styles/ClearButton.module.css";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';



const ClearButton = ({ onPress, isDisabled = false}) => {

    return(
        <FontAwesomeIcon 
            icon={faCircleXmark} 
            onClick={onPress} 
            disabled={isDisabled} 
            className={`${styles.closeIcon} flashing-icon`} 
            title="Close"
        /> 
    );
}

export default ClearButton;
