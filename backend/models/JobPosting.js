import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    advtNo: {
      type: String,
      required: [true, "Advertisement number is required"],
      unique: true,
      trim: true,
    },
    title: {
      en: {
        type: String,
        required: [true, "Title (English) is required"],
        trim: true,
      },
      hi: {
        type: String,
        default: "",
        trim: true,
      },
    },
    postTitle: {
      en: {
        type: String,
        required: [true, "Post title (English) is required"],
        trim: true,
      },
      hi: {
        type: String,
        default: "",
        trim: true,
      },
    },
    post: {
      en: {
        type: String,
        required: [true, "Post name (English) is required"],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, "Post name (Hindi) is required"],
        trim: true,
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    income: {
      en: {
        type: String,
        required: [true, "Income range (English) is required"],
      },
      hi: {
        type: String,
        required: [true, "Income range (Hindi) is required"],
      },
    },
    incomeMin: {
      type: Number,
      required: true,
    },
    incomeMax: {
      type: Number,
      required: true,
    },
    education: {
      en: {
        type: String,
        default: "",
      },
      hi: {
        type: String,
        default: "",
      },
    },
    location: {
      en: {
        type: String,
        required: [true, "Location (English) is required"],
      },
      hi: {
        type: String,
        required: [true, "Location (Hindi) is required"],
      },
    },
    locationArr: {
      type: [String],
      default: [],
    },
    locationArrHi: {
      type: [String],
      default: [],
    },
    fee: {
      en: {
        type: String,
        default: "₹0",
      },
      hi: {
        type: String,
        default: "₹0",
      },
    },
    feeStructure: {
      male_general: {
        type: String,
        default: "",
      },
      male_obc: {
        type: String,
        default: "",
      },
      male_sc: {
        type: String,
        default: "",
      },
      male_st: {
        type: String,
        default: "",
      },
      male_ews: {
        type: String,
        default: "",
      },
      female_general: {
        type: String,
        default: "",
      },
      female_obc: {
        type: String,
        default: "",
      },
      female_sc: {
        type: String,
        default: "",
      },
      female_st: {
        type: String,
        default: "",
      },
      female_ews: {
        type: String,
        default: "",
      },
    },
    advertisementFile: {
      type: String,
      default: "",
    },
    advertisementFileHi: {
      type: String,
      default: "",
    },
    lastDate: {
      type: String,
      required: [true, "Last date is required"],
    },
    applicationOpeningDate: {
      type: String,
      required: [true, "Application opening date is required"],
    },
    firstMeritListDate: {
      type: String,
      default: "",
    },
    finalMeritListDate: {
      type: String,
      default: "",
    },
    ageLimit: {
      en: {
        type: String,
        required: [true, "Age limit (English) is required"],
      },
      hi: {
        type: String,
        required: [true, "Age limit (Hindi) is required"],
      },
    },
    ageAsOn: {
      type: String,
      required: true,
    },
    selectionProcess: {
      en: {
        type: String,
        default: "",
      },
      hi: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobPostingSchema.index({ advtNo: 1 });
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ "post.en": "text", "post.hi": "text", "location.en": "text" });

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

export default JobPosting;
