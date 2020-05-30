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
    unitSelectUnselected: {
        backgroundColor: "#e9ebf0",
    },
    unitSelectSelected: {
        backgroundColor: 'rgba(82, 82, 82, 1)',
        color: 'white'
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

    const toggleIsUnit = (e) => {
        if (line.isUnit) {
            props.setUnit(1);
            line.isUnit = false;
        }
        else {
            props.setUnit(line.length);
            props.unselectAllLines();
            line.isUnit = true
        }
    };

    const toggleShowDetails = (e) => {
        line.showDetails = !line.showDetails
        props.refresh()
    };

    const openColorPicker = (e) => {
        setColorPickerLocation([e.clientX, e.clientY]);
        console.log('opening color picker')
        setShowColorPicker(true)
    };

    return (
        <React.Fragment>
            <div className={styles.LineProfile} key={uuid()} style={line.isUnit ? {backgroundColor: 'rgba(120, 120, 120, 1)', border: '3px solid black'} : {backgroundColor: "#e9ebf0"}}>
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
                                size={'small'} variant={'outlined'} onClick={toggleIsUnit}>Unit</Button>
                            <a className={styles.deleteButton} onClick={() => props.removeLine(props.index)}>×</a>
                        </div>

                        {/*<hr/>*/}

                        <div className={styles.bottomSection}>

                            <a>Length: </a>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{(line.length / props.unit).toFixed(2)}</h5>
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
                        {line.angles.map((angle, index) => {
                            return (
                                <div className={styles.detailRow} key={uuid()}>
                                    <a>Angle {index}</a>
                                    <div className={styles.numberContainer}>
                                        <h5 className={styles.number}>{angle.toFixed(0)}°</h5>
                                    </div>
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
            {/*<ColorPicker/>*/}
        </React.Fragment>
    )
}


export default PolyLineProfile