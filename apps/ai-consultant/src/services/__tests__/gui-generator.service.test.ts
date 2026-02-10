import { GUIGeneratorService } from '../gui-generator.service';

describe('GUIGeneratorService', () => {
    describe('generateGUIConfig', () => {
        it('should generate restaurant GUI config', () => {
            const result = GUIGeneratorService.generateGUIConfig('restaurante');

            expect(result.industry).toBe('restaurant');
            expect(result.theme).toBeDefined();
            expect(result.theme.primaryColor).toBeDefined();
            expect(result.layout).toBe('dashboard');
            expect(result.components.length).toBeGreaterThan(0);
        });

        it('should generate retail GUI config', () => {
            const result = GUIGeneratorService.generateGUIConfig('retail');

            expect(result.industry).toBe('retail');
            expect(result.components).toContainEqual(
                expect.objectContaining({
                    title: expect.stringContaining('Productos'),
                })
            );
        });

        it('should generate healthcare GUI config', () => {
            const result = GUIGeneratorService.generateGUIConfig('salud');

            expect(result.industry).toBe('healthcare');
            expect(result.components).toContainEqual(
                expect.objectContaining({
                    title: expect.stringContaining('Pacientes'),
                })
            );
        });

        it('should generate education GUI config', () => {
            const result = GUIGeneratorService.generateGUIConfig('educacion');

            expect(result.industry).toBe('education');
            expect(result.components).toContainEqual(
                expect.objectContaining({
                    title: expect.stringContaining('Estudiantes'),
                })
            );
        });

        it('should generate logistics GUI config', () => {
            const result = GUIGeneratorService.generateGUIConfig('logistica');

            expect(result.industry).toBe('logistics');
            expect(result.components).toContainEqual(
                expect.objectContaining({
                    title: expect.stringContaining('Envíos'),
                })
            );
        });

        it('should generate generic GUI config for unknown industry', () => {
            const result = GUIGeneratorService.generateGUIConfig('unknown-industry');

            expect(result.industry).toBe('generic');
            expect(result.components.length).toBeGreaterThan(0);
        });

        it('should include theme with colors and fonts', () => {
            const result = GUIGeneratorService.generateGUIConfig('restaurante');

            expect(result.theme.primaryColor).toMatch(/^#[0-9A-F]{6}$/i);
            expect(result.theme.secondaryColor).toMatch(/^#[0-9A-F]{6}$/i);
            expect(result.theme.fontFamily).toBeDefined();
        });

        it('should include components with required fields', () => {
            const result = GUIGeneratorService.generateGUIConfig('retail');

            result.components.forEach(component => {
                expect(component.type).toBeDefined();
                expect(component.title).toBeDefined();
                expect(component.dataSource).toBeDefined();
                expect(component.fields).toBeDefined();
                expect(Array.isArray(component.fields)).toBe(true);
            });
        });

        it('should be case-insensitive for industry names', () => {
            const result1 = GUIGeneratorService.generateGUIConfig('RESTAURANTE');
            const result2 = GUIGeneratorService.generateGUIConfig('restaurante');
            const result3 = GUIGeneratorService.generateGUIConfig('Restaurante');

            expect(result1.industry).toBe(result2.industry);
            expect(result2.industry).toBe(result3.industry);
        });

        it('should include actions for interactive components', () => {
            const result = GUIGeneratorService.generateGUIConfig('restaurante');

            const interactiveComponents = result.components.filter(c => c.actions);
            expect(interactiveComponents.length).toBeGreaterThan(0);

            interactiveComponents.forEach(component => {
                expect(Array.isArray(component.actions)).toBe(true);
                expect(component.actions!.length).toBeGreaterThan(0);
            });
        });
    });
});
