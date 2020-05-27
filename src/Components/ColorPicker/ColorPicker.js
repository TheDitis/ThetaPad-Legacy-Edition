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
        <div className={styles.overlay} onClick={() => props.setShowColorPicker(false)}>
            <div className={styles.colorBubbleContainer}>
                <div className={styles.colorBubble}>
                    <ul className={styles.swatchList}>
                        {allColors.map((color) => {
                            return (
                                <li className={styles.colorSwatch}>
                                    <div
                                        key={uuid()}
                                        style={{backgroundColor: color}}
                                        onClick={() => {props.updateColor(color, props.index)}}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ColorPicker