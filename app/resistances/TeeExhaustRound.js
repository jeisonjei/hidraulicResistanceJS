class TeeExhaustRound {
    static onPassResistance(
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        diamCollectorPipeMillimeter,
        diamTurnPipeMillimeter,
        diamPassPipeMillimeter,
        angleDegree
    ) {
        /*
         * Сопротивление тройника вытяжного на проход
         */
        const areaCollectorPipeSquareMeter = Mathematics.getAreaCircle(diamCollectorPipeMillimeter);
        const areaTurnPipeSquareMeter = Mathematics.getAreaCircle(diamTurnPipeMillimeter);
        const areaPassPipeSquareMeter = Mathematics.getAreaCircle(diamPassPipeMillimeter);

        const ksi = this._getTeeExhaustOnPassResistance(
            areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour,
            angleDegree
        );
        return ksi;
    }

    static toTurnResistance(
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        diamCollectorPipeMillimeter,
        diamTurnPipeMillimeter,
        diamPassPipeMillimeter,
        angleDegree
    ) {
        /*
         * Сопротивление тройника вытяжного на поворот
         */
        const areaCollectorPipeSquareMeter = Mathematics.getAreaCircle(diamCollectorPipeMillimeter);
        const areaTurnPipeSquareMeter = Mathematics.getAreaCircle(diamTurnPipeMillimeter);
        const areaPassPipeSquareMeter = Mathematics.getAreaCircle(diamPassPipeMillimeter);

        const velocityCollectorPipeMeterPerSecond = Flow.getFlowVelocity(flowRateCollectorPipeCubicMeterPerHour, areaCollectorPipeSquareMeter);
        const velocityTurnPipeMeterPerSecond = Flow.getFlowVelocity(flowRateTurnPipeCubicMeterPerHour, areaTurnPipeSquareMeter);

        const flowRatePassPipeCubicMeterPerHour = flowRateCollectorPipeCubicMeterPerHour - flowRateTurnPipeCubicMeterPerHour;
        const velocityPassPipeMeterPerSecond = Flow.getFlowVelocity(flowRatePassPipeCubicMeterPerHour, areaPassPipeSquareMeter);

        const ksi = this._getTeeExhaustOnTurnResistance(
            velocityCollectorPipeMeterPerSecond,
            velocityTurnPipeMeterPerSecond,
            velocityPassPipeMeterPerSecond,
            areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            areaPassPipeSquareMeter,
            angleDegree
        );
        return ksi;
    }

    static _getTeeExhaustOnPassResistance(
        areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour,
        angleDegree
    ) {
        /*
         * Сопротивление тройника вытяжного на проход, формула 7-2
         */
        const K = this._getTeeExhaustCoefficientK(
            areaTurnPipeSquareMeter,
            areaCollectorPipeSquareMeter,
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour
        );

        const angleRadian = angleDegree * (Math.PI / 180);
        const ksi =
            1 -
            Math.pow(1 - flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour, 2) -
            (1.4 - flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour) *
                Math.pow(flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour, 2) *
                Math.sin(angleRadian) -
            2 *
                K *
                (areaCollectorPipeSquareMeter / areaTurnPipeSquareMeter) *
                (flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour) *
                Math.cos(angleRadian);
        return ksi;
    }

    static _getTeeExhaustOnTurnResistance(
        velocityCollectorPipeMeterPerSecond,
        velocityTurnPipeMeterPerSecond,
        velocityPassPipeMeterPerSecond,
        areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        areaPassPipeSquareMeter,
        angleDegree
    ) {
        /*
         * Сопротивление тройника вытяжного на поворот, формула 7-1
         */
        const flowRateTurnPipeCubicMeterPerHour = Flow.getVolumeFlow(velocityTurnPipeMeterPerSecond, areaTurnPipeSquareMeter);
        const flowRateCollectorPipeCubicMeterPerHour = Flow.getVolumeFlow(velocityCollectorPipeMeterPerSecond, areaCollectorPipeSquareMeter);

        const A = this._getTeeExhaustCoefficientA(
            areaCollectorPipeSquareMeter,
            areaTurnPipeSquareMeter,
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour
        );

        const angleRadian = angleDegree * (Math.PI / 180);
        const ksi =
            A *
            (1 +
                Math.pow(velocityTurnPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2) -
                2 *
                    (areaPassPipeSquareMeter / areaCollectorPipeSquareMeter) *
                    Math.pow(velocityPassPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2) -
                2 *
                    (areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter) *
                    Math.pow(velocityTurnPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond, 2) *
                    Math.cos(angleRadian));
        return ksi;
    }

    static _getTeeExhaustCoefficientA(
        areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour
    ) {
        /*
         * Коэффициент A по таблице 7-1
         */
        const ratio = areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter;
        if (ratio <= 0.35) {
            return 1;
        }
        const flowRatio = flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour;
        return flowRatio <= 0.4 ? 0.9 * (1 - flowRatio) : 0.55;
    }

    static _getTeeExhaustCoefficientK(
        areaCollectorPipeSquareMeter,
        areaTurnPipeSquareMeter,
        flowRateCollectorPipeCubicMeterPerHour,
        flowRateTurnPipeCubicMeterPerHour
    ) {
        /*
         * Коэффициент Kп(') из таблицы 7-3
         */
        const ratio = areaTurnPipeSquareMeter / areaCollectorPipeSquareMeter;
        const flowRatio = flowRateTurnPipeCubicMeterPerHour / flowRateCollectorPipeCubicMeterPerHour;
        if (ratio <= 0.35) {
            return 0.8 * flowRatio;
        }
        return flowRatio <= 0.6 ? 0.5 : 0.8 * flowRatio;
    }
}
