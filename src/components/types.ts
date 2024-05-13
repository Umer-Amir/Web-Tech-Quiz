export type Course = {
  courseid: number;
  code: string;
  title: string;
  crhr: number;
  semester: number;
};

export type Faculty = {
  areas: Areas[];
  fid: number;
  TeacherName: string;
  fulltime: boolean;
  counts: { Fall: number; Spring: number };
};

export type Props = {
  editing: boolean;
  items: Faculty[];
  onChange: (value: string) => void;
  // onSelect: (value: string) => void;
  // setFaculty: (value: Faculty) => void;
};

export type State = {
  suggesions: Faculty[];
  text: string;
  SelectedIndex: number;
};

export type Curriculum = {
  curid: number;
  cid: number;
  semno: number;
  title: string;
};

export type Offer = {
  semno: number;
  cid: number;
  fid: number;
  sec: string;
  semester: string;
};

export type Areas = {
  cid: number;
  fid: number;
};

export type Assign = {
  fid: number;
  assign: number;
};
