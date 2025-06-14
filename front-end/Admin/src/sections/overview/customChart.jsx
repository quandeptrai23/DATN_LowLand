import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart, { useChart } from "src/components/chart";
import { CustomAutocomplete } from "src/components/input/CustomAutoComplete";
import LoadingComp from "src/components/loading/LoadingComp";
import materialAPI from "src/services/API/materialAPI";
import unitAPI from "src/services/API/unitAPI";

const MaterialDialog = ({
  open,
  onClose,
  clickedOption,
  setClickedOption,
  refetch,
}) => {
  const [data, setData] = useState({
    materialId: "",
    materialName: "",
    unitName: "",
    quantity: "",
    minQuantity: "",
  });
  const { data: material } = useQuery({
    queryKey: ["getMaterial"],

    queryFn: () =>
      materialAPI.getMaterials({
        query: clickedOption.trim(),
      }),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationKey: ({ id, data }) => ["updateMaterial", data],
    mutationFn: ({ id, data }) => materialAPI.update(id, data),
  });

  const { mutate: deleteMaterial, isPending: isDeleteing } = useMutation({
    mutationKey: ({ id }) => ["deleteMaterial"],
    mutationFn: ({ id }) => materialAPI.delete(id),
  });

  useEffect(() => {
    if (material) {
      setData(material[0]);
    }
  }, [material]);

  const handleClose = () => {
    setData({
      materialId: "",
      materialName: "",
      unitName: "",
      quantity: "",
      minQuantity: "",
    });
    setClickedOption(null);
    onClose();
  };

  const handleSave = () => {
    update(
      { id: data.materialId, data },
      {
        onSuccess: () => {
          handleClose();
          toast.success("Cập nhật nguyên liệu thành công");
          refetch();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!data.materialId) {
      toast.error("Không tìm thấy ID nguyên liệu");
      return;
    }
    deleteMaterial(
      { id: data.materialId },
      {
        onSuccess: (response) => {
          handleClose();
          toast.success("Xóa nguyên liệu thành công");
          refetch();
        },
        onError: (error) => {
          console.error("Delete error:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <LoadingComp isLoading={isUpdating || isDeleteing} />
      <DialogTitle>Chi tiết nguyên liệu</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3, minHeight: 200 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên nguyên liệu"
                value={data.materialName}
                onChange={(e) =>
                  setData({ ...data, materialName: e.target.value })
                }
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                label="Đơn vị"
                current={material?.[0]?.unitName}
                onInputChange={({ value }) =>
                  setData({ ...data, unitName: value })
                }
                labelKey={"unitName"}
                queryFn={unitAPI.getUnits}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số lượng"
                value={data.quantity}
                type="number"
                disabled
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số lượng min"
                value={data.minQuantity}
                onChange={(e) =>
                  setData({ ...data, minQuantity: e.target.value })
                }
                sx={{ width: "100%" }}
                type="number"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete}>Xóa</Button>
        {/* <Button onClick={handleClose}>Đóng</Button> */}
        <Button onClick={handleSave} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MaterialColumnChart = ({ title, subheader, chart, refetch }) => {
  const { labels, colors, series, options } = chart;
  const [open, setOpen] = useState(false);

  const { chartOptions, clickedOption, setClickedOption } = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    events: {
      dataPointSelection: (
        event,
        chartContext,
        { seriesIndex, dataPointIndex, w }
      ) => {
        const selectedValue = w.config.series[seriesIndex].data[dataPointIndex];
        console.log("Selected Value:", selectedValue);
      },
    },
    xaxis: {
      type: "text",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== "undefined") {
            return `${value.toLocaleString()}`;
          }
          return value;
        },
      },
    },
  });

  useEffect(() => {
    if (clickedOption) {
      setOpen(true);
    }
  }, [clickedOption]);

  return (
    <>
      {clickedOption && (
        <MaterialDialog
          open={open}
          onClose={() => setOpen(false)}
          clickedOption={clickedOption}
          setClickedOption={setClickedOption}
          refetch={refetch}
        />
      )}
      <Chart
        dir="ltr"
        type="line"
        series={series}
        options={chartOptions}
        width="100%"
        height={364}
      />
    </>
  );
};

export default MaterialColumnChart;
