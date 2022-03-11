import { format, differenceInDays, addDays } from "date-fns";

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

const URL = "http://portalpessoas.dasa.com.br";

const EMAIL_LOGIN = ""; //TODO: COLOQUE SEU LOGIN
const PASS_LOGIN = ""; //TODO: COLOQUE SUA SENHA

const timeZone = {
  timeZone: "America/Sao_Paulo",
};

const initialDate = new Date("2022-03-02"); //TODO: COLOQUE A DATA QUE VOCÊ QUER INICIAR O RASTREAMENTO
const endDate = new Date("2022-03-10"); //TODO: COLOQUE A DATA FINAL EX: "2021-10-04"  OU SE QUISER A DATA ATUAL DEIXE COMO ESTÁ

const getDatesBetween = (startDate, endDate) => {
  const days = differenceInDays(addDays(endDate, 1), startDate);
  if (days)
    return [...Array(days + 1).keys()].map((i) => addDays(startDate, i));
};

const defaultCheckBox = "idMarc--idRowBase-idMarc--idMarcacao-#-selectSingle-Button";
const defaultIncludeButton = "__button3-idMarc--idMarcacao-#-inner";
const defaultCodes = "__button2-idMarc--idMarcacao-#-content";
const defaultJourney = "__text12-idMarc--idMarcacao-#";
const buttonSaveGeral = "idMarc--idSalvar-img";


const markPoint = (journey) => {

  cy.wait(1000);
  cy.contains("Criar").should("be.inViewport").click({ force: true });

  cy.wait(1000);
  cy.get('input[id="idNewTime-Picker-inner"]').type(journey, { force: true });

  cy.wait(1000);
  cy.get('[id="idNewAbwgr"]').click({ force: true });

  cy.wait(1000);
  cy.contains("0007").click({ force: true });

  cy.wait(1000);
  //cy.contains("Cancelar").click({ force: true });
  cy.contains("Confirmar").click({ force: true });
};



context("clock in spec", () => {
  beforeEach(() => {
    cy.visit(URL);
    cy.viewport(1800, 1800);
  });

  it("perform clock in", () => {
    cy.get('input[name="UserName"]').type(EMAIL_LOGIN, { force: true });

    cy.get('input[name="Password"]').type(PASS_LOGIN, { force: true });

    cy.get("span[id=submitButton]").should("be.visible").click();

    // cy.wait(5000);

    // cy.contains("Home").should("be.visible");

    cy.wait(1000);

    cy.get("[id=__tile8]").should("be.visible").click();

    cy.wait(1000);

    cy.contains("Marcações").should("be.visible").click();

    const days = getDatesBetween(addDays(initialDate, 1), endDate);

    days.forEach((day) => {
      cy.contains(format(day, "dd/MM/yyyy", timeZone))
        .should("be.visible")
        .invoke("attr", "id")
        .then((id) => {
          const idLabel = id.split("-").pop();
          let prevision = defaultCodes.replace("#", idLabel);

          cy.get("span[id=" + prevision + "]")
            .should("be.visible")
            .invoke("text")
            .then((code) => {
              if (code === "0160" || code === "0150") {
                let journeyId = defaultJourney.replace("#", idLabel);
                cy.get("span[id=" + journeyId + "]")
                  .should("be.visible")
                  .invoke("text")
                  .then(async (journey) => {
                    let checkboxId = defaultCheckBox.replace("#", idLabel);

                    cy.wait(1000);
                    cy.get("div[id=" + checkboxId + "]")
                      .should("be.visible")
                      .click({ force: true });

                    cy.wait(1000);

                    let includeButtonId = defaultIncludeButton.replace("#", idLabel);
                    cy.get("div[id=" + includeButtonId + "]")
                      .should("be.visible")
                      .click({ force: true });

                    cy.wait(1000);

                    cy.get('[id=idMarcDay-tblBody] tr')
                      .then(tdMark => {
                        if (tdMark.length < 2) {
                          const indexJourney = journey.split(" - ");
                          markPoint(indexJourney[0]);
                          markPoint(indexJourney[1]);
                          cy.contains("Voltar").click({ force: true });
                        } else {
                          cy.contains("Voltar").click({ force: true });
                        }
                      });
                  });
              }
            });
        });
    });

    cy.get("[id=" + buttonSaveGeral + "]")
      .should('be.visible')
      .invoke("attr", "id")
      .then((id) => {
        if (id) {
          alert('Revise e clique no botão de salvar')
        }
      })


  });
});
