import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import * as api from '../../../redux/api';

const UserSelection = ({ initialValue, error, helperText, onChange }) => {
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
      const { rows } = await api.loadUsers({ name: search, limit: 100 });
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

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(e, newValue) => onChange(newValue)}
      isOptionEqualToValue={(opt, v) => opt._id === v._id}
      getOptionLabel={opt => `${opt.name} (${opt.email})`}
      filterOptions={opt => opt}
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
          variant="standard"
          label="User"
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

UserSelection.propTypes = {
  initialValue: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string
    }),
    null
  ]).isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

UserSelection.defaultProps = {
  error: undefined,
  helperText: undefined
};

export { UserSelection };
