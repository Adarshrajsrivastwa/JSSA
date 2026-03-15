import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // COMMENTED: Razorpay settings - replaced with Cashfree
    // razorpay: {
    //   keyId: {
    //     type: String,
    //     default: "",
    //   },
    //   keySecret: {
    //     type: String,
    //     default: "",
    //   },
    //   isTestMode: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   testKeyId: {
    //     type: String,
    //     default: "rzp_test_1DP5mmOlF5G5ag",
    //   },
    //   testKeySecret: {
    //     type: String,
    //     default: "",
    //   },
    // },
    cashfree: {
      appId: {
        type: String,
        default: "",
      },
      secretKey: {
        type: String,
        default: "",
      },
    },
    razorpay: {
      keyId: {
        type: String,
        default: "",
      },
      keySecret: {
        type: String,
        default: "",
      },
      isTestMode: {
        type: Boolean,
        default: true,
      },
      testKeyId: {
        type: String,
        default: "rzp_test_1DP5mmOlF5G5ag",
      },
      testKeySecret: {
        type: String,
        default: "",
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
