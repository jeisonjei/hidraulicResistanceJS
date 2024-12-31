import { Mathematics } from "../helpers/mathematics";
import { Flow } from "../helpers/flow";

export class TeeExhaustRectangular {
    // Method to calculate on-pass resistance
    static onPassResistance(flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        widthCollectorPipeMillimeter,
        heightCollectorPipeMillimeter,
        widthTurnPipeMillimeter,
        heightTurnPipeMillimeter,
        widthPassPipeMillimeter,
        heightPassPipeMillimeter,
        angleDegree) {
        let ksi;
        const areaCollectorPipeSquareMeter = Mathematics.GetAreaRectangle(widthCollectorPipeMillimeter, heightCollectorPipeMillimeter);
        const areaTurnPipeSquareMeter = Mathematics.GetAreaRectangle(widthTurnPipeMillimeter, heightTurnPipeMillimeter);
        const areaPassPipeSquareMeter = Mathematics.GetAreaRectangle(widthPassPipeMillimeter, heightPassPipeMillimeter);

        ksi = TeeExhaustRectangular._getTeeExhaustOnPassResistance(areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour,
            angleDegree);

        return ksi;
    }

    // Method to calculate turn resistance
    static toTurnResistance(flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        widthCollectorPipeMillimeter,
        heightCollectorPipeMillimeter,
        widthTurnPipeMillimeter,
        heightTurnPipeMillimeter,
        widthPassPipeMillimeter,
        heightPassPipeMillimeter,
        angleDegree) {
        let ksi;
        const areaCollectorPipeSquareMeter = Mathematics.GetAreaRectangle(widthCollectorPipeMillimeter, heightCollectorPipeMillimeter);
        const areaTurnPipeSquareMeter = Mathematics.GetAreaRectangle(widthTurnPipeMillimeter, heightTurnPipeMillimeter);
        const areaPassPipeSquareMeter = Mathematics.GetAreaRectangle(widthPassPipeMillimeter, heightPassPipeMillimeter);

        const velocityCollectorPipeMeterPerSecond = Flow.getFlowVelocity(flowRateCollectorPipeCubicMeterPerHour, areaCollectorPipeSquareMeter);
        const velocityTurnPipeMeterPerSecond = Flow.getFlowVelocity(flowRateTurnPipeCubicMeterPerHour, areaTurnPipeSquareMeter);

        const flowRatePassPipeCubicMeterPerHour = flowRateCollectorPipeCubicMeterPerHour - flowRateTurnPipeCubicMeterPerHour;
        const velocityPassPipeMeterPerSecond = Flow.getFlowVelocity(flowRatePassPipeCubicMeterPerHour, areaPassPipeSquareMeter);

        ksi = TeeExhaustRectangular._getTeeExhaustOnTurnResistance(velocityCollectorPipeMeterPerSecond,
            velocityTurnPipeMeterPerSecond,
            velocityPassPipeMeterPerSecond,
            areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            areaPassPipeSquareMeter,
            angleDegree);
        return ksi;
    }

    // Private method for pass resistance calculation
    static _getTeeExhaustOnPassResistance(areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        angleDegree) {
        const K = TeeExhaustRectangular._getTeeExhaustCoefficientK(areaTurnPipeSquareMeter,
            areaCollectorPipeSquareMeter,
            flowRateTurnPipeCubicMeterPerHour,
            flowRateCollectorPipeCubicMeterPerHour);
        const angleRadian = angleDegree * (Math.PI / 180);
        let ksi = 1 - Math.pow(1 - flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour, 2)
            - (1.4 - flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour)
            * Math.pow(flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour, 2)
            * Math.sin(angleRadian)
            - 2 * K * (areaCollectorPipeSquareMeter / areaTurnPipeSquareMeter)
            * (flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour)
            * Math.cos(angleRadian);
        return ksi;
    }

    // Private method for turn resistance calculation
    static _getTeeExhaustOnTurnResistance(velocityCollectorPipeMeterPerSecond,
        velocityTurnPipeMeterPerSecond,
        velocityPassPipeMeterPerSecond,
        areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        areaPassPipeSquareMeter,
        angleDegree) {
        const flowRateTurnPipeCubicMeterPerHour = Flow.getVolumeFlow(velocityTurnPipeMeterPerSecond, areaTurnPipeSquareMeter);
        const flowRateCollectorPipeCubicMeterPerHour = Flow.getVolumeFlow(velocityCollectorPipeMeterPerSecond, areaCollectorPipeSquareMeter);
        const A = TeeExhaustRectangular._getTeeExhaustCoefficientA(areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour);
        const angleRadian = angleDegree * (Math.PI / 180);
        let ksi = A * (1 + Math.pow(velocityTurnPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2)
            - 2 * (areaPassPipeSquareMeter / areaCollectorPipeSquareMeter)
            * Math.pow(velocityPassPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2)
            - 2 * (areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter)
            * Math.pow(velocityTurnPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2)
            * Math.cos(angleRadian));
        return ksi;
    }

    // Private method for coefficient A
    static _getTeeExhaustCoefficientA(areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour) {
        let A;
        const fraction = areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter;
        if (fraction <= 0.35) {
            A = 1;
        } else {
            const flowRatio = flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour;
            if (flowRatio <= 0.4) {
                A = 0.9 * (1 - flowRatio);
            } else {
                A = 0.55;
            }
        }
        return A;
    }

    // Private method for coefficient K
    static _getTeeExhaustCoefficientK(areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour) {
        let K;
        const fraction = areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter;
        if (fraction <= 0.35) {
            K = 0.8 * (flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour);
        } else {
            const flowRatio = flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour;
            if (flowRatio <= 0.6) {
                K = 0.5;
            } else {
                K = 0.8 * (flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour);
            }
        }
        return K;
    }
}

