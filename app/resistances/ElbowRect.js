export class ElbowRect{
    static resistance(equivalentRoughnessMillimeters, angleDegrees, rd, lambda, re, widthMillimeters = 0, heightMillimeters = 0, diameterMillimeters = 0) {
        let dzetam;
        let A;
        let b;
        let c;
        let kre;
        let kd;
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
                kd = (deltar === 0) ? 1 : 1; // The logic for deltar > 0 is the same
            } else {
                kd = (deltar === 0) ? 1 : ((deltar <= 0.001) ? (1 + 0.5 * Math.pow(10, 3) * deltar) : 1.5);
            }
        } else {
            if (re <= 4 * Math.pow(10, 4)) {
                kd = (deltar === 0) ? 1 : 1; // The logic for deltar > 0 is the same
            } else {
                if (re <= 2 * Math.pow(10, 5)) {
                    kd = (deltar === 0) ? 1 : ((deltar <= 0.001) ? 1.5 : 2);
                } else {
                    kd = (deltar === 0) ? 1 : ((deltar <= 0.001) ? (1 + deltar * Math.pow(10, 3)) : 2);
                }
            }
        }
    
        dzetam = A * b * c;
        elbowp = kd * kre * dzetam + 0.0175 * angleDegrees * lambda * rd;
        return elbowp;
    }
}