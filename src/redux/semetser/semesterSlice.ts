import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
//import { api } from "../../api/api";
import axios from "axios";
import { Curriculum, Faculty } from "../../components/types";

export interface SemesterState {
  loading: boolean;
  semester: "Fall" | "Spring";
  error: string;
  curriculum: Curriculum[];
  faculty: Faculty[];
  courses: Courses;
}

interface Courses {
  Fall: string[][][];
  Spring: string[][][];
}

const initialState: SemesterState = {
  loading: false,
  semester: "Fall",
  curriculum: [],
  faculty: [],
  error: "",
  courses: {
    Fall: Array(4).fill(Array(5).fill(Array(7).fill(""))),
    Spring: Array(4).fill(Array(5).fill(Array(7).fill(""))),
  },
};

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getCurriculum = createAsyncThunk(
  "semester/getCurriculum",
  async () => {
    //await timeout(5000);
    const response = await axios.get(`/api/curriculum`);
    return response.data as Curriculum[];
  }
);

export const getFaculties = createAsyncThunk(
  "semester/getFaculty",
  async () => {
    //await timeout(5000);
    const response = await axios.get(`/api/faculties`);
    return response.data as Faculty[];
  }
);

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    changeSemester(state) {
      const x = (["Fall", "Spring"].indexOf(state.semester) + 1) % 2;
      state.semester = ["Fall", "Spring"][x] as typeof state.semester;
    },
    changeCourses(
      state,
      action: PayloadAction<[number, number, number, string]>
    ) {
      state.courses[state.semester][action.payload[0]][action.payload[1]][
        action.payload[2]
      ] = action.payload[3];
    },
    clearAll(state) {
      state.courses[state.semester] = Array(4).fill(
        Array(5).fill(Array(7).fill(""))
      );
    },
    facultyCount(state, action: PayloadAction<number>) {
      state.faculty.map((f) =>
        f.fid === action.payload
          ? f.counts[state.semester]++
          : f.counts[state.semester]
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurriculum.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurriculum.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.curriculum = payload;
      })
      .addCase(getCurriculum.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(getFaculties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFaculties.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.faculty = payload.map((d) => ({
          ...d,
          counts: { Fall: 0, Spring: 0 },
        })) as Faculty[];
      })
      .addCase(getFaculties.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { changeSemester, changeCourses, clearAll, facultyCount } =
  semesterSlice.actions;
export const semesterReducer = semesterSlice.reducer;
export const selectCount = (state: RootState) => state.semester;
