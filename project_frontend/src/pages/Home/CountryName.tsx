import ReactCountryFlag from "react-country-flag";

const countryNames: Record<string, string> = {
  AF: "Afganistán",
  DE: "Alemania",
  AR: "Argentina",
  AU: "Australia",
  BR: "Brasil",
  CA: "Canadá",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KR: "Corea del Sur",
  CU: "Cuba",
  DK: "Dinamarca",
  EC: "Ecuador",
  EG: "Egipto",
  SV: "El Salvador",
  ES: "España",
  US: "Estados Unidos",
  FR: "Francia",
  GR: "Grecia",
  GT: "Guatemala",
  HN: "Honduras",
  IN: "India",
  ID: "Indonesia",
  IE: "Irlanda",
  IT: "Italia",
  JP: "Japón",
  MX: "México",
  NI: "Nicaragua",
  NO: "Noruega",
  PA: "Panamá",
  PY: "Paraguay",
  PE: "Perú",
  PL: "Polonia",
  PT: "Portugal",
  GB: "Reino Unido",
  DO: "República Dominicana",
  RU: "Rusia",
  SE: "Suecia",
  CH: "Suiza",
  TH: "Tailandia",
  TR: "Turquía",
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
