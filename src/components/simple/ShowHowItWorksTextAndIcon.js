import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const ShowHowItWorksIcon = ({onClickFn, title = "How does it work?", size = "1.5rem"}) => {
    return (
        <div onClick={onClickFn}  style={{
            cursor:"pointer", 
            width:"100%", 
            display: "flex",
            paddingTop: "1rem",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "-.5rem",
        }}>
            {/* <h3 style={{display: "inline", paddingRight:"1rem", marginTop:"1.5rem"}}>{title}</h3> */}
            <h3 style={{paddingRight:"1rem", alignSelf:"center"}}>{title}</h3>
            <FontAwesomeIcon 
                style={{height: size, alignSelf:"center", marginBottom:"1.5rem", marginLeft:".5rem"}}
                className={"flashing-icon rounded-icon"}
                icon={faCircleQuestion} 
                title={title}
            />
        </div>
    );
}

export default ShowHowItWorksIcon;