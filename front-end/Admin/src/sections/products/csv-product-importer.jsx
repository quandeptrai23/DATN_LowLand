import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify";
import * as XLSX from "xlsx";

const CSVProductImporter = ({ onImportComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageMap, setImageMap] = useState({});

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let parsedData;
      let imageColumns = [];

      // Handle different file types
      if (file.name.endsWith(".csv")) {
        // Parse CSV
        const text = await file.text();
        parsedData = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
      } else if (file.name.match(/\.xlsx?$/)) {
        // Parse Excel
        const data = await readExcelFile(file);
        parsedData = data;
      } else {
        toast.error("Unsupported file format. Please use CSV or Excel files.");
        setIsUploading(false);
        return;
      }

      // Process all columns to find image columns
      if (parsedData.length > 0) {
        const headers = Object.keys(parsedData[0]);
        imageColumns = headers.filter(
          (header) =>
            header.toLowerCase().includes("image") ||
            header.toLowerCase().includes("photo") ||
            header.toLowerCase().includes("img")
        );

        // Process images from the identified columns
        const newImageMap = {};

        for (const row of parsedData) {
          for (const imageCol of imageColumns) {
            const imageUrl = row[imageCol];
            if (
              imageUrl &&
              typeof imageUrl === "string" &&
              (imageUrl.startsWith("http") || imageUrl.startsWith("data:image"))
            ) {
              // Using product name or some unique identifier as key
              const key =
                row.productName || row.sku || `row_${parsedData.indexOf(row)}`;
              if (!newImageMap[key]) {
                newImageMap[key] = [];
              }
              newImageMap[key].push(imageUrl);
            }
          }
        }

        setImageMap(newImageMap);
      }

      setPreviewData(parsedData);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file: " + error.message);
    }

    setIsUploading(false);
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleImport = () => {
    if (!previewData) return;

    // Transform data for your application
    const transformedData = previewData.map((row) => {
      const productName = row.productName || row.name || "";
      const key = productName || row.sku || `row_${previewData.indexOf(row)}`;

      // Basic product data
      const productData = {
        productName: productName,
        description: row.description || "",
        isActive: row.isActive !== undefined ? row.isActive : true,
        type: { typeName: row.typeName || row.type || "" },
      };

      // Extract size and price data
      const details = [];
      if (row.size && (row.price || row.salePrice)) {
        details.push({
          sizeName: row.size,
          price: parseFloat(row.price) || 0,
          salePrice: parseFloat(row.salePrice) || null,
        });
      }

      // Extract material data if available
      const recipes = [];
      if (row.materialName && row.quantity && row.unitName) {
        recipes.push({
          materialName: row.materialName,
          quantity: parseFloat(row.quantity) || 0,
          unitName: row.unitName,
        });
      }

      // Get images from our imageMap
      const imageUrls = imageMap[key] || [];

      return {
        productData,
        details,
        recipes,
        imageUrls,
      };
    });

    // Close the preview and pass the data back
    setPreviewOpen(false);
    onImportComplete(transformedData);
    toast.success("CSV data processed successfully!");
  };

  // Function to fetch and convert an image URL to a File object
  const imageUrlToFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error converting image URL to File:", error);
      return null;
    }
  };

  const renderPreviewTable = () => {
    if (!previewData || previewData.length === 0) return null;

    const headers = Object.keys(previewData[0]);
    return (
      <Box sx={{ overflowX: "auto", maxHeight: "400px" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    background: "#f2f2f2",
                  }}
                >
                  {header}
                </th>
              ))}
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  background: "#f2f2f2",
                }}
              >
                Images
              </th>
            </tr>
          </thead>
          <tbody>
            {previewData.slice(0, 5).map((row, rowIndex) => {
              const key = row.productName || row.sku || `row_${rowIndex}`;
              const images = imageMap[key] || [];

              return (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      style={{ border: "1px solid #ddd", padding: "8px" }}
                    >
                      {String(row[header] || "")}
                    </td>
                  ))}
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {images.slice(0, 3).map((url, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={url}
                          alt={`Preview ${imgIndex}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/50/50";
                          }}
                        />
                      ))}
                      {images.length > 3 && (
                        <Box
                          sx={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f0f0f0",
                          }}
                        >
                          +{images.length - 3}
                        </Box>
                      )}
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {previewData.length > 5 && (
          <Typography sx={{ mt: 2, fontStyle: "italic" }}>
            Showing 5 of {previewData.length} rows
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          id="csvUpload"
          accept=".csv,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:file-upload-outline" />}
          onClick={() => document.getElementById("csvUpload").click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            "Import Products from CSV/Excel"
          )}
        </Button>
      </Box>

      <Dialog open={previewOpen} maxWidth="lg" fullWidth>
        <DialogTitle>Preview Import Data</DialogTitle>
        <DialogContent>
          {previewData && previewData.length > 0 ? (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Preview of the first 5 rows. Total rows: {previewData.length}
              </Alert>
              {renderPreviewTable()}
            </>
          ) : (
            <Typography>No data to preview</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={!previewData || previewData.length === 0}
          >
            Import Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CSVProductImporter;
