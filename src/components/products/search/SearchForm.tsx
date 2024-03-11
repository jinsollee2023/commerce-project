import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IInitialValues } from "./SearchProducts";

interface SearchFormProps {
  searchItem: IInitialValues;
  setSearchItem: (searchItem: IInitialValues) => void;
}

const SearchForm = ({ searchItem, setSearchItem }: SearchFormProps) => {
  const formatNumberOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const exceptString = value.replace(/[^\d,]/g, "");
    const formattedValue = exceptString
      .replace(/,/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setSearchItem({ ...searchItem, [name]: formattedValue });
  };

  const navigate = useNavigate();
  const searchFormOnSubmitHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const { searchKeyword, searchCategory, fromPrice, toPrice } = searchItem;
    const formattedFromPrice = fromPrice.replace(/,/g, "");
    const formattedToPrice = toPrice.replace(/,/g, "");
    navigate(
      `/search?keyword=${encodeURIComponent(
        searchKeyword
      )}&category=${encodeURIComponent(
        searchCategory
      )}&fromPrice=${encodeURIComponent(
        formattedFromPrice
      )}&toPrice=${encodeURIComponent(formattedToPrice)}`
    );
  };

  return (
    <>
      <div className="mb-8 flex justify-center">
        <p className="text-2xl font-bold">검색결과</p>
      </div>
      <form
        onSubmit={searchFormOnSubmitHandler}
        className="w-full py-10 space-y-3 border rounded-sm px-5 lg:px-36 xl:px-48"
      >
        <div className="flex items-center">
          <label className="w-[23%] sm:w-[15%]">검색조건</label>
          <div className="w-[85%] flex space-x-1">
            <Select
              defaultValue={searchItem.searchCategory}
              onValueChange={(value) =>
                setSearchItem({ ...searchItem, searchCategory: value })
              }
            >
              <SelectTrigger className="noRoundedStyle">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="necklace">목걸이</SelectItem>
                  <SelectItem value="earring">귀걸이</SelectItem>
                  <SelectItem value="ring">반지</SelectItem>
                  <SelectItem value="bracelet">팔찌</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              className="w-3/5 h-8 border px-3 py-5 text-sm outline-none"
              value={searchItem.searchKeyword}
              onChange={(event) =>
                setSearchItem({
                  ...searchItem,
                  searchKeyword: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-[23%] sm:w-[15%]">판매가격</label>
          <div className="w-[85%] space-x-2 flex justify-between items-center">
            <input
              name="fromPrice"
              className="w-[47%] h-8 border px-3 py-5 text-sm outline-none"
              value={searchItem.fromPrice}
              onChange={formatNumberOnChangeHandler}
            />
            <span>~</span>
            <input
              name="toPrice"
              className="w-[47%] h-8 border px-3 py-5 text-sm outline-none"
              value={searchItem.toPrice}
              onChange={formatNumberOnChangeHandler}
            />
          </div>
        </div>
        <div className="pt-5">
          <Button className="w-full">검색</Button>
        </div>
      </form>
    </>
  );
};

export default SearchForm;
