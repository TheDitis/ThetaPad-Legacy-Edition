import React from 'react';
import {useState, useEffect} from 'react';
import styles from './App.module.css';
import Konva from 'konva'
import {Stage, Layer, Rect, Text, Circle, Line, Ellipse} from 'react-konva';
import {Image as KonvaImage} from 'react-konva'
import uuid from 'react-uuid';
import _ from 'lodash';
import ImageUploader from 'react-images-upload';
import Button from '@material-ui/core/Button'
import useImage from "use-image";


const Lines = props => {
    return (
        props.list.map( data => {
            if (_.has(data, 'x2')) {
                const widthSub = window.innerWidth * 0.3
                const points = [data.x1 - widthSub, data.y1, data.x2 - widthSub, data.y2];
                return (
                    <React.Fragment key={uuid()}>
                        <Line key={uuid()} x={0} y={0} stroke={props.color} points={points} strokeWidth={1}/>
                        <Text
                            text={data.text}
                            x={data.x1 - widthSub - 5}
                            y={data.y1 + 10}
                            rotation={data.angle}
                            fontSize={15}
                            fill={props.color}
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

const UserImage = (props) => {
    const [image] = useImage(props.url)
    return (
        <Layer>
            <KonvaImage image={image}/>
        </Layer>
        )
}

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

    const handleUpload = (pictures) => {
        console.log(pictures[0]);
        const url = URL.createObjectURL(pictures[0]);
        // let img = new Image();
        // img.src = url;
        //
        // img.onload = () => {
        //     console.log('loaded:', img)
        //     setImage(i)mg;
        // };
        setImage(url);
        // console.log(img)
    };

    const changeColor = () => {
        const nextInd = (colorInd + 1) < allcolors.length ? colorInd + 1 : 0;
        const nextCol = allcolors[nextInd];
        setColorInd(nextInd);
        setColor(nextCol)
    };

    const undo = (e) => {
        // TODO: Add ctrl-z
        let allLines = lineList;
        allLines.pop();
        setLineList(allLines);
        // for some reason it wont update until you mouse over canvas unless I have these:
        setMouseX(e.clientX + Math.random());
        setMouseY(e.clientY + Math.random());
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Choose image'
                        onChange={handleUpload}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={20971520}
                        withIcon={false}
                        withLabel={false}
                        singleImage={false}
                        buttonStyles={{backgroundColor: 'rgb(0, 150, 255)'}}
                        fileContainerStyle={{backgroundColor: 'transparent', height: 10}}
                    />
                    <Button onClick={changeColor} style={ { backgroundColor: "white", margin: 10 }}>Cycle Color</Button>
                    <Button onClick={undo} style={ { backgroundColor: "white", margin: 10 }}>Undo</Button>
                    <hr style={{width: "85%"}}/>
                </div>
                <div className={styles.drawingArea} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                    <Stage width={window.innerWidth * 0.7} height={window.innerHeight}>
                        {image ? <UserImage url={image}/> : null}
                        <Layer>
                            {/*{image ? <Image image={image}/> : <Text>No Image</Text>}*/}
                            {/*<Text text={"Cycle Color"} fontSize={25} onClick={changeColor}/>*/}
                            <Lines list={lineList} color={color}/>
                        </Layer>
                    </Stage>
                </div>

                {/*<img src={image} alt={'img'}/>*/}
            </div>


        </div>
    );
}

export default App;
