import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import useUserMutations from "@/hooks/queries/user/useUserMutations";
import { getKoreaTimeDate } from "@/shared/common";
import { User } from "firebase/auth";

interface RoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  googleUserData: User;
}
const RoleDialog = ({ open, setOpen, googleUserData }: RoleDialogProps) => {
  const [selectedValue, setSelectedValue] = useState("");
  const { addUserMutation } = useUserMutations();

  const saveUserInfoButtonHandler = () => {
    const { uid, displayName, email } = googleUserData;
    const isSeller = selectedValue === "seller" ? true : false;
    const date = getKoreaTimeDate();
    const newUser = {
      id: uid,
      nickname: displayName as string,
      email: email as string,
      password: "",
      isSeller,
      createdAt: date,
      updatedAt: date,
    };
    addUserMutation.mutate(newUser);
    setOpen(false);
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>추가 정보</AlertDialogTitle>
          <AlertDialogDescription>역할을 선택해주세요.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              역할
            </Label>
            <Select onValueChange={(value) => setSelectedValue(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="seller">판매자</SelectItem>
                  <SelectItem value="buyer">구매자</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <Button onClick={saveUserInfoButtonHandler}>등록하기</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleDialog;
