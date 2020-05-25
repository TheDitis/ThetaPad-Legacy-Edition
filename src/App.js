import React from 'react';
import {useState, useEffect} from 'react';
import styles from './App.module.css';
import {Stage, Layer, Image, Rect, Text, Circle, Line, Ellipse} from 'react-konva';
import uuid from 'react-uuid';
import _ from 'lodash';
import ImageUploader from 'react-images-upload';


const Lines = props => {
    return (
        props.list.map( data => {
            if (_.has(data, 'x2')) {
                const points = [data.x1, data.y1, data.x2, data.y2];
                return (
                    <React.Fragment key={uuid()}>
                        <Line key={uuid()} x={0} y={0} stroke={props.color} points={points} strokeWidth={1}/>
                        <Text
                            text={data.text}
                            x={data.x1 - 10}
                            y={data.y1 + 10}
                            rotation={data.angle}
                            fontSize={15}
                        />
                    </React.Fragment>
                )
            }

        })
    )
};

const getAngle = (pt1, pt2) =>  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;

const distance = (a, b) => {
    const [x1, y1] = a;
    const [x2, y2] = b;
    const xdist = Math.abs(x1 - x2);
    const ydist = Math.abs(y1 - y2);
    return Math.sqrt(xdist ** 2 + ydist ** 2);
};

const allcolors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];


function App() {
    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);
    const [lineList, setLineList] = useState([]);
    const [mouseDown, setMouseDown] = useState(false);
    const [image, setImage] = useState(null);
    const [colorInd, setColorInd] = useState(0);
    const [color, setColor] = useState(allcolors[0]);
    // const [curImage, setCurrentImage] = useState(null)
    const [imgDims, setImgDims] = useState(null);
    // const [image] = useImage("https://lh3.googleusercontent.com/SB4W0XQWAyE_W-Zukt3M2Np_bLZh0MLJdX1Q2Hw2UPj0h9MYetkbZ_grVesfsLEpZJARdZM0lCDVrvwa0FLrUwVSubVPr1V6vBmEY540gtHXKJNy574ud5GJ1xhcRNaTKyKRXGPrgQjBAmqYTxY8a4n7zEbly3-wz_fz5s0GPILXHtSoMozCy1z2LHGNWNid8BAyACstNOzYWAOu4CP1Ifvk9cIu45XhNyd_In6Mw7rYD53m5gkDMNsJPHkKyI8TnXzkZ9pv-54VsHL8Ow6S6aNiZLUJz66wmRQbKpmLysxB8XIUjIICcIYUhPTK1eYbPOYV2Vbe8hIRA9_a2FXiKrc4irSsoIXMJSXIH67XnEH0jm0qYhPmomjNTXHwbWtPGT7LcfanYOuKlN6iMnAaExlPYTEbQ6VJC2GLkQJ0_AQXUJjVhPP3z3OYlrbUM8V9XEKzpZ5lB1_Jxkd9jzzcnLEbkbfMWMlYvVlqY2Z06J7LgfFeHNonz8JSdYA0DMvGu-J21TYNbXUUFD15y5KZZFX6XpaLbTHr1F8KiqhoFf0WVwyxzgDRdMeV2M2sMVoWs8qCIxuMjAShuPuzWj6KYr44ZFwkTy2rj4DBjelLvpeQuoLFst6i6phgCQlDERJ9hn4psjkW3oTYI0wVbsI7rHYmU398OERHnvWs1vQnvKUkkQbPw50Jbx1lkLY1H7Y=w1208-h1610-no?authuser=0")

    useEffect(() => {
        window.addEventListener('resize', resize)
    }, []);


    const resize = e => {

        handleMouseMove(e)
    }

    const handleMouseMove = e => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
        if (mouseDown){
            let currentLine = lineList[lineList.length - 1];
            currentLine.x2 = mouseX;
            currentLine.y2 = mouseY;

            const angle = getAngle(
                {x: currentLine.x1, y: currentLine.y1}, {x: currentLine.x2, y: currentLine.y2}
                );
            const text = distance([currentLine.x1, currentLine.y1], [currentLine.x2, currentLine.y2])
                .toFixed(1)
                .toString()
            currentLine.angle = angle;
            currentLine.text = text;
        }
    };

    const handleMouseDown = e => {
        const x1 = e.clientX;
        const y1 = e.clientY;
        let allLines = lineList;
        let line = {x1: x1, y1: y1};

        setMouseDown(true);
        allLines.push(line);
        setLineList(allLines);
        if (allLines.length > 50) {
            allLines.shift();
        }
    };

    const handleMouseUp = e => {
        let allLines = lineList;
        let currentLine = allLines[allLines.length - 1];
        currentLine.x2 = e.clientX;
        currentLine.y2 = e.clientY;
        allLines[allLines.length - 1] = currentLine;
        setMouseDown(false);
    };

    const onDrop = (picture) => {
        setImage(picture)
    };

    const changeColor = () => {
        const nextInd = (colorInd + 1) < allcolors.length ? colorInd + 1 : 0;
        const nextCol = allcolors[nextInd];
        setColorInd(nextInd);
        setColor(nextCol)
    };

    const removeLine = (e) => {
        let allLines = lineList;
        allLines.pop();
        setLineList(allLines);
        // for some reason it wont update until you mouse over canvas unless I have these:
        setMouseX(e.clientX);
        setMouseY(e.clientY);
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <div className={styles.drawingArea} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                    <Stage width={window.innerWidth * 0.7} height={window.innerHeight * 0.8}>
                        {/*<Layer>*/}
                        {/*    <Image image={image} width={window.innerWidth}/>*/}
                        {/*</Layer>*/}
                        <Layer>
                            {/*{image ? <Image image={image}/> : <Text>No Image</Text>}*/}
                            {/*<Text text={"Cycle Color"} fontSize={25} onClick={changeColor}/>*/}
                            <Lines list={lineList} color={color}/>
                        </Layer>
                    </Stage>
                </div>
                <div className={styles.sidebar}>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose image'
                        onChange={onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        withIcon={false}
                        withLabel={false}
                        singleImage={false}
                        buttonStyles={{backgroundColor: 'rgb(0, 150, 255)'}}
                        fileContainerStyle={{backgroundColor: 'transparent', height: 10}}
                    />
                </div>
            </div>
            <button onClick={changeColor}>Cycle Color</button>
            <button onClick={removeLine}>Undo</button>

        </div>
    );
}

export default App;
