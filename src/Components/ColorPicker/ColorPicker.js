import React, {useEffect} from 'react'
import styles from './ColorPicker.module.scss'
import allColors from '../../colorOptions.json'
import uuid from 'react-uuid'


const ColorPicker = props => {

    // On mount:
    useEffect(() => {
        window.addEventListener('click', close);  // add click event listener to close the color picker next click
        return (() => {  // cleanup function
            window.removeEventListener('click', close);  // remove the event listener
        })
    }, []);

    // function to unmount the component
    const close = () => props.setShowColorPicker(false);

    return (
        <div className={styles.overlay} 
             onClick={close}
             style={{top: props.location[1] - 100, left: props.location[0]}}
        >
            <ul className={styles.swatchList}>
                {allColors.map((color) => {  // for each color on the wheel:
                    // render a list item consisting of a div with the current color as its background
                    return (
                        <li key={uuid()}>
                            <div
                                className={styles.colorSwatch}
                                style={{backgroundColor: color}}
                                onClick={() => props.updateColor(color, props.index)}
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