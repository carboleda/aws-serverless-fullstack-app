import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { TransactionContext } from "@/features/transactions/context/TransactionContext";
import { Modal } from "@heroui/react";
import { useContext } from "react";

export const TranactionDialog = () => {
  const context = useContext(TransactionContext);

  return (
    <Modal.Backdrop
      isOpen={context?.dialogState.isOpen}
      onOpenChange={context?.dialogState.setOpen}
      isDismissable={false}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-90">
          <Modal.Heading></Modal.Heading>
          <Modal.Body>
            <TransactionForm />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
