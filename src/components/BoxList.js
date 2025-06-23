import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from "./styles/BoxList.module.css"; // Import CSS Module styles


const BoxList = ({showBoxList, setShowBoxList, title, data, showCloseButton = false, listType = "ol"}) => {
    const closeButton = showCloseButton ? 
    <FontAwesomeIcon icon={faXmark} onClick={() => { setShowBoxList(false); }} className={`${styles.closeIcon} flashing-icon rounded-icon`} title="Close"/> 
    : "";

    const allListItems = (() => {
        const listItems = [];
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];
          if (item.children && item.children.length > 0) {  // Check if the item has children
            listItems.push(  // Render a list item and its sub-list
              <li key={i}>
                <strong>{item.heading}</strong> {item.text}
                <ul>
                  {item.children.map((child, idx) => (
                    <li key={idx}><strong>{child.heading}</strong> {child.text}</li>
                  ))}
                </ul>
              </li>
            );
          } else {
            listItems.push(<li key={i}><strong>{item.heading}</strong> {item.text}</li>);  // Render just the item without children
          }
        }
        return listItems;
      })();

    var boxListHtml = <>
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
    let boxListStyles = `${styles.boxListContainer} ${showBoxList ? styles.expanded : styles.collapsed}`;

    return (
        <div className={boxListStyles}>
        {boxListHtml}
        </div>
    );
};

export default BoxList;
