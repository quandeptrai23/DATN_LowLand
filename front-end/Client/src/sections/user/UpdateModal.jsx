import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TableBody,
  Typography,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";

import Image from "src/components/Image";
import { formatPrice } from "src/utils/format-number";

import payAPI from "src/services/API/payAPI";
import orderAPI from "src/services/API/orderAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingComp from "src/components/LoadingComp";

const ProductTable = ({ products }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "645px" }}>
      <Table
        sx={{ minWidth: 700, position: "relative" }}
        aria-label="spanning table"
      >
        <TableHead
          sx={{ backgroundColor: "#f1f1f1", position: "sticky", top: 0 }}
        >
          <TableRow>
            <TableCell align="center" colSpan={4}>
              Sản phẩm
            </TableCell>
            <TableCell align="center" colSpan={2}>
              Chi tiết
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">Ảnh</TableCell>
            <TableCell align="left">Tên</TableCell>
            <TableCell align="left">Size</TableCell>
            <TableCell align="left">Giá</TableCell>
            <TableCell align="left">Số lượng</TableCell>
            <TableCell align="left">Tổng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                <Image
                  unShowOverlay={true}
                  imageURL={product.imageUrl}
                  sx={{ height: 100, width: 100 }}
                />
              </TableCell>
              <TableCell align="left">{product.productName}</TableCell>
              <TableCell align="left">{product.sizeName}</TableCell>
              <TableCell align="left">{formatPrice(product.price)}</TableCell>
              <TableCell align="left">{product.quantity}</TableCell>
              <TableCell align="left">
                {formatPrice(product.price * product.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ModalContent = ({ handleClose, order, userId, refetch }) => {
  const [updatedOrder, setUpdatedOrder] = useState({
    customerName: order?.customerName,
    phoneNumber: order?.phoneNumber,
    address: order?.address,
    message: order?.message,
    paymentLink: order?.paymentLink,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleUpdate();
    handleClose();
  };

  const { mutate: updateOrder, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["order", { orderId: order.orderId }],
    mutationFn: (oid) => orderAPI.updateOrder(userId, oid, updatedOrder),
  });

  const handleUpdate = () => {
    updateOrder(order.orderId, {
      onSuccess: (res) => {
        toast.success("Cập nhật đơn hàng thành công!");
        refetch();
      },
    });
  };

  const orderStatus = {
    0: {
      name: "Đang chờ",
      color: "#FF9800",
    },
    1: {
      name: "Đã thanh toán",
      color: "#2196F3",
    },
    2: {
      name: "Đã giao",
      color: "#4CAF50",
    },
    3: {
      name: "Đã hủy",
      color: "#F44336",
    },
  };

  const caculateTotal = () => {
    let total = 0;
    order.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const { mutate: createPaymentLink, isPending: isPendingPayment } =
    useMutation({
      mutationKey: ["payment", { orderId: order.orderId }],
      mutationFn: (oid) => payAPI.createPaymentLink(oid),
    });

  const handlePay = () => {
    if (updatedOrder?.paymentLink) {
      window.open(updatedOrder.paymentLink, "_blank");
    } else {
      createPaymentLink(order.orderId, {
        onSuccess: (res) => {
          window.open(res, "_blank");
          setUpdatedOrder((prevOrder) => ({
            ...prevOrder,
            paymentLink: res,
          }));
        },
      });
    }
  };

  return (
    <LoadingComp isLoading={isPendingPayment || isPendingUpdate}>
      <DialogTitle>Đơn hàng #{order.orderCode}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item sx={{ width: "100%" }} md={6}>
            <TextField
              margin="dense"
              name="customerName"
              label="Họ và tên"
              fullWidth
              value={updatedOrder.customerName || ""}
              disabled={order.status !== 0}
              onChange={handleChange}
              sx={{ mr: 2 }}
            />
          </Grid>
          <Grid item sx={{ width: "100%" }} md={6}>
            <TextField
              margin="dense"
              name="phoneNumber"
              label="Số điện thoại"
              fullWidth
              value={updatedOrder.phoneNumber || ""}
              disabled={order.status !== 0}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <TextField
          margin="dense"
          name="address"
          label="Địa chỉ"
          fullWidth
          value={updatedOrder.address || ""}
          disabled={order.status !== 0}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="message"
          label="Tin nhắn"
          fullWidth
          value={updatedOrder.message || ""}
          disabled={order.status !== 0}
          onChange={handleChange}
        />
        <Grid container spacing={2}>
          {/* createdDate, createdBy, status in 1 row */}
          <Grid item sx={{ width: "100%" }} md={4}>
            <TextField
              margin="dense"
              name="createdDate"
              label="Ngày tạo"
              fullWidth
              value={order.createdDate || ""}
              onChange={handleChange}
              disabled
              sx={{ mr: 2 }}
            />
          </Grid>
          <Grid item sx={{ width: "100%" }} md={4}>
            <TextField
              margin="dense"
              name="createdBy"
              label="Tạo bởi"
              fullWidth
              value={order.createdBy || ""}
              onChange={handleChange}
              disabled
              sx={{ mr: 2 }}
            />
          </Grid>
          <Grid item sx={{ width: "100%" }} md={4}>
            <Box>
              <Typography variant="caption">Trạng thái</Typography>
              <Typography
                sx={{
                  padding: "8px 40px",
                  color: "white",
                  fontWeight: "600",
                  backgroundColor: `${
                    orderStatus[order.status]?.color || "none"
                  }`,
                }}
              >
                {orderStatus[order.status]?.name || ""}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* updatedDate, updatedBy, message */}

        <TextField
          margin="dense"
          name="note"
          label="Ghi chú"
          fullWidth
          value={order.note || ""}
          disabled
          onChange={handleChange}
        />
        <ProductTable products={order.items} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ mt: 2, px: 2 }}>
            <Typography variant="h6" textAlign={"right"} fontWeight={500}>
              Tổng cộng:{" "}
              <span style={{ marginLeft: "40px" }}>
                {formatPrice(caculateTotal())} VNĐ
              </span>
            </Typography>
            <Typography variant="h6" textAlign={"right"} fontWeight={500}>
              Thuế (10%):{" "}
              <span style={{ marginLeft: "40px" }}>
                {formatPrice(Math.floor(caculateTotal() * 0.1))} VNĐ
              </span>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              textAlign={"right"}
              color={"secondary"}
              fontWeight={600}
              fontSize={"23px"}
            >
              Tổng:{" "}
              <span style={{ marginLeft: "40px" }}>
                {formatPrice(Math.floor(caculateTotal() * 1.1))} VNĐ
              </span>
            </Typography>
            <Button
              sx={{ mt: 2, width: "100%" }}
              variant="contained"
              onClick={handlePay}
              disabled={order.status !== 0}
              color="success"
            >
              Thanh toán ngay
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <Divider sx={{ my: 2 }} />
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={order.status !== 0}
        >
          Sửa
        </Button>
      </DialogActions>
    </LoadingComp>
  );
};

const UpdateModal = ({ open, handleClose, userId, orderId, refetch }) => {
  const {
    data: orderDetails,
    isFetching: isFetchingOrder,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderAPI.getOrderDetails(userId, orderId),
    enabled: open,
    refetchOnWindowFocus: false,
  });

  return (
    <Dialog open={open && !isError} onClose={handleClose} maxWidth="xl">
      {isFetchingOrder ? (
        <Box sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        !isError && (
          <ModalContent
            order={orderDetails}
            handleClose={handleClose}
            userId={userId}
            refetch={refetch}
          />
        )
      )}
    </Dialog>
  );
};

export default UpdateModal;
