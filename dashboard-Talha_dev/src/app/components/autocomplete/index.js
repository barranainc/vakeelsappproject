import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import React from 'react'
import { Controller } from 'react-hook-form';
import Colors from '../../assets/styles';

function AutoCompleteField({ name, control, rules, data, }) {
  return (
    <Controller
      // name="expert_in"
      name={name}
      control={control}
      // rules={{ required: "Expert In is required" }}
      rules={rules}
      render={({ field, fieldState }) => {
        const filteredOptions = data?.filter(
          (option) => !field?.value?.some((selected) => selected.id === option.id)
        );
        return (
          <Autocomplete
            multiple
            id="tags-outlined"
            disableCloseOnSelect
            filterSelectedOptions
            options={filteredOptions}
            value={field.value || []}
            getOptionLabel={(option) => option?.title}
            onChange={(event, value) => field.onChange(value)}
            getOptionSelected={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "Open Sans",
                    backgroundColor: "#282A2F",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    "& fieldset": {
                      border: `1px solid ${Colors.white + "33"}`,
                    },
                    "&:hover fieldset": {
                      border: `1px solid ${Colors.white + "33"}`,
                    },
                    "&.Mui-focused fieldset": {
                      border: `1px solid ${Colors.white + "33"}`,
                    },
                    "& .MuiChip-root": {
                      m: 0,
                      background: Colors.densedAccent,
                      color: Colors.white,
                      "& .MuiSvgIcon-root": {
                        "path": {
                          color: Colors.accent
                        }
                      }
                    }
                  },
                  "& .MuiInputBase-input": {
                    color: "#FFFFFF",
                  },
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
            slotProps={{
              paper: {
                sx: {
                  background: Colors.lightGray,
                  px: 1,
                }
              },
              popper: {
                sx: {
                  "& .MuiAutocomplete-option": {
                    p: 1.5,
                    borderRadius: "4px",
                    color: Colors.white,
                    ":hover": {
                      backgroundColor: Colors.densedAccent,
                      color: Colors.white
                    },
                  },
                }
              }
            }}
            renderTags={(selected, getTagProps) => {
              const chipsToShow = selected.length > 2 ? selected.slice(0, 2) : selected;
              const extraCount = selected.length - 2;

              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {chipsToShow.map((option, index) => (
                    <Chip
                      key={option.id}
                      label={option.title}
                      {...getTagProps({ index })}
                    />
                  ))}
                  {selected.length > 2 && (
                    <Chip
                      label={`+${extraCount}`}
                    />
                  )}
                </Box>
              );
            }}
          />
        )
      }}
    />
  )
}

export default AutoCompleteField;
