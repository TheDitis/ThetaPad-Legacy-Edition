export const getAngle = (pt1, pt2) =>  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;

export const distance = (a, b) => {
    const [x1, y1] = a;  // separate x and y from each coordinate
    const [x2, y2] = b;
    const xdist = Math.abs(x1 - x2);  // get the difference of each dimension (x & y)
    const ydist = Math.abs(y1 - y2);
    return Math.sqrt(xdist ** 2 + ydist ** 2);  // use pythagorean theorem to find absolute distance
};