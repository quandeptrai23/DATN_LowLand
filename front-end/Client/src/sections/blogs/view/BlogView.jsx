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
        space={200}
        title={"Read coffee stories on our Blog"}
        desciption={`Step into a world where each sip of coffee is a delightful journey,
          where flavors dance on your palate and every cup holds the promise of
          a new adventure, only at our coffee haven.`}
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
