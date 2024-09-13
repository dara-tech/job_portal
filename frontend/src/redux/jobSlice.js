import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],  // Store fetched jobs
    allAdminJobs: [],  // Store admin jobs if needed
    singleJob: null,  // Store single job details
    searchJobByText: "",  // Text search
    allAppliedJobs: [],  // Store applied jobs
    searchedQuery: "",  // Store the search query
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;  // Set the fetched jobs
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
      state.searchedQuery = action.payload;  // Set the searched query in the state
    },
    clearAllJobs: (state) => {
      state.allJobs = [];  // Clear all jobs
    },
    resetJobState: (state) => {
      state.allJobs = [];
      state.allAdminJobs = [];
      state.singleJob = null;
      state.searchJobByText = "";
      state.allAppliedJobs = [];
      state.searchedQuery = "";
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
  clearAllJobs,  // Added clearAllJobs
  resetJobState  // Added resetJobState
} = jobSlice.actions;

export default jobSlice.reducer;
