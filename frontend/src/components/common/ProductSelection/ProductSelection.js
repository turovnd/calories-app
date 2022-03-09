import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, createFilterOptions, CircularProgress, TextField } from '@mui/material';

import * as api from '../../../redux/api';
import { PRODUCT_NEW_ID } from '../../../constants';


const filter = createFilterOptions();

const ProductSelection = ({ initialValue, error, helperText, onChange }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);

    (async () => {
      const { rows } = await api.loadProducts({ name: search, limit: 100 });
      setOptions(rows);
      setLoading(false);
    })();
  }, [open, search]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e, newValue) => {
    if (typeof newValue === 'string') {
      onChange({ _id: PRODUCT_NEW_ID, name: newValue });
    } else if (newValue && newValue.inputValue) {
      onChange({ _id: PRODUCT_NEW_ID, name: newValue.inputValue });
    } else {
      onChange(newValue);
    }
  };

  const handleFilterOptions = (opts, params) => {
    const filtered = filter(opts, params);
    const { inputValue } = params;
    const isExisting = opts.some(option => inputValue === option.name);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        name: `Add "${inputValue}"`,
      });
    }

    return filtered;
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      selectOnFocus
      clearOnBlur
      isOptionEqualToValue={(opt, v) => opt._id === v._id}
      getOptionLabel={opt => opt.name}
      filterOptions={handleFilterOptions}
      options={options}
      loading={loading}
      value={value}
      renderInput={params => (
        <TextField
          {...params}
          required
          error={error}
          helperText={helperText}
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          margin="normal"
          label="Product"
          variant="standard"
          placeholder="Type for search"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

ProductSelection.propTypes = {
  initialValue: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string
    }),
    null
  ]).isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ProductSelection.defaultProps = {
  error: undefined,
  helperText: undefined,
};

export { ProductSelection };
