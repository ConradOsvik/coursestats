"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTypewriter } from "react-simple-typewriter";

export default function Search() {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [placeholder] = useTypewriter({
    words: ["TMA4100", "TDT4110", "TDT4100"],
    delaySpeed: 1500,
    loop: false,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/course/${search}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center">
      <div className="group m-2 flex w-96 items-center justify-center overflow-hidden rounded-full bg-neutral-100 [&:has(:not(button):focus)]:ring-3 [&:has(:not(button):focus)]:ring-blue-500/50">
        <label htmlFor="search" className="bg-neutral-100 p-4 outline-none">
          <MagnifyingGlassIcon className="size-6" />
        </label>
        <input
          id="search"
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent py-3.5 text-lg uppercase outline-none"
          value={search}
          onChange={handleInputChange}
          ref={inputRef}
        />
        {search.length > 0 && (
          <button
            type="button"
            className="rounded-full bg-neutral-100 p-4 outline-none focus:ring-3 focus:ring-inset focus:ring-blue-500/50"
            onClick={() => setSearch("")}
          >
            <XMarkIcon className="size-6" />
          </button>
        )}
      </div>
    </form>
  );
}
