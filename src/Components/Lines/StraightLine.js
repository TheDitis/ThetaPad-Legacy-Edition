import React from "react";
import uuid from "react-uuid";
import {Line, Text} from "react-konva";


const StraightLine = (props) => {

    const line = props.line;
    const points = [props.x1 - props.widthSub, props.y1, props.x2 - props.widthSub, props.y2];


    const findMidPoint = (a, b) => {
        const [x1, y1] = a;
        const [x2, y2] = b;

        const xMid = (x1 + x2) / 2 - props.widthSub;
        const yMid = (y1 + y2) / 2;

        return [xMid, yMid]
    };

    const [xMid, yMid] = findMidPoint([props.x1, props.y1], [props.x2, props.y2]);

    console.log(props.widthSub);
    console.log("pt1:", props.x1, props.y1, "pt2", props.x2, props.y2);
    console.log("midpoint: ", xMid, yMid);

    return (
        <React.Fragment>
            <Line key={uuid()} x={0} y={0} stroke={props.color} points={points} strokeWidth={2}/>
            <Text
                text={(props.length / props.unit).toFixed(2)}
                x={xMid}
                y={yMid}
                rotation={props.angles[0]}
                fontSize={15}
                fill={props.color}
            />
        </React.Fragment>
    );
}


export default StraightLine;