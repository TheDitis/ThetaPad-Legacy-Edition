import React, {useEffect} from 'react'
import styles from './ColorPicker.module.css'


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

                </div>
            </div>
        </div>
    )
}

export default ColorPicker