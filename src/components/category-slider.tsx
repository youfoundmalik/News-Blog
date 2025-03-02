"use client";

import { useEffect, useRef, useState } from "react";

import ArrowIcon from "./icons/arrow";
import useSort from "@/hooks/useSort";
import { useDataContext } from "@/context/data-context";

const CategorySlider: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const { handleSort } = useSort();
  const { data, filters } = useDataContext();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }
    return () => slider?.removeEventListener("scroll", handleScroll);
  }, []);

  // Add check when data changes
  useEffect(() => {
    // Small delay to ensure proper rendering
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [data]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      scroll("left");
    } else if (e.key === "ArrowRight") {
      scroll("right");
    }
  };

  return (
    <section
      className='categories w-full bg-gray-50 relative px-2.5 h-[50px] md:h-[60px] flex items-center gap-1.5 md:gap-2.5 rounded overflow-hidden'
      aria-label='Category filters'
    >
      {!isLoading && showLeft && (
        <button
          className='absolute left-0 z-10 bg-gray-100 bg-opacity-95 h-[84px] w-10 md:w-14 flex items-center justify-center'
          onClick={() => scroll("left")}
          aria-label='Scroll categories left'
        >
          <ArrowIcon className='rotate-180' aria-hidden='true' />
        </button>
      )}

      <div
        ref={sliderRef}
        className='scroll-container flex gap-4 overflow-x-auto hide-scroll w-full scroll-smooth'
        role='list'
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label='Category list'
      >
        {isLoading
          ? new Array(12)
              .fill("")
              .map((_, index) => <div key={index} className='animate-pulse h-8 md:h-10 w-[100px] md:w-[120px] bg-gray-100' role='presentation' />)
          : data.categories.map((category, index) => (
              <button
                key={index}
                className={`flex-shrink-0 h-8 md:h-10 min-w-[100px] md:min-w-[120px] px-2.5 border border-gray-200 hover:bg-slate-100 flex items-center justify-center rounded text-sm md:text-base text-gray-600 font-medium ${
                  filters.categories.includes(category) ? "!bg-cyan-100 !border-cyan-300" : ""
                }`}
                onClick={() => {
                  const payload = filters.categories.includes(category)
                    ? filters.categories.filter((cat) => cat !== category)
                    : [...filters.categories, category];
                  handleSort("categories", payload);
                }}
                aria-pressed={filters.categories.includes(category)}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </button>
            ))}
      </div>

      {!isLoading && showRight && (
        <button
          className='absolute right-0 z-10 bg-gray-100 bg-opacity-95 h-[84px] w-10 md:w-14 flex items-center justify-center shadow-[-40px_0px_30px_0px_rgba(0,_0,_0,_0.05)] focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
          onClick={() => scroll("right")}
          aria-label='Scroll categories right'
        >
          <ArrowIcon aria-hidden='true' />
        </button>
      )}
    </section>
  );
};

export default CategorySlider;
