import { ElbowRect } from './ElbowRect';



describe('ElbowRect', () => {
    describe('resistance', () => {

        it('should return undefined when any of the required parameters are missing', () => {
            expect(ElbowRect.resistance(1, 90, 0.5, 0.02, undefined)).toBeUndefined();
            expect(ElbowRect.resistance(1, 90, 0.5, undefined, 1000)).toBeUndefined();
            expect(ElbowRect.resistance(1, 90, undefined, 0.02, 1000)).toBeUndefined();
            expect(ElbowRect.resistance(1, undefined, 0.5, 0.02, 1000)).toBeUndefined();
            expect(ElbowRect.resistance(undefined, 90, 0.5, 0.02, 1000)).toBeUndefined();
        });

        it('should return result for standard input values', () => {
            const flowRate = 2500; // High flow rate to achieve Re = 250000
            const width = 500;
            const height = 300;
            const eqRoughness = 0.1;
            const angle = 90;
            const rd = 1.0;

            const result = ElbowRect.Resistance(flowRate, width, height, eqRoughness, angle, rd);

            expect(result).toBeCloseTo(0.4556);
        });

    });
});