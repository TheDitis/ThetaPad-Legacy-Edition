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
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);
    const [nRows, setNRows] = useState(6);
    const [nColumns, setNColumns] = useState(6);
    const [thickness, setThickness] = useState(1);

    const classes = useStyles();

    useEffect(() => {
        props.setGridProps({
            ...props.gridProps,
            nRows: nRows
        })
    }, [nRows]);

    useEffect(() => {
        props.setGridProps({
            ...props.gridProps,
            nColumns: nColumns
        })
    }, [nColumns]);

    useEffect(() => {
        props.setGridProps({
            ...props.gridProps,
            strokeWidth: thickness
        })
    }, [thickness]);


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

    const openColorPicker = (e) => {
        setColorPickerLocation([e.clientX, e.clientY -480]);
        setShowColorPicker(true)
    };

    const updateColor = (color, index) => {
        props.setGridProps({
            ...props.gridProps,
            color: color
            })
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
                    {/*<div className={styles.GridMenu}>*/}
                    {/*    <Button onClick={() => props.setGridOn(!props.gridOn)}*/}
                    {/*            className={`${classes.gridButton} ${props.gridOn ? props.classes.buttonSelected : props.classes.buttonUnselected}`}>*/}
                    {/*        <GridIcon color={props.gridOn ? 'white' : 'black'}/>*/}
                    {/*    </Button>*/}
                    {/*    <div className={styles.swatch} style={{backgroundColor: props.gridProps.color}}*/}
                    {/*         onClick={openColorPicker}>*/}
                    {/*    </div>*/}
                    {/*    {showColorPicker ? (*/}
                    {/*        <ColorPicker*/}

                    {/*            {...props}*/}
                    {/*            showColorPicker={showColorPicker}*/}
                    {/*            setShowColorPicker={setShowColorPicker}*/}
                    {/*            location={colorPickerLocation}*/}
                    {/*            updateColor={updateColor}*/}
                    {/*        />*/}
                    {/*    ) : null}*/}
                    {/*    /!*<div className={styles.numInputs}>*!/*/}
                    {/*    <ThemeProvider theme={theme}>*/}
                    {/*        <TextField*/}
                    {/*            className={classes.numberField}*/}
                    {/*            id="standard-number"*/}
                    {/*            label="Rows"*/}
                    {/*            type="number"*/}
                    {/*            defaultValue={5}*/}
                    {/*            value={nRows}*/}
                    {/*            InputLabelProps={{*/}
                    {/*                shrink: true,*/}
                    {/*                className: classes.inputLabel*/}
                    {/*            }}*/}
                    {/*            inputProps={{*/}
                    {/*                className: classes.input*/}
                    {/*            }}*/}
                    {/*            onChange={(e) => {*/}
                    {/*                let val = parseInt(e.target.value);*/}
                    {/*                if (val < -1) {*/}
                    {/*                    val = -1*/}
                    {/*                } else if (val > 40) {*/}
                    {/*                    val = 40*/}
                    {/*                }*/}
                    {/*                setNRows(val)*/}
                    {/*            }}*/}
                    {/*            disabled={!props.gridOn}*/}
                    {/*            size={'small'}*/}
                    {/*        />*/}
                    {/*        <TextField*/}
                    {/*            className={classes.numberField}*/}
                    {/*            id="standard-number"*/}
                    {/*            label="Columns"*/}
                    {/*            type="number"*/}
                    {/*            defaultValue={5}*/}
                    {/*            value={nColumns}*/}
                    {/*            InputLabelProps={{*/}
                    {/*                shrink: true,*/}
                    {/*                className: classes.inputLabel*/}
                    {/*            }}*/}
                    {/*            inputProps={{*/}
                    {/*                className: classes.input*/}
                    {/*            }}*/}
                    {/*            onChange={(e) => {*/}
                    {/*                let val = parseInt(e.target.value);*/}
                    {/*                if (val < -1) {*/}
                    {/*                    val = -1*/}
                    {/*                } else if (val > 40) {*/}
                    {/*                    val = 40*/}
                    {/*                }*/}
                    {/*                setNColumns(val)*/}
                    {/*            }}*/}
                    {/*            disabled={!props.gridOn}*/}
                    {/*            size={'small'}*/}
                    {/*        />*/}
                    {/*        <TextField*/}
                    {/*            className={classes.numberField}*/}
                    {/*            id="standard-number"*/}
                    {/*            label="Thickness"*/}
                    {/*            type="number"*/}
                    {/*            defaultValue={1}*/}
                    {/*            color={'secondary'}*/}
                    {/*            value={thickness}*/}
                    {/*            InputLabelProps={{*/}
                    {/*                shrink: true,*/}
                    {/*                className: classes.inputLabel*/}
                    {/*            }}*/}
                    {/*            inputProps={{*/}
                    {/*                className: classes.input*/}
                    {/*            }}*/}
                    {/*            onChange={(e) => {*/}
                    {/*                let val = parseInt(e.target.value);*/}
                    {/*                if (val < 1) {*/}
                    {/*                    val = 1*/}
                    {/*                } else if (val > 60) {*/}
                    {/*                    val = 60*/}
                    {/*                }*/}
                    {/*                setThickness(val)*/}
                    {/*            }}*/}
                    {/*            disabled={!props.gridOn}*/}
                    {/*            size={'small'}*/}
                    {/*        />*/}
                    {/*    </ThemeProvider>*/}
                    {/*    /!*</div>*!/*/}
                    {/*</div>*/}
                    <GridTool {...props} updateColor={updateColor} openColorPicker={openColorPicker} nRows={nRows}
                              setNRows={setNRows} nColumns={nColumns} setNColumns={setNColumns} thickness={thickness}
                              setThickness={setThickness}/>
                </div>
            </div>

        </motion.div>
    )
};


export default ToolsMenu;