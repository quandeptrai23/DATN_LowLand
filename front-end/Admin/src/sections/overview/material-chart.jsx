import Typography from "@mui/material/Typography";

import {
  Box,
  Button,
  Card,
  IconButton,
  Pagination,
  Skeleton,
  TextField,
} from "@mui/material";

import chartAPI from "src/services/API/chartAPI";

import MaterialColumnChart from "./customChart";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "src/hooks/use-debounce";
import Iconify from "src/components/iconify/iconify";
import LowStockChart from "./LowStockChart";

const MaterialChart = () => {
  const [pageMaterial, setPageMaterial] = useState(1);
  const [query, setQuery] = useState("");
  const queryValue = useDebounce(query, 500);

  const { data: materialsPage, refetch } = useQuery({
    queryKey: [
      "getMaterial",
      { page: pageMaterial, size: 5, query: queryValue },
    ],
    queryFn: () =>
      chartAPI.getMaterialChart({
        page: pageMaterial,
        size: 5,
        query: queryValue,
      }),
  });

  return (
    <Box sx={{ my: 3 }}>
      <Card>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ my: 3, mx: 3 }}>
            Biểu đồ nguyên liệu
          </Typography>
          <IconButton
            color="primary"
            sx={{ height: "fit-content", mr: 1 }}
            title="Refresh"
            onClick={() => {
              refetch();
            }}
          >
            <Iconify icon="material-symbols:refresh" width={30} />
          </IconButton>
        </Box>
        <Box sx={{ mx: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Tìm kiếm nguyên liệu..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPageMaterial(1);
              }}
            />
            <Button variant="contained" sx={{ py: 2 }} color="secondary">
              Tìm kiếm
            </Button>
          </Box>
        </Box>
        {materialsPage ? (
          <>
            <MaterialColumnChart
              refetch={refetch}
              chart={{
                labels: materialsPage.response.map(
                  (item) =>
                    item.materialName + " (" + item.unitName + ")" || "N/A"
                ),
                series: [
                  {
                    name: "Hiện tại",
                    type: "column",
                    fill: "solid",
                    data: materialsPage.response.map(
                      (item) => item.quantity || 0
                    ),
                  },
                  {
                    name: "Giá trị cảnh báo",
                    type: "column",
                    fill: "solid",
                    data: materialsPage.response.map(
                      (item) => item.minQuantity || 0
                    ),
                  },
                ],
              }}
            />
            <Pagination
              count={materialsPage.totalPages}
              page={pageMaterial}
              onChange={(e, v) => setPageMaterial(v)}
              color="primary"
              sx={{ my: 2, justifyContent: "center", display: "flex" }}
            />
          </>
        ) : (
          <Skeleton variant="rounded" height={300} sx={{ my: 3, mx: 3 }} />
        )}
      </Card>

      <LowStockChart />
    </Box>
  );
};

export default MaterialChart;
