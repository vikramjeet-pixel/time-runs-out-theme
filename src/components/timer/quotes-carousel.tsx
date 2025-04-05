
import { useState, useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const quotes = [
  {
    text: "Life isn't about waiting for the storm to pass, it's about learning to dance in the rain.",
    author: "Vivian Greene"
  },
  {
    text: "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.",
    author: "Mark Twain"
  },
  {
    text: "It is not death that a man should fear, but he should fear never beginning to live.",
    author: "Marcus Aurelius"
  },
  {
    text: "Life is short, art long, opportunity fleeting, experience treacherous, judgment difficult.",
    author: "Hippocrates"
  },
  {
    text: "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing.",
    author: "Seneca"
  },
  {
    text: "You will never be ready. Start from wherever you are.",
    author: "C.J. Hayden"
  },
  {
    text: "Yesterday is gone. Tomorrow has not yet come. We have only today.",
    author: "Mother Teresa"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
];

export function QuotesCarousel() {
  const [activeQuote, setActiveQuote] = useState(0);
  
  // Auto-rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((current) => (current + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="py-6">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {quotes.map((quote, index) => (
            <CarouselItem key={index} className="pl-4">
              <div className="p-4 text-center">
                <blockquote className="italic text-lg md:text-xl">
                  "{quote.text}"
                </blockquote>
                <p className="mt-2 text-sm text-muted-foreground">— {quote.author}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-2">
          <CarouselPrevious className="relative static left-0 right-auto mx-2" />
          <CarouselNext className="relative static right-0 left-auto mx-2" />
        </div>
      </Carousel>
    </div>
  );
}
