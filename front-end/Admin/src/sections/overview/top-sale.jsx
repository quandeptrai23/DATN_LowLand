import { Box } from "@mui/material";

import chartAPI from "src/services/API/chartAPI";

import { useQuery } from "@tanstack/react-query";
import AppWebsiteVisits from "./app-website-visits";

const TopSale = () => {
  const { data: topSale } = useQuery({
    queryKey: ["getTopSale", { top: 8 }],
    queryFn: () => chartAPI.getTopSale({ topProduct: 8 }),
  });
  return (
    <Box sx={{ mt: 3 }}>
      {topSale && (
        <AppWebsiteVisits
          title="Sản phẩm bán chạy nhất"
          chart={{
            labels: topSale.map((item) => item.productName || "N/A"),
            series: [
              {
                name: "Tổng",
                type: "column",
                fill: "solid",
                data: topSale.map((item) => item.quantity || 0),
              },
            ],
          }}
        />
      )}
    </Box>
  );
};

export default TopSale;
