const GREEN = "#3AB000";
const NAVY = "#1a2a4a";

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

const introItems = [
  {
    bold: "parichay :",
    text: " jan swasthya sahayata abhiyan ka gathan healthcare research end development board (Division Of Social Welfare Organization NAC.) dwara sasti, nihshulk evam behtar ilaj tatha garib evam jarooratmand logon ko swasthya sambandhit sahayata muhaiya karavane ke liye kiya gaya hai.",
    isHindi: true,
    boldText: "परिचय :",
    fullText:
      " जन स्वास्थ्य सहायता अभियान का गठन हेल्थकेयर रिसर्च एंड डेवलपमेंट बोर्ड (Division Of Social Welfare Organization NAC.) द्वारा सस्ती, निःशुल्क एवं बेहतर इलाज तथा गरीब एवं जरूरतमंद लोगों को स्वास्थ्य संबंधित सहायता मुहैया करवाने के लिए किया गया है।",
  },
  {
    boldText: "Introduction :",
    fullText:
      " Jan Swasthya Sahayata Abhiyan has been formed by the Healthcare Research and Development Board (Division of Social Welfare Organization NAC.) to provide affordable, free & better treatment with health related assistance to poor and needy people.",
  },
  {
    boldText: "उद्देश्य :",
    fullText:
      " जन स्वास्थ्य सहायता अभियान के माध्यम से देश के गरीब और जरूरतमंद लोगों को विशेष चिकित्सक, दवाईयां और चिकित्सा जांच द्वारा बेहतर उपचार प्रदान करना, साथ ही जागरूकता कार्यक्रम आयोजित कर COVID 19 से सुरक्षित रहने के लिए सरकार द्वारा दिए गए दिशा-निर्देशों का पालन करने हेतु लोगों को प्रेरित करना और स्वस्थ रहने के लिए योग और व्यायाम प्रशिक्षण के साथ स्वास्थ्य संबंधित सहायता मुहैया करवाना।",
  },
  {
    boldText: "Purpose :",
    fullText:
      " To provide better treatment by special doctors, medicines and medical tests to the poor and needy people of the country through Jan Swasthya Sahayata Abhiyan, Also motivating people to follow the guidelines given by the government to stay safe from COVID 19 by organizing awareness programs and providing health related support as well as providing yoga and exercise training.",
  },
];

const membershipItems = [
  {
    boldText: "Membership :",
    fullText:
      " Any citizen of the country whose minimum age is 18 years can get membership under Jan Swasthya Sahayata Abhiyan, Documents required to take membership: Aadhar card, PAN card and photocopy of ration card and membership fee are necessary.",
  },
  {
    boldText: "सदस्यता :",
    fullText:
      " देश के कोई भी नागरिक जिसकी न्यूनतम आयु 18 वर्ष है, वो जन स्वास्थ्य सहायता अभियान के अंतर्गत सदस्यता प्राप्त कर सकते हैं। सदस्यता लेने के लिए जरूरी दस्तावेज आधारकार्ड, पैन कार्ड तथा राशन कार्ड की छायाप्रति एवं सदस्यता शुल्क जरूरी है।",
  },
  {
    boldText: "Benefits :",
    fullText:
      " Jan Swasthya Sahayata card is provided by the organization to each member associated under the Jan Swasthya Sahayata Abhiyan. And through this card, you will get better treatment by special doctor, medicines and medical examination in the health camp organized by the organization and as per the need, financial assistance and health related assistance will be provided up to Rs. 6500.",
  },
  {
    boldText: "सुविधा :",
    fullText:
      " जन स्वास्थ्य सहायता अभियान के अंतर्गत जुड़े प्रत्येक सदस्य को संस्था द्वारा एक जन स्वास्थ्य सहायता कार्ड प्रदान किया जाता है और इस कार्ड के माध्यम से आपको संस्था द्वारा आयोजित स्वास्थ्य शिविर में विशेष चिकित्सक द्वारा बेहतर इलाज, दवाईयां एवं चिकित्सा जांच करायी जायेगी तथा आवश्यकतानुसार Rs.6500 तक की आर्थिक सहायता एवं स्वास्थ्य संबंधी सहायता प्रदान की जायेगी।",
  },
];

const Dot = () => (
  <span
    style={{
      marginTop: 6,
      flexShrink: 0,
      width: 6,
      height: 6,
      borderRadius: 2,
      background: NAVY,
      display: "inline-block",
    }}
  />
);

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
        color: "#000",
        borderLeft: "5px solid #0d9aa0",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 100px",
        }}
        className="about-inner"
      >
        {/* MAIN TITLE */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              color: NAVY,
              fontWeight: 900,
              fontSize: 28,
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            जन स्वास्थ्य सहायता अभियान / JAN SWASTHYA SAHAYTA ABHIYAN
          </h1>
          <p style={{ fontSize: 15, color: NAVY, margin: "4px 0" }}>
            A Project Of Healthcare Research &amp; Development Board
          </p>
          <p style={{ fontSize: 14, color: NAVY, margin: "4px 0" }}>
            (HRDB is Division Of Social Welfare Organisation "NAC")
          </p>
          <p style={{ fontSize: 14, color: NAVY, margin: "4px 0" }}>
            Registration No. : 053083
          </p>
        </div>

        {/* LEGAL NOTICE */}
        <div
          style={{
            background: "#f0fde8",
            border: "1px solid #c6edb0",
            borderRadius: 4,
            padding: "16px 20px",
            fontSize: 14,
            lineHeight: 1.8,
            color: "#000",
            marginBottom: 36,
          }}
        >
          This project is organized Under social welfare organization "NAC"
          Registration No. : 053083 incorporated under [Pursuant to sub-section
          (2) of section 7 and sub-section (1) of section 8 of the Companies
          Act, 2013 (18 of 2013) and rule 18 of the Companies (Incorporation)
          Rules, 2014].
        </div>

        {/* INTRO PARAGRAPHS */}
        <div style={{ marginBottom: 36 }}>
          {introItems.map((item, i) => (
            <p
              key={i}
              style={{
                fontSize: 14,
                lineHeight: 1.9,
                color: "#000",
                marginBottom: 20,
              }}
            >
              <strong>{item.boldText}</strong>
              {item.fullText}
            </p>
          ))}
        </div>

        {/* MEMBERSHIP AND BENEFITS */}
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              color: NAVY,
              fontWeight: 900,
              fontSize: 24,
              marginBottom: 20,
            }}
          >
            Membership &amp; Benefits / सदस्यता एवं सुविधा
          </h2>
          {membershipItems.map((item, i) => (
            <p
              key={i}
              style={{
                fontSize: 14,
                lineHeight: 1.9,
                color: "#000",
                marginBottom: 20,
              }}
            >
              <strong>{item.boldText}</strong>
              {item.fullText}
            </p>
          ))}
        </div>

        {/* HEALTH CHECKUP PACKAGES */}
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              color: NAVY,
              fontWeight: 900,
              fontSize: 18,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          >
            HEALTH CHECKUP PACKAGES / स्वास्थ्य जांच पैकेज
          </h2>
          <div
            style={{
              borderTop: "2px solid " + GREEN,
              borderBottom: "2px solid " + GREEN,
              padding: "20px 0",
              marginTop: 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px 32px",
              }}
              className="pkg-grid"
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
                  }}
                >
                  <Dot />
                  {pkg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DISEASES */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              color: NAVY,
              fontWeight: 900,
              fontSize: 18,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Medicines and Doctor's Consultation for the following Diseases
          </h2>
          <h2
            style={{
              color: NAVY,
              fontWeight: 900,
              fontSize: 16,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            निम्नलिखित बीमारियों के लिए दवाएं और डॉक्टरों का परामर्श
          </h2>
          <div style={{ borderTop: "2px solid " + GREEN, paddingTop: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px 64px",
              }}
              className="disease-grid"
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
                  }}
                >
                  <Dot />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-inner { padding: 16px 12px !important; }
          .about-inner h1 { font-size: 15px !important; }
          .about-inner h2 { font-size: 13px !important; }
          .pkg-grid { gap: 4px 10px !important; }
          .disease-grid { gap: 4px 16px !important; }
        }
      `}</style>
    </div>
  );
}
