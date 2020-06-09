import React from "react";

class Answers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnswered: false,
      classNames: ["", "", "", ""],
    };

    this.handleCheckAnswer = this.handleCheckAnswer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      classNames: nextProps.classNames,
    });
  }

  handleCheckAnswer(e) {
    const { isAnswered } = this.props;

    if (!isAnswered) {
      const elem = e.currentTarget;
      const { correct, onIncreaseScore, onWrongAttemp } = this.props;
      const answer = Number(elem.dataset.id);

      const updatedClassNames = this.state.classNames;
      let optionChoosenValue = false;

      if (answer === correct) {
        updatedClassNames[answer - 1] = "right";
        optionChoosenValue = true;
        onIncreaseScore();
      } else {
        updatedClassNames[answer - 1] = "wrong";
        optionChoosenValue = false;
        onWrongAttemp();
      }

      this.setState({
        classNames: updatedClassNames,
      });

      this.props.onShowButton(optionChoosenValue);
    }
  }

  render() {
    const { answers } = this.props;
    const optionTypes = ["A", "B", "C", "D"];
    const { classNames } = this.state;

    return (
      <div id="answers">
        <ul>
          {answers.map((answer, idx) => (
            <li
              key={idx}
              onClick={this.handleCheckAnswer}
              className={classNames[idx]}
              data-id={idx + 1}
            >
              <span>{optionTypes[idx]}</span> <p>{answer}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Answers;
