import "../styles/WordCounter.css";

interface WordCounterProps {
  count: number;
}

const WordCounter: React.FC<WordCounterProps> = ({
  count,
}: WordCounterProps) => {
  return <div className="word-counter">Word Count: {count}</div>;
};

export default WordCounter;
