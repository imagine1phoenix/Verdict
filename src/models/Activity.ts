import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
    user: string;
    action: string;
    target: string;
    time: string;
}

const ActivitySchema = new Schema<IActivity>(
    {
        user: { type: String, required: true },
        action: { type: String, required: true },
        target: { type: String, required: true },
        time: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
