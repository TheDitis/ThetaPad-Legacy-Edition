import React from "react";
import styles from './Sidebar.module.css'
import ImageUploader from "react-images-upload";
import Button from "@material-ui/core/Button";
import UndoIcon from '@material-ui/icons/Undo';
import LineProfile from "../LineProfile/LineProfiles";
import uuid from 'react-uuid'
import {Undo} from "@material-ui/icons";


const SideBar = props => {
    return (
        <div className={styles.sidebar}>
            <hr style={{width: "100%"}}/>
            <ImageUploader
                buttonText='Choose image'
                onChange={props.handleUpload}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={20971520}
                withIcon={false}
                withLabel={false}
                singleImage={false}
                buttonStyles={{backgroundColor: 'rgb(0, 150, 255)'}}
                fileContainerStyle={{backgroundColor: 'transparent', height: 10}}
            />
            {/*<Button onClick={props.changeColor} style={ { backgroundColor: "white", margin: 10 }}>Cycle Color</Button>*/}
            <Button onClick={props.undo} style={ { backgroundColor: "white", margin: 10, fontSize: 5}}><UndoIcon/></Button>
            <hr style={{width: "100%"}}/>
            <div className={styles.profiles}>
                {props.lineList.map( (line, index) => {
                    return (
                        <LineProfile key={uuid()} line={line} index={index} {...props}/>
                    )
                })}
            </div>
        </div>
    )
};


export default SideBar;