/**
 * Kiểm tra xem ngày có phải là hôm nay không
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Kiểm tra tính hợp lệ của material item
 */
export const validateMaterialItem = (material) => {
  const errors = [];

  if (!material.materialName || material.materialName.trim() === "") {
    errors.push("Tên nguyên vật liệu không được để trống");
  }

  if (!material.unitName || material.unitName.trim() === "") {
    errors.push("Đơn vị không được để trống");
  }

  if (!material.quantity || parseFloat(material.quantity) <= 0) {
    errors.push("Số lượng phải lớn hơn 0");
  }

  if (!material.price || parseFloat(material.price) <= 0) {
    errors.push("Đơn giá phải lớn hơn 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Kiểm tra tính hợp lệ của toàn bộ danh sách materials
 */
export const validateMaterialsList = (materialsList) => {
  const allErrors = [];

  if (!materialsList || materialsList.length === 0) {
    return {
      isValid: false,
      errors: ["Danh sách nguyên vật liệu không được để trống"],
    };
  }

  materialsList.forEach((material, index) => {
    const validation = validateMaterialItem(material);
    if (!validation.isValid) {
      allErrors.push(`Mục ${index + 1}: ${validation.errors.join(", ")}`);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

/**
 * Kiểm tra quyền chỉnh sửa phiếu nhập (chỉ được sửa trong ngày)
 */
export const canEditImport = (importDate) => {
  return isToday(importDate);
};
