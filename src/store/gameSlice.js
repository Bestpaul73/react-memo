import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    level: null,
    difficultyMode: false,
  },
  reducers: {
    setLevel(state, action) {
      state.level = action.payload;
    },
    setDifficultyModeReducer(state, action) {
      state.difficultyMode = action.payload;
    },
    toggleDifficultyModeReducer(state) {
      state.difficultyMode = !state.difficultyMode;
    },
  },
});

export const { setLevel, setDifficultyModeReducer, toggleDifficultyModeReducer } = gameSlice.actions;
export default gameSlice.reducer;
