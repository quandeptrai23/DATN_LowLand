import { Box } from "@mui/material";

import BlogMenu from "../BlogMenu";
import FeaturedPosts from "../FeaturedPosts";

import DecoComp from "src/components/DecoComp";
import Motto from "src/components/Motto";
import FloatInOnScroll from "src/components/FloatIn";
import AllArticle from "../AllArticle";

const BlogsView = () => {
  return (
    <Box sx={{ height: "fit-content" }}>
      <DecoComp
        space={150}
        title={"Đọc những câu chuyện về cà phê trên Blog của chúng tôi"}
        desciption={`Bước vào thế giới mà mỗi ngụm cà phê là một hành trình thú vị,
nơi hương vị nhảy múa trên vòm miệng và mỗi tách cà phê đều hứa hẹn
một cuộc phiêu lưu mới, chỉ có tại thiên đường cà phê của chúng tôi.`}
      >
        <FloatInOnScroll>
          <FeaturedPosts />
        </FloatInOnScroll>

        <FloatInOnScroll>
          <BlogMenu />
        </FloatInOnScroll>

        <FloatInOnScroll>
          <AllArticle />
        </FloatInOnScroll>

        <FloatInOnScroll>
          <Motto author={`NGUYEN ANH QUAN - OWNER OF LOWLAND`}>
            "Tôi thức dậy vào một buổi sáng, ngồi uống cà phê và ngắm khu vườn
            xinh đẹp của mình, và tôi nghĩ, 'Hãy nhớ rằng điều này tốt đẹp như
            thế nào. Bởi vì bạn có thể mất nó.'"
          </Motto>
        </FloatInOnScroll>
      </DecoComp>
    </Box>
  );
};

export default BlogsView;
