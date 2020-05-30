import React from "react";
import {Transition} from "react-transition-group";
import styles from "./App/App.module.css";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button"

const useStyles = makeStyles({
    stopDrawButton: {
        display: 'absolute',
        zIndex: 12,
        backgroundColor: '#282c34',
        color: 'white',
        borderRadius: 10,
        boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.6)',
        marginRight: '10px',
        '&:hover': {
            color: 'black'
        }
    },
    stopButtonText: {
        fontSize: '14pt',
        margin: '7px',
        marginBottom: '0px'
    },
    stopButtonSubtext: {
        marginBottom: '4px',
        marginTop: '0px',
        fontSize: '10pt'
    }
});

const transitionDuration = 200;

const defaultStyle = {
    transition: `opacity ${transitionDuration}ms ease-in-out`,
    // transform: 'translate(10px)',
    // opacity: 0
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
};

const StopPolyDrawButton = (props) => {

    const classes = useStyles();

    return (
        <Transition in={props.inProp} timeout={transitionDuration}>
            {state => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    <div className={styles.stopDrawButton}>
                        <Button className={classes.stopDrawButton} onClick={() => props.stopPolyDraw(true)}>
                            <div style={{borderRadius: '20px'}}>
                                <h5 className={classes.stopButtonText}>End Line</h5>
                                <h5 className={classes.stopButtonSubtext}>(Esc)</h5>
                            </div>
                        </Button>
                    </div>
                </div>
            )}
        </Transition>
    )
};


export default StopPolyDrawButton
