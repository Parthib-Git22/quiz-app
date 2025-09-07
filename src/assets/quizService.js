function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // pick a random index j from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // swap arr[i] with arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const URL = "https://the-trivia-api.com/v2/questions/";

export const getQuizData = async () =>{
    const response = await fetch(URL);
    const jsonResponse = await response.json(); // arr of obj

    const formattedData =  jsonResponse.map((item) => (
        {
            question: item.question.text,
            options: shuffleArray([...item.incorrectAnswers, item.correctAnswer]),
            ans: item.correctAnswer,
        }
    ));
    return formattedData; // arr of obj
}


