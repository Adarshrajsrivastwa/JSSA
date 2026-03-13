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
  "Infection Checkup Profilee",
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
  "LIVER FUNCTION TESTS(LFT)",
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
  "cancer",
  "Allergies",
  "Unintentional Injuries",
  "Colds and Flu",
  "Chronic Lower Respiratory Disease",
  'Conjunctivitis ("Pink Eye")',
  "Stroke and Cerebrovascular Diseases",
  "Diarrhea",
  "Alzheimer's Disease",
  "Headaches",
  "Diabaties",
  "Mononucleosis",
  "Influenza and Pneumonia",
  "Stomach Aches",
  "Kidney Disease",
  "Covid 19",
  "Stomach Problems",
  "and, More Other Diseases",
];

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  color: "#000",
};

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#111",
  marginBottom: 6,
};

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
    if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
    else setForm((p) => ({ ...p, [name]: value }));
    if (name === "state") {
      setSelectedState(value);
      setForm((p) => ({ ...p, state: value, district: "" }));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
        color: "#000",
      }}
    >
      {/* ── HEALTH CHECKUP PACKAGES ── */}
      <div style={{ width: "100%", padding: "32px 40px", background: "#fff" }}>
        <h2
          style={{
            fontWeight: 900,
            fontSize: 22,
            color: "#1a2a4a",
            textAlign: "center",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          HEALTH CHECKUP PACKAGES / स्वास्थ्य जांच पैकेज
        </h2>
        <div
          style={{
            borderTop: `2px solid ${GREEN}`,
            marginTop: 12,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px 32px",
            }}
          >
            {checkupPackages.map((pkg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 14,
                  color: "#000",
                  padding: "3px 0",
                }}
              >
                <span
                  style={{
                    marginTop: 5,
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    background: "#1a2a4a",
                    minWidth: 6,
                  }}
                />
                {pkg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MEDICINES & DOCTOR CONSULTATION ── */}
      <div
        style={{ width: "100%", padding: "24px 40px 32px", background: "#fff" }}
      >
        <h2
          style={{
            fontWeight: 900,
            fontSize: 20,
            color: "#1a2a4a",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          Medicines and Doctor's Consultation for the following Diseases
        </h2>
        <h2
          style={{
            fontWeight: 900,
            fontSize: 18,
            color: "#1a2a4a",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          निम्नलिखित बीमारियों के लिए दवाएं और डॉक्टरों का परामर्श
        </h2>
        <div style={{ borderTop: `2px solid ${GREEN}`, paddingTop: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 80px",
            }}
          >
            {diseases.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 14,
                  color: "#000",
                  padding: "4px 0",
                }}
              >
                <span
                  style={{
                    marginTop: 5,
                    flexShrink: 0,
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    background: "#1a2a4a",
                    minWidth: 6,
                  }}
                />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ONLINE FORM FOR SERVICES ── */}
      <div style={{ width: "100%", padding: "0 40px 48px" }}>
        <h2
          style={{
            fontWeight: 900,
            fontSize: 22,
            color: "#000",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          ONLINE FORM FOR SERVICES
        </h2>

        <div
          style={{
            background: "#f0f0f0",
            borderRadius: 6,
            padding: "32px 36px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Your Name — full width */}
            <div>
              <label style={labelStyle}>Your Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Email + Contact */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <label style={labelStyle}>Email Id*</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Contact Number*</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Full Address — full width */}
            <div>
              <label style={labelStyle}>Full Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House No, Street Name, Area and Landmark"
                style={inputStyle}
              />
            </div>

            {/* POSTING LOCATION heading */}
            <div>
              <p
                style={{
                  fontWeight: 900,
                  fontSize: 14,
                  color: "#000",
                  marginBottom: 16,
                  letterSpacing: "0.05em",
                }}
              >
                POSTING LOCATION
              </p>
              {/* State + District + ZIP */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 24,
                }}
              >
                <div>
                  <label style={labelStyle}>State</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    style={inputStyle}
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
                  <label style={labelStyle}>District</label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    style={inputStyle}
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
                  <label style={labelStyle}>Zip/Postal Code</label>
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Type Of Service — full width */}
            <div>
              <label style={labelStyle}>Type Of Service*</label>
              <input
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Message/Enquiry — textarea full width */}
            <div>
              <label style={labelStyle}>Message/Enquiry*</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="agree1"
                  checked={form.agree1}
                  onChange={handleChange}
                  style={{
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                    accentColor: GREEN,
                  }}
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
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="agree2"
                  checked={form.agree2}
                  onChange={handleChange}
                  style={{
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                    accentColor: GREEN,
                  }}
                />
                I declare all the informations....
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
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
