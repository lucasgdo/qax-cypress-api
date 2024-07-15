describe("PUT /tasks/:id/done", () => {
  beforeEach(function () {
    cy.fixture("tasks/put").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("should mark a task as done", function () {
    const { user, task } = this.tasks.update;
    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((userResponse) => {
      cy.postTask(task, userResponse.body.token).then((taskResponse) => {
        cy.endTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(204);
          }
        );
        cy.getUniqueTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.body.is_done).to.be.true;
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
        cy.endTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(404);
          }
        );
      });
    });
  });
});
