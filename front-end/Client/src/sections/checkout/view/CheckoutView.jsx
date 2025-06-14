import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { cart } from "src/redux/selectors/CartSelector";

import SideLayout from "src/layouts/sideLayout";
import { useRouter } from "src/routes/hooks";
import payAPI from "src/services/API/payAPI";
import ProductTable from "../ProductTable";
import { user } from "src/redux/selectors/UserSelector";
import OrderForm from "../OrderForm";
import { useMutation } from "@tanstack/react-query";

const OrderPayment = ({ open, orderId }) => {
  const router = useRouter();

  const handleClose = () => {
    router.replace("/user");
  };

  const { mutate: createPaymentLink, isPending } = useMutation({
    mutationKey: ["pay", { orderId: orderId }],
    mutationFn: (oid) => payAPI.createPaymentLink(oid),
  });

  const handlePay = () => {
    createPaymentLink(orderId, {
      onSuccess: (res) => {
        window.open(res, "_blank");
        router.replace("/user");
      },
    });
  };

  return (
    <Dialog open={open}>
      {isPending ? (
        <Box sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle>Thanh toán ngay!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Nhấp vào thanh toán ngay để thanh toán cho đơn hàng của bạn hoặc
              bạn có thể thanh toán sau.{" "}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained">
              Hủy
            </Button>
            <Button onClick={handlePay} variant="contained" color="success">
              Thanh toán
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

const CheckoutView = () => {
  const router = useRouter();
  const products = useSelector(cart);

  useEffect(() => {
    if (products.length === 0) router.push("/products");
  }, []);

  const data = useSelector(user);
  const [customerName, setCustomerName] = useState(data.fullName);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [address, setAddress] = useState(data.address);

  const [attempt, setAttempt] = useState(false);

  const [open, setOpen] = useState(false);

  const [orderId, setOrderId] = useState(0);

  return (
    <SideLayout title="Checkout">
      <Container maxWidth="lg" disableGutters sx={{ py: "100px" }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", color: "#ee4d2d" }}>
            <AccountBoxIcon sx={{ mr: 1 }} />
            <Typography sx={{ fontWeight: "600" }}>
Thông tin người nhận            </Typography>
          </Box>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "end",
            }}
          >
            <Box
              sx={{
                mt: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "start",
                width: "100%",
              }}
            >
              <Box sx={{ mr: 3, width: { xs: "100%", lg: "250px" } }}>
                <Typography sx={{ fontWeight: "600", mr: 3 }}>
                  Tên khách hàng:{" "}
                </Typography>
                <TextField
                  color={"secondary"}
                  value={customerName || ""}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={attempt && !customerName}
                  helperText={
                    attempt && !customerName
                      ? "Please enter receiver's name"
                      : ""
                  }
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <Box sx={{ mr: 3, width: { xs: "100%", lg: "200px" } }}>
                <Typography sx={{ fontWeight: "600", mr: 3 }}>
                  Số điện thoại:{" "}
                </Typography>
                <TextField
                  color={"secondary"}
                  value={phoneNumber || ""}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={attempt && !phoneNumber}
                  helperText={
                    attempt && !phoneNumber
                      ? "Vui lòng nhập số điện thoại"
                      : ""
                  }
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <Box sx={{ mr: 3, width: { xs: "100%", lg: "350px" } }}>
                <Typography sx={{ fontWeight: "600" }}>Địa chỉ: </Typography>
                <TextField
                  color={"secondary"}
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                  error={attempt && !address}
                  helperText={
                    attempt && !address ? "Vui lòng nhập địa chỉ" : ""
                  }
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: "600", fontSize: "20px" }}>
              Đặt
            </Typography>
            <Divider />
          </Box>
          <Box sx={{ my: 3 }}>
            <ProductTable products={products} />
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <OrderForm
            setAttempt={setAttempt}
            data={products}
            setOpen={setOpen}
            userData={{
              customerName,
              phoneNumber,
              address,
            }}
            setOrderId={setOrderId}
          />
        </Paper>

        <OrderPayment open={open} setOpen={setOpen} orderId={orderId} />
      </Container>
    </SideLayout>
  );
};

export default CheckoutView;
