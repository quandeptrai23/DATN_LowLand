import { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import Iconify from "../iconify";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "src/hooks/use-debounce";

export const CustomAutocomplete = ({
  current,
  label,
  labelKey,
  queryFn,
  onInputChange,
  sx,
}) => {
  const [value, setValue] = useState(current || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  
  // Update value when current prop changes
  useEffect(() => {
    setValue(current || "");
  }, [current]);

  // Debounced value to limit API calls
  const queryDebounced = useDebounce(value, 300);

  // Query for fetching options
  const { data: options = [], isLoading: loading } = useQuery({
    queryKey: ["getOptions", { query: queryDebounced }],
    queryFn: () => queryFn({ query: queryDebounced, size: 10 }),
    enabled: !!focused, // Convert to boolean with !!
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (value) => {
    setValue(value);
    onInputChange({
      value: value,
      option: options.find((o) => o[labelKey] === value),
    });
  };

  const handleBlur = () => {
    // Short delay to allow option click to register before dropdown disappears
    setTimeout(() => {
      setFocused(false);
    }, 150);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleDropdownClick = () => {
    // Toggle dropdown visibility
    if (focused) {
      setFocused(false);
    } else {
      setFocused(true);
      // Focus the input to ensure keyboard accessibility
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        value={value}
        name={label}
        label={label}
        autoComplete="off"
        inputRef={inputRef}
        sx={{ minWidth: 150, ...sx }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => handleInputChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box 
                onClick={handleDropdownClick}
                sx={{ cursor: "pointer", padding: "8px", display: "flex" }}
              >
                <Iconify icon={focused ? "fe:drop-up" : "fe:drop-down"} />
              </Box>
            </InputAdornment>
          ),
        }}
      />
      {focused && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            borderRadius: "4px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            zIndex: 1000,
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "250px",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : options.length > 0 ? (
            options.map((option, index) => (
              <Button
                key={index}
                variant="text"
                color="primary"
                sx={{ 
                  width: "100%", 
                  justifyContent: "flex-start", 
                  textAlign: "left",
                  py: 1,
                  px: 2
                }}
                onClick={() => {
                  handleInputChange(option[labelKey] || value);
                  setFocused(false);
                }}
              >
                {option[labelKey]}
              </Button>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              Không tìm thấy kết quả
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};