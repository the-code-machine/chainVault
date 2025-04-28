import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a company name"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide a company email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    ethreumAddress: {
        type: String,
        unique: true,
        sparse: true,
        default: () => `eth-${Math.random().toString(36).substring(2, 15)}`
      }
,      
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    storageLimit: {
        type: Number,
        default: 5 * 1024 * 1024 * 1024 // 5GB in bytes
    },
    storageUsed: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    plan: {
        type: String,
        enum: ['free', 'standard', 'premium', 'enterprise'],
        default: 'standard'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Virtual for storage percentage used
companySchema.virtual('storagePercentage').get(function() {
    return this.storageLimit > 0 ? Math.round((this.storageUsed / this.storageLimit) * 100) : 0;
});

const Company = mongoose.models.companies || mongoose.model("companies", companySchema);

export default Company;