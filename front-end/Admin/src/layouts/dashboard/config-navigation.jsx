import SvgColor from "../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "Trang chủ",
    path: "/dashboard",
    icon: icon("ic_analytics"),
  },
  {
    title: "Tài khoản",
    path: "/users",
    icon: icon("ic_user"),
  },
  {
    title: "Sản phẩm",
    path: "/products",
    icon: icon("ic_cart"),
  },
  {
    title: "Blog",
    path: "/blogs",
    icon: icon("ic_blog"),
  },
  {
    title: "Đơn đặt hàng",
    path: "/orders",
    icon: icon("ic_order"),
  },
  {
    title: "Nguyên liệu",
    path: "/materials",
    icon: icon("ic_import"),
  },
];

export default navConfig;
