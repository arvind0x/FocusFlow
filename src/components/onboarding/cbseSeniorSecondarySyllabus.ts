export type SyllabusClass = '11' | '12'
export type SyllabusSubject = 'Physics' | 'Chemistry' | 'Mathematics'

export interface SyllabusChapterOption {
  subject: SyllabusSubject
  classLevel: SyllabusClass
  title: string
}

export const syllabusSubjectOrder: SyllabusSubject[] = [
  'Physics',
  'Chemistry',
  'Mathematics'
]

export const cbseSyllabusPdfUrls: Record<SyllabusSubject, string> = {
  Physics: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf',
  Chemistry: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Chemistry_SecP2_2026-27.pdf',
  Mathematics: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf'
}

export const cbseSeniorSecondarySyllabus: Record<
  SyllabusClass,
  Record<SyllabusSubject, string[]>
> = {
  '11': {
    Physics: [
      'Units and Measurements',
      'Motion in a Straight Line',
      'Motion in a Plane',
      'Laws of Motion',
      'Work, Energy and Power',
      'System of Particles and Rotational Motion',
      'Gravitation',
      'Mechanical Properties of Solids',
      'Mechanical Properties of Fluids',
      'Thermal Properties of Matter',
      'Thermodynamics',
      'Kinetic Theory',
      'Oscillations',
      'Waves'
    ],
    Chemistry: [
      'Some Basic Concepts of Chemistry',
      'Structure of Atom',
      'Classification of Elements and Periodicity in Properties',
      'Chemical Bonding and Molecular Structure',
      'Chemical Thermodynamics',
      'Equilibrium',
      'Redox Reactions',
      'Organic Chemistry: Some Basic Principles and Techniques',
      'Hydrocarbons'
    ],
    Mathematics: [
      'Sets',
      'Relations and Functions',
      'Trigonometric Functions',
      'Complex Numbers and Quadratic Equations',
      'Linear Inequalities',
      'Permutations and Combinations',
      'Binomial Theorem',
      'Sequence and Series',
      'Straight Lines',
      'Conic Sections',
      'Introduction to Three-dimensional Geometry',
      'Limits and Derivatives',
      'Statistics',
      'Probability'
    ]
  },
  '12': {
    Physics: [
      'Electric Charges and Fields',
      'Electrostatic Potential and Capacitance',
      'Current Electricity',
      'Moving Charges and Magnetism',
      'Magnetism and Matter',
      'Electromagnetic Induction',
      'Alternating Current',
      'Electromagnetic Waves',
      'Ray Optics and Optical Instruments',
      'Wave Optics',
      'Dual Nature of Radiation and Matter',
      'Atoms',
      'Nuclei',
      'Semiconductor Electronics: Materials, Devices and Simple Circuits'
    ],
    Chemistry: [
      'Solutions',
      'Electrochemistry',
      'Chemical Kinetics',
      'd- and f-Block Elements',
      'Coordination Compounds',
      'Haloalkanes and Haloarenes',
      'Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids',
      'Amines',
      'Biomolecules'
    ],
    Mathematics: [
      'Relations and Functions',
      'Inverse Trigonometric Functions',
      'Matrices',
      'Determinants',
      'Continuity and Differentiability',
      'Applications of Derivatives',
      'Integrals',
      'Application of the Integrals',
      'Differential Equations',
      'Vectors',
      'Three-dimensional Geometry',
      'Linear Programming',
      'Probability'
    ]
  }
}
