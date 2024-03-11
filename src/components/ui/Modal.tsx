import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/80">
      <div className="fixed z-50 w-full h-[90%] overflow-y-auto sm:w-3/4 md:w-1/2 lg:w-1/3 p-4 flex flex-col rounded-lg border bg-white">
        <div className="modal">{children}</div>
      </div>
    </div>,
    document.body
  );
};

const Header = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-header">{children}</div>
);
const Body = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-body">{children}</div>
);
const Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-footer">{children}</div>
);
const Close = ({ children }: { children: React.ReactNode }) => (
  <div className="modal-footer">{children}</div>
);

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Close = Close;

export default Modal;
