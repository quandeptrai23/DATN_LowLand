import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { user as UserSelector } from "src/redux/selectors/UserSelector";
import accountAPI from "src/services/API/accountAPI";
import { useMutation } from "@tanstack/react-query";
import UserManagerSlice from "src/redux/slices/UserManagerSlice";
import { toast } from "react-toastify";
import InnerLoading from "src/components/InnerLoading";
import SectionTitleB from "src/components/SectionTitleB";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const UserInfo = () => {
  const user = useSelector(UserSelector);
  const dispatch = useDispatch();

  const [tab, setTab] = useState("1");
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || null);
  const [address, setAddress] = useState(user.address || null);
  const [gender, setGender] = useState(user.gender);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const handleChangeAvatar = (e) => {
    const input = e.target.files[0];
    setFile(input);
    input.preview = URL.createObjectURL(input);
  };

  const { mutate: updateUser, isPending } = useMutation({
    mutationKey: ["user", user.accountId],
    mutationFn: (formData) => accountAPI.update(user.accountId, formData),
  });

  const handleUpdate = () => {
    if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }
    const formData = new FormData();
    formData.append(
      "userInfo",
      JSON.stringify({ fullName, phoneNumber, address, gender, password })
    );
    if (file) {
      formData.append("image", file);
    }

    updateUser(formData, {
      onSuccess: (data) => {
        dispatch(UserManagerSlice.actions.updateUser(data));
        toast.success("Cập nhật thành công");
        setFile(null);
        setPassword("");
        setConfirmPassword("");
      },
    });
  };

  useEffect(() => {
    return () => {
      file && URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  return (
    <Box sx={{ position: "relative", width: "100%", mb: 5 }}>
      <SectionTitleB sx={{ textAlign: "left" }}>
        Thông tin cá nhân
      </SectionTitleB>
      <InnerLoading
        isLoading={isPending}
        sx={{ backgroundColor: "white", zIndex: 2 }}
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            width: "fit-content",
            margin: "0 auto",
          }}
        >
          <Avatar
            alt="avatar"
            title={user?.imageName || "user avatar"}
            src={file ? file.preview : user.imageURL ? user.imageURL : ""}
            sx={{ width: 180, height: 180, margin: "auto", mb: 3 }}
          />
          <IconButton
            component={"label"}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              bottom: "10px",
              right: "15px",
              backgroundColor: "var(--secondary-color)",
              "&:hover": {
                backgroundColor: "var(--secondary-color)",
                opacity: ".8",
              },
            }}
          >
            <CreateIcon sx={{ color: "white" }} />
            <input
              type="file"
              onChange={handleChangeAvatar}
              style={{ display: "none" }}
            />
          </IconButton>
        </Box>

        <TabContext value={tab}>
          <Box>
            <TabList onChange={(e, v) => setTab(v)} aria-label="user tabs">
              <Tab label="Thông tin" value={"1"} />
              <Tab label="Đổi mật khẩu" value={"2"} />
            </TabList>
          </Box>
          <TabPanel
            value={"1"}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              display: tab === "1" ? "flex" : "none",
            }}
          >
            <TextField
              sx={{ m: 2, width: "100%" }}
              value={user.email || ""}
              label="Email"
              disabled
            ></TextField>
            <TextField
              sx={{ m: 2, width: "100%" }}
              value={fullName || ""}
              label="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            ></TextField>
            <FormControl fullWidth sx={{ my: 2, textAlign: "left" }}>
              <InputLabel id="demo-simple-select-label2">Giới tính</InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                value={gender || 1}
                name="gender"
                label="Gender"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              >
                <MenuItem value={1}>Nam</MenuItem>
                <MenuItem value={0}>Nữ</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ m: 2, width: "100%" }}
              label="Phone Number"
              value={phoneNumber || ""}
              onChange={(e) => setPhoneNumber(e.target.value)}
            ></TextField>
            <TextField
              sx={{ m: 2, width: "100%" }}
              label="Address"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            ></TextField>
          </TabPanel>
          <TabPanel
            value={"2"}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              display: tab === "2" ? "flex" : "none",
            }}
          >
            <TextField
              sx={{ m: 2, width: "100%" }}
              label="Mật khẩu mới"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <TextField
              sx={{ m: 2, width: "100%" }}
              label="Xác nhận mật khẩu"
              value={confirmPassword || ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              error={Boolean(password) && password !== confirmPassword}
              helperText={
                password && password !== confirmPassword
                  ? "Mật khẩu không khớp"
                  : ""
              }
            />
          </TabPanel>
        </TabContext>

        {!isPending && (
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={
              fullName === user.fullName &&
              phoneNumber === user.phoneNumber &&
              address === user.address &&
              gender === user.gender &&
              !file &&
              !password
            }
          >
            Cập nhật hồ sơ
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UserInfo;
