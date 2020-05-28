import React from "react";
import uuid from "react-uuid";
import {Line, Text} from "react-konva";
import _ from "lodash";
import {distance} from "../App/App";


const PolyLine = (props) => {

    const findMidPoint = (a, b) => {
        const [x1, y1] = a;
        const [x2, y2] = b;

        const xMid = (x1 + x2) / 2;
        const yMid = (y1 + y2) / 2;

        return [xMid, yMid]
    };

    // const groupedLines = _.chunk(props.points, 4);
    // console.log('points:');
    // console.log(props.points)
    const groupedLines = _.compact(_.flatMap(props.points, (val, index) => {
        if (index % 2 === 0) {
            if (index < props.points.length - 3) {
                return [[[props.points[index], props.points[index + 1]], [props.points[index + 2], props.points[index + 3]]]]
            }
        }
    }));

    const makeDistancePoints = (list) => {
        if (list.length > 0) {
            const lengths = _.map(list, (line) => {
                return [distance(line[0], line[1]), line]
            });
            return lengths;
        }
        else {
            return [[0, [0, 0]], [0, [0, 0]]]
        }
    };
    // console.log("groupedLines:", groupedLines);
    const distsAndPts = makeDistancePoints(groupedLines);
    // console.log("distsAndPts:", distsAndPts)

    return (
        <React.Fragment>
            <Line x={0} y={0} stroke={props.color} points={props.points} strokeWidth={2}/>
            { !!distsAndPts ? distsAndPts.map( (list, index) => {
                // console.log('list:', list)
                if (list) {
                    const [dist, pts] = list;
                    const [pt1, pt2] = pts;
                    const [xMid, yMid] = findMidPoint(pt1,pt2);
                    return (
                        <Text
                            key={uuid()}
                            text={(dist / props.unit).toFixed(2)}
                            x={xMid}
                            y={yMid}
                            rotation={props.angles[index]}
                            fontSize={15}
                            fill={props.color}
                        />
                    )
                }

            }) : null}

        </React.Fragment>
    );
};


export default PolyLine;