import { Container } from "@mui/material";

import ButtonLink from "src/components/ButtonLink";
import IntroText from "src/components/IntroText";
import { useRouter } from "src/routes/hooks";

const HomeStory = () => {
  const router = useRouter();
  return (
    <Container
      maxWidth={"md"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <IntroText
        variant={"h2"}
        title={"Cà phê hảo hạng, khoảng không gian đẹp, trải nghiệm bất tận."}
        desciption={`Cùng chúng tôi trên hành trình khám phá và tận hưởng, nơi ranh giới của
hương vị được đẩy mạnh với mỗi hỗn hợp pha chế chuyên nghiệp, và nơi niềm vui đơn giản
của một tách cà phê trở thành khoảnh khắc kết nối và niềm vui thực sự
được chia sẻ với mỗi ngụm.`}
      />

      <ButtonLink
        color={"secondary"}
        href={"/blogs/79a5f2f2-3632-4bf9-b104-f5f098a92e47"}
        sx={{ fontWeight: "600" }}
      >
        Những câu chuyện
      </ButtonLink>
    </Container>
  );
};

export default HomeStory;
