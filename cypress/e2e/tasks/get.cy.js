describe("GET /tasks", () => {
  beforeEach(function () {
    cy.fixture("tasks/get").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("should return a list of tasks", function () {
    const { user, tasks } = this.tasks.list;
    cy.task("removeTasksLike", "Estud4r");
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((userResponse) => {
      tasks.forEach(function (task) {
        cy.postTask(task, userResponse.body.token);
      });

      cy.getTasks(userResponse.body.token)
        .then((response) => {
          expect(response.status).to.eq(200);
        })
        .its("body")
        .should("be.an", "array")
        .should("have.length", tasks.length);
    });
  });
});

describe("GET /tasks/:id", () => {
  beforeEach(function () {
    cy.fixture("tasks/get").then(function (tasks) {
      this.tasks = tasks;
    });
  });

  it("should return a task", function () {
    const { user, task } = this.tasks.unique;
    cy.task("removeTask", task.name, user.email);
    cy.task("removeUser", user.email);
    cy.postUser(user);
    cy.postSession(user).then((userResponse) => {
      cy.postTask(task, userResponse.body.token).then((taskResponse) => {
        cy.getUniqueTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(200);
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
        cy.getUniqueTask(taskResponse.body._id, userResponse.body.token).then(
          (response) => {
            expect(response.status).to.eq(404);
          }
        );
      });
    });
  });
});
