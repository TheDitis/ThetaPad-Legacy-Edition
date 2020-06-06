import React, {useState, useEffect} from 'react';
import styles from './PolyLineProfile.module.css'
import uuid from "react-uuid";
import ColorPicker from "../../ColorPicker/ColorPicker";
import Button from '@material-ui/core/Button'
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
import {Transition} from "react-transition-group";
import Fade from 'react-reveal/Fade';
import AngleIcon from "../../Icons/AngleIcon";
import LengthIcon from "../../Icons/LengthIcon";
import PolyLineIcon from "../../Icons/PolyLineIcon";

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
        marginLeft: '8px',
        marginRight: '10px',
        cursor: 'pointer'
    },
    rowNumberSelected: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: 'black'
    },
    rowNumberUnselected: {
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    }
});


const PolyLineProfile = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);

    const line = props.line;
    const classes = useStyles();

    const toggleIsUnit = (index, segment) => () => {
        let len;
        if (index === -1) {
            len = _.sum(line.distances)
        }
        else {
            len = line.distances[index]
            line.unitSegmentIndex = index
        }
        if (line.isUnit) {
            console.log('here')
            props.setUnit(1);
            if (segment) {
                line.unitSegmentIndex = index;
                props.setUnit(line.distances[index])
                console.log('segment true')
            }
            else {
                console.log('segment false')
                line.isUnit = false;
                line.unitSegmentIndex = -1
            }
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
                            <div className={styles.lineTypeIcon}>
                                <PolyLineIcon/>
                            </div>
                            <h3 className={styles.lineTitle}>{_.startCase(_.camelCase(line.type))} {props.index}</h3>
                            <Button
                                className={`${classes.unitSelect} ${line.isUnit ? classes.unitSelectSelected : classes.unitSelectUnselected}`}
                                size={'small'} variant={'outlined'} onClick={toggleIsUnit(-1, false)}>Unit
                            </Button>
                            <a className={styles.deleteButton} onClick={() => props.removeLine(props.index)}>×</a>
                        </div>

                        <div className={styles.bottomSection}>

                            <LengthIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{(_.sum(line.distances) / props.unit) < 30 ? (_.sum(line.distances) / props.unit).toFixed(2) : Math.round((_.sum(line.distances) / props.unit))}</h5>
                            </div>

                            <div style={{marginLeft: 10}}>
                                <AngleIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                            </div>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{line.angles.length > 0 ? line.angles[0].toFixed(1) : 0}°</h5>
                            </div>

                            <ExpandArrow toggleShowDetails={toggleShowDetails} in={line.showDetails}/>
                        </div>
                    </div>
                </div>
                {line.showDetails ? (
                    <div className={styles.detailsSection}>
                        {line.displayAngles.map((angle, index) => {
                            return (
                                <div className={styles.detailRow} key={uuid()}>
                                    <h5 className={`${styles.rowNumber} ${line.unitSegmentIndex === index ? classes.rowNumberSelected : classes.rowNumberUnselected}`} onClick={toggleIsUnit(index, true)}>{index}</h5>
                                    <div className={styles.numberSectionDetails}>
                                        <div style={{marginLeft: 10}}>
                                            <LengthIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                                        </div>
                                        <div className={styles.numberContainerDetails}>
                                            <h5 className={styles.number}>{(line.distances[index] / props.unit) < 30 ? (line.distances[index] / props.unit).toFixed(2) : Math.round((line.distances[index] / props.unit))}</h5>
                                        </div>
                                        <div style={{marginLeft: 10}}>
                                            <AngleIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                                        </div>
                                        <div className={styles.numberContainerDetails}>
                                            <h5 className={styles.number}>{angle.toFixed(1)}°</h5>
                                        </div>
                                    </div>
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
};

const defaultStyle = {
    transition: `transform 1s ease-in-out`,
    position: 'absolute',
    cursor: 'pointer',
    // right: '20px',
    transform: 'scaleX(0.7) rotate(0deg)',
    marginTop: 10,
    right: '0.8vw'
};

const transitionStyles = {
    entering: { transform: 'scaleX(0.7) rotate(0deg)' },
    entered:  { transform: 'scaleY(0.7) rotate(90deg)' },
    exiting:  { transform: 'scaleY(0.7) rotate(90deg)' },
    exited:  { transform: 'scaleX(0.7) rotate(0deg)' }
};


const ExpandArrow = props => {
    return (
        <Transition in={props.in} timeout={{
            appear: 500,
            enter: 300,
            exit: 500,
        }}>
            {state => (
                <a onClick={props.toggleShowDetails} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    ▶
                </a>
            )}
        </Transition>
    )
};


export default PolyLineProfile;
