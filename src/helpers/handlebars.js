const Handlebars = require("handlebars");

const isColorPresent = (color) => !!color;

const isDifferentState = (fromState, currentState) => fromState !== currentState;

const isDifferentCity = (fromCity, currentCity) => fromCity !== currentCity;

const isDifferentLocation = (fromLocation = EMPTY_OBJECT, currentLocation = EMPTY_OBJECT) => {
    const { city: fromCity, state: fromState } = fromLocation;
    const { city: currentCity, state: currentState } = currentLocation;

    const differentLocation = isDifferentState(fromState, currentState) || isDifferentCity(fromCity, currentCity);
    return differentLocation;
};

Handlebars.registerHelper({ isColorPresent, isDifferentLocation, isDifferentCity });

module.exports = Handlebars;
