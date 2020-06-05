import React, {useState} from 'react';
import styles from "./GridMenu.module.css";
import Button from "@material-ui/core/Button";
import ColorPicker from "../ColorPicker/ColorPicker";


const GridMenu = (props) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorPickerLocation, setColorPickerLocation] = useState(null);

    const openColorPicker = (e) => {
        setColorPickerLocation([e.clientX, e.clientY]);
        setShowColorPicker(true)
    };

    const updateColor = (color, index) => {
        props.setGridProps({
            ...props.gridProps,
            color: color
            })
    };

    return (
        <div className={styles.gridMenu}>
            <Button onClick={() => props.setGridOn(!props.gridOn)} className={`${styles.gridButton} ${props.gridOn ? props.classes.buttonSelected : props.classes.buttonUnselected}`}>
                Grid
            </Button>
            <div className={styles.swatch} style={{backgroundColor: props.gridProps.color}} onClick={openColorPicker}>
            </div>
            {showColorPicker ? (
                <ColorPicker

                    {...props}
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    location={colorPickerLocation}
                    updateColor={updateColor}
                />
            ) : null}
        </div>
    )
};


export default GridMenu;