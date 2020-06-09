import React from "react";
import dataSet from "../questions-data/questions-answers";
import Answers from "./Answers";
import Popup from "./Popup";
import StarRatingComponent from "react-star-rating-component";
import ProgressBar from "react-bootstrap/ProgressBar";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nr: 0,
      total: dataSet.length,
      showButton: false,
      questionAnswered: false,
      score: 0,
      displayPopup: "flex",
      classNames: ["", "", "", ""],
      isAnswerCorrect: false,
      totalQuestionAttempted: 0,
      totalQuestionWrong: 0,
      totalQuestionCorrect: 0,
      currentScorePercentage: 0,
      remaingAllCorrectPercentage: 0,
      remaingAllWrongPercentage: 0,
      category: "",
      difficulty: 1,
      quesPercentage: 0,
    };
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleShowButton = this.handleShowButton.bind(this);
    this.handleStartQuiz = this.handleStartQuiz.bind(this);
    this.handleCorrectAttemp = this.handleCorrectAttemp.bind(this);
    this.handleWrongAttemp = this.handleWrongAttemp.bind(this);
  }

  pushData(nr) {
    let options = [];
    const quesType = decodeURIComponent(dataSet[nr].type);
    if (quesType === "boolean") {
      options = ["", ""];
      options[0] = decodeURIComponent(dataSet[nr].correct_answer);
      options[1] = decodeURIComponent(dataSet[nr].incorrect_answers[0]);
    } else {
      options = ["", "", "", ""];
      options[0] = decodeURIComponent(dataSet[nr].correct_answer);
      options[1] = decodeURIComponent(dataSet[nr].incorrect_answers[0]);
      options[2] = decodeURIComponent(dataSet[nr].incorrect_answers[1]);
      options[3] = decodeURIComponent(dataSet[nr].incorrect_answers[2]);
    }

    const getSuffledOptions = this.shuffle(options);
    const getCorrectOptionIndex = getSuffledOptions.indexOf(
      decodeURIComponent(dataSet[nr].correct_answer)
    );
    const difficulty = this.getQuesDifficultyLevel(
      decodeURIComponent(dataSet[nr].difficulty)
    );

    this.setState({
      question: decodeURIComponent(dataSet[nr].question),
      category: decodeURIComponent(dataSet[nr].category),
      difficulty: difficulty,
      answers: options,
      correct: getCorrectOptionIndex + 1,
      nr: this.state.nr + 1,
    });
  }

  getQuesDifficultyLevel(difficulty) {
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      default:
    }
  }

  shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  componentWillMount() {
    const { nr } = this.state;
    this.pushData(nr);
  }

  handleNextQuestion() {
    const { nr, total } = this.state;

    if (nr === total) {
      this.setState({
        displayPopup: "flex",
      });
    } else {
      this.pushData(nr);
      this.setState({
        showButton: false,
        questionAnswered: false,
        classNames: ["", "", "", ""],
      });
    }
  }

  handleShowButton(optionChoosenValue) {
    this.setState({
      showButton: true,
      questionAnswered: true,
      isAnswerCorrect: optionChoosenValue,
    });
  }

  handleStartQuiz() {
    this.setState({
      displayPopup: "none",
      nr: 1,
    });
  }

  handleCorrectAttemp() {
    let {
      totalQuestionCorrect,
      totalQuestionAttempted,
      score,
      total,
    } = this.state;
    score = score + 1;
    totalQuestionAttempted = totalQuestionAttempted + 1;
    totalQuestionCorrect = totalQuestionCorrect + 1;

    const totalPercentage = this.handlePercentage(
      totalQuestionCorrect,
      totalQuestionAttempted,
      total
    );

    this.setState({
      score: score,
      totalQuestionAttempted: totalQuestionAttempted,
      totalQuestionCorrect: totalQuestionCorrect,
      currentScorePercentage: totalPercentage.currentScorePercentage,
      remaingAllCorrectPercentage: totalPercentage.totalRemaningQuesPercentage,
      remaingAllWrongPercentage: totalPercentage.remaingAllWrongPercentage,
      quesPercentage: totalPercentage.quesPercentage,
    });
  }

  handlePercentage(totalQuestionCorrect, totalQuestionAttempted, total) {
    const currentScorePercentage = parseInt(
      (totalQuestionCorrect / totalQuestionAttempted) * 100
    );
    /**
     * Calculate Remaing All correct percentage
     */
    const remaningQuestionCount = total - totalQuestionAttempted;
    const totalQuesCount = remaningQuestionCount + totalQuestionCorrect;
    const totalRemaningQuesPercentage = parseInt(
      (totalQuesCount / total) * 100
    );
    const remaingAllWrongPercentage = parseInt(
      ((total - totalQuestionCorrect) / total) * 100
    );
    const quesPercentage = parseInt((totalQuestionAttempted / total) * 100);
    return {
      currentScorePercentage: currentScorePercentage,
      totalRemaningQuesPercentage: totalRemaningQuesPercentage,
      remaingAllWrongPercentage: remaingAllWrongPercentage,
      quesPercentage: quesPercentage,
    };
  }

  handleWrongAttemp() {
    let { totalQuestionCorrect, totalQuestionAttempted, total } = this.state;

    totalQuestionAttempted = totalQuestionAttempted + 1;
    const totalPercentage = this.handlePercentage(
      totalQuestionCorrect,
      totalQuestionAttempted,
      total
    );

    this.setState({
      totalQuestionWrong: this.state.totalQuestionWrong + 1,
      totalQuestionAttempted: this.state.totalQuestionAttempted + 1,
      currentScorePercentage: totalPercentage.currentScorePercentage,
      remaingAllCorrectPercentage: totalPercentage.totalRemaningQuesPercentage,
      remaingAllWrongPercentage: totalPercentage.remaingAllWrongPercentage,
      quesPercentage: totalPercentage.quesPercentage,
    });
  }

  render() {
    const {
      nr,
      total,
      question,
      category,
      answers,
      correct,
      showButton,
      questionAnswered,
      remaingAllCorrectPercentage,
      displayPopup,
      score,
      classNames,
      isAnswerCorrect,
      currentScorePercentage,
      remaingAllWrongPercentage,
      difficulty,
      quesPercentage,
    } = this.state;

    return (
      <div className="container">
        <Popup
          style={{ display: displayPopup }}
          score={score}
          total={this.state.total}
          onStartQuiz={this.handleStartQuiz}
        />

        <div className="row">
          <div className="col-lg-10 col-lg-offset-1">
            <ProgressBar
              className="Progresscurrent"
              variant="info"
              now={quesPercentage}
              label={`${quesPercentage}%`}
            />
            <div id="question">
              <h4>
                Question {nr} of {total}
              </h4>

              <p>{category}</p>
              <div>
                <StarRatingComponent
                  name="quesDifficultyLevel"
                  editing={false}
                  renderStarIcon={() => <span>&#9733;</span>}
                  starCount={3}
                  value={difficulty}
                />
              </div>
              <p>{question}</p>
            </div>
            <Answers
              answers={answers}
              correct={correct}
              onShowButton={this.handleShowButton}
              isAnswered={questionAnswered}
              onIncreaseScore={this.handleCorrectAttemp}
              onWrongAttemp={this.handleWrongAttemp}
              onHandlePercentage={this.handlePercentage}
              classNames={classNames}
            />
            <div className="isanswercorrect">
              {showButton ? (isAnswerCorrect ? "Correct!" : "Sorry!") : null}
            </div>

            <div id="submit">
              {showButton ? (
                <button className="fancy-btn" onClick={this.handleNextQuestion}>
                  {nr === total ? "Finish quiz" : "Next question"}
                </button>
              ) : null}
            </div>
            <span>Score: {currentScorePercentage}%</span>
            <span className="maxScore">
              {" "}
              Max Score: {remaingAllCorrectPercentage}%
            </span>
            <ProgressBar className="progressStyle">
              <ProgressBar
                className="Progresscurrent"
                striped
                variant="success"
                now={currentScorePercentage}
                label={`${currentScorePercentage}%`}
                key={1}
              />
              <ProgressBar
                className="Progressmax"
                variant="warning"
                now={remaingAllCorrectPercentage}
                label={`${remaingAllCorrectPercentage}%`}
                key={2}
              />
              <ProgressBar
                className="Progressmin"
                striped
                variant="danger"
                now={remaingAllWrongPercentage}
                label={`${remaingAllWrongPercentage}%`}
                key={3}
              />
              <ProgressBar
                className="progressbase"
                variant="info"
                now={100}
                key={4}
              />
            </ProgressBar>
          </div>
        </div>
      </div>
    );
  }
}
export default Main;
