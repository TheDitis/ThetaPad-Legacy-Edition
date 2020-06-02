import {useState, useEffect} from 'react';


const useMultiKeyPress = (targetKey1, targetKey2) => {
    // State for keeping track of whether key is pressed
    const [key1Pressed, setKey1Pressed] = useState(false);
    const [key2Pressed, setKey2Pressed] = useState(false);
    const [bothPressed, setBothPressed] = useState(false);

    // If pressed key is our target key then set to true
    function downHandler({ key }) {
        console.log(key, 'down');
        if (key === targetKey1) {
            setKey1Pressed(true);
        }
        if (key === targetKey2) {
            setKey2Pressed(true)
        }
        if (key1Pressed && key2Pressed) {
            setBothPressed(true)
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
        console.log(key, 'up')
        if (key === targetKey1) {
            setKey2Pressed(false);
        }
        else if (key === targetKey2) {
            setKey2Pressed(false)
        }
        setBothPressed(false)
    };



    document.onkeydown = downHandler;
    document.onkeyup = upHandler;

    // Add event listeners
    useEffect(() => {
        // window.addEventListener('keydown', downHandler);
        // window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        // return () => {
        //     window.removeEventListener('keydown', downHandler);
        //     window.removeEventListener('keyup', upHandler);
        // };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return bothPressed;
};

export default useMultiKeyPress;