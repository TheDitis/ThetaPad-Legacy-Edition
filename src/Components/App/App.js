import React from 'react';
import {useState, useEffect} from 'react';
import styles from './App.module.css';
// import Konva from "konva";
import {Stage, Layer} from 'react-konva';
import {Image as KonvaImage} from 'react-konva'
import useImage from "use-image";
import allColors from '../../colorOptions.json'
import Lines from "../Lines/Lines";
import SideBar from "../SideBar/SideBar";
import StopPolyDrawButton from "../StopPolyDrawButton";
import Grid from "../Grid/Grid";
import {getAngle, distance} from "../../HelperFunctions";
import useTime from "../../Hooks/useTime";


const UserImage = (props) => {
    const [image] = useImage(props.url,);  // using useImage hook with given url
    return (
        // return Konva layer with Konva image component
        <Layer scaleX={props.scaleX} scaleY={props.scaleY}>
            <KonvaImage
                image={image}  // image from hook
                // filters={[Konva.Filters.Blur]}
                // blurRadius={10}
                width={props.width}
                height={props.height}

            />
        </Layer>
    )
};


function App() {
    // const time = useTime(1000);
    // const [latestMousePos, setLatestMousePos] = useState(null);

    const [mouseX, setMouseX] = useState(null);  // mouse location in the x dimension
    const [mouseY, setMouseY] = useState(null);  // mouse location in the y dimension
    const [lineList, setLineList] = useState([]);  // list of all lines to be drawn
    const [mouseDown, setMouseDown] = useState(false);  // boolean representing whether or not the mouse is clicked
    const [drawMode, setDrawMode] = useState('line');  // string representing the type of line that is being drawn
    const [inPolyDraw, setInPolyDraw] = useState(false);  // boolean: whether or not you are in the middle of drawing a poly line
    const [image, setImage] = useState(null);  // the image uploaded by the user
    const [imgObj, setImgObj] = useState(null);

    const [origImgDims, setOrigImgDims] = useState([0, 0]);  // the dimensions of the users image before transformation
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
    // const [canvasSize, sizeCanvasSize] = useState(null);
    const [imageStyle, setImageStyle] = useState({});  // style object to be added to the image

    const [prevWinDims, setPrevWinDims] = useState([window.innerWidth - sideBarWidth, window.innerHeight]);
    const [winDims, setWinDims] = useState([window.innerWidth - sideBarWidth, window.innerHeight]);
    const [imgRatio, setImgRatio] = useState(1);
    // let prevWinDims = [window.innerWidth, window.innerHeight]; // window dimensions that are compared when the window is resized

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
            console.log('cmdKey:', cmdKey);
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
        window.scrollTo(0, 0);
        return () => {
            window.removeEventListener('resize', handleResize)  // remove the event listener on unmount
        }
    }, []);

    useEffect(() => {
        const resizeImageAndLines =  async () => {
            if (image) {
                const canvasWidth = window.innerWidth - sideBarWidth;
                const [ratio, closerDimInd] = getSizeRatio(origImgDims, [canvasWidth, window.innerHeight]);  // get ratio between previous & new window sizes
                // console.log('ratio:', ratio);
                // setImgDims((dims) => [origImgDims[0] * ratio, origImgDims[1] * ratio]);  // multiply each dimension by the calculated ratio
                setImgRatio(ratio);

                const xyRatios = getXYRatio(prevWinDims, winDims);
                const lineRatio = xyRatios[closerDimInd];
                await rescaleLines(lineRatio);
                setPrevWinDims(winDims);
            }
        }
        resizeImageAndLines();
    }, [winDims]);

    useEffect(() => {
        console.log("imgObj: ", imgObj);
        if (imgObj) {
            console.log('w', imgObj.width, 'h', imgObj.height);
        }
    }, [imgObj]);

    // on changing image state:
    useEffect(() => {
        calcImgDims();  // recalculate image dimensions
    }, [image]);

    // useEffect(() => {
    //     console.log("origImgDims useEffect Called: ", origImgDims)
    // }, [origImgDims]);
    //
    // useEffect(() => {
    //     console.log("imgDims useEffect Called: ", imgDims)
    // }, [imgDims]);

    // used to ensure that rerender occurs, ensuring real-time reactivity
    const refresh = () => {
        setMouseX(window.innerWidth * 0.5 + Math.random());  // set mouseX to center of screen plus a random amount
        setMouseY(window.innerHeight * 0.5 + Math.random());  // set mouseY to center of screen plus a random amount
    };

    const rescaleLines = (ratio) => {
        let allLines = lineList;
        console.log("Ratio: ", ratio);
        console.log('pre: ', allLines);
        for (let i = 0; i < allLines.length; i++) {
            let line = allLines[i];
            for (let j = 0; j < line.points.length; j++) {
                const point = line.points[j];
                line.points[j] = Math.round(point * ratio);
                console.log(point, point * ratio )
            }
            allLines[i] = line;
        }
        console.log('post: ', allLines);
        setLineList(allLines);
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
    const handleResize = (e) => {
        getSideBarWidth();  // recalculate sidebar width
        // const canvasWidth = window.innerWidth + sideBarWidth;
        // // TODO: FIX IMAGE RESIZING:
        // const ratio = getSizeRatio(prevWinDims, [canvasWidth, window.innerHeight]);  // get ratio between previous & new window sizes
        // console.log('ratio:', ratio);
        // console.log('origImgDims3:', origImgDims);
        // console.log('usingFunction: ', getImgDims());
        // console.log('imgObj3: ', imgObj);
        // setImgDims((dims) => [dims[0] * ratio, dims[1] * ratio]);  // multiply each dimension by the calculated ratio

        setWinDims([window.innerWidth - sideBarWidth, window.innerHeight]);  // set window dimensions state to current dimensions
    };

    // run every time a new image is chosen.  Sizes image to fit the canvas
    const calcImgDims = () => {
        // if original dimensions have already been set:
        if (origImgDims) {
            const canvasDims = [window.innerWidth - sideBarWidth, window.innerHeight];  // get dimensions of canvas

            const [ratio, closerDimInd] = getSizeRatio(origImgDims, canvasDims);  // get size ratio between the original image and the canvas
            // setImgDims([origImgDims[0] * ratio, origImgDims[1] * ratio]);  // set the image dimensions to each original dimension x ratio
            // setting grid size to match that of the image
            setWinDims([window.innerWidth - sideBarWidth, window.innerHeight]);  // set window dimensions state to current dimensions
            setGridProps({
                ...gridProps,
                width: origImgDims[0] * ratio,
                height: origImgDims[1] * ratio
            })
        }
    };

    // finds the closer of the 2 dimensions, and returns ratio of that dimension between the given dimensions
    const getSizeRatio = (imageDims, canvasDims) => {
        // TODO: Make sure it finds not just the closer dimension, but the one that is cut off first
        let diffs = [0, 0];  // initializing diffenrences for each demension (x & y)
        for (let i = 0; i < 2; i++) {  // for each index of diffs (x and y):
            diffs[i] = canvasDims[i] / canvasDims[0] - imageDims[i] / imageDims[0]  // assign that index of diffs to the difference between the given dimensions at that index (x or y)
        }
        console.log("diffs: ", diffs);
        const closerDimInd = diffs.indexOf(Math.min(...diffs));  // get the index of the dimension (x or y) with the lesser distance
        return [canvasDims[closerDimInd] / imageDims[closerDimInd], closerDimInd];  // calculate and return the ratio between the given sizes in the determined dimension
    };

    const getXYRatio = (dim1, dim2) => {
        return [dim2[0] / dim1[0], dim2[1] / dim1[1]]
    }

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

    // run on mouse click when in poly-line mode
    const drawPoly = (x, y) => {
        if (!inPolyDraw) {  // if not already drawing a poly line:
            setInPolyDraw(true);  // signify that we are now drawing a new poly line
            startPoly(x, y);  // start poly line at given x and y coordinates
        }
        else {  // if we are already drawing a poly-line
            addPolyPoint(x, y)  // add the given point
        }

    };

    // start a poly-line
    const startPoly = (x, y) => {
        let allLines = lineList;
        const color = allColors[Math.floor(Math.random() * allColors.length)];  // get random color from list
        let line = {x1: x, y1: y, color: color, type: 'poly', angles: [], lineCount: 1, showDetails: false};  // initialize line
        line.points = [x - sideBarWidth, y, x - sideBarWidth, y];  // set list of points to [x, y, x ,y] correcting for sidebar width
        allLines.push(line);  // add modified line to list
        setLineList(allLines);  // set lineList state to updated list
        refresh();
        if (allLines.length > 100) {  // enforcing maximum number of segments to 100
            allLines.shift();
        }
    };

    // add new point to current poly-line
    const addPolyPoint = (x, y) => {
        let allLines = lineList;
        let currentLine = allLines[allLines.length - 1];  // grab current line
        currentLine.points.push(x - sideBarWidth);  // add the given x coordinate to line points correcting for sidebar
        currentLine.points.push(y);  // add the given y coordinate to line points
        currentLine.lineCount++;  // increment segment count for current line
        setLineList(allLines);  // update lineList state to updated list
    };

    // end a poly line
    const stopPolyDraw = (fromOnScreenButton) => {
        let lineRemoved = false;  // whether or not the line was removed entirely
        const currentLine = lineList[lineList.length - 1];  // get current line
        if (fromOnScreenButton) {  // if they clicked the on-screen button to end the drawing:
            // remove the latest 2 points, since clicking on the button will run addPolyPoint
            currentLine.points.pop();
            currentLine.points.pop();
        }
        if (currentLine.points.length < 5) {  // if there are 2 or fewer coordinates (only initial anchored point and current mouse position):
            const allLines = lineList;
            allLines.pop();  // remove the line
            setLineList(allLines);  // update line list
            lineRemoved = true;  // signify that the line was removed
        }
        else {  // if there were more than 2 coordinates:
            // remove the points representing the mouse position, used for live-drawing.
            currentLine.points.pop();
            currentLine.points.pop();
        }
        if (currentLine.distances) {  // if the line has a list of segment lengths:
            currentLine.distances.pop()  // remove the most recent segment difference, which is the live-drawing one
        }
        setInPolyDraw(false);  // signify that we are no longer in a poly-line drawing session
        setMouseDown(false);
        return lineRemoved;  // return the boolean representing whether or not the entire line was removed
    };

    // run every time the canvas area is clicked on
    const handleMouseDown = e => {
        const x = Math.round(e.clientX);  // get the mouse coordinates
        const y = Math.round(e.clientY);
        setMouseX(x);  // set the corresponding mouse position states
        setMouseY(y);
        switch (drawMode) {
            case 'line':  // if we are in straight line mode:
                startLine(x, y); // run line drawing function
                break;
            case 'poly':  // if we are in poly line drawing mode:
                drawPoly(x, y);  // run poly drawing function
                break;
            default:
                break;
        }
    };

    // run every time the mouse button is unpressed over canvas area
    const handleMouseUp = e => {
        const x = e.clientX;
        const y = e.clientY;
        switch (drawMode) {
            case 'line':  // if in straight line drawing mode
                endLine(x, y);  // end the line
                break;
            case 'poly':  // if in poly line drawing mode
                break;  // no need to do anything. case still here to mirror handleMouseDown
            default:
                break;
        }
    };

    // to reset the state of the program
    const clearAll = () => {
        setImage(null);  // reset user image
        setLineList([]);  // empty lineList
        setImgDims([0, 0]);  // reset imageDimensions
        setOrigImgDims([0, 0]);
        setImageStyle({});
    };

    // run when a user chooses a picture, given image files
    const handleUpload = async (pictures) => {
        const picture = pictures[pictures.length - 1];  // get only one image
        clearAll();  // clear the state of the program
        const img = await imageFromFile(picture);  // process image from raw file
        console.log("img / promise: ", img, 'w', img.width, 'h', img.height);
        setOrigImgDims([img.width, img.height]);
        setImgObj(img);

    };

    // takes image file and sets image-related states
    const imageFromFile = async (picture) => {
        const url = URL.createObjectURL(picture);  // create url for image file
        const img = new Image();  // create new image object
        // const fr = new FileReader();  // create file reader
        // fr.onload = () => {  // set function for file reader loading image
        //     img.onload = () => {  // set the function for when the image loads:
        //         console.log('Image dims with this:', img.width, img.height);
        //         setOrigImgDims([img.width, img.height]);  // set image dimension states
        //         setImgDims([img.width, img.height]);
        //         setImage(url);  // set image state to created url
        //     };
        //
        //     img.src = fr.result;  // set source to result of the file reader
        // };
        // fr.readAsDataURL(picture);  // using file reader, read image file, calling functions specified above.
        await loadImage (img, url);
        setImgObj(img);
        setImage(url);
        console.log("async Img dims: ", img.width, img.height);
        setOrigImgDims([img.width, img.height]);  // set image dimension states
        setImgDims([img.width, img.height]);
        return img;
    };

    const loadImage = (img, url) => {
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = url;
        })
    };

    const getImgDims = () => {
        // if (imgObj) {
        //
        // }
        // const w = imgObj.width;
        // const h = imgObj.height;
        // return [w, h]
    };


    // removes a point from a polyline given the index of the line in the list and the index of the point to remove
    const removePoint = (lineIndex, pointIndex) => {
        const allLines = lineList;
        let line = allLines[lineIndex];  // grab the specified line
        if (line.points.length < 5) {  // if there are only 2 or fewer points
            allLines.splice(lineIndex, 1);  // remove the line entirely, since only a point would remain otherwise
            setInPolyDraw(false);  // make sure you aren't in poly draw mode after the line is removed
        }
        else {  // if there are more than 2 points in the lise
            if (pointIndex > 0) {  // if you specify the last point to be deleted
                line.points.pop();  // remove last point, x and y
                line.points.pop();
                line.distances.pop();  // remove last distance
                line.displayAngles.pop();  // remove last display angle
                line.angles.pop();  // remove last angle
            }
            else {  // if you spcecified the first point to be deleted:
                line.points.shift();  // remove the first point, x and y
                line.points.shift();
                line.distances.shift();  // remove first distance
                line.displayAngles.shift();  // remove first display angle
                line.angles.shift();  // remove first angle
            }
            setLineList(allLines);  // update lineList state
        }
        refresh();  // refresh view
    };

    // run when cmd/ctrl key is down and z is pressed, or undo button on page is pressed
    const undo = () => {
        if (lineList.length > 0) {  // if there are actually lines to remove:
            console.log('undo');
            if (inPolyDraw) {  // if you're in the middle of drawing a poly line
                removePoint(lineList.length - 1, lineList[lineList.length - 1].distances.length - 1);  // undo the last point drawn
            }
            else {  // if you're not in a poly draw session:
                let allLines = lineList;
                let buffer = redoBuffer;
                buffer.push(allLines.pop());  // remove the last line and add it to the redo buffer
                setRedoBuffer(buffer);  // update redoBuffer state
                setLineList(allLines);  // update lineList state
            }
            refresh(); // refresh view
        }

    };

    // run when cmd/ctrl and shift are both down and z is pressed, or redo button on page is pressed
    const redo = () => {
        if (redoBuffer.length > 0) {  // if there are items in the redo buffer:
            let allLines = lineList;
            let buffer = redoBuffer;
            allLines.push(buffer.pop());  // remove the line from the buffer and add it to the lineList
            setRedoBuffer(buffer);  // update redoBuffer state
            setLineList(allLines);  // update lineList state
        }
        refresh();  // refresh view
    };

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <SideBar
                    undo={undo}  // function for undo button
                    redo={redo}  // function for redo button
                    redoBuffer={redoBuffer}  // so that we can disable redo button when the buffer is empty
                    handleUpload={handleUpload}  // function to run when the user uploads a file
                    lineList={lineList}  // list of lines
                    updateColor={updateColor}  // function to update the color of a line
                    removeLine={removeLine}  // function to remove line from list
                    removePoint={removePoint}  // function to remove point from poly-line
                    drawMode={drawMode}  // current drawing mode state
                    setDrawMode={setDrawMode}  // setState function for drawMode
                    unit={unit}  // current unit to measure all lines relative to
                    setUnit={setUnit}  // setState for updating unit to measure all lines relative to
                    unselectAllLines={unselectAllLines}  // function to remove unit status from all lines
                    refresh={refresh}  // function to refresh the view of the program
                    gridOn={gridOn}  // state of whether or not the grid is on
                    setGridOn={setGridOn}  // setState function to turn grid on and off
                    gridProps={gridProps}  // object of properties defining the grid
                    setGridProps={setGridProps}  // setState function to update the properties of the grid
                    setImageStyle={setImageStyle}  // setState function for image style properties
                    sideBarWidth={sideBarWidth}  // state of sidebar width
                />
                <div
                    className={styles.canvas}
                    onMouseDown={handleMouseDown}  // clickHandler function
                    onMouseUp={handleMouseUp}  // "unclick" handler function
                    onMouseMove={handleMouseMove}  // mouse move handler
                >
                    <StopPolyDrawButton inProp={inPolyDraw} stopPolyDraw={stopPolyDraw}/>  {/* Button that appears when in poly draw session to end the session */}
                    <Stage  // Konva stage for the image uploaded by user
                        width={window.innerWidth - sideBarWidth}
                        height={window.innerHeight}
                        style={{position: 'absolute', ...imageStyle}}
                    >

                        {image ? (  // if we have an image url set:
                            <UserImage  // render the image component using Konva
                                url={image}  // url of the image
                                // width={imgDims[0]}  // width of the image
                                // height={imgDims[1]}  // height of the image
                                width={origImgDims[0]}
                                height={origImgDims[1]}
                                scaleX={imgRatio}
                                scaleY={imgRatio}
                            />
                            ) : null}
                    </Stage>
                    <Stage  // Konva stage for lines.
                        width={window.innerWidth - sideBarWidth}  // width of canvas
                        height={window.innerHeight}  // height of canvas
                    >
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
