import _ from "lodash";
import React from "react";
import uuid from "react-uuid";
import StraightLine from "./StraightLine";
import PolyLine from "./PolyLine";


const Lines = props => {
    return (
        props.list.map( data => {
            if (_.has(data, 'x2')) {
                switch (data.type) {
                    case 'line':
                        return <StraightLine key={uuid()} {...data} line={data} {...props}/>;
                    case 'poly':
                        return <PolyLine key={uuid()} {...data} line={data} {...props}/>;
                    default:
                        return null
                }
            }
        })
    )
};


export default Lines;