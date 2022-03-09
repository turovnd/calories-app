import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

const UserWithAvatar = ({ data: { name, email }, ListItemProps }) => (
  <ListItem {...ListItemProps}>
    <ListItemAvatar>
      <Avatar alt={name} src="/static/images/avatar/1.jpg" />
    </ListItemAvatar>
    <ListItemText
      primary={name}
      secondary={email}
    />
  </ListItem>
);

UserWithAvatar.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  ListItemProps: PropTypes.object
};

UserWithAvatar.defaultProps = {
  ListItemProps: {}
};

export { UserWithAvatar };
