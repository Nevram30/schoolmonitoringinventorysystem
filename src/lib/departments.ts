/**
 * The programs the school offers, as shown in every department dropdown.
 *
 * The chosen label is what gets stored in `Borrower.m_department` (VarChar(100)), so a program
 * with majors stores "<program> - <major>" — long enough to be readable in the borrower list and
 * printed reports, short enough to fit the column.
 */
export interface Department {
  name: string;
  /** Majors the program offers, listed under it in the dropdown. */
  majors?: string[];
}

export const DEPARTMENTS: Department[] = [
  { name: "Bachelor of Elementary Education (BEEd)" },
  {
    name: "Bachelor of Secondary Education (BSEd)",
    majors: ["Mathematics", "English"],
  },
  { name: "Bachelor of Special Needs Education (BSNEd)" },
  { name: "Bachelor of Physical Education (BPE)" },
  { name: "Bachelor of Science in Information Technology (BSIT)" },
  { name: "Bachelor of Science in Geodetic Engineering (BSGE)" },
  { name: "Bachelor of Science in Computer Engineering (BSCE)" },
  { name: "Bachelor of Science in Nursing (BSN)" },
  { name: "Bachelor of Science in Criminology (BSCrim)" },
  {
    name: "Bachelor of Business Management (BSBA)",
    majors: [
      "Financial Management",
      "Human Resource Management",
      "Marketing Management",
    ],
  },
  {
    name: "Bachelor of Science in Tourism (BSTM)",
    majors: ["Tourism Management", "Hospitality Management"],
  },
];

/** The value stored for a program / major pair. */
export const departmentValue = (program: string, major?: string) =>
  major ? `${program} - ${major}` : program;

/** Every value the dropdown can produce, for prefilling a select from a stored department. */
export const DEPARTMENT_VALUES: string[] = DEPARTMENTS.flatMap((department) => [
  department.name,
  ...(department.majors ?? []).map((major) =>
    departmentValue(department.name, major)
  ),
]);

/**
 * Compact form for table cells: the program code with the major kept, so "Bachelor of Science in
 * Tourism (BSTM) - Hospitality Management" reads as "BSTM - Hospitality Management". A department
 * recorded before this list existed has no code, so it is shown as-is.
 */
export const departmentLabel = (value: string) => {
  const [program, major] = value.split(" - ");
  const code = program?.match(/\(([^)]+)\)/)?.[1];
  if (!code) return value;
  return major ? `${code} - ${major}` : code;
};

/** True when a stored department is one the dropdown offers. */
export const isKnownDepartment = (value: string) =>
  DEPARTMENT_VALUES.includes(value);
