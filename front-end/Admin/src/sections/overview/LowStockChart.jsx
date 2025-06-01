import { Box, Typography } from "@mui/material";
import Chart from "src/components/chart";
import { useQuery } from "@tanstack/react-query";
import materialAPI from "src/services/API/materialAPI";

const LowStockChart = () => {
  const { data: lowStockMaterials, isLoading } = useQuery({
    queryKey: ["lowStockMaterials"],
    queryFn: async () => {
      const allMaterials = await materialAPI.getMaterials();
      return allMaterials.filter(
        (item) => Number(item.quantity) < Number(item.minQuantity)
      );
    },
  });

  if (!lowStockMaterials?.length) return null;

  const lowStockChart = {
    labels: lowStockMaterials.map((m) => m.materialName),
    series: [
      {
        name: "Số lượng hiện tại",
        data: lowStockMaterials.map((m) => m.quantity),
        color: "#FF5630",
      },
    ],
    colors: ["#FF5630"],
  };

  return (
    <Box mt={5}>
      <Typography variant="h4"> Nguyên liệu dưới mức cảnh báo</Typography>
      <Chart
        dir="ltr"
        type="bar"
        series={lowStockChart.series}
        options={{
          chart: { id: "lowStockChart" },
          xaxis: {
            categories: lowStockChart.labels,
          },
          colors: lowStockChart.colors,
          title: {
            text: lowStockChart.title,
            align: "left",
          },
          tooltip: {
            y: {
              formatter: (value, { dataPointIndex }) => {
                const unit = lowStockMaterials[dataPointIndex]?.unitName || "";
                return `${value} ${unit}`;
              },
            },
          },
        }}
        width="100%"
        height={300}
      />
    </Box>
  );
};

export default LowStockChart;
