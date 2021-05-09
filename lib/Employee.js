// Employee parent class
class Employee {
  constructor(name, id, email) {
    this.name = name;
    this.id = id;
    this.email = email;
  }

  // return the name
  getName() {
    return this.name;
  }

  // return the id
  getId() {
    return this.id;
  }

  // return the email
  getEmail() {
    return this.email;
  }

  // return the job role
  getRole() {
    return "Employee";
  }
}

module.exports = Employee;
