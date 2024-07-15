describe("POST /SESSIONS", () => {
  beforeEach(function () {
    cy.fixture("users").then(function (users) {
      this.users = users;
    });
  });

  it("should authenticate a user", function () {
    const user = this.users.login;
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user.name).to.eq(user.name);
      expect(response.body.user.email).to.eq(user.email);
      expect(response.body.token).to.not.be.empty;
    });
  });

  it("shouldn't authenticate a user with wrong credentials", function () {
    const user = this.users.inv_pass;

    cy.postSession(user).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("shouldn't authenticate a user with a non-existing email", function () {
    const user = this.users.inv_email;

    cy.postSession(user).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
