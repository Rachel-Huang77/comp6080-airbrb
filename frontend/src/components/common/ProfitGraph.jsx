import { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * ProfitGraph Component
 * Feature 2.6.2 - Display profits from all listings for past 30 days
 * X-axis: Days ago (0-30)
 * Y-axis: Profit ($) made on that day
 */
const ProfitGraph = ({ bookings = [] }) => {
  // Calculate profit data for the past 30 days
  const profitData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Initialize data for past 30 days
    const data = [];
    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      data.push({
        daysAgo,
        date: date.toISOString().split('T')[0],
        profit: 0,
      });
    }

    // Calculate profit for each day
    bookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        const bookingStart = new Date(booking.dateRange.start);
        const bookingEnd = new Date(booking.dateRange.end);
        bookingStart.setHours(0, 0, 0, 0);
        bookingEnd.setHours(0, 0, 0, 0);

        // Calculate daily rate for this booking
        const nights = Math.ceil((bookingEnd - bookingStart) / (1000 * 60 * 60 * 24));
        const dailyRate = nights > 0 ? booking.totalPrice / nights : 0;

        // Add profit to each day the booking covers (within past 30 days)
        data.forEach((dayData) => {
          const dayDate = new Date(dayData.date);
          dayDate.setHours(0, 0, 0, 0);

          // Check if this day falls within the booking range
          if (dayDate >= bookingStart && dayDate < bookingEnd) {
            dayData.profit += dailyRate;
          }
        });
      }
    });

    // Round profits to 2 decimal places
    data.forEach((d) => {
      d.profit = Math.round(d.profit * 100) / 100;
    });

    return data;
  }, [bookings]);

  // Calculate total profit for display
  const totalProfit = profitData.reduce((sum, day) => sum + day.profit, 0);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Profit Analytics - Last 30 Days
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Profit: ${totalProfit.toFixed(2)}
      </Typography>

      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={profitData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="daysAgo"
              label={{ value: 'Days Ago', position: 'insideBottom', offset: -5 }}
              reversed
            />
            <YAxis
              label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => [`$${value.toFixed(2)}`, 'Profit']}
              labelFormatter={(daysAgo) => {
                const dataPoint = profitData.find((d) => d.daysAgo === daysAgo);
                return dataPoint ? `${daysAgo} days ago (${dataPoint.date})` : `${daysAgo} days ago`;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Daily Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProfitGraph;
