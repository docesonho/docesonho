"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const { src, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: current !== index ? "scale(0.98) rotateX(8deg)" : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-white rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: current === index ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-contain opacity-100 transition-opacity duration-600 ease-in-out"
            style={{ opacity: current === index ? 1 : 0.6 }}
            alt={title}
            src={src}
            loading="eager"
            decoding="sync"
          />
        </div>
      </li>
    </div>
  );
};

const CarouselControl = ({ type, title, handleClick }: { type: string; title: string; handleClick: () => void }) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-white border-2 border-gray-200 rounded-full focus:border-bakery-pink focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 shadow-md hover:shadow-lg ${type === "previous" ? "rotate-180" : ""}`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-gray-600" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel3D({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => prev === slides.length - 1 ? 0 : prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-[70vmin] h-[70vmin] mx-auto" aria-labelledby={`carousel-heading-${id}`}>
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * (100 / slides.length)}%)` }}
      >
        {slides.map((slide, index) => (
          <Slide key={index} slide={slide} index={index} current={current} handleSlideClick={handleSlideClick} />
        ))}
      </ul>
      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl type="previous" title="Ir para slide anterior" handleClick={handlePreviousClick} />
        <CarouselControl type="next" title="Ir para próximo slide" handleClick={handleNextClick} />
      </div>
      <div className="absolute flex justify-center w-full top-[calc(100%+4rem)] gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${current === index ? "bg-bakery-pink w-6" : "bg-gray-300"}`}
            onClick={() => setCurrent(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 