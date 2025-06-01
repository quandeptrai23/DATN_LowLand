import { useState, useEffect } from "react";
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import orderAPI from "src/services/API/orderAPI";
import { toast } from "react-toastify";
import { formatPrice } from "src/utils/format-number";
import Image from "src/components/Image";
import payAPI from "src/services/API/payAPI";

import LoadingComp from "src/components/loading/LoadingComp";
import { useMutation, useQuery } from "@tanstack/react-query";

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
            <TableCell align="center">Hình ảnh</TableCell>
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

const ModalContent = ({ onClose, orderDetails, refetch, refetchOrder }) => {
  const orderStatus = {
    0: {
      value: "WAITING",
      color: "#FF9800",
    },
    1: {
      value: "PAID",
      color: "#2196F3",
    },
    2: {
      value: "DELIVERED",
      color: "#4CAF50",
    },
    3: {
      value: "CANCELED",
      color: "#F44336",
    },
  };

  const [order, setOrder] = useState(orderDetails);

  const { mutate: createPaymentLink, isPending: isCreatePaymentLink } =
    useMutation({
      mutationKey: (orderId) => ["createPaymentLink", { orderId: orderId }],
      mutationFn: (orderId) => payAPI.createPaymentLink(orderId),
    });

  const { mutate: updateOrder, isPending: isUpdateOrder } = useMutation({
    mutationKey: (order) => ["updateOrder", { orderId: order.orderId }],
    mutationFn: (order) => orderAPI.updateOrder(order.orderId, order),
  });

  const caculateTotal = () => {
    let total = 0;
    order.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const handlePay = () => {
    if (order.paymentLink) {
      window.open(order.paymentLink, "_blank");
    } else {
      createPaymentLink(order.orderId, {
        onSuccess: (data) => {
          window.open(data, "_blank");
          setOrder({
            ...order,
            paymentLink: data,
          });
        },
      });
    }
  };

  const handleSubmit = () => {
    updateOrder(order, {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
        refetchOrder();
        refetch();
      },
    });
  };

  // Helper function để tạo style cho disabled fields
  const getDisabledFieldStyle = (isDisabled) => ({
    '& .MuiInputBase-root': {
      '&.Mui-disabled': {
        backgroundColor: 'transparent',
        '& .MuiInputBase-input': {
          color: 'rgba(0, 0, 0, 0.6)',
          WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
        }
      }
    }
  });

  return (
    <>
      {order && (
        <>
          <LoadingComp isLoading={isCreatePaymentLink || isUpdateOrder} />
          <DialogTitle>Đơn đặt hàng #{order.orderCode}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item sx={{ width: "100%" }} md={6}>
                <TextField
                  margin="dense"
                  name="customerName"
                  label="Tên khách hàng"
                  fullWidth
                  value={order.customerName || ""}
                  disabled={
                    orderDetails.status === 3 || orderDetails.status === 2
                  }
                  onChange={(e) =>
                    setOrder({ ...order, customerName: e.target.value })
                  }
                  sx={{ 
                    mr: 2,
                    ...getDisabledFieldStyle(orderDetails.status === 3 || orderDetails.status === 2)
                  }}
                />
              </Grid>
              <Grid item sx={{ width: "100%" }} md={6}>
                <TextField
                  margin="dense"
                  name="phoneNumber"
                  label="Số điện thoại"
                  fullWidth
                  value={order.phoneNumber || ""}
                  disabled={
                    orderDetails.status === 3 || orderDetails.status === 2
                  }
                  onChange={(e) =>
                    setOrder({ ...order, phoneNumber: e.target.value })
                  }
                  sx={getDisabledFieldStyle(orderDetails.status === 3 || orderDetails.status === 2)}
                />
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              name="address"
              label="Địa chỉ"
              fullWidth
              value={order.address || ""}
              disabled={orderDetails.status === 3 || orderDetails.status === 2}
              onChange={(e) => setOrder({ ...order, address: e.target.value })}
              sx={getDisabledFieldStyle(orderDetails.status === 3 || orderDetails.status === 2)}
            />
            <TextField
              margin="dense"
              name="message"
              label="Ghi chú"
              fullWidth
              value={order.message || ""}
              disabled={orderDetails.status === 3 || orderDetails.status === 2}
              onChange={(e) => {
                setOrder({ ...order, message: e.target.value });
              }}
              sx={getDisabledFieldStyle(orderDetails.status === 3 || orderDetails.status === 2)}
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
                  disabled
                  sx={{ 
                    mr: 2,
                    ...getDisabledFieldStyle(true)
                  }}
                />
              </Grid>
              <Grid item sx={{ width: "100%" }} md={4}>
                <TextField
                  margin="dense"
                  name="createdBy"
                  label="Được tạo bởi"
                  fullWidth
                  value={order.createdBy || ""}
                  disabled
                  sx={{ 
                    mr: 2,
                    ...getDisabledFieldStyle(true)
                  }}
                />
              </Grid>

              <Grid item sx={{ width: "100%", mt: 1 }} md={4}>
                <FormControl
                  sx={{
                    width: "100%",
                  }}
                >
                  <InputLabel
                    sx={{ backgroundColor: "white", borderRadius: "8px" }}
                  >
                    Trạng thái
                  </InputLabel>
                  <Select
                    value={order.status}
                    disabled={
                      orderDetails.status === 3 || orderDetails.status === 2
                    }
                    onChange={(e) =>
                      setOrder((prevOrder) => ({
                        ...prevOrder,
                        status: e.target.value,
                      }))
                    }
                    sx={{
                      backgroundColor: (orderDetails.status === 3 || orderDetails.status === 2) 
                        ? 'transparent' 
                        : `${orderStatus[order.status].color}`,
                      color: (orderDetails.status === 3 || orderDetails.status === 2)
                        ? 'rgba(0, 0, 0, 0.6) !important'
                        : 'white !important',
                      '&.Mui-disabled': {
                        backgroundColor: 'transparent',
                        color: 'rgba(0, 0, 0, 0.6) !important',
                      }
                    }}
                    label="Trạng thái"
                  >
                    <MenuItem value={0}>Chờ</MenuItem>
                    <MenuItem value={1}>Đã thanh toán</MenuItem>
                    <MenuItem value={2}>Đã giao</MenuItem>
                    <MenuItem value={3}>Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sx={{ width: "100%" }} md={6}>
                <TextField
                  margin="dense"
                  name="updatedDate"
                  label="Ngày cập nhật"
                  fullWidth
                  value={order.updatedDate || ""}
                  disabled
                  sx={{ 
                    mr: 2,
                    ...getDisabledFieldStyle(true)
                  }}
                />
              </Grid>
              <Grid item sx={{ width: "100%" }} md={6}>
                <TextField
                  margin="dense"
                  name="updatedBy"
                  label="Cập nhật bởi"
                  fullWidth
                  value={order.updatedBy || ""}
                  disabled
                  sx={{ 
                    mr: 2,
                    ...getDisabledFieldStyle(true)
                  }}
                />
              </Grid>
            </Grid>
            {/* updatedDate, updatedBy, message */}

            <TextField
              margin="dense"
              name="note"
              label="Ghi chú"
              fullWidth
              value={order.note || ""}
              disabled={orderDetails.status === 3 || orderDetails.status === 2}
              onChange={(e) => setOrder({ ...order, note: e.target.value })}
              sx={getDisabledFieldStyle(orderDetails.status === 3 || orderDetails.status === 2)}
            />
            <ProductTable products={order.items} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ mt: 2, px: 2 }}>
                <Typography variant="h6" textAlign={"right"} fontWeight={500}>
                  Tổng phí:{" "}
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
                  Total:{" "}
                  <span style={{ marginLeft: "40px" }}>
                    {formatPrice(Math.floor(caculateTotal() * 1.1))} VNĐ
                  </span>
                </Typography>
                <Box>
                  <Button
                    sx={{ mt: 2, width: "100%" }}
                    variant="contained"
                    onClick={handlePay}
                    color="success"
                  >
                    Link thanh toán
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <Divider sx={{ my: 2 }} />
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                setOrder(null);
              }}
              variant="contained"
              color="primary"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="warning"
              sx={{ color: "white" }}
              disabled={orderDetails.status === 3 || orderDetails.status === 2}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

const UpdateModal = ({ open, handleClose, order, refetch }) => {
  const { data: orderDetails, refetch: refetchOrder } = useQuery({
    queryKey: ["getOrderDetails", order.orderId],
    queryFn: () => orderAPI.getOrderDetails(order.accountId, order.orderId),
    enabled: !!order && open,
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <LoadingComp isLoading={!orderDetails} />
      {orderDetails && (
        <ModalContent
          orderDetails={orderDetails}
          onClose={handleClose}
          refetch={refetch}
          refetchOrder={refetchOrder}
        />
      )}
    </Dialog>
  );
};

export default UpdateModal;