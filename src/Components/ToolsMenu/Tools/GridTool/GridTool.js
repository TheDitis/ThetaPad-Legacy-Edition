import React, {useEffect, useState} from 'react'
import ToolProfile from "../../ToolProfile/ToolProfile";
import Button from "@material-ui/core/Button";
import GridIcon from "../../../Icons/GridIcon";
import styles from "./GridTool.module.scss"
import ColorPicker from "../../../ColorPicker/ColorPicker";
import {ThemeProvider} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import cyan from "@material-ui/core/colors/cyan";
import lime from "@material-ui/core/colors/lime";
import Tooltip from "@material-ui/core/Tooltip";


const theme = createMuiTheme({
    palette: {
        primary: cyan,
        secondary: lime
    }
});

const useStyles = makeStyles({
    numberField: {
        position: 'relative',
        width: 50,
        color: 'black',
        marginLeft: 15,
        marginRight: 0,
        marginTop: 13,
        marginBottom: 10,
        float: 'left'
    },
    numberFieldWider: {
        position: 'relative',
        width: 50,
        color: 'black',
        marginLeft: 15,
        marginRight: 0,
        marginTop: 13,
        marginBottom: 10,
        float: 'left'
    },
    inputLabel: {
        color: 'black',
        textAlign: 'center'
    },
    input: {
        background: 'white',
        paddingLeft: 4
    },
    gridButton: {
        height: 60,
        padding: 0,
        margin: 0,
        // color: red;
    }
});


const GridTool = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);
    const [nRows, setNRows] = useState(6);
    const [nColumns, setNColumns] = useState(6);
    const [thickness, setThickness] = useState(1);
    const [opacity, setOpacity] = useState(80);

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

    useEffect(() => {
        props.setGridProps({
            ...props.gridProps,
            opacity: opacity / 100
        })
    }, [opacity])

    const classes = useStyles();

    const openColorPicker = (e) => {
        console.log(showColorPicker)
        setColorPickerLocation([e.clientX, e.clientY - 847]);
        console.log("opening color picker");
        setShowColorPicker(true)
    };

    const updateColor = (color, index) => {
        props.setGridProps({
            ...props.gridProps,
            color: color
        })
    };

    return (
        <ToolProfile isActive={props.gridOn}>
            <React.Fragment key={'main'}>
                <Button onClick={() => props.setGridOn(!props.gridOn)}
                        className={`${classes.gridButton} ${props.gridOn ? props.classes.buttonSelected : 
                            props.classes.buttonUnselected}`}
                >

                        <GridIcon color={props.gridOn ? 'white' : 'black'}/>
                </Button>
                <div className={styles.swatch} style={{backgroundColor: props.gridProps.color, width: props.sideBarWidth * 0.08, height: props.sideBarWidth * 0.08, marginTop: 20 + (1800 / props.sideBarWidth)}}
                     onClick={openColorPicker}>
                </div>
                {showColorPicker ? (
                    <ColorPicker
                        showColorPicker={showColorPicker}
                        setShowColorPicker={setShowColorPicker}
                        openColorPicker={openColorPicker}
                        location={colorPickerLocation}
                        updateColor={updateColor}
                    />
                ) : null}
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Rows"
                    type="number"
                    // defaultValue={5}
                    value={nRows}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.inputLabel
                    }}
                    inputProps={{
                        className: classes.input
                    }}
                    onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (val < -1) {
                            val = -1
                        } else if (val > 40) {
                            val = 40
                        }
                        setNRows(val)
                    }}
                    disabled={!props.gridOn}
                    size={'small'}
                />
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Columns"
                    type="number"
                    // defaultValue={5}
                    value={nColumns}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.inputLabel
                    }}
                    inputProps={{
                        className: classes.input
                    }}
                    onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (val < -1) {
                            val = -1
                        } else if (val > 40) {
                            val = 40
                        }
                        setNColumns(val)
                    }}
                    disabled={!props.gridOn}
                    size={'small'}
                />
            </React.Fragment>

            <React.Fragment key={'controls'}>

                {/*<div className={styles.numInputs}>*/}
                <ThemeProvider theme={theme}>

                    <TextField
                        className={classes.numberField}
                        label="Thickness"
                        type="number"
                        defaultValue={1}
                        color={'secondary'}
                        value={thickness}
                        InputLabelProps={{
                            shrink: true,
                            className: classes.inputLabel
                        }}
                        inputProps={{
                            className: classes.input
                        }}
                        onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (val < 1) {
                                val = 1
                            } else if (val > 60) {
                                val = 60
                            }
                            setThickness(val)
                        }}
                        disabled={!props.gridOn}
                        size={'small'}
                    />
                    <TextField
                        className={classes.numberFieldWider}
                        label="Opacity"
                        type="number"
                        // defaultValue={1}
                        color={'secondary'}
                        value={opacity}
                        // step={0.01}
                        InputLabelProps={{
                            shrink: true,
                            className: classes.inputLabel
                        }}
                        inputProps={{
                            className: classes.input,
                            step: 5
                        }}
                        onChange={(e) => {
                            let val = parseFloat(e.target.value);
                            if (val < 4) {
                                val = 5
                            } else if (val > 100) {
                                val = 100
                            }
                            setOpacity(val)
                        }}
                        disabled={!props.gridOn}
                        size={'small'}
                    />
                </ThemeProvider>
            </React.Fragment>
        </ToolProfile>
    )
};

export default GridTool;