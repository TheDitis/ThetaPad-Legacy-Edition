import React from "react";
import uuid from "react-uuid";
import {Line, Text} from "react-konva";


const PolyLine = (props) => {
    const points = props.points;
    return (
        <React.Fragment>
            <Line x={0} y={0} stroke={props.color} points={points} strokeWidth={2}/>
            <Text
                text={props.length}
                x={props.x1 - props.widthSub}
                y={props.y1 + 10}
                rotation={props.angles[0]}
                fontSize={15}
                fill={props.color}
            />
        </React.Fragment>
    );
};


export default PolyLine;