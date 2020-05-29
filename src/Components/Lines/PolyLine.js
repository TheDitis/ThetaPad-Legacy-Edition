import React from "react";
import uuid from "react-uuid";
import {Line, Text, Group} from "react-konva";
import _ from "lodash";
import {distance, getAngle} from "../App/App";


const PolyLine = (props) => {

    const line = props.line;

    const length = distance([line.x1, line.y1], [line.x2, line.y2])
        .toFixed(0)

    const x1 = line.points[line.points.length - 4];
    const x2 = line.points[line.points.length - 2];
    const y1 = line.points[line.points.length - 3];
    const y2 = line.points[line.points.length - 1];
    const angle = getAngle({ x: x1, y: y1 }, { x: x2, y: y2 });
    const index = line.points.length / 2 - 1;
    if (angle) {
        line.angles[line.lineCount - 1] = angle;
    }

    const findMidPoint = (a, b) => {
        const [x1, y1] = a;
        const [x2, y2] = b;
        const xMid = (x1 + x2) / 2;
        const yMid = (y1 + y2) / 2;
        return [xMid, yMid]
    };

    const groupedLines = _.compact(_.flatMap(line.points, (val, index) => {
        if (index % 2 === 0) {
            if (index < line.points.length - 3) {
                return [[[line.points[index], line.points[index + 1]], [line.points[index + 2], line.points[index + 3]]]]
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

    const distsAndPts = makeDistancePoints(groupedLines);

    return (
        <React.Fragment>
            <Line x={0} y={0} stroke={line.color} points={line.points} strokeWidth={2}/>
            { !!distsAndPts ? distsAndPts.map( (list, index) => {
                // console.log('list:', list)
                if (list) {
                    const [dist, pts] = list;
                    const [pt1, pt2] = pts;
                    const [xMid, yMid] = findMidPoint(pt1,pt2);


                    let angle;
                    if (line.angles[0]) {
                        angle = index !== 0 ? Math.abs((line.angles[index] + line.angles[index-1] -90) % 180) : line.angles[index]
                    }

                    return (
                        <React.Fragment key={uuid()}>
                            <Group
                                x={xMid}
                                y={yMid}
                                rotation={(line.angles[index] % 180)}
                            >
                                <Text
                                    text={(dist / props.unit).toFixed(2)}
                                    x={-20}
                                    y={10}
                                    // rotation={}
                                    fontSize={15}
                                    fill={line.color}
                                />
                            </Group>
                            {angle ? (
                                <Group
                                    x={pt1[0]}
                                    y={pt1[1]}
                                >
                                    <Text
                                        text={`${(angle).toFixed(1)}°`}
                                        // text={`${((angle + 90) % 180).toFixed(1)}°`}
                                        x={15}
                                        // y={pt1[1]}
                                        // rotation={line.angles[index]}
                                        fontSize={15}
                                        fill={line.color}
                                    />
                                </Group>
                            ) : null}

                        </React.Fragment>
                    )
                }

            }) : null}

        </React.Fragment>
    );
};


export default PolyLine;