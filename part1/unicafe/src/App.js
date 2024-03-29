import { useState } from "react";

const Button = ({ handleClick, text1 }) => {
  return <button onClick={handleClick}>{text1}</button>;
};

const Header = ({ text1 }) => {
  return <h1>{text1}</h1>;
};

const StatisticLine = ({ text1, count, text2 }) => {
  return (
    <tr>
      <td>{text1}</td>
      <td>{count}</td>
      <td>{text2}</td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.categories[3].count === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <>
      <Header text1={props.header} />
      <table>
        <tbody>
          <StatisticLine
            text1={props.categories[0].name}
            count={props.categories[0].count}
          />
          <StatisticLine
            text1={props.categories[1].name}
            count={props.categories[1].count}
          />
          <StatisticLine
            text1={props.categories[2].name}
            count={props.categories[2].count}
          />
          <StatisticLine
            text1={props.categories[3].name}
            count={props.categories[3].count}
          />
          <StatisticLine
            text1={props.categories[4].name}
            count={props.categories[4].count}
          />
          <StatisticLine
            text1={props.categories[5].name}
            count={props.categories[5].count}
            text2="%"
          />
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [sum, setSum] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGlobalClick = (buttonValue, totalGood) => {
    const updatedAll = all + 1;
    setAll(updatedAll);
    const updatedSum = sum + buttonValue;
    setSum(updatedSum);
    const updatedAverage = updatedSum / updatedAll;
    setAverage(updatedAverage);
    const updatedPositive = (totalGood * 100) / updatedAll;
    setPositive(updatedPositive);
  };

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    handleGlobalClick(1, updatedGood);
  };

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    handleGlobalClick(0, good);
  };

  const handleBadClick = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    handleGlobalClick(-1, good);
  };

  const statistics = {
    header: "statistics",
    categories: [
      {
        name: "good",
        count: good,
      },
      {
        name: "neutral",
        count: neutral,
      },
      {
        name: "bad",
        count: bad,
      },
      {
        name: "all",
        count: all,
      },
      {
        name: "average",
        count: average,
      },
      {
        name: "positive",
        count: positive,
      },
    ],
  };

  return (
    <div>
      <Header text1="give feedback" />
      <Button handleClick={handleGoodClick} text1="good" />
      <Button handleClick={handleNeutralClick} text1="neutral" />
      <Button handleClick={handleBadClick} text1="bad" />
      <Header text1={statistics.header} />
      <Statistics categories={statistics.categories} />
    </div>
  );
};

export default App;
