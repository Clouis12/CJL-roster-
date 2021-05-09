const EmployeeClass = require("./Employee.js");

class Engineer extends EmployeeClass {
  constructor(name, id, email, github) {
    super(name, id, email);
    this.github = github;
  }

  // return github id
  getGitHub() {
    return this.github;
  }

  // override getRole function to return Eningeer instead of Employee
  getRole() {
    return "Engineer";
  }
}

module.exports = Engineer;
