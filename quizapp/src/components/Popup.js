import React from "react";

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: "start",
      title: "Welcome to Quizz",
      text: "Quiz Application",
      buttonText: "Start the quiz",
    };

    this.handlePopupHandle = this.handlePopupHandle.bind(this);
  }

  handlePopupHandle() {
    const { time } = this.state;

    if (time === "start") {
      this.setState({
        time: "end",
        title: "Congratulations!",
        buttonText: "Restart",
      });

      this.props.onStartQuiz();
    } else {
      window.location.reload(); // restart the application
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      text:
        "You have completed the quiz. <br /> You got: <strong>" +
        this.props.score +
        "</strong> out of <strong>" +
        this.props.total +
        "</strong> questions right.",
    });
  }

  createMarkup(text) {
    return { __html: text };
  }

  render() {
    const { title, text, buttonText } = this.state;

    const { style } = this.props;

    return (
      <div className="popup-container" style={style}>
        <div className="container">
          <div className="col-md-8 col-md-offset-2">
            <div className="popup">
              <h1>{title}</h1>
              <p dangerouslySetInnerHTML={this.createMarkup(text)} />
              <button className="fancy-btn" onClick={this.handlePopupHandle}>
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
