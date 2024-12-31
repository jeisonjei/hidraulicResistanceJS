export function densityAir(t) {
    if (!t) return;
    return 353/(273+t);
}
export function dynViscAir(t) {
    // mu
    if (!t) return;
    return 9.80665 * (1.745 * 10 ** (-6) + 5.03 * 10 ** (-9) * t);
}
export function dynViscWater(t) {
    // mu
    if (!t) return;
    return 2.414 * 10 ** (-5) * 10 ** (247.8 / (t + 133.15));
}
export function kinViscAir(t) {
    // nu
    if (!t) return;
    var dens = densityAir(t);
    return dynViscAir(t) / dens;
}
export function kinViscWater(t) {
    // nu
    if (!t) return;
    var dens = 1000;
    return dynViscWater(t) / dens;
}
export function reinolds(v, diameterMet, nu) {
    if (!v || !diameterMet || !nu) return;
    return (v * diameterMet) / nu;
}
export function lambdaKoef(re, diameterMil, roughness) {
    if (!re || !diameterMil) return;
    return 0.11 * ((roughness / diameterMil) + (0.68 / re)) ** 0.25;
}
export function velocityRect(widthMil, heightMil, flowCmh) {
    if (!widthMil || !heightMil || !flowCmh) return;
    var area = (widthMil / 1000) * (heightMil / 1000);
    var vel = (flowCmh / 3600) / area;
    return vel;
}
export function velocityRound(diameterMil, flowCmh) {
    if (!diameterMil || !flowCmh) return;
    var area = Math.PI * (diameterMil / 2000) ** 2;
    var vel = (flowCmh / 3600) / area;
    return vel;
}
export function hydraulicDiameter(widthMeter, heightMeter) {
    if (!widthMeter || !heightMeter) return;
    return (2 * widthMeter * heightMeter) / (widthMeter + heightMeter);
}
export function dpRoundAir(diameterMil, flowCmh, lenMet) {
    if (!diameterMil || !flowCmh || !lenMet) return;
    var diameterMet = diameterMil / 1000;
    var v = velocityRound(diameterMet, flowCmh);
    var nu = kinViscAir(t);
    var re = reinolds(v, diameterMet, nu);
    var lambda = lambdaKoef(re, diameterMil);
    var dens = densityAir(t);
    var dp = lenMet * lambda * ((dens * v ** 2) / (2 * diameterMet));

    return dp;
}
export function dpRectAir(widthMil, heightMil, flowCmh, lenMet) {
    if (!widthMil || !heightMil || !flowCmh || !lenMet) return;
    var widthMet = widthMil / 1000;
    var heightMet = heightMil / 1000;
    var area = widthMet * heightMet;
    var v = velocityRect(widthMil, heightMil, flowCmh);
    var dMeter = hydraulicDiameter(widthMet, heightMet);
    var nu = kinViscAir(t);
    var re = reinolds(v, dMeter, nu);
    var lambda = lambdaKoef(re, dMeter * 1000);
    var dens = densityAir(t);

    
    if (lenMet) {
        var dp = lenMet * lambda * ((dens * v ** 2) / (2 * dMeter));
    }
    else {
        var dp = 0;
    }

    
    return dp;
}

export class Flow{

    static getFlowVelocity(flowRateCollectorPipeCubicMeterPerHour, areaCollectorPipeSquareMeter) {
        var flowVelocityMeterPerSecond = (flowRateCollectorPipeCubicMeterPerHour / 3600) / areaCollectorPipeSquareMeter;
    
        return flowVelocityMeterPerSecond;
    }

    static getVolumeFlow(velocityPipeMeterPerSecond, areaTurnPipeSquareMeter) {
        var volumeFlowCubicMeterPerHour = (velocityPipeMeterPerSecond * 3600) * areaTurnPipeSquareMeter;
        return volumeFlowCubicMeterPerHour;
    }
}

// Tests for the Flow class



