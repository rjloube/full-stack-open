import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Counter = ({ text, count }) => {
  return (
    <div>
      {text} {count}
    </div>
  );
};

const App = () => {
  console.log("rendered");
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  const handleGlobalClick = () => {
    const updatedAll = all + 1;
    setAll(updatedAll);
    const updatedTotal = total + 1;
    setTotal(updatedTotal);
    const updatedAverage = total / all;
    setAverage(updatedAverage);
  };

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    handleGlobalClick();
  };

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    handleGlobalClick();
  };

  const handleBadClick = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    handleGlobalClick();
  };

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Header text="statistics" />
      <Counter text="good" count={good} />
      <Counter text="neutral" count={neutral} />
      <Counter text="bad" count={bad} />
      <Counter text="all" count={all} />
      <Counter text="average" count={average} />
    </div>
  );
};

export default App;
