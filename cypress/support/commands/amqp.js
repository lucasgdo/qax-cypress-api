Cypress.Commands.add("purgeMessageQueue", () => {
  cy.api({
    url: `${Cypress.env("amqpHost")}/tasks/contents`,
    method: "DELETE",
    body: { vhost: "vlpjpuka", name: Cypress.env("amqpQueue"), mode: "purge" },
    headers: {
      Authorization: Cypress.env("amqpToken"),
    },
    failOnStatusCode: false,
  }).then((response) => response);
});

Cypress.Commands.add("getMessageQueue", () => {
  cy.api({
    url: `${Cypress.env("amqpHost")}/tasks/get`,
    method: "POST",
    body: {
      vhost: "vlpjpuka",
      name: Cypress.env("amqpQueue"),
      truncate: "50000",
      ackmode: "ack_requeue_true",
      encoding: "auto",
      count: "1",
    },
    headers: {
      Authorization: Cypress.env("amqpToken"),
    },
    failOnStatusCode: false,
  }).then((response) => response);
});
