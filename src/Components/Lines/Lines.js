import _ from "lodash";
import React from "react";
import uuid from "react-uuid";
import StraightLine from "./StraightLine";
import PolyLine from "./PolyLine";


const widthSub = window.innerWidth * 0.3;

const Lines = props => {
    return (
        props.list.map( data => {
            if (_.has(data, 'x2')) {
                switch (data.type) {
                    case 'line':
                        return <StraightLine key={uuid()} {...data} widthSub={widthSub}/>
                    default:
                        return <PolyLine key={uuid()} {...data} widthSub={widthSub}/>
                }
            }
        })
    )
};


export default Lines;