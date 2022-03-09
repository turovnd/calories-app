import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';

import { Add as AddIcon, MoreVert as MoreVertIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { AddFriend } from './AddFriend';
import { UserWithAvatar } from '../../common/UserWithAvatar';

import { authActions, authSelectors } from '../../../redux/slices';

const Friends = () => {
  const dispatch = useDispatch();

  const profile = useSelector(authSelectors.selectProfile);

  const [editedFriend, setEditedFriend] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleShowFriendOptions = (event, friend) => setEditedFriend({ target: event.currentTarget, friend });
  const handleCloseFriendOptions = () => setEditedFriend({});

  const handleOpenAddFriend = () => setShowModal(true);
  const handleCloseAddFriend = () => setShowModal(false);

  const handleAddFriend = (data) => {
    dispatch(authActions.addFriend.base(data));
    handleCloseAddFriend();
  };

  const handleDeleteFriend = () => {
    dispatch(authActions.deleteFriend.base(editedFriend.friend));
    handleCloseFriendOptions();
  };

  return (
    <Card>
      <CardHeader
        title="Friends"
        action={
          <IconButton onClick={handleOpenAddFriend}>
            <AddIcon />
          </IconButton>
        }
      />
      <List dense>
        {profile.friends.length === 0 && (
          <ListItem>
            <ListItemText primary="No friends" sx={{ textAlign: 'center' }} />
          </ListItem>
        )}
        {profile.friends.map(friend => (
          <UserWithAvatar
            key={friend._id}
            data={friend}
            ListItemProps={{
              secondaryAction: (
                <IconButton size="small" onClick={event => handleShowFriendOptions(event, friend)}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )
            }}
          />
        ))}
      </List>
      <Menu
        anchorEl={editedFriend.target}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(editedFriend.target)}
        onClose={handleCloseFriendOptions}
      >
        <MenuItem onClick={handleDeleteFriend}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <AddFriend
        open={showModal}
        onClose={handleCloseAddFriend}
        onCreate={handleAddFriend}
      />
    </Card>
  );
};

export { Friends };
