import { Box, Container, Grid, Typography } from "@mui/material";

import ButtonLink from "src/components/ButtonLink";
import SectionTitle from "src/components/SectionTitle";
import { useResponsive } from "src/hooks/use-responsive";
import { useRouter } from "src/routes/hooks";

const HomeMagazine = () => {
  const router = useRouter();

  const isMobile = useResponsive("down", 900);

  const isLessMobile = useResponsive("down", 600);

  return (
    <Container maxWidth={"md"} sx={{ marginBottom: "100px" }}>
      <SectionTitle>
        MUA 2 CỐC VÀ ĐƯỢC NHẬN TẠP CHÍ CÀ PHÊ MIỄN PHÍ
      </SectionTitle>
      <Grid
        container
        justifyContent={"center"}
        columns={{ md: 2 }}
        spacing={4}
        flexWrap={"wrap-reverse"}
        alignItems={"center"}
      >
        <Grid item md={1} height={"100%"}>
          <Box
            sx={{
              textAlign: `${isMobile ? "center" : "left"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: `${isMobile ? "center" : "start"}`,
            }}
          >
            <Typography sx={{ margin: "10px" }}>ƯU ĐÃI CAO CẤP</Typography>
            <Typography
              sx={{ fontWeight: "600", fontSize: "30px", margin: "10px" }}
            >
              Tạp chí cà phê của chúng tôi
            </Typography>
            <Typography sx={{ margin: "10px" }}>
              Hệ thống đồ nội thất đa năng nhất từng được tạo ra. Được thiết kế
              để phù hợp với cuộc sống của bạn.
            </Typography>

            <ButtonLink
              href="/products"
              sx={{ margin: "10px" }}
              variant={"outlined"}
            >
              SHOPPING
            </ButtonLink>
          </Box>
        </Grid>
        <Grid
          item
          md={1}
          sx={{
            display: "flex",
            flexWrap: `${isLessMobile ? "wrap" : "nowrap"}`,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundImage: "url(/static/images/magazine1.jpg)",
              height: "280px",
              width: `${isLessMobile ? "100%" : "280px"}`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: `${isLessMobile ? "row" : "column"}`,
              paddingLeft: `${isLessMobile ? "0px" : "20px"}`,
            }}
          >
            <Box
              sx={{
                backgroundImage: "url(/static/images/magazine2.jpg)",
                height: "130px",
                width: "110px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                margin: `${isLessMobile ? "20px" : "0px"} 20px 0px 0px`,
              }}
            />
            <Box
              sx={{
                backgroundImage: "url(/static/images/magazine3.jpg)",
                height: "130px",
                width: "110px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                margin: "20px 0px 0px 0px",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeMagazine;
