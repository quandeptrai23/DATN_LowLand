import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: "fixed",
        p: (theme) => ({
          xs: theme.spacing(3, 3, 0),
          sm: theme.spacing(5, 5, 0),
        }),
      }}
    ></Box>
  );

  return (
    <>
      {renderHeader}

      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: "auto",
            display: "flex",
            minHeight: "100vh",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Xin lỗi, không tìm thấy trang!
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm. Có lẽ bạn
            đã nhập sai URL? Hãy chắc chắn kiểm tra lỗi chính tả của bạn.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/404SVG.svg"
            sx={{
              mx: "auto",
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />

          <Button
            href="/dashboard"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            Về trang chủ
          </Button>
        </Box>
      </Container>
    </>
  );
}
