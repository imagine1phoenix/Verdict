import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineEntry {
    date: string;
    event: string;
    done: boolean;
}

export interface ITeamMember {
    name: string;
    role: string;
}

export interface ICaseDocument {
    name: string;
    tag: string;
    checkedOut: boolean;
    updated: string;
}

export interface IRelatedCase {
    caseId: string;
    name: string;
    relevance: string;
}

export interface IBilling {
    total: string;
    billed: string;
    outstanding: string;
    hours: number;
}

export type PipelineStatus = "intake" | "discovery" | "motion" | "trial" | "closed";

export interface ICase extends Document {
    caseId: string;
    name: string;
    type: string;
    status: PipelineStatus;
    lead: string;
    priority: "Critical" | "High" | "Medium" | "Low";
    nextDate: string;
    billing: IBilling;
    court: string;
    judge: string;
    filed: string;
    team: ITeamMember[];
    timeline: ITimelineEntry[];
    documents: ICaseDocument[];
    relatedCases: IRelatedCase[];
}

const CaseSchema = new Schema<ICase>(
    {
        caseId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        status: {
            type: String,
            enum: ["intake", "discovery", "motion", "trial", "closed"],
            required: true,
        },
        lead: { type: String, required: true },
        priority: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"],
            default: "Medium",
        },
        nextDate: { type: String },
        billing: {
            total: { type: String, default: "₹0" },
            billed: { type: String, default: "₹0" },
            outstanding: { type: String, default: "₹0" },
            hours: { type: Number, default: 0 },
        },
        court: { type: String },
        judge: { type: String },
        filed: { type: String },
        team: [{ name: String, role: String }],
        timeline: [{ date: String, event: String, done: Boolean }],
        documents: [{ name: String, tag: String, checkedOut: Boolean, updated: String }],
        relatedCases: [{ caseId: String, name: String, relevance: String }],
    },
    { timestamps: true }
);

export default mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);
