import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ConfirmDelete = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa nó ?</Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Không
          </Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            Có
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
