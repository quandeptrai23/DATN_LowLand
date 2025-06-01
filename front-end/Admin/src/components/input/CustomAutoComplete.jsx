import { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "src/hooks/use-debounce";

export const CustomAutocomplete = ({
  current,
  label,
  labelKey,
  queryFn,
  onInputChange,
  sx,
  excludeValues = [],
}) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(current?.[labelKey] || "");
  const [selectedOption, setSelectedOption] = useState(current || null);
  const [open, setOpen] = useState(false);

  const isInitialMount = useRef(true);
  const prevCurrent = useRef(current);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!current) return;
    }

    const currentValue = current?.[labelKey] || "";
    const prevValue = prevCurrent.current?.[labelKey] || "";

    if (currentValue !== prevValue) {
      setSelectedOption(current || null);
      setQuery(currentValue);
    }

    prevCurrent.current = current;
  }, [current, labelKey]);

  // Debounced value to limit API calls
  const queryDebounced = useDebounce(query, 300);

  // Query for fetching options
  const { data: rawOptions = [], isLoading: loading } = useQuery({
    queryKey: ["getOptions", { query: queryDebounced }],
    queryFn: () => queryFn({ query: queryDebounced, size: 10 }),
    enabled: focused,
    refetchOnWindowFocus: false,
  });

  // Lọc bỏ các option đã được chọn/sử dụng
  const options = rawOptions.filter((option) => {
    const optionValue = option[labelKey];
    return !excludeValues.some((excludeVal) => {
      const excludeValue =
        typeof excludeVal === "object" ? excludeVal[labelKey] : excludeVal;
      return optionValue === excludeValue;
    });
  });

  const handleChange = (event, newValue) => {
    if (newValue?.inputValue) {
      const customOption = { [labelKey]: newValue[labelKey] };
      setSelectedOption(customOption);
      setQuery(newValue[labelKey]);
      onInputChange({
        value: newValue[labelKey],
        option: customOption,
      });
    } else {
      setSelectedOption(newValue || null);
      setQuery(newValue?.[labelKey] || "");
      onInputChange({
        value: newValue?.[labelKey] || "",
        option: newValue,
      });
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    onInputChange({
      value: inputValue,
      option: options.find((o) => o[labelKey] === inputValue),
    });
  };

  return (
    <Autocomplete
      value={selectedOption || null}
      open={open && focused}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => {
        return (
          option[labelKey] === value[labelKey] || option[labelKey] === value
        );
      }}
      filterOptions={(options, params) => {
        const filtered = options.filter((option) =>
          option[labelKey]
            ?.toLowerCase()
            .includes(params.inputValue.toLowerCase())
        );

        if (
          params.inputValue !== "" &&
          !filtered.some((opt) => opt[labelKey] === params.inputValue)
        ) {
          filtered.push({
            [labelKey]: params.inputValue,
            inputValue: `Thêm "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      clearOnBlur
      options={options || []}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option[labelKey] || "";
      }}
      loading={loading}
      sx={{ minWidth: 150, ...sx }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          autoComplete="off"
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setOpen(false), 150);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          onChange={handleInputChange}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li
            key={key}
            {...optionProps}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "8px 12px",
              margin: "2px 0",
            }}
          >
            {option.inputValue ? option.inputValue : option[labelKey]}
          </li>
        );
      }}
    />
  );
};
