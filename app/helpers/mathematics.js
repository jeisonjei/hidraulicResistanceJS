export class Mathematics {
    static GetAreaCircle(diameterMillimeters) {
        const radius = diameterMillimeters / 2;
        const area = Math.PI * Math.pow(radius, 2);
        return area; // Returning area in square millimeters
    }

    static GetAreaRectangle(widthMillimeters, heightMillimeters) {
        const widthMeter = widthMillimeters / 1000;
        const heightMeter = heightMillimeters / 1000;
        const areaSquareMeter = widthMeter * heightMeter;
        return areaSquareMeter; // Returning area in square millimeters
    }

    static GetEquivalentDiameter(widthMillimeters, heightMillimeters) {
        const eqD = (2 * widthMillimeters * heightMillimeters) / (widthMillimeters + heightMillimeters);
        return eqD; // Returning equivalent diameter in millimeters
    }
}