describe("POST /users", function () {
  beforeEach(function () {
    cy.fixture("users").then(function (users) {
      this.users = users;
    });
  });

  it("should register a new user", function () {
    const user = this.users.create;
    cy.task("removeUser", user.email);
    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it("shouldn't register a new user with an existing email", function () {
    const user = this.users.dup_email;
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postUser(user).then((response) => {
      const { message } = response.body;
      expect(response.status).to.eq(409);
      expect(message).to.eq("Duplicated email!");
    });
  });

  context("required fields", function () {
    let user;
    beforeEach(function () {
      user = this.users.required;
    });

    it("should return an error if name is missing", function () {
      const { name, ...userWithoutName } = user;
      cy.postUser(userWithoutName).then((response) => {
        const { message } = response.body;
        expect(response.status).to.eq(400);
        expect(message).to.eq('ValidationError: "name" is required');
      });
    });

    it("should return an error if email is missing", function () {
      const { email, ...userWithoutEmail } = user;
      cy.postUser(userWithoutEmail).then((response) => {
        const { message } = response.body;
        expect(response.status).to.eq(400);
        expect(message).to.eq('ValidationError: "email" is required');
      });
    });

    it("should return an error if password is missing", function () {
      const { password, ...userWithoutPassword } = user;
      cy.postUser(userWithoutPassword).then((response) => {
        const { message } = response.body;
        expect(response.status).to.eq(400);
        expect(message).to.eq('ValidationError: "password" is required');
      });
    });
  });
});
