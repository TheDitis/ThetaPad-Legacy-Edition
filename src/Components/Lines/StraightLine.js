import React from "react";
import uuid from "react-uuid";
import {Line, Text, Group} from "react-konva";
import {distance, getAngle} from "../App/App";


const StraightLine = (props) => {

    const line = props.line;
    const points = [props.x1 - props.sideBarWidth, props.y1, props.x2 - props.sideBarWidth, props.y2];

    const length = distance([line.x1, line.y1], [line.x2, line.y2])
    line.length = length;

    const angle = getAngle(
        {x: line.x1, y: line.y1}, {x: line.x2, y: line.y2}
    );
    line.angles[0] = angle;

    const findMidPoint = (a, b) => {
        const [x1, y1] = a;
        const [x2, y2] = b;

        const xMid = (x1 + x2) / 2 - props.sideBarWidth;
        const yMid = (y1 + y2) / 2;

        return [xMid, yMid]
    };

    const [xMid, yMid] = findMidPoint([props.x1, props.y1], [props.x2, props.y2]);

    if (line.x2) {
        const textRotation = line.angles[0] <= -90 || line.angles[0] > 90 ? line.angles[0] + 180 : line.angles[0];
        const lengthText = props.unit === 1 ? (line.length / props.unit).toFixed(0) : (line.length / props.unit).toFixed(2);
        return (
            <React.Fragment>
                <Line key={uuid()} x={0} y={0} stroke={props.color} points={points} strokeWidth={2}/>
                <Group
                    x={xMid}
                    y={yMid}
                    rotation={textRotation}
                >
                    <Text
                        y={5}
                        x={-10}
                        text={lengthText}
                        fontSize={15}
                        fill={props.color}
                    />
                </Group>
            </React.Fragment>
        )
    }
};


export default StraightLine;