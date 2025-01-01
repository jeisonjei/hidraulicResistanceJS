import { TeeSupplyRectangular } from './TeeSupplyRectangular';
import { Mathematics } from '../helpers/mathematics';

describe('TeeSupplyRectangular', () => {
    describe('onPassResistance', () => {

        it('should calculate resistance correctly for typical flow rates and pipe dimensions', () => {
            const flowRateCollector = 1000;
            const flowRateTurn = 400;
            const widthCollector = 500;
            const heightCollector = 300;
            const widthTurn = 300;
            const heightTurn = 200;
            const widthPass = 500;
            const heightPass = 300;

            const result = TeeSupplyRectangular.onPassResistance(
                flowRateCollector,
                flowRateTurn,
                widthCollector,
                heightCollector,
                widthTurn,
                heightTurn,
                widthPass,
                heightPass
            );

            expect(result).toBeCloseTo(0.064, 3);
        });

it('should calculate resistance correctly for a 90-degree angle', () => {
    const flowRateCollector = 1000;
    const flowRateTurn = 400;
    const widthCollector = 500;
    const heightCollector = 300;
    const widthTurn = 300;
    const heightTurn = 200;
    const widthPass = 500;
    const heightPass = 300;
    const angleDegrees = 90;

    const result = TeeSupplyRectangular.toTurnResistance(
        flowRateCollector,
        flowRateTurn,
        widthCollector,
        heightCollector,
        widthTurn,
        heightTurn,
        widthPass,
        heightPass,
        angleDegrees
    );

    expect(result).toBeCloseTo(2.0, 3);
});
    });
});
