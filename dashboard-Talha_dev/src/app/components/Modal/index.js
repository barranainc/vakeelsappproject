import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import Colors from '../../assets/styles';

function SimpleDialog({ open, onClose, title, children,selectedUser ,maxWidth }) {
  return (
    <Dialog
    //   onClick={() => onClose()}
      maxWidth={maxWidth}
      open={open}
      sx={{ '& .MuiDialog-paper': { width: '80%', height: "auto", borderRadius: 2, py: { xs: 2, md: 4 }, px: { xs: 3, md: 6 } } }}
    >
      <IconButton color="primary" onClick={() => onClose()} sx={{ position: 'absolute', right: 13, top: 13 }}>
        <Close />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center", fontSize: '20px', fontWeight: 700 ,color:Colors.primary,fontFamily:"Poppins"}}>{title}</DialogTitle>
      {children}

    </Dialog>
  )
}

export default SimpleDialog