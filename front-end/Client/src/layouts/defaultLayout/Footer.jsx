import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import ButtonLink from "src/components/ButtonLink";
import Image from "src/components/Image";

const SubcribeForm = () => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--primary-color)",
        width: "100%",
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 0px",
        marginBottom: "30px",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" sx={{ opacity: "0.6" }}>
        ĐĂNG KÝ VÀ NHẬN TÚI CÀ PHÊ MIỄN PHÍ{" "}
      </Typography>
      <Typography sx={{ fontSize: "30px", margin: "15px 0px 20px" }}>
        Coffee Updates
      </Typography>
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "20px 20px",
          display: "flex",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;",
        }}
      >
        <TextField
          label="youremail@lowlandcoffee.com"
          variant="outlined"
          color="info"
          sx={{ zIndex: 0 }}
        />
        <Button
          color="secondary"
          variant="contained"
          sx={{ marginLeft: "10px" }}
        >
          Đăng ký
        </Button>
      </Box>
    </Box>
  );
};

const ContactFooter = () => {
  return (
    <Container
      sx={{
        backgroundColor: "#fff",
        padding: "20px ",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;",
      }}
    >
      <Grid container spacing={5} justifyContent={"center"}>
        <Grid item sx={{ margin: "10px" }}>
          <ButtonLink
            href={"/"}
            callBack={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            ariaLabel={"logo"}
          >
            <Image
              unShowOverlay={true}
              imageURL={"/static/images/logo.jpg"}
              sx={{
                height: "120px",
                width: "120px",
                margin: "auto",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                marginBottom: "10px",
              }}
            />
          </ButtonLink>
          <Typography sx={{ fontWeight: "700" }}>
            LowLand Cà Phê &copy;
          </Typography>
        </Grid>
        <Grid item sx={{ margin: "10px" }}>
          <Typography
            sx={{
              width: "200px",
              fontWeight: "600",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            "Mang đến trải nghiệm cà phê tuyệt vời nhất kể từ năm 1996. Từ những
            người sành cà phê đến những người thực thụ."
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>MENU</Typography>
          <ButtonLink href="/">Trang chủ</ButtonLink>
          <ButtonLink href="/products">Sản phẩm</ButtonLink>
          <ButtonLink href="/blogs">Blog</ButtonLink>
          <ButtonLink href="/about">Về chúng tôi</ButtonLink>
          <ButtonLink href="/contact">Liên hệ</ButtonLink>
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>LIÊN HỆ</Typography>
          <Button>lowland@coffee.io</Button>
          <Button>(+84) 974.039.385</Button>
        </Grid>
      </Grid>

      <Divider sx={{ margin: "10px 0px" }} />
    </Container>
  );
};

const Footer = () => {
  return (
    <Container disableGutters>
      <SubcribeForm />
      <ContactFooter />
    </Container>
  );
};

export default Footer;
