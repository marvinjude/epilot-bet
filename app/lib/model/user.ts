import dynamoose from "../dynamodb";
import { Item } from "dynamoose/dist/Item";

interface IUser extends Item {
  id: string;
  score: number;
  authUserId: string;
}

const UserSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  score: Number,
  authUserId: {
    type: String,
    required: true,
    index: {
      type: "global",
      project: true,
    },
  },
});

export const User = dynamoose.model<IUser>("User", UserSchema);
