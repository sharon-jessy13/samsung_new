import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Chip
} from "@mui/material";

export default function ApproveState({ instanceId }) {
  const [loading, setLoading] = useState(true);
  const [letterData, setLetterData] = useState(null);

  // ✅ Fetch data for given instanceId
  useEffect(() => {
    if (!instanceId) return;

    const fetchLetterData = async () => {
      try {
        const res = await fetch(
          `http://your-api.com/api/HRLetter/GetByInstanceId/${instanceId}`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setLetterData(data);
      } catch (error) {
        console.error("❌ Error fetching letter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetterData();
  }, [instanceId]);

  // ✅ Approve / Reject / Restart API calls
  const handleAction = async (status) => {
    try {
      const res = await fetch(
        `http://your-api.com/api/HRLetter/UpdateStatus/${instanceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      alert(`✅ Request ${status} successfully!`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!letterData) return <Typography>No data found</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom>
        HR Letter Request - Approval
      </Typography>
      <Chip label={`Status: ${letterData.status}`} color="info" sx={{ mb: 2 }} />

      {/* Employee Info */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Employee Name</Typography>
          <Typography>{letterData.employeeName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Manager</Typography>
          <Typography>{letterData.managerName}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2">Permanent Address</Typography>
          <Typography>{letterData.permanentAddress}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Current Address</Typography>
          <Typography>{letterData.currentAddress}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle2">Letter Type</Typography>
          <Typography>{letterData.letterType}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Reason</Typography>
          <Typography>{letterData.reason}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2">Comment</Typography>
          <Typography>{letterData.comment}</Typography>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleAction("Restart")}
          sx={{ mr: 1 }}
        >
          Restart
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleAction("Reject")}
          sx={{ mr: 1 }}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAction("Approve")}
        >
          Approve
        </Button>
      </Box>
    </Paper>
  );
}
