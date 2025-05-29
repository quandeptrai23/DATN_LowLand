import { Container } from "@mui/material";

import AboutIntroductions from "../AboutIntroductions";
import AuthorsIntro from "../AuthorsIntro";
import Introduction from "../Introduction";
import TimeLine from "../TimeLine";

import DecoComp from "src/components/DecoComp";
import Image from "src/components/Image";
import ShowCase from "src/components/ShowCase";
import FloatInOnScroll from "src/components/FloatIn";

const AboutView = () => {
  return (
    <>
      <DecoComp
        space={80}
        title={"Thông tin"}
        desciption={
          "Tại LowLand Coffee Shop, chúng tôi tin vào việc nâng cao trải nghiệm cà phê hàng ngày của bạn. Tọa lạc tại trung tâm thành phố, chúng tôi cung cấp nhiều hơn một tách cà phê – chúng tôi cung cấp một bầu không khí ấm áp, hấp dẫn, nơi mỗi ngụm cà phê là một hành trình của hương vị phong phú. Hãy đến và tận hưởng khoảnh khắc cùng chúng tôi."
        }
      >
        <Container maxWidth="md" style={{ marginTop: "10px" }}>
          <Image
            imageURL={"/static/images/aboutBanner.jpg"}
            sx={{ width: "100%", height: "320px", mb: "100px" }}
            unShowOverlay={true}
          />

          <FloatInOnScroll>
            <Introduction />
          </FloatInOnScroll>

          <FloatInOnScroll>
            <AboutIntroductions />
          </FloatInOnScroll>

          <FloatInOnScroll>
            <AuthorsIntro />
          </FloatInOnScroll>
        </Container>
      </DecoComp>

      <ShowCase imageURL={"/static/images/showcase2.jpg"} />

      <FloatInOnScroll>
        <TimeLine />
      </FloatInOnScroll>
    </>
  );
};

export default AboutView;
