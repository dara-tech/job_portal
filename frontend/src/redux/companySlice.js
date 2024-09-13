import { createSlice } from "@reduxjs/toolkit";

// Create a slice for managing company-related state
const companySlice = createSlice({
    name: 'company', // Name of the slice
    initialState: {
        singleCompany: null, // Initial state with singleCompany set to null
        companies: [], // Initialize companies as an empty array
        searchCompanyByText: "", // Initialize searchCompanyByText as an empty string
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload; // Update singleCompany with the action payload
        },
        setCompanies: (state, action) => {
            state.companies = action.payload; // Update companies with the action payload
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload; // Update searchCompanyByText with the action payload
        },
    }
});

// Export the action creators and reducer
export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
