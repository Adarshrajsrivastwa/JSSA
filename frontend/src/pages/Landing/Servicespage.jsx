import { useState } from "react";

const GREEN = "#3AB000";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

const districtsByState = {
  Bihar: [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
    "Purnia",
    "Samastipur",
    "Begusarai",
    "Nalanda",
    "Rohtas",
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Buxar",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Nawada",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
    "East Champaran",
  ],
  Jharkhand: [
    "Ranchi",
    "Dhanbad",
    "Jamshedpur",
    "Bokaro",
    "Hazaribagh",
    "Giridih",
    "Deoghar",
    "Dumka",
    "Pakur",
    "Garhwa",
    "Chatra",
    "Gumla",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Palamu",
    "Ramgarh",
    "Sahibganj",
    "Seraikela",
    "Simdega",
    "West Singhbhum",
    "East Singhbhum",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Allahabad",
    "Meerut",
    "Noida",
    "Ghaziabad",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Faizabad",
    "Jhansi",
    "Mathura",
    "Firozabad",
    "Rampur",
    "Shahjahanpur",
    "Muzaffarnagar",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Nanded",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Bharatpur",
    "Sikar",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Anand",
    "Navsari",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Darjeeling",
    "Jalpaiguri",
    "Murshidabad",
    "Bardhaman",
    "Nadia",
    "North 24 Parganas",
    "South 24 Parganas",
    "Hooghly",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
};

const checkupPackages = [
  "Full Body CheckUp",
  "Immunity Profile",
  "Covid Antibody Packages",
  "D-DIMER",
  "Infection Checkup Profile",
  "Post Covid Checkup Packages",
  "C-REACTIVE PROTEIN (CRP)",
  "CBC-CRP COMBO",
  "Women Health Checkup Packages",
  "KIDNEY PROFILE",
  "CRP-CBC-D-DIMER COMBO",
  "HealthyLife Packages",
  "CBC / HEMOGRAM",
  "CBC-CRP-LDH-FERR-D-DIMER-IL6",
  "Wellness Packages",
  "LIVER FUNCTION TESTS (LFT)",
  "Woman Wellness Profile",
  "Full Body Health Checkup",
  "FERRITIN",
  "Food Intolerance Profile",
  "Senior Citizen Health Checkup",
  "Master Health Checkup",
  "Complete Vitamins Profile",
  "and, More Other Checkups",
];

const diseases = [
  "Heart Disease",
  "Liver Problem",
  "Cancer",
  "Allergies",
  "Unintentional Injuries",
  "Colds and Flu",
  "Chronic Lower Respiratory Disease",
  "Conjunctivitis (Pink Eye)",
  "Stroke and Cerebrovascular Diseases",
  "Diarrhea",
  "Alzheimer's Disease",
  "Headaches",
  "Diabetes",
  "Mononucleosis",
  "Influenza and Pneumonia",
  "Stomach Aches",
  "Kidney Disease",
  "Covid 19",
  "Stomach Problems",
  "and, More Other Diseases",
];

export default function ServicesPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    state: "",
    district: "",
    zip: "",
    serviceType: "",
    message: "",
    agree1: false,
    agree2: false,
  });
  const [selectedState, setSelectedState] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }
    if (name === "state") {
      setSelectedState(value);
      setForm((p) => ({ ...p, state: value, district: "" }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans',sans-serif",
        color: "#000",
      }}
    >
      <style>{`
        .svc-pkg-section  { padding: 32px 40px; background: #fff; }
        .svc-dis-section  { padding: 24px 40px 32px; background: #fff; }
        .svc-form-section { padding: 0 40px 48px; }

        .svc-pkg-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 32px; }
        .svc-dis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 80px; }

        .svc-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .svc-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }

        .svc-h2-main { font-weight: 900; font-size: 22px; color: #1a2a4a; text-align: center; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.02em; }
        .svc-h2-sub  { font-weight: 900; font-size: 20px; color: #1a2a4a; text-align: center; margin-bottom: 2px; }
        .svc-h2-hin  { font-weight: 900; font-size: 18px; color: #1a2a4a; text-align: center; margin-bottom: 12px; }
        .svc-form-h2 { font-weight: 900; font-size: 22px; color: #000; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.02em; }

        .svc-field-label { display: block; font-size: 14px; font-weight: 600; color: #111; margin-bottom: 6px; }
        .svc-field-input {
          width: 100%; padding: 10px 12px;
          border: 1px solid #ccc; border-radius: 4px;
          font-size: 14px; background: #fff; outline: none;
          box-sizing: border-box; color: #000;
          font-family: inherit;
        }
        .svc-field-input:focus { border-color: ${GREEN}; }
        .svc-field-textarea {
          width: 100%; padding: 10px 12px;
          border: 1px solid #ccc; border-radius: 4px;
          font-size: 14px; background: #fff; outline: none;
          box-sizing: border-box; color: #000; resize: vertical;
          font-family: inherit; min-height: 120px;
        }
        .svc-field-textarea:focus { border-color: ${GREEN}; }

        .svc-dot { margin-top: 5px; flex-shrink: 0; width: 6px; height: 6px; border-radius: 1px; background: #1a2a4a; min-width: 6px; }
        .svc-item { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; color: #000; padding: 3px 0; }

        .svc-cb-label { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #000; cursor: pointer; }
        .svc-cb       { width: 16px; height: 16px; cursor: pointer; accent-color: ${GREEN}; }

        .svc-post-label { font-weight: 900; font-size: 14px; color: #000; margin-bottom: 16px; letter-spacing: 0.05em; }

        @media (max-width: 768px) {
          .svc-pkg-section  { padding: 14px 10px; }
          .svc-dis-section  { padding: 10px 10px 14px; }
          .svc-form-section { padding: 0 10px 24px; }

          .svc-pkg-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 3px 8px !important; }
          .svc-dis-grid { grid-template-columns: 1fr 1fr !important; gap: 3px 16px !important; }

          .svc-form-grid-2 { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .svc-form-grid-3 { grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; }

          .svc-h2-main { font-size: 9px !important; margin-bottom: 2px !important; }
          .svc-h2-sub  { font-size: 8px !important; margin-bottom: 1px !important; }
          .svc-h2-hin  { font-size: 8px !important; margin-bottom: 6px !important; }
          .svc-form-h2 { font-size: 10px !important; margin-bottom: 8px !important; }

          .svc-item { font-size: 7px !important; padding: 1px 0 !important; gap: 4px !important; }
          .svc-dot  { width: 4px !important; height: 4px !important; min-width: 4px !important; margin-top: 3px !important; }

          .svc-field-label    { font-size: 7px !important; margin-bottom: 2px !important; }
          .svc-field-input    { padding: 4px 5px !important; font-size: 7px !important; border-radius: 2px !important; }
          .svc-field-textarea { padding: 4px 5px !important; font-size: 7px !important; border-radius: 2px !important; min-height: 50px !important; }

          .svc-post-label { font-size: 7px !important; margin-bottom: 6px !important; }
          .svc-cb-label   { font-size: 7px !important; gap: 4px !important; }
          .svc-cb         { width: 10px !important; height: 10px !important; }

          .svc-form-inner { gap: 10px !important; }
          .svc-form-box   { padding: 12px 10px !important; }

          .svc-submit-btn { font-size: 8px !important; padding: 7px 20px !important; }
        }
      `}</style>

      {/* HEALTH CHECKUP PACKAGES */}
      <div className="svc-pkg-section">
        <h2 className="svc-h2-main">
          HEALTH CHECKUP PACKAGES / स्वास्थ्य जांच पैकेज
        </h2>
        <div
          style={{
            borderTop: `2px solid ${GREEN}`,
            marginTop: 12,
            paddingTop: 16,
          }}
        >
          <div className="svc-pkg-grid">
            {checkupPackages.map((pkg, i) => (
              <div key={i} className="svc-item">
                <span className="svc-dot" />
                {pkg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MEDICINES & DOCTOR CONSULTATION */}
      <div className="svc-dis-section">
        <h2 className="svc-h2-sub">
          Medicines and Doctor's Consultation for the following Diseases
        </h2>
        <h2 className="svc-h2-hin">
          निम्नलिखित बीमारियों के लिए दवाएं और डॉक्टरों का परामर्श
        </h2>
        <div style={{ borderTop: `2px solid ${GREEN}`, paddingTop: 16 }}>
          <div className="svc-dis-grid">
            {diseases.map((d, i) => (
              <div key={i} className="svc-item">
                <span className="svc-dot" />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ONLINE FORM FOR SERVICES */}
      <div className="svc-form-section">
        <h2 className="svc-form-h2">ONLINE FORM FOR SERVICES</h2>
        <div
          className="svc-form-box"
          style={{
            background: "#f0f0f0",
            borderRadius: 6,
            padding: "32px 36px",
          }}
        >
          <div
            className="svc-form-inner"
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {/* Name */}
            <div>
              <label className="svc-field-label">Your Name*</label>
              <input
                className="svc-field-input"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Email + Contact */}
            <div className="svc-form-grid-2">
              <div>
                <label className="svc-field-label">Email Id*</label>
                <input
                  className="svc-field-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="svc-field-label">Contact Number*</label>
                <input
                  className="svc-field-input"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="svc-field-label">Full Address</label>
              <input
                className="svc-field-input"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House No, Street Name, Area and Landmark"
              />
            </div>

            {/* Posting Location */}
            <div>
              <p className="svc-post-label">POSTING LOCATION</p>
              <div className="svc-form-grid-3">
                <div>
                  <label className="svc-field-label">State</label>
                  <select
                    className="svc-field-input"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="svc-field-label">District</label>
                  <select
                    className="svc-field-input"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    {(districtsByState[selectedState] || []).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="svc-field-label">Zip/Postal Code</label>
                  <input
                    className="svc-field-input"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Type of Service */}
            <div>
              <label className="svc-field-label">Type Of Service*</label>
              <input
                className="svc-field-input"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div>
              <label className="svc-field-label">Message/Enquiry*</label>
              <textarea
                className="svc-field-textarea"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
              />
            </div>

            {/* Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="svc-cb-label">
                <input
                  type="checkbox"
                  className="svc-cb"
                  name="agree1"
                  checked={form.agree1}
                  onChange={handleChange}
                />
                I have read and agree to the Terms and Conditions.{" "}
                <a
                  href="#"
                  style={{
                    color: "#000",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Click here to read
                </a>
              </label>
              <label className="svc-cb-label">
                <input
                  type="checkbox"
                  className="svc-cb"
                  name="agree2"
                  checked={form.agree2}
                  onChange={handleChange}
                />
                I declare all the informations....
              </label>
            </div>

            {/* Submit */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                className="svc-submit-btn"
                onClick={() => alert("Form submitted!")}
                style={{
                  background: GREEN,
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 15,
                  padding: "12px 48px",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
