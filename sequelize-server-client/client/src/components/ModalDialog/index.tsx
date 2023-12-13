import { useEffect, useState, Fragment } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

type ModalDialogProps = {
  children: React.ReactNode
  parentOpen?: boolean;
  setParentOpen?: Function;
};

export default function ModalDialog({ children, parentOpen, setParentOpen }: ModalDialogProps) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setParentOpen && setParentOpen(false);
  };

  useEffect(() => {
    parentOpen && setOpen(parentOpen);
  }, [parentOpen]);

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
