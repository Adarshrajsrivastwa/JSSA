// import { useState } from "react";

// const GREEN = "#3AB000";

// const indianStates = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Delhi",
//   "Jammu & Kashmir",
//   "Ladakh",
// ];

// const districtsByState = {
//   Bihar: [
//     "Patna",
//     "Gaya",
//     "Muzaffarpur",
//     "Bhagalpur",
//     "Darbhanga",
//     "Purnia",
//     "Samastipur",
//     "Begusarai",
//     "Nalanda",
//     "Rohtas",
//   ],
//   Jharkhand: [
//     "Ranchi",
//     "Dhanbad",
//     "Jamshedpur",
//     "Bokaro",
//     "Hazaribagh",
//     "Giridih",
//     "Deoghar",
//     "Dumka",
//     "Pakur",
//     "Garhwa",
//   ],
//   "Uttar Pradesh": [
//     "Lucknow",
//     "Kanpur",
//     "Agra",
//     "Varanasi",
//     "Allahabad",
//     "Meerut",
//     "Noida",
//     "Ghaziabad",
//     "Bareilly",
//     "Aligarh",
//   ],
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px 12px",
//   border: "1px solid #ccc",
//   borderRadius: 4,
//   fontSize: 14,
//   background: "#fff",
//   outline: "none",
//   boxSizing: "border-box",
// };

// const labelStyle = {
//   display: "block",
//   fontSize: 14,
//   fontWeight: 600,
//   color: "#111",
//   marginBottom: 6,
// };

// export default function MembershipPage() {
//   const [form, setForm] = useState({
//     name: "",
//     fatherName: "",
//     mobile: "",
//     email: "",
//     photo: null,
//     aadhar: "",
//     pan: "",
//     dob: "",
//     address: "",
//     state: "",
//     district: "",
//     zip: "",
//     policeStation: "",
//     signature: null,
//     agree1: false,
//     agree2: false,
//   });
//   const [selectedState, setSelectedState] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "file") setForm((p) => ({ ...p, [name]: files[0] }));
//     else if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
//     else setForm((p) => ({ ...p, [name]: value }));
//     if (name === "state") {
//       setSelectedState(value);
//       setForm((p) => ({ ...p, district: "" }));
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#fff",
//         fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
//         color: "#000",
//       }}
//     >
//       {/* ── MEMBERSHIP & BENEFITS TEXT SECTION ── */}
//       <div style={{ width: "100%", padding: "32px 40px", background: "#fff" }}>
//         <h2
//           style={{
//             fontWeight: 900,
//             fontSize: 28,
//             color: "#1a2a4a",
//             marginBottom: 24,
//           }}
//         >
//           Membership &amp; Benefits / सदस्यता एवं सुविधा
//         </h2>

//         <div
//           style={{
//             borderTop: `2px solid ${GREEN}`,
//             paddingTop: 24,
//             display: "flex",
//             flexDirection: "column",
//             gap: 20,
//           }}
//         >
//           <p style={{ fontSize: 14, lineHeight: 1.9, color: "#000" }}>
//             <span style={{ fontWeight: 700 }}>Membership :</span> Any citizen of
//             the country whose minimum age is 18 years can get membership under
//             Jan Swasthya Sahayata Abhiyan, Documents required to take
//             membership: Aadhar card, PAN card and photocopy of ration card and
//             membership fee are necessary.
//           </p>

//           <p style={{ fontSize: 14, lineHeight: 1.9, color: "#000" }}>
//             <span style={{ fontWeight: 700 }}>सदस्यता :</span> देश के कोई भी
//             नागरिक जिसकी न्यूनतम आयु 18 वर्ष है, वो जन स्वास्थ्य सहायता अभियान
//             के अंतर्गत सदस्यता प्राप्त कर सकते हैं। सदस्यता लेने के लिए जरूरी
//             दस्तावेज आधारकार्ड, पैन कार्ड तथा राशन कार्ड की छायाप्रति एवं
//             सदस्यता शुल्क जरूरी है।
//           </p>

//           <p style={{ fontSize: 14, lineHeight: 1.9, color: "#000" }}>
//             <span style={{ fontWeight: 700 }}>Benefits :</span> Jan Swasthya
//             Sahayata card is provided by the organization to each member
//             associated under the Jan Swasthya Sahayata Abhiyan. And through this
//             card, you will get better treatment by special doctor, medicines and
//             medical examination in the health camp organized by the organization
//             and as per the need, financial assistance and health related
//             assistance will be provided.
//           </p>

//           <p style={{ fontSize: 14, lineHeight: 1.9, color: "#000" }}>
//             <span style={{ fontWeight: 700 }}>सुविधा :</span> जन स्वास्थ्य
//             सहायता अभियान के अंतर्गत जुड़े प्रत्येक सदस्य को संस्था द्वारा एक जन
//             स्वास्थ्य सहायता कार्ड प्रदान किया जाता है और इस कार्ड के माध्यम से
//             आपको संस्था द्वारा आयोजित स्वास्थ्य शिविर में विशेष चिकित्सक द्वारा
//             बेहतर इलाज, दवाईयां एवं चिकित्सा जांच करायी जायेगी तथा आवश्यकतानुसार
//             आर्थिक सहायता एवं स्वास्थ्य संबंधी सहायता प्रदान की जायेगी।
//           </p>
//         </div>
//       </div>

//       {/* ── REGISTRATION FORM ── */}
//       <div style={{ width: "100%", padding: "0 40px 40px" }}>
//         <div
//           style={{
//             background: "#f0f0f0",
//             borderRadius: 6,
//             padding: "32px 36px",
//           }}
//         >
//           <h2
//             style={{
//               fontWeight: 900,
//               fontSize: 18,
//               color: "#000",
//               marginBottom: 28,
//             }}
//           >
//             ONLINE MEMBERSHIP REGISTRATION FORM / ऑनलाइन सदस्यता पंजीकरण फॉर्म :
//           </h2>

//           <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
//             {/* Row 1: Name + Father Name */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Your Name/आपका नाम *</label>
//                 <input
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Father's Name/पिता का नाम*</label>
//                 <input
//                   name="fatherName"
//                   value={form.fatherName}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             {/* Row 2: Mobile + Email */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Mobile Number/मोबाइल नंबर*</label>
//                 <input
//                   name="mobile"
//                   value={form.mobile}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Email Id/ईमेल आईडी*</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             {/* Row 3: Photo + Aadhar */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>
//                   Attach Photograph/फोटोग्राफ संलग्न करें*
//                 </label>
//                 <input
//                   name="photo"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleChange}
//                   style={{ ...inputStyle, padding: "6px 8px" }}
//                 />
//                 <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
//                   Max file size:1 MB
//                 </p>
//               </div>
//               <div>
//                 <label style={labelStyle}>Aadhar No/आधार नंबर*</label>
//                 <input
//                   name="aadhar"
//                   value={form.aadhar}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             {/* Row 4: PAN + DOB */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>PAN Card No/पैन कार्ड नं*</label>
//                 <input
//                   name="pan"
//                   value={form.pan}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Date Of Birth/जन्मतिथि*</label>
//                 <input
//                   name="dob"
//                   type="date"
//                   value={form.dob}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             {/* Row 5: Permanent Address (full width) */}
//             <div>
//               <label style={labelStyle}>Permanent Address</label>
//               <input
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 placeholder="House No, Street Name, Area and Landmark"
//                 style={inputStyle}
//               />
//             </div>

//             {/* Row 6: State + District + ZIP */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: 24,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>State</label>
//                 <select
//                   name="state"
//                   value={form.state}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 >
//                   <option value="">Select</option>
//                   {indianStates.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>District</label>
//                 <select
//                   name="district"
//                   value={form.district}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 >
//                   <option value="">--Please Select---</option>
//                   {(districtsByState[selectedState] || []).map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>Zip/Postal Code</label>
//                 <input
//                   name="zip"
//                   value={form.zip}
//                   onChange={handleChange}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>

//             {/* Row 7: Police Station (full width) */}
//             <div>
//               <label style={labelStyle}>
//                 Local Police Station/स्थानीय पुलिस स्टेशन*
//               </label>
//               <input
//                 name="policeStation"
//                 value={form.policeStation}
//                 onChange={handleChange}
//                 style={inputStyle}
//               />
//             </div>

//             {/* Row 8: Membership Fee + Signature */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 24,
//                 alignItems: "start",
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>
//                   Membership Fees/सदस्यता शुल्क* :
//                 </label>
//                 <input
//                   readOnly
//                   value="₹ 150/- only"
//                   style={{
//                     ...inputStyle,
//                     background: "#fff",
//                     color: "#333",
//                     fontWeight: 600,
//                     width: "auto",
//                     cursor: "default",
//                   }}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>
//                   Attach Signature/हस्ताक्षर संलग्न करें*
//                 </label>
//                 <input
//                   name="signature"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleChange}
//                   style={{ ...inputStyle, padding: "6px 8px" }}
//                 />
//                 <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
//                   Max file size:1 MB
//                 </p>
//               </div>
//             </div>

//             {/* Checkboxes */}
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               <label
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   fontSize: 14,
//                   color: "#000",
//                   cursor: "pointer",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   name="agree1"
//                   checked={form.agree1}
//                   onChange={handleChange}
//                   style={{
//                     width: 16,
//                     height: 16,
//                     cursor: "pointer",
//                     accentColor: GREEN,
//                   }}
//                 />
//                 I have read and agree to the Terms and Conditions.{" "}
//                 <a
//                   href="#"
//                   style={{
//                     color: "#000",
//                     fontWeight: 700,
//                     textDecoration: "underline",
//                   }}
//                 >
//                   Click here to read
//                 </a>
//               </label>
//               <label
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   fontSize: 14,
//                   color: "#000",
//                   cursor: "pointer",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   name="agree2"
//                   checked={form.agree2}
//                   onChange={handleChange}
//                   style={{
//                     width: 16,
//                     height: 16,
//                     cursor: "pointer",
//                     accentColor: GREEN,
//                   }}
//                 />
//                 I declare all the informations....
//               </label>
//             </div>

//             {/* Submit Button */}
//             <div style={{ textAlign: "center", marginTop: 8 }}>
//               <button
//                 onClick={() => alert("Form submitted!")}
//                 style={{
//                   background: GREEN,
//                   color: "#fff",
//                   fontWeight: 900,
//                   fontSize: 15,
//                   padding: "12px 48px",
//                   borderRadius: 4,
//                   border: "none",
//                   cursor: "pointer",
//                   letterSpacing: "0.08em",
//                 }}
//               >
//                 SUBMIT
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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
  ],
};

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

export default function MembershipPage() {
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    email: "",
    photo: null,
    aadhar: "",
    pan: "",
    dob: "",
    address: "",
    state: "",
    district: "",
    zip: "",
    policeStation: "",
    signature: null,
    agree1: false,
    agree2: false,
  });
  const [selectedState, setSelectedState] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setForm((p) => ({ ...p, [name]: files[0] }));
    else if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
    else setForm((p) => ({ ...p, [name]: value }));
    if (name === "state") {
      setSelectedState(value);
      setForm((p) => ({ ...p, district: "" }));
    }
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
      {/* ── MEMBERSHIP & BENEFITS TEXT ── */}
      <div className="mem-text-wrap">
        <h2 className="mem-main-heading">
          Membership &amp; Benefits / सदस्यता एवं सुविधा
        </h2>
        <div
          style={{
            borderTop: `2px solid ${GREEN}`,
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p className="mem-body-text">
            <span style={{ fontWeight: 700 }}>Membership :</span> Any citizen of
            the country whose minimum age is 18 years can get membership under
            Jan Swasthya Sahayata Abhiyan. Documents required: Aadhar card, PAN
            card and photocopy of ration card and membership fee are necessary.
          </p>
          <p className="mem-body-text">
            <span style={{ fontWeight: 700 }}>सदस्यता :</span> देश के कोई भी
            नागरिक जिसकी न्यूनतम आयु 18 वर्ष है, वो जन स्वास्थ्य सहायता अभियान
            के अंतर्गत सदस्यता प्राप्त कर सकते हैं। सदस्यता लेने के लिए जरूरी
            दस्तावेज: आधारकार्ड, पैन कार्ड तथा राशन कार्ड की छायाप्रति एवं
            सदस्यता शुल्क जरूरी है।
          </p>
          <p className="mem-body-text">
            <span style={{ fontWeight: 700 }}>Benefits :</span> Jan Swasthya
            Sahayata card is provided by the organization to each member.
            Through this card, you will get better treatment by special doctor,
            medicines and medical examination in health camps organized by the
            organization and as per need, financial assistance and health
            related assistance will be provided.
          </p>
          <p className="mem-body-text">
            <span style={{ fontWeight: 700 }}>सुविधा :</span> जन स्वास्थ्य
            सहायता अभियान के अंतर्गत जुड़े प्रत्येक सदस्य को संस्था द्वारा एक जन
            स्वास्थ्य सहायता कार्ड प्रदान किया जाता है और इस कार्ड के माध्यम से
            आपको संस्था द्वारा आयोजित स्वास्थ्य शिविर में विशेष चिकित्सक द्वारा
            बेहतर इलाज, दवाईयां एवं चिकित्सा जांच करायी जायेगी तथा आवश्यकतानुसार
            आर्थिक सहायता एवं स्वास्थ्य संबंधी सहायता प्रदान की जायेगी।
          </p>
        </div>
      </div>

      {/* ── REGISTRATION FORM ── */}
      <div className="mem-form-wrap">
        <div
          style={{
            background: "#f0f0f0",
            borderRadius: 6,
            padding: "28px 24px",
          }}
        >
          <h2 className="mem-form-heading">
            ONLINE MEMBERSHIP REGISTRATION FORM / ऑनलाइन सदस्यता पंजीकरण फॉर्म :
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name + Father Name */}
            <div className="mem-grid-2">
              <div>
                <label style={labelStyle}>Your Name / आपका नाम *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Father's Name / पिता का नाम *</label>
                <input
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Mobile + Email */}
            <div className="mem-grid-2">
              <div>
                <label style={labelStyle}>Mobile Number / मोबाइल नंबर *</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Id / ईमेल आईडी *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Photo + Aadhar */}
            <div className="mem-grid-2">
              <div>
                <label style={labelStyle}>
                  Attach Photograph / फोटोग्राफ संलग्न करें *
                </label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ ...inputStyle, padding: "6px 8px" }}
                />
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  Max file size: 1 MB
                </p>
              </div>
              <div>
                <label style={labelStyle}>Aadhar No / आधार नंबर *</label>
                <input
                  name="aadhar"
                  value={form.aadhar}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* PAN + DOB */}
            <div className="mem-grid-2">
              <div>
                <label style={labelStyle}>PAN Card No / पैन कार्ड नं *</label>
                <input
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date Of Birth / जन्मतिथि *</label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <label style={labelStyle}>Permanent Address / स्थाई पता</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House No, Street Name, Area and Landmark"
                style={inputStyle}
              />
            </div>

            {/* State + District + ZIP */}
            <div className="mem-grid-3">
              <div>
                <label style={labelStyle}>State / राज्य</label>
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
                <label style={labelStyle}>District / जिला</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">--Please Select--</option>
                  {(districtsByState[selectedState] || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Zip / Postal Code</label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Police Station */}
            <div>
              <label style={labelStyle}>
                Local Police Station / स्थानीय पुलिस स्टेशन *
              </label>
              <input
                name="policeStation"
                value={form.policeStation}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Membership Fee + Signature */}
            <div className="mem-grid-2">
              <div>
                <label style={labelStyle}>
                  Membership Fees / सदस्यता शुल्क * :
                </label>
                <input
                  readOnly
                  value="₹ 150/- only"
                  style={{
                    ...inputStyle,
                    background: "#fff",
                    color: "#333",
                    fontWeight: 600,
                    width: "auto",
                    cursor: "default",
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Attach Signature / हस्ताक्षर संलग्न करें *
                </label>
                <input
                  name="signature"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ ...inputStyle, padding: "6px 8px" }}
                />
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  Max file size: 1 MB
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="mem-checkbox-label">
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
                    flexShrink: 0,
                  }}
                />
                I have read and agree to the Terms and Conditions.{" "}
                <a
                  href="#"
                  style={{
                    color: "#000",
                    fontWeight: 700,
                    textDecoration: "underline",
                    marginLeft: 4,
                  }}
                >
                  Click here to read
                </a>
              </label>
              <label className="mem-checkbox-label">
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
                    flexShrink: 0,
                  }}
                />
                I declare that all the information given in this form is correct
                to the best of my knowledge and belief.
              </label>
            </div>

            {/* Submit */}
            <div style={{ textAlign: "center", marginTop: 6 }}>
              <button
                onClick={() => alert("Form submitted!")}
                className="mem-submit-btn"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        /* ── Text section ── */
        .mem-text-wrap   { padding: 32px 40px; background: #fff; }
        .mem-main-heading { font-weight: 900; font-size: 26px; color: #1a2a4a; margin-bottom: 20px; }
        .mem-body-text   { font-size: 15px; line-height: 1.9; color: #000; }

        /* ── Form section ── */
        .mem-form-wrap   { padding: 0 40px 40px; }
        .mem-form-heading { font-weight: 900; font-size: 17px; color: #000; margin-bottom: 24px; line-height: 1.5; }

        /* ── Grids ── */
        .mem-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .mem-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }

        /* ── Checkboxes ── */
        .mem-checkbox-label {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 14px; color: #000; cursor: pointer; line-height: 1.6;
        }

        /* ── Submit button ── */
        .mem-submit-btn {
          background: ${GREEN}; color: #fff; font-weight: 900;
          font-size: 15px; padding: 12px 48px; border-radius: 4px;
          border: none; cursor: pointer; letter-spacing: 0.08em;
        }

        /* ══════════════════════════
           MOBILE  ≤ 768px
        ══════════════════════════ */
        @media (max-width: 768px) {
          /* Text section */
          .mem-text-wrap    { padding: 18px 14px; }
          .mem-main-heading { font-size: 18px; margin-bottom: 14px; }
          .mem-body-text    { font-size: 13px; line-height: 1.8; }

          /* Form section */
          .mem-form-wrap    { padding: 0 12px 32px; }
          .mem-form-heading { font-size: 14px; margin-bottom: 18px; }

          /* 2-col → 1-col */
          .mem-grid-2 { grid-template-columns: 1fr; gap: 16px; }

          /* 3-col → 1-col */
          .mem-grid-3 { grid-template-columns: 1fr; gap: 16px; }

          /* Checkboxes */
          .mem-checkbox-label { font-size: 13px; }

          /* Submit button */
          .mem-submit-btn { font-size: 14px; padding: 11px 36px; }
        }
      `}</style>
    </div>
  );
}
