"use client";

import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTypewriter } from "react-simple-typewriter";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    <form
      onSubmit={handleSubmit}
      className="bg-background flex rounded-md shadow-xs"
    >
      <Input
        className="-me-px rounded-e-none shadow-none focus-visible:z-10"
        placeholder={placeholder}
        value={search}
        ref={inputRef}
        type="text"
        onChange={handleInputChange}
      />
      <Select defaultValue="NTNU">
        <SelectTrigger className="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none">
          <SelectValue placeholder="Select an institution" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Institutions</SelectLabel>
            <SelectItem value="NTNU">NTNU</SelectItem>
            <SelectItem value="UIO">UIO</SelectItem>
            <SelectItem value="UIB">UIB</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}
