import React, {useState} from 'react';
import styles from './StraightLineProfile.module.css'
import uuid from "react-uuid";
import ColorPicker from "../../ColorPicker/ColorPicker";
import Button from '@material-ui/core/Button'
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
// import LengthIcon from '../../../Assets/Icons/LengthIcon.svg'
import LengthIcon from "../../Icons/LengthIcon";
import AngleIcon from "../../Icons/AngleIcon";

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
    },
    numberLabelsUnselected: {
        textAlign: 'left',
        marginLeft: '8px',
        fill: 'black',
    },
    numberLabelsSelected: {
        textAlign: 'left',
        marginLeft: '8px',
        fill: 'white',
        stroke: 'white'
    }
});


const StraightLineProfile = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);
    // const [isUnit, setIsUnit] = useState();

    const line = props.line;

    const classes = useStyles();

    const toggleIsUnit = (e) => {
        if (line.isUnit) {
            props.setUnit(1);
            line.isUnit = false;
        }
        else {
            props.setUnit(line.length);
            props.unselectAllLines()
            line.isUnit = true
        }
    };

    const openColorPicker = (e) => {
        setColorPickerLocation([e.clientX, e.clientY]);
        setShowColorPicker(true)
    };

    return (
        <React.Fragment>
            <div className={styles.LineProfile} key={uuid()} style={line.isUnit ? {backgroundColor: 'rgba(100, 100, 100, 1)', color: 'white'} : {backgroundColor: "#e9ebf0"}}>
                <div className={styles.leftSide}>
                    <div className={styles.swatch} style={{backgroundColor: line.color}} onClick={openColorPicker}>
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.topSection}>
                        <h3 className={styles.lineTitle}>{_.startCase(_.camelCase(line.type))} {props.index}</h3>
                        <Button className={`${classes.unitSelect} ${line.isUnit ? classes.unitSelectSelected : classes.unitSelectUnselected}`} size={'small'} variant={'outlined'} onClick={toggleIsUnit}>Unit</Button>
                        <a className={styles.deleteButton} onClick={() => props.removeLine(props.index)}>×</a>
                    </div>

                    <hr/>

                    <div className={styles.bottomSection} style={{color: 'black'}}>
                        {/*<img className={line.isUnit ? classes.numberLabelsSelected : classes.numberLabelsUnselected} src={LengthIcon} alt={'Length:'} width={30}/>*/}
                        <LengthIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                        <div className={styles.numberContainer}>
                            <h5 className={styles.number}>{(line.length / props.unit).toFixed(0)}</h5>
                        </div>
                        <React.Fragment>
                            <div style={{marginLeft: 10}}>
                                <AngleIcon color={line.isUnit ? '#ffffff' : '#000000'} size={0.23}/>
                            </div>
                            <div className={styles.numberContainer}>
                                <h5 className={styles.number}>{line.angles.length > 0 ? line.angles[0].toFixed(0) : 0}°</h5>
                            </div>
                        </React.Fragment>
                    </div>
                </div>
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


export default StraightLineProfile