import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    clearAllJobs: (state) => {
      state.allJobs = [];
    },
    resetJobState: (state) => {
      state.allJobs = [];
      state.allAdminJobs = [];
      state.singleJob = null;
      state.searchJobByText = "";
      state.allAppliedJobs = [];
      state.searchedQuery = "";
    },
    removeJob: (state, action) => {
      state.allJobs = state.allJobs.filter(job => job.id !== action.payload);
      state.allAdminJobs = state.allAdminJobs.filter(job => job.id !== action.payload);
    }
  }
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  clearAllJobs,
  resetJobState,
  removeJob
} = jobSlice.actions;

export default jobSlice.reducer;
