import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

/**
 * NotificationPanel Component
 * Feature 2.6.4 - Display live notifications in dropdown
 */
const NotificationPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
    case 'booking_request':
      return <BookmarkBorderIcon fontSize="small" color="primary" />;
    case 'booking_accepted':
      return <CheckCircleIcon fontSize="small" color="success" />;
    case 'booking_declined':
      return <CancelIcon fontSize="small" color="error" />;
    default:
      return <NotificationsIcon fontSize="small" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`${unreadCount} unread notifications`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 360,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Box>
              <Button size="small" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button size="small" onClick={clearAll} color="error">
                Clear
              </Button>
            </Box>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                alignItems: 'flex-start',
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={
                  <>
                    {notification.dateRange && (
                      <Typography variant="caption" display="block">
                        {notification.dateRange.start} to {notification.dateRange.end}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(notification.timestamp)}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: notification.read ? 'normal' : 'bold',
                }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationPanel;
