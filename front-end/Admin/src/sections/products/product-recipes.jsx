import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { CustomAutocomplete } from "src/components/input/CustomAutoComplete";
import materialAPI from "src/services/API/materialAPI";
import ConfirmDelete from "../../components/dialog/confirm-delete";

const ProductRecipes = ({ recipes, setRecipes }) => {
  const queryFn = materialAPI.getMaterials;

  const [openConfirmDelete, setOpenConfirmDelete] = useState({
    open: false,
    target: null,
  });

  const [newRecipe, setNewRecipe] = useState({
    materialName: "",
    quantity: "",
    unitName: "",
  });

  // Key để force re-render CustomAutocomplete khi cần reset
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  // Hàm lọc materials cho việc edit
  const getFilteredMaterialsForEdit = async (currentMaterial) => {
    try {
      const allMaterials = await queryFn();
      const selectedMaterialNames = recipes
        .filter((r) => r.materialName !== currentMaterial.materialName) // So sánh bằng materialName thay vì productRecipeId
        .map((r) => r.materialName)
        .filter(Boolean); // Loại bỏ các giá trị null/undefined

      const filtered = allMaterials.filter(
        (m) => !selectedMaterialNames.includes(m.materialName)
      );
      
      return filtered;
    } catch (error) {
      return await queryFn(); // Fallback về danh sách đầy đủ nếu có lỗi
    }
  };

  // Hàm lọc materials cho việc thêm mới
  const getFilteredMaterialsForNew = async () => {
    try {
      const allMaterials = await queryFn();
      const selectedMaterialNames = recipes
        .map((r) => r.materialName)
        .filter(Boolean); // Loại bỏ các giá trị null/undefined

      const filtered = allMaterials.filter(
        (m) => !selectedMaterialNames.includes(m.materialName)
      );
      
      return filtered;
    } catch (error) {
      return await queryFn(); // Fallback về danh sách đầy đủ nếu có lỗi
    }
  };

  const handleAdd = () => {
    if (newRecipe.materialName && newRecipe.quantity && newRecipe.unitName) {
      if (
        !recipes?.find((item) => item.materialName === newRecipe.materialName)
      ) {
        setRecipes([...recipes, newRecipe]);
        setNewRecipe({
          materialName: "",
          quantity: "",
          unitName: "",
        });
        // Force re-render CustomAutocomplete để reset state
        setAutocompleteKey(prev => prev + 1);
      } else {
        toast.error("Nguyên liệu đã có");
      }
    } else {
      toast.error("Hãy nhập đủ các trường");
    }
  };

  const handleDelete = (value) => {
    setOpenConfirmDelete({ open: true, target: value });
  };

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(null);
    setRecipes((prev) => {
      return prev.filter(
        (item) => item.materialName !== openConfirmDelete.target
      );
    });
    toast.success("Xóa nguyên liệu thành công");
  };

  return (
    <Box sx={{ overflowY: "auto", overflowX: "hidden", mt: 2 }}>
      <Typography fontWeight={700} sx={{ ml: 2, mb: 1 }}>
        Danh sách nguyên liệu:
      </Typography>
      <Box sx={{ m: 2 }}>
        {recipes?.map((material, index) => (
          <Grid
            container
            key={`${material.materialName}-${index}`} // Sử dụng index để đảm bảo unique key
            gap={2}
            sx={{
              mb: 6,
            }}
          >
            <Grid item xs={12} md={5} sx={{ width: "100%" }}>
              <CustomAutocomplete
                label={"Nguyên liệu"}
                queryFn={() => getFilteredMaterialsForEdit(material)}
                labelKey={"materialName"}
                sx={{ width: "100%" }}
                current={material.materialName}
                onInputChange={(val) => {
                  setRecipes((prev) =>
                    prev.map((item, i) =>
                      i === index // Sử dụng index thay vì productRecipeId
                        ? {
                            ...item,
                            materialName: val.value,
                            unitName: val.option?.unitName || "",
                          }
                        : item
                    )
                  );
                }}
              />
            </Grid>
            <Grid item sm={12} md={5} sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Số lượng"
                value={material.quantity}
                fullWidth
                onChange={(e) => {
                  setRecipes((prev) =>
                    prev.map((item, i) =>
                      i === index // Sử dụng index thay vì productRecipeId
                        ? { ...item, quantity: Number(e.target.value) }
                        : item
                    )
                  );
                }}
                type="number"
              />
              <TextField
                label="Đơn vị"
                disabled
                fullWidth
                type="text"
                value={material.unitName}
              />
            </Grid>
            <Grid item sm={12} md={1} sx={{ width: "100%" }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "100%", height: "100%" }}
                onClick={() => handleDelete(material.materialName)}
              >
                Xóa
              </Button>
            </Grid>
          </Grid>
        ))}

        {/* Form thêm mới */}
        <Grid container gap={2}>
          <Grid item sm={12} md={5} sx={{ width: "100%" }}>
            <CustomAutocomplete
              key={`new-recipe-${autocompleteKey}`} // Key để force re-render
              label={"Nguyên liệu"}
              queryFn={getFilteredMaterialsForNew}
              labelKey={"materialName"}
              sx={{ width: "100%" }}
              current={newRecipe.materialName ? { materialName: newRecipe.materialName } : null} // Đảm bảo truyền đúng format
              onInputChange={(val) => {
                setNewRecipe((prev) => ({
                  ...prev,
                  materialName: val.value || "",
                  unitName: val.option?.unitName || "",
                }));
              }}
            />
          </Grid>
          <Grid item sm={12} md={5} sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Số lượng"
              type="number"
              value={newRecipe.quantity}
              onChange={(e) =>
                setNewRecipe((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              fullWidth
            />
            <TextField
              label="Đơn vị"
              value={newRecipe.unitName}
              disabled
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

      {/* confirm delete */}
      <ConfirmDelete
        open={openConfirmDelete?.open || false}
        onClose={() => setOpenConfirmDelete({ open: false, target: null })}
        onDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default ProductRecipes;