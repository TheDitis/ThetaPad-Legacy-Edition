import React, {useEffect} from 'react'
import styles from './ColorPicker.module.scss'
import allColors from '../../colorOptions.json'
import uuid from 'react-uuid'


const ColorPicker = props => {
    useEffect(() => {
        window.addEventListener('click', hide);
        return (() => {
            window.removeEventListener('click', hide);
        })
    });

    const hide = () => {
        if (props.showColorPicker) {
            props.setShowColorPicker(false)
        }
    }

    return (
        <div className={styles.overlay} 
             onClick={() => props.setShowColorPicker(false)}
             style={{top: props.location[1] - 100, left: props.location[0]}}
        >
            <ul className={styles.swatchList}>
                {allColors.map((color) => {
                    return (
                        <li key={uuid()}>
                            <div
                                className={styles.colorSwatch}
                                style={{backgroundColor: color}}
                                onClick={() => {props.updateColor(color, props.index)}}
                            />
                        </li>
                    )
                })}
                <li >
                    <div className={styles.blackWhiteContainer}>
                        <div className={styles.blackSwatch} onClick={() => {props.updateColor('black', props.index)}}/>
                        <div className={styles.whiteSwatch} onClick={() => {props.updateColor('white', props.index)}}/>
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default ColorPicker