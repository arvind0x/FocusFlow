export type SyllabusClass = '10' | '11' | '12'
export type SyllabusSubject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology'

export interface SyllabusChapterOption {
  subject: SyllabusSubject
  classLevel: SyllabusClass
  title: string
}

export const syllabusSubjectOrder: SyllabusSubject[] = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology'
]

export const cbseSyllabusPdfLinks = [
  {
    label: 'Class 10 Science (includes Biology)',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf'
  },
  {
    label: 'Class 11–12 Physics',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf'
  },
  {
    label: 'Class 11–12 Chemistry',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Chemistry_SecP2_2026-27.pdf'
  },
  {
    label: 'Class 11–12 Maths',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf'
  },
  {
    label: 'Class 11–12 Biology',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Biology_SecP2_2026-27.pdf'
  }
]

export const cbseSeniorSecondarySyllabus: Record<
  SyllabusClass,
  Partial<Record<SyllabusSubject, string[]>>
> = {
  '10': {
    Biology: [
      'Life Processes',
      'Control and Coordination',
      'Reproduction',
      'Heredity and Evolution (Formative Assessment Only)',
      'Our Environment'
    ]
  },
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
    ],
    Biology: [
      'The Living World',
      'Biological Classification',
      'Plant Kingdom',
      'Animal Kingdom',
      'Morphology of Flowering Plants',
      'Anatomy of Flowering Plants',
      'Structural Organisation in Animals',
      'Cell: The Unit of Life',
      'Biomolecules',
      'Cell Cycle and Cell Division',
      'Photosynthesis in Higher Plants',
      'Respiration in Plants',
      'Plant Growth and Development',
      'Breathing and Exchange of Gases',
      'Body Fluids and Circulation',
      'Excretory Products and their Elimination',
      'Locomotion and Movement',
      'Neural Control and Coordination',
      'Chemical Coordination and Integration',
      'Digestion and Absorption (Formative Assessment Only)'
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
    ],
    Biology: [
      'Sexual Reproduction in Flowering Plants',
      'Human Reproduction',
      'Reproductive Health',
      'Principles of Inheritance and Variation',
      'Molecular Basis of Inheritance',
      'Evolution',
      'Human Health and Diseases',
      'Microbes in Human Welfare',
      'Biotechnology: Principles and Processes',
      'Biotechnology and its Applications',
      'Organisms and Populations',
      'Ecosystem',
      'Biodiversity and its Conservation',
      'Environmental Issues (Formative Assessment Only)'
    ]
  }
}
