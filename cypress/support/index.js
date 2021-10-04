// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


const isInViewport = (_chai, utils) => {
    function assertIsInViewport(options) {

        const subject = this._obj;

        const bottom = Cypress.$(cy.state('window')).height();
        const rect = subject[0].getBoundingClientRect();

        this.assert(
            rect.top < bottom && rect.bottom < bottom,
            "expected #{this} to be in viewport",
            "expected #{this} to not be in viewport",
            this._obj
        )
    }

    _chai.Assertion.addMethod('inViewport', assertIsInViewport)
};

chai.use(isInViewport);