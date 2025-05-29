import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import convert from 'convert-units';
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify/iconify";
import { CustomAutocomplete } from "src/components/input/CustomAutoComplete";
import LoadingComp from "src/components/loading/LoadingComp";
import { useDebounce } from "src/hooks/use-debounce";
import importStockAPI from "src/services/API/importStock";
import materialAPI from "src/services/API/materialAPI";
import { formatPrice } from "src/utils/format-number";

const tryConvertUnits = (quantity, fromUnit, toUnit) => {
  if (!fromUnit || !toUnit || String(fromUnit).toLowerCase() === String(toUnit).toLowerCase()) {
    return { quantity: parseFloat(quantity) || 0, unit: toUnit || fromUnit, success: true, originalQuantity: parseFloat(quantity) || 0, originalUnit: fromUnit };
  }
  try {
    if (isNaN(parseFloat(quantity))) {
        throw new Error("Invalid quantity for conversion.");
    }
    const convertedQuantity = convert(parseFloat(quantity)).from(String(fromUnit).toLowerCase()).to(String(toUnit).toLowerCase());
    return { quantity: convertedQuantity, unit: String(toUnit).toLowerCase(), success: true, originalQuantity: parseFloat(quantity) || 0, originalUnit: fromUnit };
  } catch (error) {
    return { quantity: parseFloat(quantity) || 0, unit: fromUnit, success: false, originalQuantity: parseFloat(quantity) || 0, originalUnit: fromUnit };
  }
};

const getPreferredUnit = (unit1, unit2) => {
    const u1 = String(unit1 || '').toLowerCase();
    const u2 = String(unit2 || '').toLowerCase();

    if (!u1 && u2) return u2;
    if (u1 && !u2) return u1;
    if (u1 === u2) return u1;

    try {
        const desc1 = convert().describe(u1);
        const desc2 = convert().describe(u2);

        if (desc1.measure === desc2.measure) { // Cùng loại đơn vị (khối lượng, thể tích,...)
            // Ưu tiên đơn vị nhỏ hơn hoặc đơn vị đã tồn tại
            const possibilities = convert().possibilities(desc1.measure);
            if (possibilities.includes('ml') && (u1 === 'ml' || u2 === 'ml') && desc1.measure === 'volume') return 'ml';
            if (possibilities.includes('g') && (u1 === 'g' || u2 === 'g') && desc1.measure === 'mass') return 'g';
            return u1; // Mặc định giữ lại đơn vị của item đã có
        }
    } catch (e) {
        // Một trong các đơn vị không hợp lệ với thư viện hoặc khác loại
    }
    return u1; // Trả về đơn vị đầu tiên nếu không chuyển đổi được
};


const Deltails = ({ id, open, onClose, refetch }) => {
  const { data: importDetails } = useQuery({
    queryKey: ["importDetails", id],
    queryFn: () => importStockAPI.getDetails(id),
    enabled: !!id,
  });

  const { mutate: updateImport } = useMutation({
    mutationKey: ["updateImport"],
    mutationFn: ({ id, data }) => importStockAPI.update(id, data),
  });

  const { mutate: createImport } = useMutation({
    mutationKey: ["createImport"],
    mutationFn: (data) => importStockAPI.create(data),
  });

  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    importCode: "",
    supplierName: "",
    importDate: "",
    description: "",
    materialsList: [],
  });

  useEffect(() => {
    if (importDetails) {
      setData(importDetails);
    } else if (!id) { 
      setData({
        importCode: "", 
        supplierName: "",
        importDate: new Date().toISOString(), 
        description: "",
        materialsList: [],
      });
    }
  }, [importDetails, id]);

  const handleClose = () => {
    if (open) {
      setData({ 
        importCode: "",
        supplierName: "",
        importDate: "",
        description: "",
        materialsList: [],
      });
      onClose();
    }
  };

  const handleSave = () => {
    const payload = {
        ...data,
        materialsList: data.materialsList.map(m => ({
            ...m,
            quantity: Number(m.quantity) || 0,
            price: Number(m.price) || 0,
        })),
    };

    if (id) {
      updateImport(
        { id: id, data: payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật phiếu nhập thành công!");
            handleClose();
            refetch();
          },
          onError: (err) => {
            toast.error(`Cập nhật thất bại: ${err.message || "Lỗi không xác định"}`);
          }
        }
      );
    } else {
      createImport(payload, {
        onSuccess: () => {
          toast.success("Tạo phiếu nhập thành công!");
          handleClose();
          refetch();
        },
        onError: (err) => {
            toast.error(`Tạo phiếu nhập thất bại: ${err.message || "Lỗi không xác định"}`);
        }
      });
    }
  };
  
  const handleImportCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (fileInputRef.current) { 
        fileInputRef.current.value = "";
    }

    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Vui lòng chọn file CSV hợp lệ.");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false, 
        complete: (results) => {
          try {
            if (results.data && results.data.length > 0) {
              let updatedCount = 0;
              let addedCount = 0;
              let failedConversionCount = 0;
              let generalInfoApplied = false;

              setData((prevData) => {
                let currentMaterials = [...prevData.materialsList];
                let csvEffectiveSupplierName = prevData.supplierName;
                let csvEffectiveDescription = prevData.description;

                // 1. Trích xuất thông tin chung (Nhà cung cấp, Mô tả) từ CSV
                // Ưu tiên dòng đầu tiên không có materialName nhưng có supplierName hoặc description
                for (const row of results.data) {
                    const currentMaterialName = row.materialName?.trim();
                    const currentSupplierName = row.supplierName?.trim();
                    const currentDescription = row.description?.trim();

                    if (!currentMaterialName && (currentSupplierName || currentDescription)) {
                        if (currentSupplierName) {
                            csvEffectiveSupplierName = currentSupplierName;
                            generalInfoApplied = true;
                        }
                        if (currentDescription) {
                            csvEffectiveDescription = currentDescription;
                            generalInfoApplied = true;
                        }
                        break; 
                    }
                }
                
                const materialsDataFromCSV = results.data.filter(
                  (row) => row.materialName && row.materialName.trim() !== ""
                );

                if (materialsDataFromCSV.length > 0) {
                  materialsDataFromCSV.forEach((csvItem, index) => {
                    const materialNameFromCSV = csvItem.materialName?.trim();
                    if (!materialNameFromCSV) return; 

                    const quantityFromCSV = parseFloat(csvItem.quantity) || 0;
                    const priceFromCSV = parseFloat(csvItem.price) || 0;
                    const unitFromCSV = csvItem.unitName?.trim() || "";
                    
                   
                    const existingMaterialIndex = currentMaterials.findIndex(
                      (m) => m.materialName === materialNameFromCSV
                    );

                    if (existingMaterialIndex !== -1) { 
                      const existingMaterial = currentMaterials[existingMaterialIndex];
                      const targetUnit = getPreferredUnit(existingMaterial.unitName, unitFromCSV) || existingMaterial.unitName || unitFromCSV;

                      if (!targetUnit) {
                        failedConversionCount++;
                        toast.warn(`Không xác định được đơn vị chung cho ${materialNameFromCSV}. Mục này sẽ được thêm mới.`);
                        currentMaterials.push({
                          detailsId: Date.now() + index + Math.random() + "_unit_issue",
                          materialName: materialNameFromCSV,
                          unitName: unitFromCSV,
                          quantity: quantityFromCSV,
                          price: priceFromCSV,
                          isNew: true,
                        });
                        addedCount++;
                        return;
                      }
                      
                      const convExisting = tryConvertUnits(existingMaterial.quantity, existingMaterial.unitName, targetUnit);
                      const convCSV = tryConvertUnits(quantityFromCSV, unitFromCSV, targetUnit);

                      if (convExisting.success && convCSV.success) {
                        existingMaterial.quantity = convExisting.quantity + convCSV.quantity;
                        existingMaterial.unitName = targetUnit; 
                        existingMaterial.price = priceFromCSV; // Cập nhật giá mới từ CSV
                        updatedCount++;
                      } else {
                        failedConversionCount++;
                        toast.warn(`Không thể quy đổi đơn vị cho ${materialNameFromCSV} (từ ${unitFromCSV} sang ${existingMaterial.unitName}). Mục này sẽ được thêm mới.`);
                        // Thêm như một mục mới nếu không quy đổi được
                        currentMaterials.push({
                          detailsId: Date.now() + index + Math.random() + "_conv_fail",
                          materialName: materialNameFromCSV,
                          unitName: unitFromCSV,
                          quantity: quantityFromCSV,
                          price: priceFromCSV,
                          isNew: true,
                        });
                        addedCount++;
                      }
                    } else { // NVL mới
                      currentMaterials.push({
                        detailsId: Date.now() + index + Math.random(),
                        materialName: materialNameFromCSV,
                        unitName: unitFromCSV, 
                        quantity: quantityFromCSV,
                        price: priceFromCSV,
                        isNew: true,
                      });
                      addedCount++;
                    }
                  });
                }
                
                let messages = [];
                if (generalInfoApplied) messages.push("Thông tin chung (NCC/Mô tả) đã được cập nhật.");
                if (addedCount > 0) messages.push(`Thêm mới ${addedCount} NVL.`);
                if (updatedCount > 0) messages.push(`Cập nhật ${updatedCount} NVL.`);
                if (failedConversionCount > 0) messages.push(`${failedConversionCount} NVL gặp sự cố quy đổi đơn vị.`);
                
                if (messages.length === 0 && materialsDataFromCSV.length > 0) {
                    toast.info("Dữ liệu CSV đã được xử lý. Không có mục mới hoặc cập nhật trực tiếp.");
                } else if (messages.length > 0) {
                    toast.success(messages.join(" "));
                } else if (materialsDataFromCSV.length === 0 && !generalInfoApplied) {
                     toast.warning("File CSV trống hoặc không chứa dữ liệu NVL/thông tin chung hợp lệ.");
                }

                return {
                  ...prevData,
                  supplierName: csvEffectiveSupplierName, 
                  description: csvEffectiveDescription, 
                  materialsList: currentMaterials,
                };
              });
            } else {
              toast.error("File CSV trống hoặc không thể phân tích cú pháp.");
            }
          } catch (error) {
            console.error("Lỗi xử lý CSV:", error);
            toast.error("Lỗi xử lý file CSV. Kiểm tra console để biết chi tiết.");
          }
        },
        error: (error) => {
          console.error("Lỗi phân tích CSV:", error);
          toast.error("Lỗi phân tích file CSV.");
        },
      });
    }
  };

  const displayImportDate = data?.importDate
    ? new Date(data.importDate).toLocaleDateString() + " " + new Date(data.importDate).toLocaleTimeString()
    : "Chưa đặt";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      {(!id || importDetails || !data.importCode && id) && data ? ( 
        <>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {id ? "Chi Tiết Phiếu Nhập" : "Tạo Phiếu Nhập Mới"}
            {data?.importCode && (
              <Typography component="span" color={"primary"} sx={{ fontWeight: "600" }}>
                #{data.importCode}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Grid container sx={{ mt: 2 }} spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  value={data.supplierName || ""}
                  onChange={(e) =>
                    setData({ ...data, supplierName: e.target.value })
                  }
                  label="Tên Nhà Cung Cấp"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  value={displayImportDate}
                  disabled
                  label="Ngày Nhập"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={data.description || ""}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  label="Mô Tả"
                  multiline
                  rows={2}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
            
            <Box
              sx={{ mt: 3, mb: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Iconify icon={"mdi:file-upload"} />}
                onClick={handleImportCSV}
              >
                Nhập NVL từ CSV
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                startIcon={<Iconify icon={"mdi:file-download"} />}
                onClick={() => {
                  const csvHeader = "materialName,unitName,quantity,price,supplierName,description";
                  const csvExampleMaterial1 = "Bột mì đa dụng,kg,10,15000,,";
                  const csvExampleMaterial2 = "Đường cát trắng,g,500,800,,";  
                  const csvExampleGeneral = ",,,,Công ty Thực Phẩm XYZ,Hàng nhập tháng 5"; 
                  
                  const BOM = "\uFEFF";
                  const csvContent = `${BOM}${csvHeader}\n${csvExampleMaterial1}\n${csvExampleMaterial2}\n${csvExampleGeneral}\n`;

                  const blob = new Blob([csvContent], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const link = document.createElement("a");
                  const url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", "mau_nhap_nvl.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Tải CSV Mẫu
              </Button>
            </Box>

            {/* Phần Card danh sách materialsList giữ nguyên */}
            <Card
              sx={{ mt: 2, p: 2, maxHeight: 450, overflow: "auto" }}
              variant="outlined"
            >
              {data.materialsList?.length === 0 && (
                <Typography sx={{textAlign: 'center', my:2}}>
                    Chưa có nguyên vật liệu nào. Thêm thủ công hoặc nhập từ CSV.
                </Typography>
              )}
              {data.materialsList?.map((detail, index) => ( 
                <Card
                  sx={{ mt: index === 0 ? 0 : 2, p: 2 }} 
                  variant="outlined"
                  key={detail.detailsId || `material-${index}`} 
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={3}>
                      <CustomAutocomplete
                        label="Tên NVL"
                        labelKey="materialName"
                        queryFn={materialAPI.getMaterials} 
                        current={detail.materialName}
                        onInputChange={(valueObj) => 
                          setData((prev) => ({
                            ...prev,
                            materialsList: prev.materialsList.map((item) => {
                              if (item.detailsId === detail.detailsId) {
                                return {
                                  ...item,
                                  materialName: valueObj.value, 
                                  unitName: valueObj.option?.unitName || item.unitName || "", 
                                  isNew: !Boolean(valueObj.option?.materialId), 
                                };
                              }
                              return item;
                            }),
                          }))
                        }
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Đơn vị"
                        value={detail.unitName || ""}
                        sx={{ width: "100%" }}
                        disabled={!detail.isNew} 
                        onChange={(e) => {
                          if (detail.isNew) { 
                            setData((prev) => ({
                              ...prev,
                              materialsList: prev.materialsList.map((item) => {
                                if (item.detailsId === detail.detailsId) {
                                  return {
                                    ...item,
                                    unitName: e.target.value,
                                  };
                                }
                                return item;
                              }),
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}> 
                      <TextField
                        label="Số lượng"
                        type="number"
                        value={detail.quantity === "" ? "" : Number(detail.quantity)} 
                        inputProps={{ min: 0, step: "any" }} // Cho phép số thập phân
                        onChange={(e) => {
                            const newQuantity = e.target.value;
                            setData((prev) => ({
                                ...prev,
                                materialsList: prev.materialsList.map((item) => {
                                if (item.detailsId === detail.detailsId) {
                                    return {
                                    ...item,
                                    quantity: newQuantity,
                                    };
                                }
                                return item;
                                }),
                            }));
                         }
                        }
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}> 
                      <TextField
                        label="Đơn giá"
                        type="number"
                        value={detail.price === "" ? "" : Number(detail.price)} // Hiển thị số, cho phép trống
                        inputProps={{ min: 0, step: "any" }} // Cho phép số thập phân
                        onChange={(e) => {
                            const newPrice = e.target.value;
                            setData((prev) => ({
                                ...prev,
                                materialsList: prev.materialsList.map((item) => {
                                if (item.detailsId === detail.detailsId) {
                                    return {
                                    ...item,
                                    price: newPrice, 
                                    };
                                }
                                return item;
                                }),
                            }));
                         }
                        }
                        InputProps={{
                          endAdornment: <Typography variant="caption" sx={{mr:1}}>vnđ</Typography>,
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                     <Grid item xs={12} sm={12} md={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                       <Button
                        onClick={() =>
                            setData((prev) => ({
                            ...prev,
                            materialsList: prev.materialsList.filter(
                                (item) => item.detailsId !== detail.detailsId
                            ),
                            }))
                        }
                        color="error"
                        sx={{minWidth: 'auto', p:0.5 }}
                        title="Xóa NVL"
                        >
                        <Iconify icon={"ic:round-delete"} width={24} height={24}/>
                        </Button>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      mt:1,
                      display: "flex",
                      justifyContent: "flex-end", 
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ textAlign: "right", fontWeight:'medium' }}>
                      Thành tiền:{" "}
                      <b>
                        {formatPrice( (parseFloat(detail.quantity) || 0) * (parseFloat(detail.price) || 0) )} vnđ
                      </b>
                    </Typography>
                  </Box>
                </Card>
              ))}

              <Button
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    materialsList: [
                      ...prev.materialsList,
                      {
                        detailsId: Date.now() + Math.random(), 
                        isNew: true, 
                        materialName: "",
                        unitName: "",
                        quantity: 0,
                        price: 0,
                      },
                    ],
                  }))
                }
                variant="outlined"
                startIcon={<Iconify icon={"eva:plus-fill"} />}
                sx={{ mt: 2 }}
              >
                Thêm NVL thủ công
              </Button>
            </Card>
            <Typography
              sx={{
                mt: 2,
                textAlign: "right",
                fontWeight: "600",
                fontSize: "20px",
              }}
              color={"error"}
            >
              Tổng cộng:{" "}
              <b>
                {formatPrice(
                  data.materialsList.reduce(
                    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0),
                    0
                  )
                )}{" "}
                vnđ
              </b>
            </Typography>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                {id ? "Lưu Thay Đổi" : "Tạo Phiếu Nhập"}
              </Button>
            </Box>
          </DialogContent>
        </>
      ) : (
        <LoadingComp isLoading={true} /> 
      )}
    </Dialog>
  );
};

// Component ImportStock giữ nguyên như phiên bản trước của bạn
const ImportStock = () => {
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [selectedImportId, setSelectedImportId] = useState(null); 
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false); 

  const { data: importsPage, isLoading: isLoadingImports, refetch } = useQuery({
    queryKey: ["imports", { query, page, size: 5 }],
    queryFn: () => importStockAPI.getImports({ query, page, size: 5 }),
    placeholderData: (previousData) => previousData, 
  });

  const handleOpenDetails = (id) => {
    setSelectedImportId(id); 
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailDialogOpen(false);
    setSelectedImportId(null); 
  };

  return (
    <Card sx={{ p: 3 }}>
      {isDetailDialogOpen && ( 
            <Deltails
                id={selectedImportId}
                open={isDetailDialogOpen}
                onClose={handleCloseDetails}
                refetch={refetch}
            />
      )}
      <Typography variant="h5" gutterBottom>Quản Lý Phiếu Nhập Kho</Typography>
      <Box
        sx={{
          my: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap", 
        }}
      >
        <Box 
          component="form" 
          onSubmit={(e) => e.preventDefault()} 
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", md: "auto" }, 
            flexGrow: { xs: 0, md: 1}, 
            maxWidth: { md: 500 }, 
          }}
        >
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
            placeholder="Tìm theo mã phiếu, NCC..."
            label="Tìm Phiếu Nhập"
            fullWidth 
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon={"eva:plus-fill"} />}
          sx={{ width: { xs: "100%", md: "auto" } }} 
          onClick={() => handleOpenDetails(null)} 
        >
          Tạo Phiếu Nhập Mới
        </Button>
      </Box>
      <Stack spacing={2.5}> 
        {isLoadingImports && !importsPage ? ( 
          Array.from(new Array(3)).map((_, index) => (
            <Skeleton key={index} sx={{ height: 180 }} variant="rounded" />
          ))
        ) : importsPage?.response?.length > 0 ? (
          importsPage.response.map((importItem) => (
            <Card
              sx={{ p: 2.5, cursor: "pointer", '&:hover': { boxShadow: 3 } }} 
              key={importItem.importStockId}
              variant="outlined"
              onClick={() => handleOpenDetails(importItem.importStockId)}
            >
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6} md={2}>
                    <Typography variant="subtitle2">Mã phiếu:</Typography>
                    <Typography>{importItem.importCode}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2">Ngày nhập:</Typography>
                    <Typography>
                        {new Date(importItem.importDate).toLocaleDateString() +
                        " " +
                        new Date(importItem.importDate).toLocaleTimeString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2">Nhà cung cấp:</Typography>
                    <Typography >{importItem.supplierName || "N/A"}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="subtitle2" color="primary.main">Tổng tiền:</Typography>
                    <Typography fontWeight="bold" color="primary.main">
                        {formatPrice(importItem.totalPrice || 0)} vnđ
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">Mô tả:</Typography>
                    <Typography noWrap>{importItem.description || "Không có mô tả"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Số loại NVL:</Typography>
                    <Typography>{importItem.materialsList?.split(',')?.length || 0} mục</Typography> 
                </Grid>
                 {importItem?.updatedDate && (
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Cập nhật lần cuối:</Typography>
                        <Typography>
                        {new Date(importItem.updatedDate).toLocaleDateString()} bởi {importItem.updatedBy || "Không rõ"}
                        </Typography>
                    </Grid>
                 )}
              </Grid>
            </Card>
          ))
        ) : (
          <Typography sx={{textAlign: 'center', py: 5}}>Không tìm thấy phiếu nhập nào. Thử điều chỉnh tìm kiếm hoặc tạo phiếu mới.</Typography>
        )}
      </Stack>

        {importsPage?.totalPages > 1 && (
            <Pagination
                color="primary"
                count={importsPage.totalPages || 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mt: 4, display: "flex", justifyContent: "center" }} 
            />
        )}
    </Card>
  );
};

export default ImportStock;