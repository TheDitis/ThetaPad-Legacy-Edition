import React from 'react'
import {Layer, Line} from 'react-konva';
import uuid from 'react-uuid';
import _ from 'lodash';

const Grid = (props) => {

    const makeFlatLines = (numVert, numHor, width, height) => {
         const range = n => [...Array(n).keys()];
         const wInterval = width / numVert;
         const hInterval = height / numHor;
         const verticalXs = Array.from(range(numVert + 1), x => x * wInterval);
         const horizontalYs = Array.from(range(numHor + 1), x => x * hInterval);

         const verticalLines = _.map(verticalXs, (x) => {
             return [x, 0, x, height]
         });
        const horizontalLines = _.map(horizontalYs, (y) => {
            return [0, y, width, y]
        });

        return [verticalLines, horizontalLines]
    };

    const makeDiagonalLines = (vertical, horizontal) => {
        const sides = [vertical, horizontal];
        const [longer, shorter] = sides.sort((a, b) => b.length - a.length);

        const upLines = _.map(longer, (_, index) => {
            if (index < shorter.length) {
                const line1 = [
                    longer[index][0],
                    longer[index][1],
                    shorter[index][0],
                    shorter[index][1]
                ];
                const line2 = [
                    longer[longer.length - (index + 1)][2],
                    longer[longer.length - (index + 1)][3],
                    shorter[shorter.length - (index + 1)][2],
                    shorter[shorter.length - (index + 1)][3]
                ];
                return [line1, line2]
            }
            else {
                const altIndex = (index - shorter.length + 1) % longer.length;
                const line1 = [
                    longer[index][0],
                    longer[index][1],
                    longer[altIndex][2],
                    longer[altIndex][3]
                ];
                return [line1, null]
            }
        });
        const downLines = _.map(longer, (_, index) => {
            if (index < shorter.length) {
                const line1 = [
                    longer[index][2],
                    longer[index][3],
                    shorter[shorter.length - (index + 1)][0],
                    shorter[shorter.length - (index + 1)][1]
                ];
                const line2 = [
                    longer[longer.length - (index + 1)][0],
                    longer[longer.length - (index + 1)][1],
                    shorter[index][2],
                    shorter[index][3]
                ];
                return [line1, line2]
            }
            else {
                const altIndex = (index - shorter.length + 1) % longer.length;
                const line1 = [
                    longer[altIndex][0],
                    longer[altIndex][1],
                    longer[index][2],
                    longer[index][3]
                ];
                return [line1, null]
            }
        });
        return _.flatten([_.flatten(upLines), _.flatten(downLines)])
    };

    const [verticalLines, horizontalLines] = makeFlatLines(props.nLinesV, props.nLinesH, props.width, props.height);

    const diagonalUpLines= makeDiagonalLines(verticalLines, horizontalLines);

    return (
        <Layer>
            {horizontalLines.map((line) => {
                return (
                    <Line key={uuid()} x={0} y={0} stroke={'black'} points={line} strokeWidth={2}/>
                )
            })}
            {verticalLines.map((line) => {
                return (
                    <Line key={uuid()} x={0} y={0} stroke={'black'} points={line} strokeWidth={2}/>
                )
            })}
            {diagonalUpLines.map((line) => {
                return (
                    <Line key={uuid()} x={0} y={0} stroke={'black'} points={line} strokeWidth={2}/>
                )
            })}
            {/*{diagonalDownLines.map((line) => {*/}
            {/*    console.log('hi there', line)*/}
            {/*    return (*/}
            {/*        <Line key={uuid()} x={0} y={0} stroke={'black'} points={line} strokeWidth={2}/>*/}
            {/*    )*/}
            {/*})}*/}
        </Layer>
    )
};

export default Grid;
