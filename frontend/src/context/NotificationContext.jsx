import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { getAllBookings } from '../services/bookingsService';
import { getAllListings } from '../services/listingsService';

export const NotificationContext = createContext();

/**
 * NotificationProvider Component
 * Feature 2.6.4 - Live Notifications with Polling
 * Polls for booking requests and status changes every 30 seconds
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const lastCheckedBookingsRef = useRef(new Map());
  const [userEmail, setUserEmail] = useState(null);
  const [userListingIds, setUserListingIds] = useState([]);

  // Initialize user email and listing IDs
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      setUserEmail(email);

      // Fetch user's listings
      getAllListings()
        .then((listings) => {
          const myListingIds = listings
            .filter((l) => l.owner === email)
            .map((l) => l.id);
          setUserListingIds(myListingIds);
        })
        .catch((error) => {
          console.error('Failed to fetch user listings for notifications:', error);
        });
    }
  }, []);

  // Poll for new notifications
  const checkForNotifications = useCallback(async () => {
    if (!userEmail) return;

    try {
      const bookings = await getAllBookings();
      const newNotifications = [];

      bookings.forEach((booking) => {
        const isMyListing = userListingIds.includes(booking.listingId);
        const isMyBooking = booking.owner === userEmail;
        const lastStatus = lastCheckedBookingsRef.current.get(booking.id);

        // Host notification: New booking request
        if (isMyListing && booking.status === 'pending' && !lastStatus) {
          newNotifications.push({
            id: `${booking.id}-new`,
            type: 'booking_request',
            message: `New booking request for listing ${booking.listingId}`,
            bookingId: booking.id,
            dateRange: booking.dateRange,
            timestamp: Date.now(),
            read: false,
          });
        }

        // Guest notification: Booking accepted
        if (isMyBooking && booking.status === 'accepted' && lastStatus === 'pending') {
          newNotifications.push({
            id: `${booking.id}-accepted`,
            type: 'booking_accepted',
            message: `Your booking request has been accepted!`,
            bookingId: booking.id,
            dateRange: booking.dateRange,
            timestamp: Date.now(),
            read: false,
          });
        }

        // Guest notification: Booking declined
        if (isMyBooking && booking.status === 'declined' && lastStatus === 'pending') {
          newNotifications.push({
            id: `${booking.id}-declined`,
            type: 'booking_declined',
            message: `Your booking request has been declined`,
            bookingId: booking.id,
            dateRange: booking.dateRange,
            timestamp: Date.now(),
            read: false,
          });
        }
      });

      // Update last checked bookings using ref (no re-render)
      const newLastChecked = new Map();
      bookings.forEach((booking) => {
        newLastChecked.set(booking.id, booking.status);
      });
      lastCheckedBookingsRef.current = newLastChecked;

      // Add new notifications
      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev]);
      }
    } catch (error) {
      console.error('Failed to check for notifications:', error);
    }
  }, [userEmail, userListingIds]);

  // Set up polling (every 30 seconds)
  useEffect(() => {
    if (!userEmail) return;

    // Initial check
    checkForNotifications();

    // Set up interval
    const intervalId = setInterval(() => {
      checkForNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [userEmail, checkForNotifications]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
