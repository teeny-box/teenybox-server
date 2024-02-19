import mongoose, { Document, Schema } from "mongoose";

export interface IPromotion extends Document {
  promotion_number: number;
  user_id: IUser;
  title: string;
  content: string;
  tags?: string[];
  image_url: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comments: mongoose.Schema.Types.ObjectId[];
  start_date: Date;
  end_date: Date;
  likes: number;
  views: number;
  likedUsers: string[];
  category: "연극" | "기타";
  is_fixed: "일반" | "고정";
  play_title?: string;
  runtime?: number;
  location?: string;
  host?: string;
  deletedAt?: Date | null;
}
export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string;
  profile_url: string;
  state: string;
}

const promotionSchema = new Schema<IPromotion>(
  {
    promotion_number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    image_url: {
      type: [String],
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likedUsers: {
      type: [String],
      ref: "User",
      default: [],
    },
    category: {
      type: String,
      enum: ["연극", "기타"],
      required: true,
    },
    is_fixed: {
      type: String,
      enum: ["일반", "고정"],
      required: true,
    },
    play_title: {
      type: String,
    },
    runtime: {
      type: Number,
    },
    location: {
      type: String,
    },
    host: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model<IPromotion>("Promotion", promotionSchema);

export default PromotionModel;
