import React, {useState, useEffect} from 'react';
import styles from "./ToolsMenu.module.css";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ColorPicker from "../ColorPicker/ColorPicker";
import TextField from '@material-ui/core/TextField';
import cyan from '@material-ui/core/colors/cyan';
import lime from "@material-ui/core/colors/lime";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from "@material-ui/styles";
import {motion} from 'framer-motion';
import GridIcon from "../Icons/GridIcon";
import GridTool from "./Tools/GridTool/GridTool";
import ImageFilterTool from "./Tools/ImageFilterTool/ImageFilterTool";

const theme = createMuiTheme({
    palette: {
        primary: cyan,
        secondary: lime
    }
});
const useStyles = makeStyles({
    numberField: {
        position: 'relative',
        width: 45,
        color: 'white',
        marginLeft: 8,
        marginRight: 8,
        marginTop: 10,
        float: 'left'
    },
    inputLabel: {
        color: 'white'
    },
    input: {
        background: 'white',
        paddingLeft: 4
    },
    gridButton: {
        height: 60,
        padding: 0
        // color: red;
    }
});


const ToolsMenu = (props) => {
    const [menuHeight, setMenuHeight] = useState(0);

    const classes = useStyles();




    const toggleShowMenu = (menuBody) => {
        if (menuHeight < 40) {
            setMenuHeight(350);
            console.log('Tool Menu Open')
        }
        else if (!menuBody) {
            setMenuHeight(0);
            console.log('Tool Menu Closed')
        }
    };

    const handleTabMouseEnter = () => {
        if (menuHeight < 40) {
            setMenuHeight(menuHeight + 10)
        }
    };

    const handleTabMouseExit = () => {
        if (menuHeight > 5 && menuHeight < 40) {
            setMenuHeight(menuHeight - 10);
        }
    };





    return (
        <motion.div
            animate={{
                x: 0,
                y: -menuHeight
            }}
        >
            <div className={styles.ToolsMenu} onClick={() => toggleShowMenu(true)} onMouseEnter={handleTabMouseEnter} onMouseLeave={handleTabMouseExit}>

                <div className={styles.toolMenuTab} onClick={() => toggleShowMenu(false)}>
                    <div className={styles.tabLeft}/>
                    <div className={styles.tabMiddle}>
                        <a className={styles.tabTitle}>Tools</a>
                    </div>
                    <div className={styles.tabRight}/>
                </div>
                <div className={styles.mainSection}>

                    <GridTool {...props}/>
                    <ImageFilterTool {...props}/>
                </div>
            </div>

        </motion.div>
    )
};


export default ToolsMenu;