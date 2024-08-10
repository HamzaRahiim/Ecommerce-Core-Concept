// features/searchSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SingleBlog } from "@/lib/data"; // Import your data fetching function
import { searchType } from "@/app/types";

interface SearchState {
  results: searchType[]; // Adjust the type based on your SingleBlog response
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (searchTerm: string) => {
    const response = await SingleBlog(searchTerm);
    return response;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});
// export const { reducer, actions } = searchSlice;

export default searchSlice.reducer;
