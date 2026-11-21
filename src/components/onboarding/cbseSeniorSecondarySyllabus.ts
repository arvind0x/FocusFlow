export type SyllabusClass = '10' | '11' | '12'
export type SyllabusSubject = 'Science' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'English'

export interface SyllabusChapterOption {
  subject: SyllabusSubject
  classLevel: SyllabusClass
  title: string
}

export const syllabusSubjectOrder: SyllabusSubject[] = [
  'Science',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'English'
]

export const cbseSyllabusPdfLinks = [
  {
    label: 'Class 10 Science (includes Biology)',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf'
  },
  {
    label: 'Class 10 Mathematics',
    url: 'https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf'
  },
  {
    label: 'CBSE curriculum (including English)',
    url: 'https://cbseacademic.nic.in/curriculum_2027.html'
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
    Science: [
      'Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals',
      'Carbon and its Compounds', 'Life Processes', 'Control and Coordination',
      'How do Organisms Reproduce?', 'Heredity', 'Light: Reflection and Refraction',
      'The Human Eye and the Colourful World', 'Electricity',
      'Magnetic Effects of Electric Current', 'Our Environment'
    ],
    Mathematics: [
      'Real Numbers', 'Polynomials', 'Pair of Linear Equations in Two Variables',
      'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry',
      'Introduction to Trigonometry', 'Some Applications of Trigonometry', 'Circles',
      'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'
    ],
    English: [
      'Reading Skills', 'Grammar and Writing Skills',
      'First Flight: A Letter to God', 'First Flight: Nelson Mandela: Long Walk to Freedom',
      'First Flight: Stories About Flying', 'First Flight: From the Diary of Anne Frank',
      'First Flight: Glimpses of India', 'First Flight: Mijbil the Otter',
      'First Flight: Madam Rides the Bus', 'First Flight: The Sermon at Benares',
      'First Flight: The Proposal', 'First Flight: Dust of Snow', 'First Flight: Fire and Ice',
      'First Flight: A Tiger in the Zoo', 'First Flight: How to Tell Wild Animals',
      'First Flight: The Ball Poem', 'First Flight: Amanda!', 'First Flight: The Trees',
      'First Flight: Fog', 'First Flight: The Tale of Custard the Dragon',
      'First Flight: For Anne Gregory', 'Footprints Without Feet: A Triumph of Surgery',
      "Footprints Without Feet: The Thief's Story", 'Footprints Without Feet: The Midnight Visitor',
      'Footprints Without Feet: A Question of Trust', 'Footprints Without Feet: Footprints Without Feet',
      'Footprints Without Feet: The Making of a Scientist', 'Footprints Without Feet: The Necklace',
      'Footprints Without Feet: Bholi', 'Footprints Without Feet: The Book That Saved the Earth'
    ]
  },
  '11': {
    English: [
      'Reading Skills', 'Grammar and Creative Writing Skills',
      'Hornbill: The Portrait of a Lady', 'Hornbill: A Photograph',
      'Hornbill: We’re Not Afraid to Die... if We Can All Be Together',
      'Hornbill: Discovering Tut: The Saga Continues', 'Hornbill: The Laburnum Top',
      'Hornbill: The Voice of the Rain', 'Hornbill: Childhood', 'Hornbill: The Adventure',
      'Hornbill: Silk Road', 'Hornbill: Father to Son',
      'Snapshots: The Summer of the Beautiful White Horse', 'Snapshots: The Address',
      'Snapshots: Mother’s Day', 'Snapshots: Birth', 'Snapshots: The Tale of Melon City'
    ],
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
    English: [
      'Reading Skills', 'Creative Writing Skills', 'Flamingo: The Last Lesson',
      'Flamingo: Lost Spring', 'Flamingo: Deep Water', 'Flamingo: The Rattrap',
      'Flamingo: Indigo', 'Flamingo: Poets and Pancakes', 'Flamingo: The Interview',
      'Flamingo: Going Places', 'Flamingo: My Mother at Sixty-Six', 'Flamingo: Keeping Quiet',
      'Flamingo: A Thing of Beauty', 'Flamingo: A Roadside Stand', 'Flamingo: Aunt Jennifer’s Tigers',
      'Vistas: The Third Level', 'Vistas: The Tiger King', 'Vistas: Journey to the End of the Earth',
      'Vistas: The Enemy', 'Vistas: On the Face of It', 'Vistas: Memories of Childhood'
    ],
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
