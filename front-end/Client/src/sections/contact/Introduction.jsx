import { Box } from "@mui/material";

import IntroText from "src/components/IntroText";
import SectionTitle from "src/components/SectionTitle";

const Introduction = () => {
  return (
    <Box sx={{}}>
      <SectionTitle>CỬA HÀNG CỦA CHÚNG TÔI</SectionTitle>
      <IntroText variant={"h2"} />
    </Box>
  );
};

export default Introduction;
