import { useEffect, useState } from 'react';

// Collection of quotes for founders and builders
export const founderQuotes = [
  {
    quote: "Move like a hacker, build like a monk.",
    explanation: "A blend of speed and calm craft."
  },
  {
    quote: "Dreams don't build—schedules do.",
    explanation: "Turns inspiration into execution."
  },
  {
    quote: "Start ugly. Grow beautiful.",
    explanation: "For perfectionists stuck at start."
  },
  {
    quote: "Data is an asset, intuition is a strategy.",
    explanation: "Balancing analysis with instinct."
  },
  {
    quote: "MVPs test markets, not masterpieces.",
    explanation: "Ship to learn, not to perfect."
  },
  {
    quote: "The best API is the one with zero documentation needs.",
    explanation: "Simplicity is the ultimate feature."
  },
  {
    quote: "Cash flow is oxygen, revenue is food.",
    explanation: "You need both to survive and grow."
  },
  {
    quote: "Users hire products; make yours employable.",
    explanation: "Focus on the job to be done."
  },
  {
    quote: "Code ownership is territorial; knowledge sharing is imperial.",
    explanation: "Build a learning organization."
  },
  {
    quote: "Ten loyal users beat a thousand casual visitors.",
    explanation: "Depth over breadth in early days."
  },
  {
    quote: "Execute in silence. Celebrate in public.",
    explanation: "Work quietly, let results speak."
  },
  {
    quote: "Adapt like water, persist like stone.",
    explanation: "Flexibility with commitment."
  },
  {
    quote: "The hardest bug to fix is the one in your business model.",
    explanation: "Tech is easy compared to market fit."
  },
  {
    quote: "Pitch the dream, sell the reality.",
    explanation: "Vision and execution balanced."
  },
  {
    quote: "Failure isn't the opposite of success; it's part of it.",
    explanation: "Embrace the learning process."
  },
  {
    quote: "Slow is smooth. Smooth is fast.",
    explanation: "Methodical progress beats rushed chaos."
  },
  {
    quote: "Delete more code than you write.",
    explanation: "Simplicity requires ruthless editing."
  },
  {
    quote: "Good founders build products. Great founders build culture.",
    explanation: "Products expire, culture compounds."
  },
  {
    quote: "Money buys runway; passion fuels the engine.",
    explanation: "You need both to take flight."
  },
  {
    quote: "Success leaves clues. Failure leaves lessons.",
    explanation: "Study both with equal attention."
  }
];

export const useRandomQuote = (intervalMs: number = 3600000) => { // Default: 1 hour
  const [quote, setQuote] = useState<typeof founderQuotes[0]>(
    founderQuotes[Math.floor(Math.random() * founderQuotes.length)]
  );

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * founderQuotes.length);
      setQuote(founderQuotes[randomIndex]);
    };

    // Set interval to update the quote
    const interval = setInterval(getRandomQuote, intervalMs);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [intervalMs]);

  return quote;
};

export const getRandomQuote = (): typeof founderQuotes[0] => {
  return founderQuotes[Math.floor(Math.random() * founderQuotes.length)];
}; 