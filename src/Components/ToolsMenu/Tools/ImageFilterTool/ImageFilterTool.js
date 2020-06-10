import React, {useEffect, useState} from 'react'
import ToolProfile from "../../ToolProfile/ToolProfile";
import Button from "@material-ui/core/Button";
import GridIcon from "../../../Icons/GridIcon";
import styles from "./ImageFilterTool.module.scss"
import ColorPicker from "../../../ColorPicker/ColorPicker";
import {ThemeProvider} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Slider from "@material-ui/core/Slider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import cyan from "@material-ui/core/colors/cyan";
import lime from "@material-ui/core/colors/lime";
import Tooltip from "@material-ui/core/Tooltip";

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

const ImageFilterTool = (props) => {
    const [saturation, setSaturation] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [hue, setHue] = useState(0);
    const [blur, setBlur] = useState(0)

    const classes = useStyles();

    useEffect(() => {
        props.setImageStyle({
            filter: `hue-rotate(${hue}deg) brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%) `
        })
    }, [saturation, contrast, brightness, hue, blur]);

    const saturationSliderTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                thumb: {
                    color: 'rgb(200, 140, 0)',
                    filter: `saturate(${saturation}%)`
                },
                track: {
                    color: 'rgb(200, 140, 0)',
                    filter: `saturate(${saturation}%)`
                },
                rail: {
                    color: 'black'
                }
            }
        }
    });

    const contrastSliderTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                thumb: {
                    color: 'white',
                    filter: `brightness(${contrast + 40}%)`,
                    // border: '1px solid black'
                },
                track: {
                    color: "white",
                    filter: `brightness(${70 - contrast /2}%)`
                },
                rail: {
                    color: 'black'
                }
            }
        }
    });

    const brightnessSliderTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                thumb: {
                    color: 'white',
                    filter: `brightness(${brightness / 2}%)`,
                    // border: '1px solid black'
                },
                track: {
                    color: "white",
                    filter: `brightness(${brightness / 2}%)`
                },
                rail: {
                    color: 'black'
                }
            }
        }
    });

    const hueSliderTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                thumb: {
                    color: 'red',
                    filter: `hue-rotate(${hue}deg)`,
                    // border: '1px solid black'
                },
                track: {
                    color: "red",
                    filter: `hue-rotate(${hue}deg)`,
                },
                rail: {
                    color: 'black'
                }
            }
        }
    });


    return (
        <ToolProfile isActive={true}>
            <React.Fragment key={'main'}>
                <Button
                    className={`${classes.gridButton} ${props.gridOn ? props.classes.buttonSelected : props.classes.buttonUnselected}`}
                >
                    FILTERS
                    {/*<GridIcon color={props.gridOn ? 'white' : 'black'}/>*/}
                </Button>
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Saturation"
                    type="number"
                    // defaultValue={5}
                    value={saturation}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.inputLabel
                    }}
                    inputProps={{
                        className: classes.input,
                        step: 5
                    }}
                    onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (val < 0) {
                            val = 0
                        } else if (val > 100) {
                            val = 100
                        }
                        setSaturation(val)
                    }}
                    // disabled={!props.gridOn}
                    size={'small'}
                />
                <TextField
                    className={classes.numberField}
                    id="standard-number"
                    label="Contrast"
                    type="number"
                    // defaultValue={5}
                    value={contrast}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.inputLabel
                    }}
                    inputProps={{
                        className: classes.input,
                        step: 5
                    }}
                    onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (val < 0) {
                            val = 0
                        } else if (val > 500) {
                            val = 500
                        }
                        setContrast(val)
                    }}
                    // disabled={!props.gridOn}
                    size={'small'}
                />
                {/*<TextField*/}
                {/*    className={classes.numberField}*/}
                {/*    id="standard-number"*/}
                {/*    label="Columns"*/}
                {/*    type="number"*/}
                {/*    // defaultValue={5}*/}
                {/*    value={nColumns}*/}
                {/*    InputLabelProps={{*/}
                {/*        shrink: true,*/}
                {/*        className: classes.inputLabel*/}
                {/*    }}*/}
                {/*    inputProps={{*/}
                {/*        className: classes.input*/}
                {/*    }}*/}
                {/*    onChange={(e) => {*/}
                {/*        let val = parseInt(e.target.value);*/}
                {/*        if (val < -1) {*/}
                {/*            val = -1*/}
                {/*        } else if (val > 40) {*/}
                {/*            val = 40*/}
                {/*        }*/}
                {/*        setNColumns(val)*/}
                {/*    }}*/}
                {/*    disabled={!props.gridOn}*/}
                {/*    size={'small'}*/}
                {/*/>*/}
            </React.Fragment>

            <React.Fragment key={'controls'}>
                <div className={styles.sliders}>

                    <ThemeProvider theme={saturationSliderTheme}>
                        <div className={styles.sliderControl}>
                            <Typography className={styles.sliderControlLabel}>
                                Saturation
                            </Typography>
                            <Slider
                                value={saturation}
                                min={0}
                                max={400}
                                onChange={(e, val) => {
                                    setSaturation(parseInt(val))
                                }}
                            >
                            </Slider>
                        </div>
                        <ThemeProvider theme={contrastSliderTheme}>
                            <div className={styles.sliderControl}>
                                <Typography className={styles.sliderControlLabel}>
                                    Contrast
                                </Typography>
                                <Slider
                                    value={contrast}
                                    min={0}
                                    max={200}
                                    onChange={(e, val) => {
                                        setContrast(parseInt(val))
                                    }}
                                >
                                </Slider>
                            </div>
                        </ThemeProvider>
                        <ThemeProvider theme={brightnessSliderTheme}>
                            <div className={styles.sliderControl}>
                                <Typography className={styles.sliderControlLabel}>
                                    Brightness
                                </Typography>
                                <Slider
                                    // value={brightness}
                                    defaultValue={100}
                                    min={0}
                                    max={200}
                                    scale={(x) => {
                                        if (x <= 100) {
                                            setBrightness(x);
                                            return x
                                        } else {
                                            x = x + 3 * (x - 100);
                                            setBrightness(x);
                                            return x
                                        }
                                    }}
                                    // getAriaValueText={(val) => val}
                                    // valueLabelFormat={(val) => val}
                                    // valueLabelDisplay="auto"
                                    // aria-labelledby="non-linear-slider"
                                >
                                </Slider>
                            </div>
                        </ThemeProvider>
                        <ThemeProvider theme={hueSliderTheme}>
                            <div className={styles.sliderControl}>
                                <Typography className={styles.sliderControlLabel}>
                                    Hue
                                </Typography>
                                <Slider
                                    // value={brightness}
                                    defaultValue={0}
                                    min={-180}
                                    max={180}
                                    onChange={(e, val) => {
                                        setHue(parseInt(val))
                                    }}
                                >
                                </Slider>
                            </div>
                        </ThemeProvider>
                    </ThemeProvider>
                    <Button/>

                </div>
            </React.Fragment>
        </ToolProfile>
    )
};

export default ImageFilterTool;