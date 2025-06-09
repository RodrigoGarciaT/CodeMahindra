import ReactCountryFlag from "react-country-flag";

const countryNames: Record<string, string> = {
  AF: "Afghanistan",
  DE: "Germany",
  AR: "Argentina",
  AU: "Australia",
  BR: "Brazil",
  CA: "Canada",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KR: "South Korea",
  CU: "Cuba",
  DK: "Denmark",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  ES: "Spain",
  US: "United States",
  FR: "France",
  GR: "Greece",
  GT: "Guatemala",
  HN: "Honduras",
  IN: "India",
  ID: "Indonesia",
  IE: "Ireland",
  IT: "Italy",
  JP: "Japan",
  MX: "Mexico",
  NI: "Nicaragua",
  NO: "Norway",
  PA: "Panama",
  PY: "Paraguay",
  PE: "Peru",
  PL: "Poland",
  PT: "Portugal",
  GB: "United Kingdom",
  DO: "Dominican Republic",
  RU: "Russia",
  SE: "Sweden",
  CH: "Switzerland",
  TH: "Thailand",
  TR: "Turkey",
  UY: "Uruguay",
  VE: "Venezuela",
  VN: "Vietnam"
};

const nameToCode: Record<string, string> = Object.entries(countryNames).reduce(
  (acc, [code, name]) => {
    acc[name.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, string>
);

// A simple globe icon from Wikimedia as a fallback
const defaultFlagUrl = "https://webspace.ship.edu/cgboer/unflag.gif";

export default function CountryName({
  code,
  showCountryName = true
}: {
  code: string;
  showCountryName?: boolean;
}) {
  const normalized = code.trim();
  const upperCode = normalized.toUpperCase();

  let countryCode = "";
  let countryTitle = "";

  if (countryNames[upperCode]) {
    countryCode = upperCode;
    countryTitle = countryNames[upperCode];
  } else {
    const matchedCode = nameToCode[normalized.toLowerCase()];
    if (matchedCode) {
      countryCode = matchedCode;
      countryTitle = countryNames[matchedCode];
    } else {
      countryCode = ""; // Not a valid code
      countryTitle = normalized;
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {countryCode ? (
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{ width: "1.5em", height: "1.5em" }}
          title={countryTitle}
        />
      ) : (
        <img
          src={defaultFlagUrl}
          alt="Unknown country"
          style={{ width: "1.5em", height: "1.5em" }}
        />
      )}
      {showCountryName && <span>{countryTitle}</span>}
    </div>
  );
}
