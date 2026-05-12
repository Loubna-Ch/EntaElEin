import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type ReportsState = {
  items: any[];
  loading: boolean;
  error: string | null;
};

const initialState: ReportsState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all reports
export const fetchReports = createAsyncThunk<any[], { token?: string } | void>(
  "reports/fetchAll",
  async (payload, thunkApi) => {
    try {
      const token = payload && "token" in payload ? payload.token : undefined;
      const response = await fetch(`${API_URL}/reports`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch reports");
      }
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Failed to fetch reports");
    }
  }
);

export const createReport = createAsyncThunk<any, { reportData: any; token: string }>(
  "reports/create",
  async ({ reportData, token }, thunkApi) => {
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Failed to create report");
      }
      return data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Failed to create report");
    }
  }
);

export const updateReport = createAsyncThunk<any, { reportId: number; reportData: any; token: string }>(
  "reports/update",
  async ({ reportId, reportData, token }, thunkApi) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update report");
      }
      return data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Failed to update report");
    }
  }
);

export const deleteReport = createAsyncThunk<number, { reportId: number; token: string }>(
  "reports/delete",
  async ({ reportId, token }, thunkApi) => {
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete report");
      }
      return reportId; // return id so we can remove it from state
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Failed to delete report");
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    // Clear the stored report error.
    clearReportsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch reports";
      })
      // Create
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add new item to start
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create report";
      })
      // Update
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(r => r.reportid === action.payload.reportid);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update report";
      })
      // Delete
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(r => r.reportid !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete report";
      });
  },
});

export const { clearReportsError } = reportsSlice.actions;
export default reportsSlice.reducer;
