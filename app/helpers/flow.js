function densityAir(t) {
    return 353/(273+t);
}
function dynViscAir(t) {
    // mu
    return 9.80665 * (1.745 * 10 ** (-6) + 5.03 * 10 ** (-9) * t);
}
function dynViscWater(t) {
    // mu
    return 2.414 * 10 ** (-5) * 10 ** (247.8 / (t + 133.15));
}
function kinViscAir(t) {
    // nu
    var dens = densityAir(t);
    return dynViscAir(t) / dens;
}
function kinViscWater(t) {
    // nu
    var dens = 1000;
    return dynViscWater(t) / dens;
}
function reinolds(v, diameterMet, nu) {
    return (v * diameterMet) / nu;
}
function lambdaKoef(re, diameterMil) {
    return 0.11 * ((roughness / diameterMil) + (0.68 / re)) ** 0.25;
}
function velocityRect(widthMil, heightMil, flowCmh) {
    var area = (widthMil / 1000) * (heightMil / 1000);
    var vel = (flowCmh / 3600) / area;
    return vel;
}
function velocityRound(diameterMil, flowCmh) {
    var area = Math.PI * (diameterMil / 2000) ** 2;
    var vel = (flowCmh / 3600) / area;
    return vel;
}
function hydraulicDiameter(widthMeter, heightMeter) {
    return (2 * widthMeter * heightMeter) / (widthMeter + heightMeter);
}
function dpRoundAir(diameterMil, flowCmh, lenMet) {
    var diameterMet = diameterMil / 1000;
    var v = velocityRound(diameterMet, flowCmh);
    var nu = kinViscAir(t);
    var re = reinolds(v, diameterMet, nu);
    var lambda = lambdaKoef(re, diameterMil);
    var dens = densityAir(t);
    var dp = lenMet * lambda * ((dens * v ** 2) / (2 * diameterMet));

    return dp;
}
function dpRectAir(widthMil, heightMil, flowCmh, lenMet) {
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

export {
    densityAir,
    dynViscAir,
    dynViscWater,
    kinViscAir,
    kinViscWater,
    reinolds,
    lambdaKoef,
    velocityRect,
    velocityRound,
    hydraulicDiameter,
    dpRoundAir,
    dpRectAir
}


