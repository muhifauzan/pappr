interface WordCounterProps {
  content: string;
}

const WordCounter: React.FC<WordCounterProps> = ({
  content,
}: WordCounterProps) => {
  const countWord = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
      Word Count: {countWord(content)}
    </div>
  );
};

export default WordCounter;
