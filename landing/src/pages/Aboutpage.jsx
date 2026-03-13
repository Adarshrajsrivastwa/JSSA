import { useState } from "react";

const GREEN = "#3AB000";

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
  'Conjunctivitis ("Pink Eye")',
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

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-white w-full px-10 py-10"
      style={{
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
        color: "#000",
      }}
    >
      {/* ── MAIN TITLE ── */}
      <div className="text-center mb-8">
        <h1
          className="font-black text-2xl sm:text-3xl mb-2"
          style={{ color: "#1a2a4a" }}
        >
          जन स्वास्थ्य सहायता अभियान / JAN SWASTHYA SAHAYTA ABHIYAN
        </h1>
        <p className="text-sm" style={{ color: "#000" }}>
          A Project Of Healthcare Research &amp; Development Board
        </p>
        <p className="text-sm" style={{ color: "#000" }}>
          (HRDB is Division Of Social Welfare Organisation "NAC")
        </p>
        <p className="text-sm" style={{ color: "#000" }}>
          Registration No. : 053083
        </p>
      </div>

      {/* ── LEGAL NOTICE ── */}
      <div
        className="rounded px-5 py-4 text-sm leading-relaxed mb-10"
        style={{
          background: "#f0fde8",
          border: "1px solid #c6edb0",
          color: "#000",
        }}
      >
        This project is organized Under social welfare organization "NAC"
        Registration No. : 053083 incorporated under [Pursuant to sub-section
        (2) of section 7 and sub-section (1) of section 8 of the Companies Act,
        2013 (18 of 2013) and rule 18 of the Companies (Incorporation) Rules,
        2014].
      </div>

      {/* ── INTRO PARAGRAPHS ── */}
      <div
        className="space-y-6 mb-10 text-sm leading-relaxed"
        style={{ color: "#000" }}
      >
        <p>
          <span className="font-bold">परिचय :</span> जन स्वास्थ्य सहायता अभियान
          का गठन हेल्थकेयर रिसर्च एंड डेवलपमेंट बोर्ड (Division Of Social
          Welfare Organization "NAC".) द्वारा सस्ती, निःशुल्क एवं बेहतर इलाज तथा
          गरीब एवं जरूरतमंद लोगों को स्वास्थ्य संबंधित सहायता मुहैया करवाने के
          लिए किया गया है।
        </p>
        <p>
          <span className="font-bold">Introduction :</span> Jan Swasthya
          Sahayata Abhiyan has been formed by the Healthcare Research and
          Development Board (Division of Social Welfare Organization "NAC".) to
          provide affordable, free &amp; better treatment with health related
          assistance to poor and needy people.
        </p>
        <p>
          <span className="font-bold">उद्देश्य :</span> जन स्वास्थ्य सहायता
          अभियान के माध्यम से देश के गरीब और जरूरतमंद लोगों को विशेष चिकित्सक,
          दवाईयां और चिकित्सा जांच द्वारा बेहतर उपचार प्रदान करना, साथ ही
          जागरूकता कार्यक्रम आयोजित कर COVID 19 से सुरक्षित रहने के लिए सरकार
          द्वारा दिए गए दिशा-निर्देशों का पालन करने हेतु लोगों को प्रेरित करना
          और स्वस्थ रहने के लिए योग और व्यायाम प्रशिक्षण के साथ स्वास्थ्य
          संबंधित सहायता मुहैया करवाना।
        </p>
        <p>
          <span className="font-bold">Purpose :</span> To provide better
          treatment by special doctors, medicines and medical tests to the poor
          and needy people of the country through Jan Swasthya Sahayata Abhiyan,
          Also motivating people to follow the guidelines given by the
          government to stay safe from COVID 19 by organizing awareness programs
          and providing health related support as well as providing yoga and
          exercise training.
        </p>
      </div>

      {/* ── MEMBERSHIP & BENEFITS ── */}
      <div className="mb-10">
        <h2
          className="font-black text-2xl sm:text-3xl mb-5"
          style={{ color: "#1a2a4a" }}
        >
          Membership &amp; Benefits / सदस्यता एवं सुविधा
        </h2>
        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{ color: "#000" }}
        >
          <p>
            <span className="font-bold">Membership :</span> Any citizen of the
            country whose minimum age is 18 years can get membership under Jan
            Swasthya Sahayata Abhiyan, Documents required to take membership:
            Aadhar card, PAN card and photocopy of ration card and membership
            fee are necessary.
          </p>
          <p>
            <span className="font-bold">सदस्यता :</span> देश के कोई भी नागरिक
            जिसकी न्यूनतम आयु 18 वर्ष है, वो जन स्वास्थ्य सहायता अभियान के
            अंतर्गत सदस्यता प्राप्त कर सकते हैं। सदस्यता लेने के लिए जरूरी
            दस्तावेज आधारकार्ड, पैन कार्ड तथा राशन कार्ड की छायाप्रति एवं
            सदस्यता शुल्क जरूरी है।
          </p>
          <p>
            <span className="font-bold">Benefits :</span> Jan Swasthya Sahayata
            card is provided by the organization to each member associated under
            the Jan Swasthya Sahayata Abhiyan. And through this card, you will
            get better treatment by special doctor, medicines and medical
            examination in the health camp organized by the organization and as
            per the need, financial assistance and health related assistance
            will be provided up to ₹ 6500.
          </p>
          <p>
            <span className="font-bold">सुविधा :</span> जन स्वास्थ्य सहायता
            अभियान के अंतर्गत जुड़े प्रत्येक सदस्य को संस्था द्वारा एक जन
            स्वास्थ्य सहायता कार्ड प्रदान किया जाता है और इस कार्ड के माध्यम से
            आपको संस्था द्वारा आयोजित स्वास्थ्य शिविर में विशेष चिकित्सक द्वारा
            बेहतर इलाज, दवाईयां एवं चिकित्सा जांच करायी जायेगी तथा आवश्यकतानुसार
            ₹6500 तक की आर्थिक सहायता एवं स्वास्थ्य संबंधी सहायता प्रदान की
            जायेगी।
          </p>
        </div>
      </div>

      {/* ── HEALTH CHECKUP PACKAGES ── */}
      <div className="mb-10">
        <h2
          className="font-black text-xl sm:text-2xl text-center mb-1 uppercase tracking-wide"
          style={{ color: "#1a2a4a" }}
        >
          HEALTH CHECKUP PACKAGES / स्वास्थ्य जांच पैकेज
        </h2>
        <div
          style={{
            borderTop: `2px solid ${GREEN}`,
            borderBottom: `2px solid ${GREEN}`,
          }}
          className="py-5 mt-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2">
            {checkupPackages.map((pkg, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: "#000" }}
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-sm"
                  style={{ background: "#1a2a4a", minWidth: 6 }}
                />
                {pkg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISEASES ── */}
      <div className="mb-10">
        <h2
          className="font-black text-xl sm:text-2xl text-center mb-1"
          style={{ color: "#1a2a4a" }}
        >
          Medicines and Doctor's Consultation for the following Diseases
        </h2>
        <h2
          className="font-black text-lg sm:text-xl text-center mb-3"
          style={{ color: "#1a2a4a" }}
        >
          निम्नलिखित बीमारियों के लिए दवाएं और डॉक्टरों का परामर्श
        </h2>
        <div style={{ borderTop: `2px solid ${GREEN}` }} className="pt-5">
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {diseases.map((d, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: "#000" }}
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-sm"
                  style={{ background: "#1a2a4a", minWidth: 6 }}
                />
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
