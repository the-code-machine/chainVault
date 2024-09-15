import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
    caseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    courtName: {
        type: String,
        required: true,
    },
    stateName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CaseModal = mongoose.models.Case || mongoose.model('Case', CaseSchema);
export default CaseModal;
