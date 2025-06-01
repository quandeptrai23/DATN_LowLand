import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import productSizeAPI from "src/services/API/productSizeAPI";
import { CustomAutocomplete } from "src/components/input/CustomAutoComplete";
import { toast } from "react-toastify";
import ConfirmDelete from "../../components/dialog/confirm-delete";
import productAPI from "src/services/API/productAPI";
import { useMutation } from "@tanstack/react-query";
import LoadingComp from "src/components/loading/LoadingComp";

const SizeAndPrice = ({ details, setDetails }) => {
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizePrice, setNewSizePrice] = useState("");
  const [newSizeSalePrice, setNewSizeSalePrice] = useState("");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(null);

  const queryFn = productSizeAPI.getSizes;

  const { mutate: deleteDetails, isPending: isDeleting } = useMutation({
    mutationKey: (data) => ["deleteProductDetails", data],
    mutationFn: (data) => {
      return productAPI.deleteDetails(data.productId, data.productDetailsId);
    },
  });

  const handleAdd = () => {
    setDetails((prev) => {
      if (prev.find((sz) => sz.sizeName === newSizeName)) {
        toast.error("Đã có size này");
        return prev;
      }

      if (newSizeName === "" || newSizePrice === "") {
        toast.error("Hãy điền tất các trường");
        return prev;
      }
      return [
        ...prev,
        {
          sizeName: newSizeName,
          price: newSizePrice,
          salePrice: newSizeSalePrice,
        },
      ];
    });
    // Reset form sau khi thêm thành công
    setNewSizeName("");
    setNewSizePrice("");
    setNewSizeSalePrice("");
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(null);
    if (openConfirmDelete && openConfirmDelete.productDetailsId) {
      deleteDetails(openConfirmDelete, {
        onSuccess: () => {
          setDetails((prev) => {
            return prev.filter(
              (item) =>
                item.productDetailsId !== openConfirmDelete.productDetailsId
            );
          });
          toast.success("Xóa size thành công");
        },
      });
    } else {
      setDetails((prev) => {
        return prev.filter(
          (item) => item.sizeName !== openConfirmDelete.sizeName
        );
      });
      toast.success("Xóa size thành công");
    }
  };

  // Hàm để cập nhật size name cho từng item cụ thể
  const handleSizeNameChange = (index, value) => {
    setDetails((prev) => {
      return prev.map((item, i) =>
        i === index ? { ...item, sizeName: value } : item
      );
    });
  };

  return (
    <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Box sx={{ m: 2 }}>
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Sizes:
          </Typography>
          {details?.map((sz, index) => (
            <Grid
              container
              key={index}
              gap={2}
              sx={{
                mb: 6,
              }}
            >
              <Grid item xs={12} md={5} sx={{ width: "100%" }}>
                <CustomAutocomplete
                  current={{ sizeName: sz.sizeName }}
                  label={"Size"}
                  sx={{ width: "100%" }}
                  labelKey={"sizeName"}
                  queryFn={async () => {
                    const allSizes = await queryFn();
                    const selectedSizeNames = details.map((d) => d.sizeName);
                    return allSizes.filter(
                      (s) => !selectedSizeNames.includes(s.sizeName)
                    );
                  }}
                  onInputChange={(val) => {
                    // ✅ Cập nhật size cụ thể thay vì newSizeName
                    handleSizeNameChange(index, val.value);
                  }}
                />
              </Grid>

              <Grid item sm={12} md={5} sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Giá size"
                  value={sz.price || ""}
                  fullWidth
                  type="number"
                  onChange={(e) =>
                    setDetails((prev) => {
                      return prev.map((item, i) =>
                        i === index
                          ? { ...item, price: Number(e.target.value) }
                          : item
                      );
                    })
                  }
                />
                <TextField
                  label="Giảm giá"
                  value={sz.salePrice || ""}
                  type="number"
                  fullWidth
                  onChange={(e) =>
                    setDetails((prev) => {
                      return prev.map((item, i) =>
                        i === index
                          ? { ...item, salePrice: Number(e.target.value) }
                          : item
                      );
                    })
                  }
                />
              </Grid>
              <Grid item sm={12} md={1} sx={{ width: "100%" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "100%", height: "100%" }}
                  onClick={() => setOpenConfirmDelete(sz)}
                >
                  Xóa
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>

        {/* Form thêm mới - tách biệt hoàn toàn */}
        <Grid container gap={2}>
          <Grid item sm={12} md={5} sx={{ width: "100%" }}>
            <CustomAutocomplete
              current={newSizeName ? { sizeName: newSizeName } : null} // ✅ Truyền object hoặc null
              label={"Loại size"}
              sx={{ width: "100%" }}
              labelKey={"sizeName"}
              queryFn={async () => {
                const allSizes = await queryFn();
                const selectedSizeNames = details.map((d) => d.sizeName);
                return allSizes.filter(
                  (s) => !selectedSizeNames.includes(s.sizeName)
                );
              }}
              onInputChange={(val) => {
                // ✅ Chỉ cập nhật state cho form thêm mới
                setNewSizeName(val.value);
              }}
            />
          </Grid>

          <Grid item sm={12} md={5} sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Giá gốc"
              value={newSizePrice}
              type="number"
              onChange={(e) => {
                setNewSizePrice(Number(e.target.value));
              }}
              fullWidth
            />
            <TextField
              label="Giá giảm giá"
              value={newSizeSalePrice}
              type="number"
              onChange={(e) => {
                setNewSizeSalePrice(Number(e.target.value));
              }}
              fullWidth
            />
          </Grid>
          <Grid item sm={12} md={1} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              sx={{ width: "100%", height: "100%" }}
            >
              Thêm
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Confirm delete */}
      <ConfirmDelete
        open={openConfirmDelete ? true : false}
        onClose={() => setOpenConfirmDelete(false)}
        onDelete={handleConfirmDelete}
      />

      {/* Loading component */}
      <LoadingComp isLoading={isDeleting} />
    </Box>
  );
};

export default SizeAndPrice;