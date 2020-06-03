import React, {useState, useEffect} from 'react';
import styles from './PolyLineProfile.module.css'
import uuid from "react-uuid";
import ColorPicker from "../../ColorPicker/ColorPicker";
import Button from '@material-ui/core/Button'
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
import Fade from 'react-reveal/Fade';

const useStyles = makeStyles({
    unitSelect: {
        '&:hover': {
            backgroundColor: 'gray'
        },
        marginLeft: '15px',
        marginTop: '4px',
        height: '30px'
    },
    unitSelectSmall: {
        '&:hover': {
            backgroundColor: 'gray'
        },
        marginLeft: '15px',
        marginTop: '2px',
        marginBottom: '9px',
        // height: '15px',
        // height: '30px'
    },
    unitSelectUnselected: {
        backgroundColor: "#e9ebf0",
        height: '30px',
        marginBottom: '10px'
    },
    unitSelectSelected: {
        backgroundColor: 'rgba(82, 82, 82, 1)',
        color: 'white',
        marginBottom: '10px'
    },
    rowNumber: {
        margin: '0px',
        marginRight: '10px',
        marginBottom: '10px',
        paddingTop: '6px',
        paddingLeft: '10px',
        fontSize: '14px',
        padding: '0px',
        width: '25px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderTopRightRadius: '10px'
    },
    deleteSegmentButton: {
        fontSize: '18pt',
        marginLeft: '20px',
        marginRight: '10px',
        cursor: 'pointer'
    }
});


const PolyLineProfile = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);
    // const [showDetails, setShowDetails] = useState(false);

    const line = props.line;
    const classes = useStyles();

    useEffect(() => {

    });

    const toggleIsUnit = (index) => () => {
        let len;
        if (index === -1) {
            len = _.sum(line.distances)
        }
        else {
            len = line.distances[index]
            line.unitSegmentIndex = index
        }
        if (line.isUnit) {
            props.setUnit(1);
            line.isUnit = false;
            line.unitSegmentIndex = -1
        }
        else {
            props.setUnit(len);
            props.unselectAllLines();
            line.isUnit = true
        }
    };

    const toggleShowDetails = (e) => {
        line.showDetails = !line.showDetails;
        props.refresh()
    };

    const openColorPicker = (e) => {
        setColorPickerLocation([e.clientX, e.clientY]);
        console.log('opening color picker');
        setShowColorPicker(true)
    };

    return (
        <React.Fragment>
            <div className={styles.LineProfile} key={uuid()} style={line.isUnit ? {backgroundColor: 'rgba(100, 100, 100, 1)', color: "white"} : {backgroundColor: "#e9ebf0"}}>
                <div className={styles.mainSection}>
                    <div className={styles.leftSide}>
                        <div className={styles.swatch} style={{backgroundColor: line.color}} onClick={openColorPicker}>
                        </div>
                    </div>


                    <div className={styles.rightSide}>

                        <div className={styles.topSection}>
                            <h3 className={styles.lineTitle}>{_.startCase(_.camelCase(line.type))} {props.index}</h3>
                            <Button
                                className={`${classes.unitSelect} ${line.isUnit ? classes.unitSelectSelected : classes.unitSelectUnselected}`}
                                size={'small'} variant={'outlined'} onClick={toggleIsUnit(-1)}>Unit
                            </Button>
                            <a className={styles.deleteButton} onClick={() => props.removeLine(props.index)}>×</a>
                        </div>


                        <div className={styles.bottomSection}>

                            <a>Length: </a>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{(_.sum(line.distances) / props.unit).toFixed(2)}</h5>
                            </div>

                            <a>Angle</a>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{line.angles.length > 0 ? line.angles[0].toFixed(0) : 0}°</h5>
                            </div>

                            <a className={styles.showDetailsArrow} onClick={toggleShowDetails}>▶</a>
                        </div>
                    </div>
                </div>
                {line.showDetails ? (
                    <div className={styles.detailsSection}>
                        {line.displayAngles.map((angle, index) => {
                            return (
                                <div className={styles.detailRow} key={uuid()}>
                                    <h5 className={styles.rowNumber}>{index}</h5>
                                    <div className={styles.numberSectionDetails}>
                                        <a>Angle: </a>
                                        <div className={styles.numberContainerDetails}>
                                            <h5 className={styles.number}>{angle.toFixed(1)}°</h5>
                                        </div>
                                        <a>Length: </a>
                                        <div className={styles.numberContainerDetails}>
                                            <h5 className={styles.number}>{(line.distances[index] / props.unit).toFixed(2)}</h5>
                                        </div>
                                    </div>

                                    <Button
                                        className={`${classes.unitSelectSmall} ${line.unitSegmentIndex === index ? classes.unitSelectSelected : classes.unitSelectUnselected}`}
                                        size={'small'} variant={'outlined'} onClick={toggleIsUnit(index)}>Unit
                                    </Button>
                                    {index === 0 ? (
                                        <a className={classes.deleteSegmentButton} onClick={() => props.removePoint(props.index, 0)}>×</a>
                                    ) : index === line.distances.length - 1 ? (
                                        <a className={classes.deleteSegmentButton} onClick={() => props.removePoint(props.index, index)}>×</a>
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </div>

            {showColorPicker ? (
                <ColorPicker
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    location={colorPickerLocation}
                    {...props}
                />
                ) : null}
        </React.Fragment>
    )
}


export default PolyLineProfile