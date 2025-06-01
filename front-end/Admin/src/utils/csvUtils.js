import Papa from "papaparse";
import { toast } from "react-toastify";
import { tryConvertUnits, getPreferredUnit } from "./unitConversion";

/**
 * Tạo file CSV mẫu và tải xuống
 */
export const downloadSampleCSV = () => {
  const csvHeader =
    "materialName,unitName,quantity,price,supplierName,description";
  const csvExampleMaterial1 = "Sữa bò,g,10,15000,,";
  const csvExampleMaterial2 = "Đường cát trắng,g,500,800,,";
  const csvExampleGeneral = ",,,,Công ty Thực Phẩm Siêu sạch,Hàng nhập tháng 5";

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
};

/**
 * Xử lý import CSV và cập nhật dữ liệu
 */
export const processCSVFile = (file, currentData, onSuccess) => {
  if (!file) return;

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
          const processedData = processCSVData(results.data, currentData);
          onSuccess(processedData.updatedData, processedData.messages);
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
};

/**
 * Xử lý dữ liệu CSV và merge với dữ liệu hiện tại
 */
const processCSVData = (csvData, currentData) => {
  let updatedCount = 0;
  let addedCount = 0;
  let failedConversionCount = 0;
  let generalInfoApplied = false;

  let currentMaterials = [...currentData.materialsList];
  let csvEffectiveSupplierName = currentData.supplierName;
  let csvEffectiveDescription = currentData.description;

  // Xử lý thông tin chung từ CSV
  for (const row of csvData) {
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

  // Xử lý materials từ CSV
  const materialsDataFromCSV = csvData.filter(
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
        // Cập nhật material đã tồn tại
        const existingMaterial = currentMaterials[existingMaterialIndex];
        const targetUnit =
          getPreferredUnit(existingMaterial.unitName, unitFromCSV) ||
          existingMaterial.unitName ||
          unitFromCSV;

        if (!targetUnit) {
          failedConversionCount++;
          toast.warn(
            `Không xác định được đơn vị chung cho ${materialNameFromCSV}. Mục này sẽ được thêm mới.`
          );
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

        const convExisting = tryConvertUnits(
          existingMaterial.quantity,
          existingMaterial.unitName,
          targetUnit
        );
        const convCSV = tryConvertUnits(
          quantityFromCSV,
          unitFromCSV,
          targetUnit
        );

        if (convExisting.success && convCSV.success) {
          existingMaterial.quantity = convExisting.quantity + convCSV.quantity;
          existingMaterial.unitName = targetUnit;
          existingMaterial.price = priceFromCSV;
          updatedCount++;
        } else {
          failedConversionCount++;
          toast.warn(
            `Không thể quy đổi đơn vị cho ${materialNameFromCSV} (từ ${unitFromCSV} sang ${existingMaterial.unitName}). Mục này sẽ được thêm mới.`
          );
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
      } else {
        // Thêm material mới
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

  // Tạo thông báo
  let messages = [];
  if (generalInfoApplied) {
    messages.push("Thông tin chung (NCC/Mô tả) đã được cập nhật.");
  }
  if (addedCount > 0) {
    messages.push(`Thêm mới ${addedCount} NVL.`);
  }
  if (updatedCount > 0) {
    messages.push(`Cập nhật ${updatedCount} NVL.`);
  }
  if (failedConversionCount > 0) {
    messages.push(`${failedConversionCount} NVL gặp sự cố quy đổi đơn vị.`);
  }

  const updatedData = {
    ...currentData,
    supplierName: csvEffectiveSupplierName,
    description: csvEffectiveDescription,
    materialsList: currentMaterials,
  };

  return { updatedData, messages };
};
