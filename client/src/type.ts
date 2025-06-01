export type newUser = {
  name: string;
  kode: string;
  email: string;
  username: string;
  password: string;
};

export type loginUser = {
  username: string;
  password: string;
};

export type userType = {
  _id: string;
  name: string;
  kode: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};
