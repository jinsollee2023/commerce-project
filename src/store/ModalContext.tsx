import React, { createContext, useCallback, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const contextDefaultValues: ModalContextProps = {
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
};

const ModalContext = createContext(contextDefaultValues);

export const useModal = () => React.useContext(ModalContext);

const ModalProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(contextDefaultValues.isOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue: ModalContextProps = {
    isOpen,
    onOpen,
    onClose,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
