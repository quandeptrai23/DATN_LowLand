import convert from "convert-units";

export const tryConvertUnits = (quantity, fromUnit, toUnit) => {
  if (
    !fromUnit ||
    !toUnit ||
    String(fromUnit).toLowerCase() === String(toUnit).toLowerCase()
  ) {
    return {
      quantity: parseFloat(quantity) || 0,
      unit: toUnit || fromUnit,
      success: true,
      originalQuantity: parseFloat(quantity) || 0,
      originalUnit: fromUnit,
    };
  }
  try {
    if (isNaN(parseFloat(quantity))) {
      throw new Error("Số lượng chuyển đổi không hợp lệ.");
    }
    const convertedQuantity = convert(parseFloat(quantity))
      .from(String(fromUnit).toLowerCase())
      .to(String(toUnit).toLowerCase());
    return {
      quantity: convertedQuantity,
      unit: String(toUnit).toLowerCase(),
      success: true,
      originalQuantity: parseFloat(quantity) || 0,
      originalUnit: fromUnit,
    };
  } catch (error) {
    return {
      quantity: parseFloat(quantity) || 0,
      unit: fromUnit,
      success: false,
      originalQuantity: parseFloat(quantity) || 0,
      originalUnit: fromUnit,
    };
  }
};

export const getPreferredUnit = (unit1, unit2) => {
  const u1 = String(unit1 || "").toLowerCase();
  const u2 = String(unit2 || "").toLowerCase();

  if (!u1 && u2) return u2;
  if (u1 && !u2) return u1;
  if (u1 === u2) return u1;

  try {
    const desc1 = convert().describe(u1);
    const desc2 = convert().describe(u2);

    if (desc1.measure === desc2.measure) {
      const possibilities = convert().possibilities(desc1.measure);

      if (possibilities.includes("ml") && desc1.measure === "volume") {
        if (u1 === "ml") return u1;
        if (u2 === "ml") return u2;
        return convert(1).from(u1).to("ml") > convert(1).from(u2).to("ml")
          ? u2
          : u1;
      }

      if (possibilities.includes("g") && desc1.measure === "mass") {
        if (u1 === "g") return u1;
        if (u2 === "g") return u2;
        return convert(1).from(u1).to("g") > convert(1).from(u2).to("g")
          ? u2
          : u1;
      }

      try {
        const baseUnit = possibilities[0];
        const value1 = convert(1).from(u1).to(baseUnit);
        const value2 = convert(1).from(u2).to(baseUnit);
        return value1 > value2 ? u1 : u2;
      } catch (e) {
        return u1;
      }
    }
  } catch (e) {
    // Handle conversion error
  }
  return u1;
};
