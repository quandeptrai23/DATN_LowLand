import {
  Box,
  Button,
  Container,
  Grid,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";

import Introduction from "../Introduction";

import DecoComp from "src/components/DecoComp";
import SectionTitle from "src/components/SectionTitle";
import Image from "src/components/Image";
import IntroText from "src/components/IntroText";
import FloatInOnScroll from "src/components/FloatIn";

const FormWrap = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          textAlign: {
            md: "left",
            xs: "center",
          },
          mb: "100px",
        }}
      >
        <Grid
          container
          sx={{
            border: "1px solid rgba(209, 209, 209, 0.98)",
            padding: {
              md: "60px !important",
              xs: "30px !important",
            },
            textAlign: {
              md: "left",
              xs: "center",
            },
          }}
        >
          <Grid item md={8} xs={12}>
            <Typography>PHIẾU LIÊN HỆ</Typography>
            <Typography sx={{ marginBottom: "30px" }}>
              Hãy gửi tin nhắn cho chúng tôi và tôi sẽ trả lời bạn sớm nhất có
              thể.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: {
                  md: "73%",
                  xs: "100%",
                },
              }}
            >
              <TextField
                id="outlined-basic"
                label="TÊN"
                variant="outlined"
                sx={{
                  marginBottom: "20px",
                }}
              />
              <TextField
                id="outlined-basic"
                label="EMAIL"
                variant="outlined"
                sx={{
                  marginBottom: "20px",
                }}
              />
              <TextareaAutosize
                placeholder="GHI CHÚ"
                style={{
                  padding: "15px",
                  maxWidth: { md: "500px", xs: "100%" },
                  marginBottom: "20px",
                  fontSize: "19px",
                }}
              ></TextareaAutosize>
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  padding: "15px",
                  marginBottom: "20px",
                  "&:hover": {
                    backgroundColor: "var(--primary-color)",
                    opacity: ".7",
                  },
                }}
              >
                GỬI THÔNG TIN
              </Button>
            </Box>
          </Grid>

          <Grid
            item
            md={4}
            xs={12}
            textAlign={{
              md: "left",
              xs: "center",
            }}
          >
            <Typography>PHIẾU LIÊN HỆ</Typography>

            <Typography fontWeight={"Bold"} sx={{ marginBottom: "30px" }}>
              Lowland Coffee. Inc
            </Typography>
            <Typography>Minh Khai</Typography>
            <Typography>Cầu Diễn</Typography>
            <Typography sx={{ marginBottom: "30px" }}>Hà Nội</Typography>
            <Typography>SỐ ĐIỆN THOẠI</Typography>
            <Typography sx={{ marginBottom: "30px" }}>
              +84 (415) 555-1212
            </Typography>
            <Typography>EMAIL</Typography>
            <Typography>site@lowlandCoffee.io</Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const IntroductionBehindForm = () => {
  return (
    <Container maxWidth="sm" sx={{ mb: "100px" }}>
      <Grid
        container
        sx={{
          textAlign: {
            xs: "center",
          },
        }}
      >
        <SectionTitle>Danh mục</SectionTitle>
        <IntroText variant={"h2"} />
        <Grid
          item
          sx={{
            opacity: ".7",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: {
              md: "row",
              xs: "column",
            },
          }}
        >
          <Typography sx={{ marginTop: "20px" }}>Người sở hữu</Typography>
          <Typography sx={{ marginTop: "20px" }}>Nguyen Anh Quan</Typography>
          <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
            <Typography sx={{ marginTop: "20px" }}>086-374-42242</Typography>
            <Typography>quanna@lowlandCoffee.com</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const ContactView = () => {
  return (
    <>
      <DecoComp
        space={200}
        title={"Kết nối ngay"}
        desciption={
          "Tại LowLand Coffee Shop, chúng tôi tin vào việc nâng cao trải nghiệm cà phê hàng ngày của bạn. Tọa lạc tại trung tâm thành phố, chúng tôi cung cấp nhiều hơn một tách cà phê – chúng tôi cung cấp một bầu không khí ấm áp, hấp dẫn, nơi mỗi ngụm cà phê là một hành trình của hương vị phong phú và kết nối cộng đồng. Hãy đến và tận hưởng khoảnh khắc cùng chúng tôi."
        }
      >
        <FloatInOnScroll>
          <Introduction />
          <Container maxWidth="lg">
            <Grid
              container
              sx={{ width: "100%", justifyContent: "center" }}
              spacing={{ sx: 0, md: 4 }}
            >
              <Grid item md={6} xs={12} sx={{ textAlign: "center" }}>
                <Image
                  imageURL={"static/images/aboutBanner.jpg"}
                  sx={{ height: "190px", mb: "50px" }}
                  unShowOverlay={true}
                />
                <Typography variant="" sx={{ opacity: ".6" }}>
                  Cầu Giấy
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Cầu Giấy, Hà Nội
                </Typography>
                <Typography sx={{ opacity: ".6" }}>Số 38 Cầu Diễn</Typography>
                <Typography sx={{ opacity: ".6" }}>Hà Nội</Typography>
                <Typography sx={{ opacity: ".6", marginBottom: "30px" }}>
                  Việt Nam
                </Typography>
                <Typography sx={{ opacity: ".6" }}>Thời gian mở cửa</Typography>
                <Typography sx={{ opacity: ".6" }}>
                  Thứ hai - Thứ sáu 08:00 to 22:00
                </Typography>
                <Typography sx={{ opacity: ".6" }}>
                  Thứ 7 - 09:00 to 20:00
                </Typography>
                <Typography sx={{ opacity: ".6", marginBottom: "20px" }}>
                  Chủ Nhật - 12:00 to 18:00
                </Typography>
              </Grid>
              <Grid item md={6} xs={12} sx={{ textAlign: "center" }}>
                <Image
                  imageURL={"static/images/aboutBanner.jpg"}
                  sx={{ height: "190px", mb: "50px" }}
                  unShowOverlay={true}
                />
                <Typography variant="" sx={{ opacity: ".6" }}>
                  MINH KHAI
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  Nguyên Xá, Cầu Diễn, Hà Nội
                </Typography>
                <Typography sx={{ opacity: ".6" }}>Số 316 Đường 30</Typography>
                <Typography sx={{ opacity: ".6" }}>Nguyên Xá</Typography>
                <Typography sx={{ opacity: ".6", marginBottom: "30px" }}>
                  Cầu Diễn
                </Typography>
                <Typography sx={{ opacity: ".6" }}>Thời gian mở cửa</Typography>
                <Typography sx={{ opacity: ".6" }}>
                  Thứ hai - Thứ sáu 08:00 to 22:00
                </Typography>
                <Typography sx={{ opacity: ".6" }}>
                  Thứ 7 - 09:00 to 20:00
                </Typography>
                <Typography sx={{ opacity: ".6", marginBottom: "20px" }}>
                  Chủ Nhật - 12:00 to 18:00
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </FloatInOnScroll>
      </DecoComp>

      <FloatInOnScroll>
        <FormWrap />
      </FloatInOnScroll>

      <FloatInOnScroll>
        <Container
          maxWidth={"100%"}
          sx={{ marginBottom: "30px" }}
          disableGutters
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d516.8840432587057!2d105.73992301942843!3d21.0507561891785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455002d060de1%3A0xe32d1e8b23ea3477!2sLowLand%20Coffee!5e0!3m2!1svi!2s!4v1716020772756!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            // allowFullScreen="true"
            loading="lazy"
            allow="geolocation"
            referrerPolicy="no-referrer-when-downgrade"
            title="map"
          ></iframe>
        </Container>
      </FloatInOnScroll>

      <FloatInOnScroll>
        <IntroductionBehindForm />
      </FloatInOnScroll>
    </>
  );
};

export default ContactView;
