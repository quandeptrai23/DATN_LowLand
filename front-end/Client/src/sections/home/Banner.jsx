import { Box, Button, Container, Typography } from "@mui/material";

import ButtonLink from "src/components/ButtonLink";
import IntroText from "src/components/IntroText";

const HomeBanner = () => {
  return (
    <Container disableGutters sx={{ marginBottom: "100px" }}>
      <Container
        sx={{
          backgroundImage: `linear-gradient(180deg, rgba(5, 8, 39, 0.4), rgba(5, 8, 39, 0.4)), url("/static/images/banner.jpg")`,
          height: "530px",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat,",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "800px",
          }}
        >
          <Typography
            sx={{ marginBottom: "20px", fontWeight: "600", opacity: "0.8" }}
          >
            NƠI TUYỆT VỜI ĐỂ THƯ GIÃN
          </Typography>
          <IntroText
            title={"LowLand Coffee"}
            desciption={`Bước vào thế giới mà mỗi ngụm cà phê là một hành trình thú vị, nơi hương vị nhảy múa trên vòm miệng và mỗi tách cà phê đều hứa hẹn một cuộc phiêu lưu mới, chỉ có tại cà phê của chúng tôi.`}
          />
          <ButtonLink
            href={"/products"}
            sx={{
              backgroundColor: "#fff",
              padding: "15px 20px",
              fontWeight: "700",
              "&:hover": {
                backgroundColor: "#ccc",
              },
            }}
          >
            KHÁM PHÁ SẢN PHẨM
          </ButtonLink>
        </Box>
      </Container>
    </Container>
  );
};

export default HomeBanner;
