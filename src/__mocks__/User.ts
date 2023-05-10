import { IUser } from "../models/User";

const UserMock = {
  findOne: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

export default UserMock;
