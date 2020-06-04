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

         console.log(verticalXs, horizontalYs);

         const verticalLines = _.map(verticalXs, (x) => {
             return [x, 0, x, height]
         });
        const horizontalLines = _.map(horizontalYs, (y) => {
            return [0, y, width, y]
        });
        console.log(verticalLines, horizontalLines);
        return [verticalLines, horizontalLines]
    };

    // const makeDiagonalLines = (vertical, horizontal) => {
    //     const upLines = _.map(vertical, (_, index) => {
    //         const line1 = [ horizontal[index][0], horizontal[index][1], vertical[index][0], vertical[index][1] ];
    //         const line2 = [ horizontal[index][2], horizontal[index][3], vertical[index][2], vertical[index][3] ];
    //         return [line1, line2]
    //     });
    //     const downLines = _.map(vertical, (_, index) => {
    //         const hIndex = horizontal.length - (index + 1);
    //         const vIndex = vertical.length - (index + 1);
    //         console.log('vIndex', vIndex);
    //         const line1 = [ horizontal[hIndex][0], horizontal[hIndex][1], vertical[index][2], vertical[index][3] ];
    //         const line2 = [ vertical[index][0], vertical[index][1], horizontal[hIndex][2], horizontal[hIndex][3] ]
    //         return [line1, line2]
    //     });
    //     return [_.flatten(upLines), _.flatten(downLines)]
    // };

    const makeDiagonalLines = (vertical, horizontal) => {
        const sides = [vertical, horizontal];
        const [longer, shorter] = sides.sort((a, b) => b.length - a.length);

        const upLines = _.map(longer, (_, index) => {
            if (index < shorter.length) {
                const line1 = [ shorter[index][0], shorter[index][1], longer[index][0], longer[index][1] ];
                const line2 = [ shorter[shorter.length - (index + 1)][2], shorter[shorter.length - (index + 1)][3], longer[longer.length - (index + 1)][2], longer[longer.length - (index + 1)][3] ];
                return [line1, line2]
            }
            else {
                const altIndex = (index - shorter.length + 1) % shorter.length;
                console.log('altIndex:', altIndex);
                const line1 = [ longer[index][0], longer[index][1], longer[altIndex][2], longer[altIndex][3] ];
                // const line2 = [ longer[index][2], longer[index][3], shorter[index][2], shorter[index][3] ];
                const line2 = [0, 0, 0, 0]
                return [line1, line2]
            }

            // return [line1, line2]
        });
        // const downLines = _.map(maxLength, (_, index) => {
        //     const hIndex = horizontal.length - (index + 1);
        //     const vIndex = vertical.length - (index + 1);
        //     console.log('vIndex', vIndex);
        //     const line1 = [ horizontal[hIndex][0], horizontal[hIndex][1], vertical[index][2], vertical[index][3] ];
        //     const line2 = [ vertical[index][0], vertical[index][1], horizontal[hIndex][2], horizontal[hIndex][3] ]
        //     return [line1, line2]
        // });
        return _.flatten(upLines);
        // return [_.flatten(upLines), _.flatten(downLines)]
    };

    const [verticalLines, horizontalLines] = makeFlatLines(props.nLinesV, props.nLinesH, props.width, props.height);


    // makeDiagonalLines(verticalLines, horizontalLines)
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
}

export default Grid;