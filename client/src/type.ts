import { ObjectId } from "mongodb";

export type newUser = {
  name: string;
  kode: string;
  role: string;
  email: string;
  username: string;
  password: string;
};

export type loginUser = {
  username: string;
  password: string;
};

export type userType = {
  _id: ObjectId;
  name: string;
  kode: string;
  email: string;
  role: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type transInput = {
  totalAmount: number;
};
