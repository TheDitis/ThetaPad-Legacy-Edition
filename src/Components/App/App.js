import React from 'react';
import {useState, useEffect, useRef} from 'react';
import styles from './App.module.css';
import Konva from 'konva'
import {Stage, Layer, Rect, Text, Circle, Line, Ellipse} from 'react-konva';
import {Image as KonvaImage} from 'react-konva'
import uuid from 'react-uuid';
import _ from 'lodash';
import useImage from "use-image";
import allColors from '../../colorOptions.json'
import Lines from "../Lines/Lines";

import SideBar from "../SideBar/SideBar";


const getAngle = (pt1, pt2) =>  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;

const distance = (a, b) => {
    const [x1, y1] = a;
    const [x2, y2] = b;
    const xdist = Math.abs(x1 - x2);
    const ydist = Math.abs(y1 - y2);
    return Math.sqrt(xdist ** 2 + ydist ** 2);
};

const UserImage = (props) => {
    const [image] = useImage(props.url);
    return (
        <Layer>
            <KonvaImage ref={props.imgRef} image={image} {...props}/>
        </Layer>
    )
};

const widthSub = window.innerWidth * 0.3;


function App() {
    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);
    const [lineList, setLineList] = useState([]);
    const [mouseDown, setMouseDown] = useState(false);
    const [drawMode, setDrawMode] = useState('line');
    const [inPolyDraw, setInPolyDraw] = useState(false);
    const [newPolyLine, setNewPolyLine] = useState(true)
    const [image, setImage] = useState(null);
    const [origImgDims, setOrigImgDims] = useState(null);
    const [imgDims, setImgDims] = useState([0, 0]);
    const [cmdKey, setCmdKey] = useState(null);
    const [unit, setUnit] = useState(1);

    let prevWinDims = [window.innerWidth, window.innerHeight];

    document.onkeydown = (e) => {
        if (e.key === 'Escape') {
            console.log('Escape Pressed');
            setNewPolyLine(true);
            if (inPolyDraw) {
                stopPolyDraw()
            }
        }
        else if (e.key === 'Meta') {
            setCmdKey(true);
            console.log("cmdKey: ", cmdKey)
        }
        else if (e.key === 'z') {
            console.log('z key pressed');
            if (cmdKey) {
                undo();
                refresh();
            }
        }
    };
    document.onkeyup = (e) => {
        if (e.key === 'Meta') {
            setCmdKey(false)
            console.log("cmdKey: ", cmdKey)
        }
    };

    useEffect(() => {
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, []);

    useEffect(() => {
        calcImgDims();
    }, [image]);

    const refresh = () => {
        setMouseX(window.innerWidth * 0.5 + Math.random());
        setMouseY(window.innerHeight * 0.5 + Math.random());
    };

    const updateColor = (color, index) => {
        let allLines = lineList;
        allLines[index].color = color;
        setLineList(allLines);
        refresh()
    };
    
    const removeLine = (index) => {
        let allLines = lineList;
        allLines.splice(index, 1);
        setLineList(allLines);
        refresh();
    };

    const resize = e => {
        handleMouseMove(e);
        e.preventDefault();
        // console.log('here');
        const ratio = getSizeRatio(prevWinDims, [window.innerWidth, window.innerHeight]);
        // console.log('ratio', ratio);
        setImgDims((dims) => {
            return [dims[0] * ratio, dims[1] * ratio]
        });
        // console.log('post resize dims:', imgDims)
        prevWinDims = [window.innerWidth, window.innerHeight]
    };

    const calcImgDims = () => {
        if (origImgDims) {
            const preDims = origImgDims;
            // console.log('calculating target dimensions')
            const canvasDims = [window.innerWidth * 0.7, window.innerHeight];
            const ratio = getSizeRatio(origImgDims, canvasDims);
            // console.log('ratio:', ratio);
            setImgDims([origImgDims[0] * ratio, origImgDims[1] * ratio]);
        }
    };

    const getSizeRatio = (imageDims, canvasDims) => {
        let diffs = [0, 0];
        let dimsInds = [0, 1];
        for (const index of dimsInds) {
            diffs[index] = canvasDims[index] - imageDims[index]
        }
        const closerDimInd = diffs.indexOf(Math.min(...diffs));
        return canvasDims[closerDimInd] / imageDims[closerDimInd];
    };

    const handleMouseMove = e => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
        if (mouseDown || inPolyDraw){
            // console.log("in mouse Move")
            let currentLine = lineList[lineList.length - 1];
            currentLine.x2 = mouseX;
            currentLine.y2 = mouseY;
            if (currentLine.points.length > 2) {
                currentLine.points.pop();
                currentLine.points.pop();
                currentLine.points.push(e.clientX - widthSub);
                currentLine.points.push(e.clientY);
            }

            // currentLine.points[currentLine.length - 2] = mouseX - widthSub;
            // currentLine.points[currentLine.length - 1] = mouseY;
            // currentLine.points[currentLine.length - 2] = 0
            // currentLine.points[currentLine.length - 1] = 0

            let length;

            if (drawMode === 'line') {
                length = distance([currentLine.x1, currentLine.y1], [currentLine.x2, currentLine.y2])
                    .toFixed(0)
                    .toString();
                const angle = getAngle(
                    {x: currentLine.x1, y: currentLine.y1}, {x: currentLine.x2, y: currentLine.y2}
                );
                currentLine.angles[0] = angle;
            }
            else if (drawMode === 'poly') {
                // for (let i; i++; i<)
                let separatedLines = _.chunk(currentLine.points, 4);
                console.log('separated:', separatedLines);
                // currentLine.points.forEach(( coord, index ) => {
                //
                // });
                length = distance([currentLine.x1, currentLine.y1], [currentLine.x2, currentLine.y2])
                    .toFixed(0)
                    .toString();

                const x1 = currentLine.points[currentLine.points.length - 4];
                const x2 = currentLine.points[currentLine.points.length - 2];
                const y1 = currentLine.points[currentLine.points.length - 3];
                const y2 = currentLine.points[currentLine.points.length - 1];
                console.log('points:', x1, y1, x2, y2);
                const angle = getAngle({ x: x1, y: y1 }, { x: x2, y: y2 });
                const index = currentLine.points.length / 2 - 1;
                console.log('angle: ', angle);
                if (angle) {
                    currentLine.angles[currentLine.lineCount - 1] = angle;
                }

                console.log('line:', currentLine)
            }

            currentLine.length = length;
        }
    };



    const startLine = (x, y) => {
        let allLines = lineList;
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        const widthSub = window.innerWidth * 0.3;
        let line = {x1: x, y1: y, color: color, type: drawMode, points: [x - widthSub, y], angles: []};
        setMouseDown(true);
        allLines.push(line);
        setLineList(allLines);
        if (allLines.length > 50) {
            allLines.shift();
        }
    };

    const endLine = (x, y) => {
        if (mouseDown) {
            let allLines = lineList;
            let currentLine = allLines[allLines.length - 1];
            currentLine.points.push(x - widthSub);
            currentLine.points.push(y)
            currentLine.x2 = x;
            currentLine.y2 = y;
            allLines[allLines.length - 1] = currentLine;
            if (!(currentLine.length) || Math.round(currentLine.length) === 0) {
                allLines.pop();
            }
            setMouseDown(false);
            setLineList(allLines);
        }
    };

    const drawPoly = (x, y) => {
        if (newPolyLine) {
            setInPolyDraw(true);
            setNewPolyLine(false);
            startPoly(x, y);
            addPolyPoint(x, y)
        }
        else {
            // startLine(x, y);
            addPolyPoint(x, y)
        }

    };

    const startPoly = (x, y) => {
        let allLines = lineList;
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        const widthSub = window.innerWidth * 0.3;
        let line = {x1: x, y1: y, color: color, type: 'poly', angles: [], lineCount: 0};
        line.points = [x - widthSub, y];
        // setMouseDown(true);
        allLines.push(line);
        setLineList(allLines);
        console.log('first line:', line)
        refresh()
        if (allLines.length > 50) {
            allLines.shift();
        }
    }

    const addPolyPoint = (x, y) => {
        let allLines = lineList;
        let currentLine = allLines[allLines.length - 1];
        currentLine.points.push(x - widthSub);
        currentLine.points.push(y);
        currentLine.lineCount ++
        setLineList(allLines)
    };

    const stopPolyDraw = () => {
        const currentLine = lineList[lineList.length - 1];
        currentLine.points.pop();
        currentLine.points.pop();
        setInPolyDraw(false);
        setMouseDown(false);
    };

    const handleMouseDown = e => {
        const x = Math.round(e.clientX);
        const y = Math.round(e.clientY);
        switch (drawMode) {
            case 'line':
                startLine(x, y);
                break;
            case 'poly':
                drawPoly(x, y);
                break;
            default:
                break;
        }

    };

    const handleMouseUp = e => {
        const x = e.clientX;
        const y = e.clientY;

        switch (drawMode) {
            case 'line':
                endLine(x, y);
                break;
            case 'poly':
                // addPolyPoint(x, y);
                break;
            default:
                break;
        }

    };

    const clearAll = () => {
        setImage(null);
        setLineList([])
        // setOrigImgDims(null);
        setImgDims([0, 0])
    };

    const handleUpload = (pictures) => {
        const picture = pictures[pictures.length - 1];
        // console.log(pictures);
        clearAll();
        imageFromFile(picture)
    };

    const imageFromFile = (picture) => {
        const url = URL.createObjectURL(picture);
        const fr = new FileReader();
        let imageObj;
        fr.onload = () => {
            const img = new Image();
            img.onload = () => {
                console.log('Image dims:', img.width, img.height);
                setOrigImgDims([img.width, img.height]);
                setImgDims([img.width, img.height]);
                setImage(url);
            };
            img.src = fr.result;
            imageObj = img
        };
        fr.readAsDataURL(picture);
    };

    const undo = () => {
        // TODO: Add ctrl-z
        let allLines = lineList;
        allLines.pop();
        setLineList(allLines);
        // for some reason it wont update until you mouse over canvas unless I have these:
        setMouseX(window.innerWidth * 0.5 + Math.random());
        setMouseY(window.innerHeight * 0.5 + Math.random());
        refresh()
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <SideBar undo={undo} handleUpload={handleUpload} lineList={lineList} updateColor={updateColor} removeLine={removeLine} setDrawMode={setDrawMode} unit={unit} setUnit={setUnit}/>
                <div className={styles.drawingArea} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                    <Stage width={window.innerWidth * 0.7} height={window.innerHeight}>
                        {image ? <UserImage url={image} width={imgDims[0]} height={imgDims[1]}/> : null}
                        <Layer>
                            <Lines list={lineList} unit={unit} widthSub={widthSub}/>
                        </Layer>
                    </Stage>
                </div>

                {/*<img src={image} alt={'img'}/>*/}
            </div>


        </div>
    );
}

export default App;
