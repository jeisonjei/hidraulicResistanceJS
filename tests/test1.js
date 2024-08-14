function densityAir(t) {
    return 353 / (273 + t);
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
function getRe(v, diameterMet, nu) {
    return (v * diameterMet) / nu;
}
function getLambda(re, diameterMil) {
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

export class ElbowRound {
    static resistance(equivalentRoughnessMillimeters, angleDegrees, rd, lambda, re, widthMillimeters = 0, heightMillimeters = 0, diameterMillimeters = 0) {
        let dzetam;
        let A = 0;
        let b = 0;
        let c = 0;
        let kre = 0;
        let kd = 0;
        let ln;
        let deltar;
        let elbowp;

        // Calculate A based on angleDegrees
        if (angleDegrees <= 70) {
            A = 0.9 * Math.sin(angleDegrees * Math.PI / 180);
        } else if (angleDegrees <= 100) {
            A = 1;
        } else {
            A = 0.7 + 0.35 * (angleDegrees / 90);
        }

        // Calculate b based on rd
        if (rd >= 0.5) {
            if (rd <= 1) {
                b = 0.21 * Math.pow(rd, -2.5);
            } else {
                b = 0.21 * Math.pow(rd, -0.5);
            }
        } else {
            b = 0.21 * Math.pow(rd, -2.5);
        }

        // Calculate c based on diameterMillimeters and heightMillimeters/widthMillimeters
        if (diameterMillimeters === 0) {
            if (heightMillimeters / widthMillimeters === 1) {
                c = 1;
            } else if (heightMillimeters / widthMillimeters <= 4) {
                c = 0.85 + 0.125 / (heightMillimeters / widthMillimeters);
            } else {
                c = 1.115 - 0.84 / (heightMillimeters / widthMillimeters);
            }
        } else if (diameterMillimeters > 0) {
            c = 1;
        } else {
            if (heightMillimeters / widthMillimeters === 1) {
                c = 1;
            } else if (heightMillimeters / widthMillimeters <= 4) {
                c = 0.85 + 0.125 / (heightMillimeters / widthMillimeters);
            } else {
                c = 1.115 - 0.84 / (heightMillimeters / widthMillimeters);
            }
        }

        // Calculate hydraulicDiameterMillimeters
        let hydraulicDiameterMillimeters = (heightMillimeters !== 0 && widthMillimeters !== 0)
            ? (2 * (widthMillimeters * heightMillimeters)) / (widthMillimeters + heightMillimeters)
            : diameterMillimeters;

        deltar = equivalentRoughnessMillimeters / hydraulicDiameterMillimeters;

        // Calculate kre based on rd and re
        if (rd <= 0.55) {
            kre = 1 + 4400 / re;
        } else {
            if (rd <= 0.7) {
                kre = 5.45 / Math.pow(re, 0.131);
            } else {
                ln = Math.log(Math.pow(re, Math.pow(10, -5)));
                kre = 1.3 - 0.29 * ln;
            }
        }

        // Calculate kd based on rd and re
        if (rd <= 0.55) {
            if (re <= 4 * Math.pow(10, 4)) {
                if (deltar === 0) {
                    kd = 1;
                } else {
                    kd = 1; // The logic for deltar > 0 is the same
                }
            } else {
                if (deltar === 0) {
                    kd = 1;
                } else {
                    if (deltar <= 0.001) {
                        kd = 1 + 0.5 * Math.pow(10, 3) * deltar;
                    } else {
                        kd = 1.5;
                    }
                }
            }
        } else {
            if (re <= 4 * Math.pow(10, 4)) {
                if (deltar === 0) {
                    kd = 1;
                } else {
                    kd = 1; // The logic for deltar > 0 is the same
                }
            } else {
                if (re <= 2 * Math.pow(10, 5)) {
                    if (deltar === 0) {
                        kd = 1;
                    } else {
                        if (deltar <= 0.001) {
                            kd = 1.5;
                        } else {
                            kd = 2;
                        }
                    }
                } else {
                    if (deltar === 0) {
                        kd = 1;
                    } else {
                        if (deltar <= 0.001) {
                            kd = 1 + deltar * Math.pow(10, 3);
                        } else {
                            kd = 2;
                        }
                    }
                }
            }
        }

        dzetam = A * b * c;
        elbowp = kd * kre * dzetam + 0.0175 * angleDegrees * lambda * rd;
        return elbowp;
    }

}

var t = 20;
var roughness = 0.1;
var angleDeg = 15;
var rd = 1;
var widthMil = 200;
var heightMil = 200;
var widthMet = widthMil / 1000;
var heightMet = heightMil / 1000;
var diamMil = 315;
var diamMet = hydraulicDiameter(widthMet, heightMet);
var flowCmh = 1000;
var v = velocityRect(widthMil,heightMil,flowCmh);

var nu = kinViscAir(t);
var re = getRe(v, diamMet, nu);
var lambda = getLambda(re, diamMet * 1000);

console.log(diamMet)
console.log(v);
console.log(re);
console.log(lambda);


var result = ElbowRound.resistance(roughness, angleDeg, rd, lambda, re, 0, 0, diamMil);
console.log(result);