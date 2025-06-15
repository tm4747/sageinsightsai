import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const ShowHowItWorksIcon = ({onClickFn, title = "How does it work?", size = "1.5rem"}) => {
    return (
        <div onClick={onClickFn}  style={{cursor:"pointer", paddingLeft:"1rem",paddingBottom:"1rem", paddingTop:"5px", width:"100%", justifyContent:"left", textAlign:"left"}}>
            <h3 style={{display: "inline", paddingRight:"1rem"}}>{title}</h3>
            <FontAwesomeIcon 
                style={{height: size}}
                className={"flashing-icon"}
                icon={faCircleQuestion} 
                title={title}
            />
        </div>
    );
}

export default ShowHowItWorksIcon;