import React, {useEffect} from 'react'
import styles from './ColorPicker.module.css'
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
                    {allColors.map((color) => {
                        return (
                            <div
                                key={uuid()}
                                style={{backgroundColor: color, height: '20px', width: '20px', alignItems: 'center'}}
                                onClick={() => {
                                    props.updateColor(color, props.index)
                                    // let allLines = props.lineList;
                                    // allLines[props.index].color = color;
                                    // props.setLineList(allLines)
                                    //
                                    // props.lineList[props.index].color = color;
                                }}
                            />
                            )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ColorPicker