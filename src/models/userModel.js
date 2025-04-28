import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    // Add name field but make it non-unique or sparse
    name: {
        type: String,
        required: false,
        sparse: true, // Allows multiple null values
        default: function() {
            // Generate a name from firstName and lastName if they exist
            if (this.firstName && this.lastName) {
                return `${this.firstName} ${this.lastName}`;
            } else if (this.firstName) {
                return this.firstName;
            }
            return null;
        }
    },
    firstName: {
        type: String,
        required: [true, "Please provide a first name"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Please provide a last name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    ethreumAddress: {
        type: String,
        unique: true,
        sparse: true,
        default: () => `eth-${Math.random().toString(36).substring(2, 15)}`
      },
      
    role: {
        type: String,
        enum: ['employee', 'manager', 'legal', 'executive', 'admin'],
        default: 'employee'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    isCompanyAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Pre-save hook to sync name with firstName and lastName
userSchema.pre('save', async function(next) {
    // Update the name field
    if (this.firstName && this.lastName) {
        this.name = `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
        this.name = this.firstName;
    }
    
    // Only hash the password if it has been modified (or is new)
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Make sure we're using an existing model or creating a new one
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;