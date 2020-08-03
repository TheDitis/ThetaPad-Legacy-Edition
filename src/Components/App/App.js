import React from 'react';
import {useState, useEffect, useRef} from 'react';
import styles from './App.module.css';
import Konva from "konva";
import {Stage, Layer, Rect, Text, Circle, Line, Ellipse} from 'react-konva';
import {Image as KonvaImage} from 'react-konva'
import useImage from "use-image";
import allColors from '../../colorOptions.json'
import Lines from "../Lines/Lines";
import SideBar from "../SideBar/SideBar";
import StopPolyDrawButton from "../StopPolyDrawButton";
import Grid from "../Grid/Grid";

export const getAngle = (pt1, pt2) =>  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;


export const distance = (a, b) => {
    const [x1, y1] = a;  // separate x and y from each coordinate
    const [x2, y2] = b;
    const xdist = Math.abs(x1 - x2);  // get the difference of each dimension (x & y)
    const ydist = Math.abs(y1 - y2);
    return Math.sqrt(xdist ** 2 + ydist ** 2);  // use pythagorean theorem to find absolute distance
};

const UserImage = (props) => {
    const [image] = useImage(props.url,);
    return (
        <Layer>
            <KonvaImage
                filters={[Konva.Filters.Blur]}
                blurRadius={10}
                image={image} {...props}/>
        </Layer>
    )
};


function App() {
    const [mouseX, setMouseX] = useState(null);  // mouse location in the x dimension
    const [mouseY, setMouseY] = useState(null);  // mouse location in the y dimension
    const [lineList, setLineList] = useState([]);  // list of all lines to be drawn
    const [mouseDown, setMouseDown] = useState(false);  // boolean representing whether or not the mouse is clicked
    const [drawMode, setDrawMode] = useState('line');  // string representing the type of line that is being drawn
    const [inPolyDraw, setInPolyDraw] = useState(false);  // boolean: whether or not you are in the middle of drawing a poly line
    const [image, setImage] = useState(null);  // the image uploaded by the user
    const [origImgDims, setOrigImgDims] = useState(null);  // the dimensions of the users image before transformation
    const [imgDims, setImgDims] = useState([0, 0]);  // dimensions of the image after transformation
    const [cmdKey, setCmdKey] = useState(false);  // boolean: whether or not Cmd / Ctrl key is pressed
    const [shiftKey, setShiftKey] = useState(null);  // boolean: whether or not shift key is pressed
    const [unit, setUnit] = useState(1);  // The base unit that we measure all lines relative to
    const [gridOn, setGridOn] = useState(false);  // boolean: whether or not the grid overlay should be shown
    const [sideBarWidth, setSideBarWidth] = useState(window.innerWidth * 0.3);  // the width of the sidebar
    const [gridProps, setGridProps] = useState({
        color: 'black',
        nColumns: 8,
        nRows: 12,
        width: window.innerWidth - sideBarWidth,
        height: window.innerHeight,
        strokeWidth: 1,
        opacity: 0.8
    });  // all of the parameters of the grid
    const [redoBuffer, setRedoBuffer] = useState([]);  // buffer of lines that you undid


    const [canvasSize, sizeCanvasSize] = useState(null);
    const [imageStyle, setImageStyle] = useState({});


    let prevWinDims = [window.innerWidth, window.innerHeight]; // window dimensions that are compared when the window is resized

    // adding keydown listener:
    document.onkeydown = (e) => {
        // if you press escape and are currently in a poly-line draw, end the drawing of that line
        if (e.key === 'Escape') {
            console.log('Escape Pressed');
            if (inPolyDraw) {
                stopPolyDraw()
            }
        }
        // set CmdKey to true when cmd / ctrl is pressed
        else if (e.key === 'Meta') {
            setCmdKey(true);
            console.log("cmdKey: ", cmdKey)
        }
        //  set shiftKey to true when it's pressed
        else if (e.key === 'Shift') {
            setShiftKey(true);
            console.log('shiftKey:', shiftKey)
        }
        // if z is pressed, undo if cmd is pressed and shift is not, and redo if cmd & shift are both pressed
        else if (e.key === 'z') {
            console.log('z key pressed');
            console.log('cmdKey:', cmdKey)
            if (cmdKey && !shiftKey) {
                undo();
                refresh();
            }
            else if (cmdKey && shiftKey) {
                redo();
                refresh();
            }
        }
        // go into straight line drawing mode when l is pressed
        else if (e.key === 'l') {
            if (inPolyDraw) {
                stopPolyDraw()
            }
            setDrawMode('line')
        }
        // go into poly line drawing mode when p is pressed
        else if (e.key === 'p') {
            setDrawMode('poly')
        }
    };

    // adding keyup listeners
    document.onkeyup = (e) => {
        // set cmdKey to false when cmd / ctrl is lifted
        if (e.key === 'Meta') {
            setCmdKey(false);
            console.log("cmdKey: ", cmdKey)
        }
        // set shift to false when it is lifted
        else if (e.key === 'Shift') {
            setShiftKey(false);
            console.log("shiftKey: ", shiftKey)
        }
    };

    const getSideBarWidth = () => {
        const width = window.innerWidth;  // get current width
        console.log('winsize', window.innerWidth, 'x', window.innerHeight);
        const min = 1050;  // window width below which the sidebar will no longer shrink
        const max = 1460;  // window width above which the sidebar will no longer grow wider
        if (width <= min) {  // if the width is less than or equal to the minimum:
            setSideBarWidth(min * 0.3)  // set sideBarWidth to 30% of the minimum window size
        }
        else if (width >= max) {   // if the width is greater than or equal to the maximum:
            setSideBarWidth(max * 0.3)  // set sideBarWidth to 30% of the maximum window size
        }
        else {  // otherwise:
            setSideBarWidth(width * 0.3)  // set sideBarWidth to 30% of the current width
        }
    };

    // on mount:
    useEffect(() => {
        window.addEventListener('resize', handleResize);  // add event listener for resize, and pass my custom resize function
        getSideBarWidth();  // calculate the sidebar width

        return () => {
            window.removeEventListener('resize', handleResize)  // remove the event listener on unmount
        }
    }, []);

    // on changing image state:
    useEffect(() => {
        calcImgDims();  // recalculate image dimensions
    }, [image]);

    // used to ensure that rerender occurs, ensuring real-time reactivity
    const refresh = () => {
        setMouseX(window.innerWidth * 0.5 + Math.random());  // set mouseX to center of screen plus a random amount
        setMouseY(window.innerHeight * 0.5 + Math.random());  // set mouseY to center of screen plus a random amount
    };

    // to update color of line in linelist at given index to the given color
    const updateColor = (color, index) => {
        let allLines = lineList;
        allLines[index].color = color;
        setLineList(allLines);
        refresh();
    };

    // remove line at given index from lineList
    const removeLine = (index) => {
        let allLines = lineList;
        if (allLines[index].isUnit) {  // if the line you are removing is set as the unit:
            setUnit(1)  // reset the unit to 1
        }
        allLines.splice(index, 1);  // remove the line
        setLineList(allLines);
        refresh();
    };

    // remove "unit" status from all lines
    const unselectAllLines = () => {
        for (let line of lineList) {
            line.isUnit = false;
        }
    };

    // run every time the window is resized
    const handleResize = e => {
        handleMouseMove(e);
        e.preventDefault();
        getSideBarWidth();  // recalculate sidebar width

        // TODO: FIX IMAGE RESIZING
        const ratio = getSizeRatio(prevWinDims, [window.innerWidth, window.innerHeight]);  // get ratio between previous & new window sizes
        // console.log('ratio', ratio);
        setImgDims((dims) => {
            return [dims[0] * ratio, dims[1] * ratio]  // multiply each dimension by the calculated ratio
        });
        prevWinDims = [window.innerWidth, window.innerHeight];  // set previous window dimensions to current dimensions
    };

    // run every time a new image is chosen.  Sizes image to fit the canvas
    const calcImgDims = () => {
        // if original dimensions have already been set:
        if (origImgDims) {
            const canvasDims = [window.innerWidth - sideBarWidth, window.innerHeight];  // get dimensions of canvas
            const ratio = getSizeRatio(origImgDims, canvasDims);  // get size ratio between the original image and the canvas
            setImgDims([origImgDims[0] * ratio, origImgDims[1] * ratio]);  // set the image dimensions to each original dimension x ratio

            // let diffs = [0, 0];
            // let dimsInds = [0, 1];
            // for (const index of dimsInds) {
            //     diffs[index] = canvasDims[index] - origImgDims[index]
            // }
            //
            // setImgDims([origImgDims[0] + 10, origImgDims[1] + 10])

            // setting grid size to match that of the image
            setGridProps({
                ...gridProps,
                width: origImgDims[0] * ratio,
                height: origImgDims[1] * ratio
            })
        }
    };

    // finds the closer of the 2 dimensions, and returns ratio of that dimension between the given dimensions
    const getSizeRatio = (imageDims, canvasDims) => {
        let diffs = [0, 0];  // initializing diffenrences for each demension (x & y)
        // for each index of diffs (x and y):
        for (let i = 0; i < 2; i++) {
            diffs[i] = canvasDims[i] - imageDims[i]  // assign that index of diffs to the difference between the given dimensions at that index (x or y)
        }
        const closerDimInd = diffs.indexOf(Math.min(...diffs));  // get the index of the dimension (x or y) with the lesser distance
        return canvasDims[closerDimInd] / imageDims[closerDimInd];  // calculate and return the ratio between the given sizes in the determined dimension
    };

    // run whenever the mouse moves
    const handleMouseMove = e => {
        // if the mouse is down or you are in the middle of a poly-line draw:
        if (mouseDown || inPolyDraw) {
            setMouseX(e.clientX);  // set mouseX to current mouse x position
            setMouseY(e.clientY);  // set mouseY to current mouse y position
            let currentLine = lineList[lineList.length - 1];  // get the most recent line
            currentLine.x2 = mouseX;  // set the x endpoint of that line to mouseX
            currentLine.y2 = mouseY;  // set the y endpoint of that line to mouseY
            // if the line has more than 2 points:
            if (currentLine.points.length > 2) {
                currentLine.points.pop();  // delete the last two points
                currentLine.points.pop();
                currentLine.points.push(e.clientX - sideBarWidth);  // replace deleted x point with mouse x position, corrected for the sidebar width
                currentLine.points.push(e.clientY);  // replace deleted y point with the mouse y position
            }
        }
    };

    // start a new straight line
    const startLine = (x, y) => {
        let allLines = lineList;
        const color = allColors[Math.floor(Math.random() * allColors.length)];  // get a random color from our list of colors
        // initialize line
        let line = {
            x1: x,
            y1: y,
            color: color,
            type: drawMode,
            points: [x - sideBarWidth, y],
            angles: [],
            isUnit: false,
            showDetails: false
        };
        setMouseDown(true);
        allLines.push(line);  // add new line to list
        setLineList(allLines);  // update list
        // enforcing maximum length of line-list to 200:
        if (allLines.length > 200) {
            allLines.shift();
        }
    };

    // run when in 'line' mode and the mouse button is lifted. Ends the current line if you are drawing one
    const endLine = (x, y) => {
        // if the mouseDown state is true (if you were drawing a line):
        if (mouseDown) {
            let allLines = lineList;
            let currentLine = allLines[allLines.length - 1];  // get line currently being drawn
            currentLine.points.push(x - sideBarWidth);  // add the given x coordinate (correcting for sidebar) to line points
            currentLine.points.push(y);  // add given y coordinate to line points
            currentLine.x2 = x;  // set endpoint x to given x
            currentLine.y2 = y;  // set endpoint y to given y
            allLines[allLines.length - 1] = currentLine;  // assign modified line to its position in list
            if (!(currentLine.length) || Math.round(currentLine.length) === 0) {  // if the length of the line is 0 or non-existent:
                allLines.pop();  // remove it from the list
            }
            setMouseDown(false);
            setLineList(allLines);  // update line list state
        }
    };


    const drawPoly = (x, y) => {
        if (!inPolyDraw) {
            setInPolyDraw(true);
            startPoly(x, y);
            addPolyPoint(x, y)
        }
        else {
            addPolyPoint(x, y)
        }

    };

    const startPoly = (x, y) => {
        let allLines = lineList;
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        let line = {x1: x, y1: y, color: color, type: 'poly', angles: [], lineCount: 0, showDetails: false};
        line.points = [x - sideBarWidth, y];
        allLines.push(line);
        setLineList(allLines);
        refresh();
        if (allLines.length > 50) {
            allLines.shift();
        }
    }

    const addPolyPoint = (x, y) => {
        let allLines = lineList;
        let currentLine = allLines[allLines.length - 1];
        currentLine.points.push(x - sideBarWidth);
        currentLine.points.push(y);
        currentLine.lineCount ++
        setLineList(allLines)
    };

    const stopPolyDraw = (fromButton) => {
        let lineRemoved = false;
        const currentLine = lineList[lineList.length - 1];
        if (fromButton) {
            currentLine.points.pop();
            currentLine.points.pop();
        }
        if (currentLine.points.length < 5) {
            const allLines = lineList
            allLines.pop();
            setLineList(allLines);
            lineRemoved = true;
        }
        else {
            currentLine.points.pop();
            currentLine.points.pop();
        }
        if (currentLine.distances) {
            currentLine.distances.pop()
        }
        setInPolyDraw(false);
        setMouseDown(false);
        return lineRemoved;
    };

    const handleMouseDown = e => {
        const x = Math.round(e.clientX);
        const y = Math.round(e.clientY);
        setMouseX(x);
        setMouseY(y);
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

    const removePoint = (lineIndex, pointIndex) => {
        const allLines = lineList;
        let line = allLines[lineIndex];
        if (line.points.length < 5) {
            // undo()
            allLines.splice(lineIndex, 1)
        }
        else {
            if (pointIndex > 0) {
                line.points.pop();
                line.points.pop();
                line.distances.pop();
                line.displayAngles.pop();
                line.angles.pop();
            }
            else {
                line.points.shift();
                line.points.shift();
                line.distances.shift();
                line.displayAngles.shift();
                line.angles.shift();
            }
            setLineList(allLines);
        }
        refresh();
    };

    const undo = () => {
        console.log('undo');
        let lineRemoved;
        if (inPolyDraw) {
            lineRemoved = stopPolyDraw()
        }
        if (!lineRemoved) {
            let allLines = lineList;
            let buffer = redoBuffer;
            buffer.push(allLines.pop());
            setRedoBuffer(buffer);
            console.log(redoBuffer);

            setLineList(allLines);
        }
        // for some reason it wont update until you mouse over canvas unless I have these:
        setMouseX(window.innerWidth * 0.5 + Math.random());
        setMouseY(window.innerHeight * 0.5 + Math.random());
        refresh()
    };

    const redo = () => {
        if (redoBuffer.length > 0) {
            let allLines = lineList;
            let buffer = redoBuffer;
            allLines.push(buffer.pop());
            setRedoBuffer(buffer);
            setLineList(allLines)
        }
        refresh();
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <SideBar
                    undo={undo}
                    redo={redo}
                    handleUpload={handleUpload}
                    lineList={lineList}
                    updateColor={updateColor}
                    removeLine={removeLine}
                    removePoint={removePoint}
                    drawMode={drawMode}
                    setDrawMode={setDrawMode}
                    unit={unit} setUnit={setUnit}
                    unselectAllLines={unselectAllLines}
                    refresh={refresh}
                    gridOn={gridOn}
                    setGridOn={setGridOn}
                    gridProps={gridProps}
                    setGridProps={setGridProps}
                    setImageStyle={setImageStyle}
                    sideBarWidth={sideBarWidth}
                />
                <div
                    className={styles.drawingArea}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <StopPolyDrawButton inProp={inPolyDraw} stopPolyDraw={stopPolyDraw}/>
                    <Stage width={window.innerWidth - sideBarWidth} height={window.innerHeight} style={{position: 'absolute', ...imageStyle}}>

                        {image ? <UserImage url={image} width={imgDims[0]} height={imgDims[1]} imgStyle={{filter: "grayscale(100%)"}}/> : null}
                    </Stage>

                    <Stage width={window.innerWidth - sideBarWidth} height={window.innerHeight}>
                        {gridOn ? <Grid {...gridProps}/> : null}
                        <Layer>
                            <Lines list={lineList} unit={unit} sideBarWidth={sideBarWidth}/>
                        </Layer>
                    </Stage>


                </div>
            </div>


        </div>
    );
}


export default App;
