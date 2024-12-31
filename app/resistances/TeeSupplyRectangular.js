import { Mathematics } from "../helpers/mathematics";
import { Flow } from "../helpers/flow";

export class TeeSupplyRectangular {
    /*
    Со страницы 333:
    В общем случае основные потери в вытяжном тройнике складываются из 
    1) потерь на турбулентное смешение двух потоков, обладающих различными скоростями ("удар"),
    2) потерь на поворот потока при выходе его из бокового ответвления в сборный рукав,
    3) потерь на расширение потока в диффузорой части
    4) потерь в плавном отводе
    */

    static onPassResistance(flowRateCollectorPipeCubicMetersPerHour, flowRateTurnPipeCubicMetersPerHour, widthCollectorPipeMillimeters, heightCollectorPipeMillimeters, widthTurnPipeMillimeters, heightTurnPipeMillimeters, widthPassPipeMillimeters, heightPassPipeMillimeters) {
        /*
        Сопротивление приточного тройника на проход, все ответвления прямоугольного сечения
        */
        let ksi;
        const areaCollectorPipeSquareMeters = Mathematics.getAreaRectangle(widthCollectorPipeMillimeters, heightCollectorPipeMillimeters);
        const areaTurnPipeSquareMeters = Mathematics.getAreaRectangle(widthTurnPipeMillimeters, heightTurnPipeMillimeters);
        const areaPassPipeSquareMeters = Mathematics.getAreaRectangle(widthPassPipeMillimeters, heightPassPipeMillimeters);

        ksi = this._getTeeSupplyOnPassResistance(
            flowRateCollectorPipeCubicMetersPerHour,
            flowRateTurnPipeCubicMetersPerHour,
            areaCollectorPipeSquareMeters,
            areaTurnPipeSquareMeters,
            areaPassPipeSquareMeters
        );
        return ksi;
    }

    static toTurnResistance(flowRateCollectorPipeCubicMetersPerHour, flowRateTurnPipeCubicMetersPerHour, widthCollectorPipeMillimeters, heightCollectorPipeMillimeters, widthTurnPipeMillimeters, heightTurnPipeMillimeters, widthPassPipeMillimeters, heightPassPipeMillimeters, angleDegrees) {
        let ksi;
        const areaCollectorPipeSquareMeters = Mathematics.getAreaRectangle(widthCollectorPipeMillimeters, heightCollectorPipeMillimeters);
        const areaTurnPipeSquareMeters = Mathematics.getAreaRectangle(widthTurnPipeMillimeters, heightTurnPipeMillimeters);
        const areaPassPipeSquareMeters = Mathematics.getAreaRectangle(widthPassPipeMillimeters, heightPassPipeMillimeters);

        ksi = this._getTeeSupplyOnTurnResistance(
            flowRateCollectorPipeCubicMetersPerHour,
            flowRateTurnPipeCubicMetersPerHour,
            areaCollectorPipeSquareMeters,
            areaTurnPipeSquareMeters,
            areaPassPipeSquareMeters,
            angleDegrees
        );
        return ksi;
    }

    static _getTeeSupplyOnPassResistance(flowRateCollectorPipeCubicMetersPerHour, flowRateTurnPipeCubicMetersPerHour, areaCollectorPipeSquareMeters, areaTurnPipeSquareMeters, areaPassPipeSquareMeters) {
        /*
        Коэффициент сопротивления тройника приточного на проход
        Пункт 16 на странице 336
        Коэффициент τ (tau) - таблица на странице 366 из диаграммы 7-20
        */
        let tau = 0;
        if (areaTurnPipeSquareMeters + areaPassPipeSquareMeters > areaCollectorPipeSquareMeters && areaPassPipeSquareMeters === areaCollectorPipeSquareMeters) {
            if (areaTurnPipeSquareMeters / areaCollectorPipeSquareMeters <= 0.4) {
                tau = 0.4;
            } else {
                const ratio = flowRateTurnPipeCubicMetersPerHour / flowRateCollectorPipeCubicMetersPerHour;
                tau = ratio <= 0.5 ? 2 * (2 * ratio - 1) : 0.3 * (2 * ratio - 1);
            }
        }

        const ksi = tau * Math.pow(flowRateTurnPipeCubicMetersPerHour / flowRateCollectorPipeCubicMetersPerHour, 2);
        return ksi;
    }

    static _getTeeSupplyOnTurnResistance(flowRateCollectorPipeCubicMetersPerHour, flowRateTurnPipeCubicMetersPerHour, areaCollectorPipeSquareMeters, areaTurnPipeSquareMeters, areaPassPipeSquareMeters, angleDegrees) {
        /*
        Коэффициент сопротивления тройника приточного на поворот
        Пункт 16 на странице 336, диаграмма 7.18 на странице 364
        Значения A и Kb - таблицы 7-4 и 7-5 соответственно
        */
        let A = 0, Kb = 0;

        if (areaTurnPipeSquareMeters + areaPassPipeSquareMeters > areaCollectorPipeSquareMeters && areaPassPipeSquareMeters === areaCollectorPipeSquareMeters) {
            const ratio = areaTurnPipeSquareMeters / areaCollectorPipeSquareMeters;

            if (ratio <= 0.35) {
                const flowRatio = flowRateTurnPipeCubicMetersPerHour / flowRateCollectorPipeCubicMetersPerHour;
                A = flowRatio <= 0.4 ? 1.1 - 0.7 * flowRatio : 0.85;
            } else {
                const flowRatio = flowRateTurnPipeCubicMetersPerHour / flowRateCollectorPipeCubicMetersPerHour;
                A = flowRatio <= 0.6 ? 1 - 0.6 * flowRatio : 0.6;
            }

            if (angleDegrees === 90) {
                A = 1;
            }
        } else if (areaTurnPipeSquareMeters + areaPassPipeSquareMeters === areaCollectorPipeSquareMeters) {
            A = 1;

            switch (angleDegrees) {
                case 15: Kb = 0.04; break;
                case 30: Kb = 0.16; break;
                case 45: Kb = 0.36; break;
                case 60: Kb = 0.64; break;
                case 90: Kb = 1; break;
                default: Kb = 1; break;
            }
        }

        const velocityCollectorPipeMeterPerSecond = Flow.getFlowVelocity(flowRateCollectorPipeCubicMetersPerHour, areaCollectorPipeSquareMeters);
        const velocityTurnPipeMeterPerSecond = Flow.getFlowVelocity(flowRateTurnPipeCubicMetersPerHour, areaTurnPipeSquareMeters);
        const block1 = velocityTurnPipeMeterPerSecond / velocityCollectorPipeMeterPerSecond;
        const angle = Math.PI * angleDegrees / 180.0;

        const ksi = A * (1 + Math.pow(block1, 2) - 2 * block1 * Math.cos(angle)) - Kb * Math.pow(block1, 2);
        return ksi;
    }
}
