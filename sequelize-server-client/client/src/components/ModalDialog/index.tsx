import { useEffect, useState, Fragment } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
