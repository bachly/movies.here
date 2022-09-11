const sizes = [
    [320, 2560],
    [640, 2560],
    [768, 2560],
    [1080, 2560],
    [1440, 2560],
    [1920, 2560],
];

describe('Home Page', () => {
    sizes.forEach((size) => {
        it(`Should match the screenshot on '${size}' viewport`, () => {
            cy.viewport(size[0], size[1]);
            cy.visit(`/`);
            cy.matchImageSnapshot();
        });
    });
})