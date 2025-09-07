import './QuizGame.css'
import { getQuizData } from '../../assets/quizService';
import { useEffect, useRef, useState } from 'react';

const QuizGame = () => {
  const [quizData, setQuizData] = useState([]); // initialized with empty arr
  let [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false); // lock -> false : no option selected, true : option selected
  let [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  

  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem("quizData");
      if(savedData){
        setQuizData(JSON.parse(savedData));
      }else{
        const data = await getQuizData();
        setQuizData(data);
        localStorage.setItem("quizData", JSON.stringify(data));
      }
    }
    loadData();
  },[]);

  let option1 = useRef(null);
  let option2 = useRef(null);
  let option3 = useRef(null);
  let option4 = useRef(null);

  let option_arr = [option1, option2, option3, option4];

  if(quizData.length === 0){
    let loadingStyle = {color: "white", margin: "auto", textAlign: "center", marginTop: "1.25rem"};
    return(
      <div style={loadingStyle}>
        <p>Loading Quiz...</p>
      </div>
    );
  }

  const checkAns = (el) => {
    if(lock === false){ 
      const currOption = el.target.innerHTML;
      if (currOption === question.ans) {
        el.target.classList.add("correct");
        setScore((prevScore) => (prevScore + 1));
      } else {
        el.target.classList.add("wrong");
        let ansIdx = question.options.indexOf(question.ans);
        option_arr[ansIdx].current.classList.add("correct");
      }
      setLock(true);
    }
  }

  const next = () => {
    if(lock){
      if(index === quizData.length - 1){
        setResult(true);
        return 0;
      }
      setIndex(++index);
      setLock(false);
      option_arr.map((option) => {
        option.current.classList.remove("correct");
        option.current.classList.remove("wrong");
        return null;
      });
    }
  }

  const reset = () => {
    setIndex(0);
    setLock(false);
    setScore(0);
    setResult(false);
    localStorage.removeItem("quizData");
    const loadData = async () => {
      const data = await getQuizData();
      setQuizData(data);
      localStorage.setItem("quizData", JSON.stringify(data));
    }
    loadData();
  }

  const question = quizData[index];

  return (
    <div className="container">
      <h2>Quiz Game</h2>
      <hr />
      {result ? (
        <>
          <h2>You scored {score} out of {quizData.length}</h2>
          <button onClick={reset}>Play Again</button>
        </>
      ) : (
        <>
          <h3>
            {index + 1}. {question.question}
          </h3>
          <ul>
            <li ref={option1} onClick={(e) => checkAns(e)}>
              {question.options[0]}
            </li>
            <li ref={option2} onClick={(e) => checkAns(e)}>
              {question.options[1]}
            </li>
            <li ref={option3} onClick={(e) => checkAns(e)}>
              {question.options[2]}
            </li>
            <li ref={option4} onClick={(e) => checkAns(e)}>
              {question.options[3]}
            </li>
          </ul>
          <button onClick={next}>{index === quizData.length -1 ? "Submit" : "Next"}</button>
          <p>
            {index + 1} out of {quizData.length} questions
          </p>
        </>
      )}
    </div>
  );
}

export default QuizGame;