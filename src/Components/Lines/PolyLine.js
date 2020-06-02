import React from "react";
import uuid from "react-uuid";
import {Line, Text, Group} from "react-konva";
import _ from "lodash";
import {distance, getAngle} from "../App/App";
import nj from 'numjs';


const PolyLine = (props) => {

    const line = props.line;

    const x1 = line.points[line.points.length - 4];
    const x2 = line.points[line.points.length - 2];
    const y1 = line.points[line.points.length - 3];
    const y2 = line.points[line.points.length - 1];
    const angle = getAngle({ x: x1, y: y1 }, { x: x2, y: y2 });
    // const index = line.points.length / 2 - 1;
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

    const calculateAngles = (lineList) => {
        const angles = _.map(lineList, (line2, index) => {
            if (index !== 0) {
                const line1 = lineList[index - 1]
                const vec1 = [line1[0][0] - line1[1][0], line1[0][1] - line1[1][1]];
                const vec2 = [line2[1][0] - line2[0][0], line2[1][1]- line2[0][1]];
                const mag1 = Math.sqrt(vec1[0] ** 2 + vec1[1] ** 2);
                const mag2 = Math.sqrt(vec2[0] ** 2 + vec2[1] ** 2);
                const dot = nj.dot(vec1, vec2).selection.data[0];
                const magnitudes = mag1 * mag2;
                const radians = Math.acos(dot / magnitudes);
                return radians * (180 / Math.PI)
            }
            else {
                return line.angles[0]
            }
        });
        return angles;
    };

    const distsAndPts = makeDistancePoints(groupedLines);
    line.distances = _.map(distsAndPts, (list) => list[0])
    line.displayAngles = calculateAngles(groupedLines);

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
                    if (line.displayAngles[0]) {
                        angle = line.displayAngles[index]
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