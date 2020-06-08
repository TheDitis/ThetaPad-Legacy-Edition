import React, {useState} from 'react'
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
        width: 45,
        color: 'black',
        marginLeft: 18,
        marginRight: 8,
        marginTop: 10,
        float: 'left'
    },
    inputLabel: {
        color: 'black'
    },
    input: {
        background: 'white',
        paddingLeft: 4
    },
    gridButton: {
        height: 60,
        padding: 0,
        margin: 0
        // color: red;
    }
});


const GridTool = (props) => {
    const [isActive, setIsActive] = useState(false);

    const classes = useStyles();
    console.log('show picker', props.openColorPicker);

    return (
        <ToolProfile isActive={props.gridOn}>
            <div className={styles.mainSection} key={'main'}>
                <Button onClick={() => props.setGridOn(!props.gridOn)}
                        className={`${classes.gridButton} ${props.gridOn ? props.classes.buttonSelected : props.classes.buttonUnselected}`}>

                        <GridIcon color={props.gridOn ? 'white' : 'black'}/>
                </Button>
                <div className={styles.swatch} style={{backgroundColor: props.gridProps.color}}
                     onClick={props.openColorPicker}>
                </div>
                {props.showColorPicker ? (
                    <ColorPicker

                        {...props}
                        showColorPicker={props.showColorPicker}
                        setShowColorPicker={props.setShowColorPicker}
                        location={props.colorPickerLocation}
                        updateColor={props.updateColor}
                    />
                ) : null}
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Rows"
                    type="number"
                    defaultValue={5}
                    value={props.nRows}
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
                        props.setNRows(val)
                    }}
                    disabled={!props.gridOn}
                    size={'small'}
                />
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Columns"
                    type="number"
                    defaultValue={5}
                    value={props.nColumns}
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
                        props.setNColumns(val)
                    }}
                    disabled={!props.gridOn}
                    size={'small'}
                />
            </div>

            <div className={styles.controlSection} key={'controls'}>

                {/*<div className={styles.numInputs}>*/}
                <ThemeProvider theme={theme}>
                    <TextField
                        className={classes.numberField}
                        id="standard-number"
                        label="Rows"
                        type="number"
                        defaultValue={5}
                        value={props.nRows}
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
                            props.setNRows(val)
                        }}
                        disabled={!props.gridOn}
                        size={'small'}
                    />
                    <TextField
                        className={classes.numberField}
                        id="standard-number"
                        label="Columns"
                        type="number"
                        defaultValue={5}
                        value={props.nColumns}
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
                            props.setNColumns(val)
                        }}
                        disabled={!props.gridOn}
                        size={'small'}
                    />
                    <TextField
                        className={classes.numberField}
                        id="standard-number"
                        label="Thickness"
                        type="number"
                        defaultValue={1}
                        color={'secondary'}
                        value={props.thickness}
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
                            props.setThickness(val)
                        }}
                        disabled={!props.gridOn}
                        size={'small'}
                    />
                </ThemeProvider>
            </div>
        </ToolProfile>
    )
};

export default GridTool;