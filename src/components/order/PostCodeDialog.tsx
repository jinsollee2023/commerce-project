import { Dialog, DialogContent } from "@/components/ui/dialog";

import DaumPostcode from "react-daum-postcode";

interface PostCodeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCompletePostCode: (address: string, zonecode: string) => void;
}

const PostCodeDialog = ({
  isOpen,
  setIsOpen,
  onCompletePostCode,
}: PostCodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="pt-12 flex justify-center">
        <DaumPostcode
          style={{ width: "400px", height: "400px" }}
          onComplete={(event) => {
            onCompletePostCode(event.address, event.zonecode);
            setIsOpen(false);
          }}
        ></DaumPostcode>
      </DialogContent>
    </Dialog>
  );
};

export default PostCodeDialog;
