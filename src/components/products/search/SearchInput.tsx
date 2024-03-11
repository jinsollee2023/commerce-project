import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const searchOnSubmitHanler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?keyword=${inputValue}`);
  };
  return (
    <form
      className="w-full md:w-3/5 mx-auto space-x-2 flex items-center "
      onSubmit={searchOnSubmitHanler}
    >
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="궁금한 주얼리를 검색해보세요!"
        className="flex h-10 w-full border-b px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button size="icon" variant="ghost" type="submit">
        <IoSearch size={20} />
      </Button>
    </form>
  );
};

export default SearchInput;
