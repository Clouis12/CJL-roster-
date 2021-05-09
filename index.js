// first lines for all the libraries we need
var inquirer = require("inquirer");
const fs = require("fs");
var Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
let roster = {
  manager: null, // store the manager's info here
  engineers: [], // store the engineers' info here
  interns: [], // store the interns' info here
};

async function startProgram() {
  // ask for the manager info
  inquirer
    .prompt([
      {
        type: "input",
        name: "managerName",
        message: ["Please enter team manager's name: "],
      },
      {
        type: "input",
        name: "managerEmployeeID",
        message: ["Please enter team manager's employee ID: "],
      },
      {
        type: "input",
        name: "managerEmailAddy",
        message: ["Please enter team manager's email address: "],
      },
      {
        type: "input",
        name: "managerOfficeNumber",
        message: ["Please enter team manager's office number: "],
      },
    ])
    .then((answers) => {
      // answers parameter has the results from the questions
      const manager = new Manager(
        answers.managerName,
        answers.managerEmployeeID,
        answers.managerEmailAddy,
        answers.managerOfficeNumber
      );
      roster.manager = manager;
      // prompt the user for the Engineer/Intern and create a roster of the input
      // ask user to select engineer, intern, or build
      promptUser();
    });
}

// repeadily prompt the user to choose options from the menu and save the info
// into the roster and stop prompting when the user selects "Finish Building Team".
// When the user selects "Finish Building Team", then save the roster to an HTML file
// and return from the function
async function promptUser() {
  // ask user to select engineer, intern, or build
  let selection = null;
  // while the user's selection isnt "Finish Building Team"
  while (selection !== "Finish Building Team") {
    // ask the user to enter data for an engineer or intern or to finish building their team
    // store the answer in answers object
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "userAnswer",
        message:
          "Do you wish to add an engineer, intern, or to finish building your team",
        choices: ["Engineer", "Intern", "Finish Building Team"],
      },
    ]);
    // set the user's selection
    selection = answers.userAnswer;

    // if the user answer was Engineer
    if (selection === "Engineer") {
      // prompt for Engineer info
      await promptForEngineerInfo();
    }
    // if the user answer was Intern
    else if (selection === "Intern") {
      // prompt for Intern info
      await promptForInternInfo();
    }
    // create an html file based on  the roster and store it in the dist/ folder
    else if (selection == "Finish Building Team") {
      console.log(roster);
      buildTeam();
    }
  }
}

// prompt for intern info
const promptForInternInfo = async () => {
  const internAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: ["Please enter team intern's name: "],
    },
    {
      type: "input",
      name: "id",
      message: ["Please enter team intern's employee ID: "],
    },
    {
      type: "input",
      name: "email",
      message: ["Please enter team intern's email address: "],
    },
    {
      type: "input",
      name: "school",
      message: ["Please enter intern's school name: "],
    },
  ]);
  // save the answers into the Intern section of the roster
  const intern = new Intern(
    internAnswers.name,
    internAnswers.id,
    internAnswers.email,
    internAnswers.school
  );
  roster.interns.push(intern);
};

// prompt for engineer info
const promptForEngineerInfo = async () => {
  const engineerAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: ["Please enter team engineer's name: "],
    },
    {
      type: "input",
      name: "id",
      message: ["Please enter team engineer's employee ID: "],
    },
    {
      type: "input",
      name: "email",
      message: ["Please enter team engineer's email address: "],
    },
    {
      type: "input",
      name: "github",
      message: ["Please enter engineer's GitHub username: "],
    },
  ]);
  // save the answers into the Engineer section of the roster
  const engineer = new Engineer(
    engineerAnswers.name,
    engineerAnswers.id,
    engineerAnswers.email,
    engineerAnswers.github
  );
  // add engineer to engineers' array/list in the roster
  roster.engineers.push(engineer); // push adds a value to the end of the array
};

const buildTeam = () => {
  let htmlString = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../dist/styles.css" />
        <title>Team Roster</title>
      </head>
      <body>
        <div class="main-container">
          <div class="title-container">
            <h1>My Team</h1>
          </div>
          <div class="team-roster-container">
            {{ROSTER}}
          </div>
        </div>
      </body>
    </html>
  `;
  const employeeCard = `
    <div class="employee-card">
      <!-- top of the card -->
      <div class="top">
        <h3>{{EMPLOYEE NAME}}</h3>
        <h4>{{EMPLOYEE ROLE}}</h4>
      </div>
      <!-- bottom half of the card -->
      <div class="bottom">
        <h5>ID: {{EMPLOYEE ID}}</h5>
        <h5>Email: <a href="mailto:{{EMPLOYEE EMAIL}}"> {{EMPLOYEE EMAIL}} </a></h5>
        <h5>{{EXTRA}}: {{EMPLOYEE EXTRA}}</h5>
      </div>
    </div>
  `;

  let rosterString = "";
  // create the HTML string for the manager card
  const managerCard = createManagerCard(employeeCard);
  // create engineer cards
  const engineerCards = createEngineerCards(employeeCard);
  // create engineer cards
  const internCards = createInternsCards(employeeCard);

  // build the html roster
  rosterString = rosterString.concat([managerCard, engineerCards, internCards]);

  htmlString = htmlString.replace("{{ROSTER}}", rosterString);

  // print html string to an html file
  fs.writeFileSync("./dist/index.html", htmlString);
  console.log(
    "Roster created in the ./dist folder!\n\nThanks for using the program!\n\n"
  );
};

const createManagerCard = (genericCard) => {
  let managerCard = genericCard;
  return managerCard
    .replace("{{EMPLOYEE NAME}}", roster.manager.name)
    .replace("{{EMPLOYEE ROLE}}", roster.manager.getRole())
    .replace("{{EMPLOYEE ID}}", roster.manager.id)
    .replace("{{EMPLOYEE EMAIL}}", roster.manager.email)
    .replace("{{EMPLOYEE EMAIL}}", roster.manager.email)
    .replace("{{EXTRA}}", "Office Number")
    .replace("{{EMPLOYEE EXTRA}}", roster.manager.officeNumber);
};

const createEngineerCards = (genericCard) => {
  let genCard = genericCard;
  // create variable to store the HTML cards for the engineers
  let engineerHTMLString = "";
  // for each engineer inside the engineers array in the roster object
  roster.engineers.forEach((engineer) => {
    // replace the necessary values for an engineer card
    let engineerCard = genCard
      .replace("{{EMPLOYEE NAME}}", engineer.name)
      .replace("{{EMPLOYEE ROLE}}", engineer.getRole())
      .replace("{{EMPLOYEE ID}}", engineer.id)
      .replace("{{EMPLOYEE EMAIL}}", engineer.email)
      .replace("{{EMPLOYEE EMAIL}}", engineer.email)
      .replace("{{EXTRA}}", "Github")
      .replace("{{EMPLOYEE EXTRA}}", engineer.github);
    // store the card into the HTML string
    engineerHTMLString = engineerHTMLString.concat(engineerCard);
  });
  // return the finished string with all the cards created
  return engineerHTMLString;
};

const createInternsCards = (genericCard) => {
  let genCard = genericCard;
  // create variable to store the HTML cards for the interns
  let internHTMLString = "";
  // for each intern inside the interns array in the roster object
  roster.interns.forEach((intern) => {
    // replace the necessary values for an intern card
    let internCard = genCard
      .replace("{{EMPLOYEE NAME}}", intern.name)
      .replace("{{EMPLOYEE ROLE}}", intern.getRole())
      .replace("{{EMPLOYEE ID}}", intern.id)
      .replace("{{EMPLOYEE EMAIL}}", intern.email)
      .replace("{{EMPLOYEE EMAIL}}", intern.email)
      .replace("{{EXTRA}}", "School")
      .replace("{{EMPLOYEE EXTRA}}", intern.school);
    // store the card into the HTML string
    internHTMLString = internHTMLString.concat(internCard);
  });
  // return the finished string with all the cards created
  return internHTMLString;
};

startProgram();

// EXAMPLE
// let number = null; // creating a variable  number --> [__] (not array)
// number++;// number === 3

// //A:0 [] <-- number (A:0)
// //A:1 [{name: nate, id: 1, of: 1, email: nate@ms.com}]  <-- manager
// //A:2 [__]     <-- is array
// //A:3 [__]

// // decisons happen
// if (number > 3) { // What does this statment evaluate to? FALSE
//   number++; // what is the value of number after ++?
// } else {
//   number--; // what is the value of number after --? 2
// }

// WHAT WOULD NUMBER EQUAL AT LINE 60
// >> 2

// logical expressions
// equal: valA === valB
// not equal: valA !== valB
// less than: valA < valB
// greater than: valA > valB
// valA is less than or equal to valB: valA <== valB
// valA is greater than or equal to valB: valA >== valB

// combinatory logic
// 0 == 0
// 01 == 1
// 10 == 2
// 11 == 3

// 0000111001 == 'c'
// 0000111011 == 'g'
// 0000111001  0000111011 == 'cg'
// 0000111011 0000111001 == 'cg'

// 'cg' === 'gc' || 'cg' < 'gc' // true
// // false          // true
// false || true && (true && false) // true
