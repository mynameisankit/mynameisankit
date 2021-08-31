// Lodash
const _join = require('lodash/join');
const _flow = require('lodash/flow');
const _map = require('lodash/map');
const _isFunction = require('lodash/isFunction');

const joinWithSpaces = segments => _join(segments, ' ');

const colorSegment = (colorer, segment) => {
    if(!_isFunction(colorer)) return segment;

    const colouredSegment = colorer(segment);
    return colouredSegment;
};

const colorSegments = segmentByColorer => {
    const coloredSegments = _map(segmentByColorer, colorSegment);
    return coloredSegments;
};

const print = _flow(colorSegments, joinWithSpaces, console.log);

module.exports = print;
