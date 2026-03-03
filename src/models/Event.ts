import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
    day: string;
    event: string;
    time: string;
    type: string;
}

const EventSchema = new Schema<IEvent>(
    {
        day: { type: String, required: true },
        event: { type: String, required: true },
        time: { type: String, required: true },
        type: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
