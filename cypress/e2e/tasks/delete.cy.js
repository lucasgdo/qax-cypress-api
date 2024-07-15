describe("DELETE /tasks/:id", () => {
  beforeEach(function () {
    cy.fixture("tasks/delete").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("should remove a task", function () {
    const { user, task } = this.tasks.remove;
    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((userResponse) => {
      cy.postTask(task, userResponse.body.token).then((taskResponse) => {
        cy.deleteTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(204);
          }
        );
      });
    });
  });

  it("should return status 404 for a task that does not exist", function () {
    const { user, task } = this.tasks.not_found;
    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((userResponse) => {
      cy.postTask(task, userResponse.body.token).then((taskResponse) => {
        cy.deleteTask(taskResponse.body._id, userResponse.body.token);
        cy.deleteTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(404);
          }
        );
      });
    });
  });
});
