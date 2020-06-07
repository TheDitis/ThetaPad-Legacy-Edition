import React, { useState } from "react";
import styles from './ToolProfile.module.scss'


const ToolProfile = (props) => {
    const getComponent = (key) => {
        return props.children.filter((comp) => {
            return comp.key === key;
        })
    };
    return (
        <div className={styles.ToolProfile}>
            <div className={styles.mainSection}>
                {getComponent('main')}
            </div>
            <div className={styles.controlSection}>
                {getComponent('controls')}
            </div>
        </div>
    )
};


export default ToolProfile;