import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from "./styles/HowItWorks.module.css"; // Import CSS Module styles


const HowItWorks = ({showHowItWorks, setShowHowItWorks, title, data, showCloseButton = false, listType = "ol"}) => {
    const closeButton = showCloseButton ? 
    <FontAwesomeIcon icon={faXmark} onClick={() => { setShowHowItWorks(false); }} className={`${styles.closeIcon} flashing-icon`} title="Close"/> 
    : "";

    const allListItems = (() => {
        const listItems = [];
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          if (item.children && item.children.length > 0) {  // Check if the item has children
            listItems.push(  // Render a list item and its sub-list
              <li key={i}>
                {item.text}
                <ul>
                  {item.children.map((child, idx) => (
                    <li key={idx}>{child}</li>
                  ))}
                </ul>
              </li>
            );
          } else {
            listItems.push(<li key={i}>{item.text}</li>);  // Render just the item without children
          }
        }
        return listItems;
      })();

    var howAppWorksHtml = <>
    {closeButton}
    <h4>{title}</h4>
    {listType === "ol" ? (
        <ol>
            {allListItems}
        </ol>
        ) : (
        <ul>
            {allListItems}
        </ul>
    )}

    </>;
    let howItWorksStyles = `${styles.howItWorksContainer} ${showHowItWorks ? styles.expanded : styles.collapsed}`;

    return (
        <div className={howItWorksStyles}>
        {howAppWorksHtml}
        </div>
    );
};

export default HowItWorks;
