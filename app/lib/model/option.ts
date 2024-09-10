import { Option as OptionType } from "@/app/types";
import dynamoose from "../dynamodb";
import { Item } from "dynamoose/dist/Item";

interface IOption extends Item {
  id: string;
  userId: string;
  type: OptionType;
  priceAtCreation: number;
  resolved: boolean;
  resolvedAt: Date;
  createdAt: Date;
}

const OptionSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  priceAtCreation: Number,
  resolved: Boolean,
  resolvedAt: Date,
  createdAt: Date,
});

export const Option = dynamoose.model<IOption>("Option", OptionSchema);
