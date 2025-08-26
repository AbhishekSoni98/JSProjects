let readlineSync = require("readline-sync");
let kuler = require("kuler");
let score = 0;

let userName = readlineSync.question("Whats your name? ");
console.log(kuler(`\nHello ${userName} welcome to Quiz-CLIApp`, "#91b1eeff"))

console.log(kuler("\n ** Rules ** - Please select any options by typing either a/b/c/d\n","#ca4848ff"))

/** Creating data set */
const database = {
  data: [
    {
      question: `What is the capital of India?`,
      options: {
        a: "Mumbai",
        b: "Delhi",
        c: "Kolkata",
        d: "Banglore"
      },
      correctAnswer: "b"
    },
    {
      question: "National animal of India?",
      options: {
        a: "Lion",
        b: "Tiger",
        c: "Horse",
        d: "Elephant"
      },
      correctAnswer: "b"
    },
    {
      question: "Is Independance day for India celebrated on 26th January?",
      options: {
        a: "Yes",
        b: "No"
      },
      correctAnswer: "b"
    }
  ]
}


/** Creating Leader Board*/
const leaderBoard = {
  data: [
    {
      name: "Priya",
      score: 2
    },
    {
      name: "Pooja",
      score: 3
    }
  ]
}

/** Main Logic */
function checkAnswer(userAnswer, correctAnswer) {
  if (userAnswer === correctAnswer) {
    console.log(kuler("Correct Answer", "#059669"));
    score++
  } else {
    console.log(kuler("Incorrect Answer", "#b91c1c"));
    console.log(kuler(`Correct Answer is ${correctAnswer}`, "#9aea9eff"))
  }
}

function showQuestionAndOptions(database) {
  for (let i = 0; i < database.data.length; i++) {
    console.log(`\nQ${i + 1} - ${database.data[i].question}\n`);
    for (let key in database.data[i].options) {
      console.log(`${key} - ${database.data[i].options[key]}`)
    }
    let userAnswer = readlineSync.question("Enter your answer - (a/b/c/d) - ").toLowerCase();
    checkAnswer(userAnswer, database.data[i].correctAnswer)
  }
}

function showHighScorer(leaderBoard) {
  leaderBoard.data.push({ name: userName, score: score })
  let sortedScoreList = leaderBoard.data.sort((a, b) => b.score - a.score);
  console.log(kuler("\nCheck your position on the Leader Board🎉🎉", "#fde047"))
  for (let leader of sortedScoreList) {
    if (leader.name === userName) {
        console.log(kuler(`${leader.name} -  Score: ${leader.score}  <-- (Your Score)`, "#cca9edff"))
    } else {
        console.log(kuler(`${leader.name} -  Score: ${leader.score}`, "#9333ea"))
    }
    
  }
}

showQuestionAndOptions(database);
console.log(kuler(`\nYour score is - ${score}`, "#5eead4"));
showHighScorer(leaderBoard);