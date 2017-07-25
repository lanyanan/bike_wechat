function accurateNumber(number) {
    return parseFloat(number.toPrecision(12));
}

function properUnit(val, unit, kUnit) {
    if (val > 1000) {
        return accurateNumber(val/1000) + kUnit;
    } else {
        return val + unit;
    }
}

export default{
    accurateNumber: accurateNumber,
    properUnit: properUnit
}