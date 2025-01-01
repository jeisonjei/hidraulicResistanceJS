import { TeeExhaustRectangular } from './TeeExhaustRectangular';
import { Mathematics } from '../helpers/mathematics';
import { afterAll, beforeAll, jest } from '@jest/globals';

beforeAll(() => {
    jest.unstable_mockModule('../helpers/mathematics', () => {
        return {
            GetAreaRectangle: jest.fn((width, height) => {
                return width * height / 1000000
            }),
        }
    })
});

afterAll(() => {
    jest.clearAllMocks();
})

describe('TeeExhaustRectangular', () => {
    describe('onPassResistance', () => {
        it('should calculate correct resistance for standard flow rates and pipe dimensions', async () => {

            const result = TeeExhaustRectangular.onPassResistance(
                1000, // flowRateCollectorPipeCubicMeterPerHour
                500,  // flowRateTurnPipeCubicMeterPerHour
                500,  // widthCollectorPipeMillimeter
                300,  // heightCollectorPipeMillimeter
                400,  // widthTurnPipeMillimeter
                200,  // heightTurnPipeMillimeter
                450,  // widthPassPipeMillimeter
                250,  // heightPassPipeMillimeter
                90    // angleDegree
            );

            expect(result).toBeCloseTo(0.525);
        });
    });

    it('should calculate correct resistance when all pipe dimensions are equal', async () => {
        const flowRateCollectorPipeCubicMeterPerHour = 1000;
        const flowRateTurnPipeCubicMeterPerHour = 500;
        const widthCollector = 400;
        const heightCollector = 300;
        const widthTurn = 400;
        const heightTurn = 300;
        const widthPass = 400;
        const heightPass = 300;
        const angleDegree = 90;

        const result = TeeExhaustRectangular.onPassResistance(
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour,
            widthCollector,
            heightCollector,
            widthTurn,
            heightTurn,
            widthPass,
            heightPass,
            angleDegree
        );

        expect(result).toBeCloseTo(0.525);
    });

    it('should calculate correct resistance when flow rate in turn pipe is equal to collector pipe (no flow in pass pipe)', async () => {
        const flowRateCollectorPipeCubicMeterPerHour = 1000;
        const flowRateTurnPipeCubicMeterPerHour = 500;
        const widthCollector = 500;
        const heightCollector = 300;
        const widthTurn = 400;
        const heightTurn = 200;
        const widthPass = 400;
        const heightPass = 200;
        const angleDegree = 90;

        const result = TeeExhaustRectangular.toTurnResistance(
            flowRateCollectorPipeCubicMeterPerHour,
            flowRateTurnPipeCubicMeterPerHour,
            widthCollector,
            heightCollector,
            widthTurn,
            heightTurn,
            widthPass,
            heightPass,
            angleDegree
        );

        expect(result).toBeCloseTo(0.5178);
    });

    it('should calculate correct resistance when all input values are identical (flow rates and dimensions)', async () => {
        const flowRateCollector = 1000;
        const flowRateTurn = 500;
        const width = 400;
        const height = 300;
        const angleDegree = 90;

        const result = TeeExhaustRectangular.toTurnResistance(
            flowRateCollector,
            flowRateTurn,
            width,
            height,
            width,
            height,
            width,
            height,
            angleDegree
        );

        expect(result).toBeCloseTo(0.4125);
    });
});
