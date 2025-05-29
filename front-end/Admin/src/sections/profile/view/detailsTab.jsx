import { Facebook, Twitter, Instagram } from "@mui/icons-material";

import { Typography, Box, Grid, Card, Switch, IconButton } from "@mui/material";
const DetailsTab = ({ user }) => {
  const {
    followsMe,
    answersPost,
    mentionsMe,
    newLaunches,
    productUpdate,
    newsletter,
  } = user;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, boxShadow: "none" }}>
          <Typography
            variant="h6"
            fontWeight="medium"
            textTransform="capitalize"
          >
            Cài đặt{" "}
          </Typography>
          <Box pt={1} pb={2} px={2} lineHeight={1.25}>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text"
              textTransform="uppercase"
            >
              Tài khoản
            </Typography>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={followsMe}
                  onChange={() => setFollowsMe(!followsMe)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Gửi email cho tôi khi ai đó theo dõi
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={answersPost}
                  onChange={() => setAnswersPost(!answersPost)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Gửi email cho tôi khi ai đó trả lời bài đăng{" "}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={mentionsMe}
                  onChange={() => setMentionsMe(!mentionsMe)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Gửi email cho tôi khi ai đó nhắc đến tôi{" "}
                </Typography>
              </Box>
            </Box>
            <Box mt={3}>
              <Typography
                variant="caption"
                fontWeight="bold"
                color="text"
                textTransform="uppercase"
              >
                Ứng dụng
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={newLaunches}
                  onChange={() => setNewLaunches(!newLaunches)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Ra mắt dự án mới{" "}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={productUpdate}
                  onChange={() => setProductUpdate(!productUpdate)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Cập nhật sản phẩm hàng tháng{" "}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={0.5} ml={-1.5}>
              <Box mt={0.5}>
                <Switch
                  checked={newsletter}
                  onChange={() => setNewsletter(!newsletter)}
                />
              </Box>
              <Box width="80%" ml={0.5}>
                <Typography variant="button" fontWeight="regular" color="text">
                  Đăng ký nhận bản tin{" "}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight="medium"
            textTransform="capitalize"
          >
            Thông tin hồ sơ{" "}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {user.bio}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Họ tên:</strong> {user.fullName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Số điện thoại:</strong> {user.phoneNumber}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Địa điểm:</strong> {user.address}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Vị trí:</strong> {user?.position || "---"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Chi tiết:</strong> {user?.description || "---"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                <strong>Mạng xã hội:</strong>
              </Typography>
              <Box>
                <IconButton color="primary" aria-label="facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="primary" aria-label="twitter">
                  <Twitter />
                </IconButton>
                <IconButton color="primary" aria-label="instagram">
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DetailsTab;
