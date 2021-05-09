const EmployeeClass = require("./Employee.js");

class Intern extends EmployeeClass {
  constructor(name, id, email, school) {
    super(name, id, email);
    this.school = school;
  }

  // return github id
  getSchool() {
    return this.school;
  }

  // override getRole function to return Intern instead of Employee
  getRole() {
    return "Intern";
  }
}

module.exports = Intern;
