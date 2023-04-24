import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Section = ({ header, anecdote, votes }) => {
  return (
    <>
      <h1>{header}</h1>
      <div>{anecdote}</div>
      <div>{votes}</div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const [maxIndex, setMaxIndex] = useState(0);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const handleNextClick = () => {
    const index = getRandomInt(anecdotes.length);
    console.log(`Anecdote index: ${index}`);
    setSelected(index);
  };

  const handleVoteClick = () => {
    const updatedVotes = [...votes];
    updatedVotes[selected] += 1;
    console.log(`updatedVotes: ${updatedVotes}`);
    const updatedMaxIndex = updatedVotes.indexOf(Math.max(...updatedVotes));
    console.log(`maxVoteIndex: ${maxIndex}`);
    console.log(`Anecdote with max votes: ${anecdotes[maxIndex]}`);
    setVotes(updatedVotes);
    setMaxIndex(updatedMaxIndex);
  };

  return (
    <>
      <Section
        header="Anecdote of the day"
        anecdote={anecdotes[selected]}
        votes={votes[selected]}
      />
      <Button handleClick={handleVoteClick} text="vote" />
      <Button handleClick={handleNextClick} text="next anecdote" />
      <Section
        header="Anecdote with the most votes"
        anecdote={anecdotes[maxIndex]}
        votes={votes[maxIndex]}
      />
    </>
  );
};

export default App;
