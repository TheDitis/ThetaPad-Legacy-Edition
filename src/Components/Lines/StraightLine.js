import React from "react";
import uuid from "react-uuid";
import {Line, Text} from "react-konva";


const StraightLine = (props) => {
    const points = [props.x1 - props.widthSub, props.y1, props.x2 - props.widthSub, props.y2];
    return (
        <React.Fragment>
            <Line key={uuid()} x={0} y={0} stroke={props.color} points={points} strokeWidth={2}/>
            <Text
                text={(props.length / props.unit).toFixed(2)}
                x={props.x1 - props.widthSub}
                y={props.y1 + 10}
                rotation={props.angles[0]}
                fontSize={15}
                fill={props.color}
            />
        </React.Fragment>
    );
}


export default StraightLine;