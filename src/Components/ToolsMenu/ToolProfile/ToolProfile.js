import React, { useState } from "react";
import styles from './ToolProfile.module.scss';
import {motion} from 'framer-motion';


const ToolProfile = (props) => {
    const [showControls, setShowControls] = useState(false);

    const getComponent = (key) => {
        return props.children.filter((comp) => {
            return comp.key === key;
        })
    };

    const toggleShowControls = () => {
        if (showControls) {
            setShowControls(false)
        }
        else if (props.isActive) {
            setShowControls(true)
        }
    };

    return (
        <div className={styles.ToolProfile}>
            <div className={styles.mainSection}>
                {getComponent('main')}

                    <div className={styles.showMoreArrowDiv}>
                        <motion.div
                            animate={{
                                rotate: showControls && props.isActive ? 90 : 0
                            }}
                        >
                            <a onClick={toggleShowControls} style={{color: props.isActive ? 'black' : 'gray'}}>▶</a>
                        </motion.div>
                    </div>
            </div>
                <motion.div
                    animate={ { scaleY: showControls ? 1 : 0 } }
                    initial={false}
                >
                    {showControls && props.isActive ? (
                        <div className={styles.controlSection}>
                            {getComponent('controls')}
                        </div>
                    ) : null }
                </motion.div>
        </div>
    )
};


export default ToolProfile;