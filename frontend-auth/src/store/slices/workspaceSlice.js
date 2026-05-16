import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTeam: { id: 'mock-1', name: 'Engineering Alpha' },
  teams: [
    { id: 'mock-1', name: 'Engineering Alpha' },
    { id: 'mock-2', name: 'Design Systems' },
    { id: 'mock-3', name: 'Product Strategy' },
    { id: 'mock-4', name: 'Marketing Hub' }
  ],
  activeProject: null,
  projects: [],
  isLoading: false,
  error: null
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
      if (action.payload.length > 0 && !state.activeTeam) {
        state.activeTeam = action.payload[0];
      }
    },
    setActiveTeam: (state, action) => {
      state.activeTeam = action.payload;
      // Reset active project when switching teams
      state.activeProject = null;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setActiveProject: (state, action) => {
      state.activeProject = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { 
  setTeams, 
  setActiveTeam, 
  setProjects, 
  setActiveProject,
  setLoading,
  setError
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
