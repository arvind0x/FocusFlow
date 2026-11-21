import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Plus,
  X
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PriorityLevel } from '../../types'
import {
  cbseSeniorSecondarySyllabus,
  cbseSyllabusPdfLinks,
  syllabusSubjectOrder,
  type SyllabusClass,
  type SyllabusChapterOption,
  type SyllabusSubject
} from './cbseSeniorSecondarySyllabus'

export const OnboardingModal: React.FC = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    profile,
    updateProfile,
    subjects,
    addSubjects,
    updateSubject,
    generateSmartTimetable,
    setActiveTab
  } = useApp()

  const [step, setStep] = useState<number>(1)

  const [name, setName] = useState(profile.name)
  const [gradeOrExam, setGradeOrExam] = useState(profile.gradeOrExam)
  const [dailyHours, setDailyHours] = useState(profile.targetDailyStudyHours)
  const [focusDuration, setFocusDuration] = useState(profile.preferredFocusMinutes)
  const [breakDuration, setBreakDuration] = useState(profile.preferredBreakMinutes)
  const [companionName, setCompanionName] = useState(profile.companionName)
  const [companionTone, setCompanionTone] = useState(profile.companionTone)
  const [checkInInterval, setCheckInInterval] = useState(profile.checkInIntervalMinutes)

  const examOptions = [
    'Class 11 — JEE Main & Advanced',
    'Class 12 — Boards & Competitive Exam',
    'Class 11 & 12 — NEET Aspirant',
    'Class 10 — Board Exam Preparation',
    'Class 9 — Foundation & Olympiads',
    'College Entrance / General Competitive'
  ]

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    subjects.map((s) => s.name)
  )
  const [chapterClass, setChapterClass] = useState<SyllabusClass>(
    gradeOrExam.startsWith('Class 10') ? '10' : gradeOrExam.startsWith('Class 12') ? '12' : '11'
  )
  const [chapterSubjectFilter, setChapterSubjectFilter] = useState<'all' | SyllabusSubject>('all')
  const [chapterSelection, setChapterSelection] = useState('')
  const [selectedChapters, setSelectedChapters] = useState<SyllabusChapterOption[]>([])
  const [chapterEntryMode, setChapterEntryMode] = useState<'cbse' | 'custom'>(
    gradeOrExam.startsWith('Class 10') || gradeOrExam.startsWith('Class 11') || gradeOrExam.startsWith('Class 12') ? 'cbse' : 'custom'
  )
  const [customChapterSubject, setCustomChapterSubject] = useState('')
  const [customChapterTitle, setCustomChapterTitle] = useState('')
  const [customChapters, setCustomChapters] = useState<{ subject: string; title: string }[]>([])
  const supportsCbseSyllabus = gradeOrExam.startsWith('Class 10') || gradeOrExam.startsWith('Class 11') || gradeOrExam.startsWith('Class 12')

  const defaultSubjectPool = [
    { name: 'Physics', color: '#3b82f6', priority: 'high' as PriorityLevel },
    { name: 'Chemistry', color: '#10b981', priority: 'high' as PriorityLevel },
    { name: 'Mathematics', color: '#8b5cf6', priority: 'high' as PriorityLevel },
    { name: 'Biology', color: '#14b8a6', priority: 'high' as PriorityLevel },
    { name: 'Computer Science', color: '#f59e0b', priority: 'medium' as PriorityLevel },
    { name: 'English', color: '#ec4899', priority: 'low' as PriorityLevel }
  ]

  const subjectsInSelectedClass = Object.keys(cbseSeniorSecondarySyllabus[chapterClass]) as SyllabusSubject[]
  const availableSyllabusSubjects = syllabusSubjectOrder.filter((subject) =>
    selectedSubjects.includes(subject) && subjectsInSelectedClass.includes(subject)
  )
  const availableChapterOptions = availableSyllabusSubjects
    .flatMap((subject) => (cbseSeniorSecondarySyllabus[chapterClass][subject] || []).map((title) => ({
      subject,
      classLevel: chapterClass,
      title
    })))
    .filter((chapter) => chapterSubjectFilter === 'all' || chapter.subject === chapterSubjectFilter)
    .filter((chapter) => !selectedChapters.some((selected) =>
      selected.subject === chapter.subject &&
      selected.classLevel === chapter.classLevel &&
      selected.title === chapter.title
    ))
  const selectedChapterOption = availableChapterOptions.find(
    (chapter) => `${chapter.subject}::${chapter.title}` === chapterSelection
  )

  const addSelectedChapter = () => {
    if (!selectedChapterOption) return
    setSelectedChapters((previous) => [...previous, selectedChapterOption])
    setChapterSelection('')
  }

  const addCustomChapter = () => {
    const subject = customChapterSubject.trim()
    const title = customChapterTitle.trim()
    if (!subject || !title) return

    const alreadyAdded = customChapters.some((chapter) =>
      chapter.subject.toLowerCase() === subject.toLowerCase() &&
      chapter.title.toLowerCase() === title.toLowerCase()
    )
    if (alreadyAdded) return

    setCustomChapters((previous) => [...previous, { subject, title }])
    setCustomChapterSubject(subject)
    setCustomChapterTitle('')
  }

  const toggleSubject = (subName: string) => {
    const isSelected = selectedSubjects.includes(subName)
    setSelectedSubjects((previous) =>
      isSelected ? previous.filter((subject) => subject !== subName) : [...previous, subName]
    )
    setChapterSelection('')

    if (isSelected && syllabusSubjectOrder.includes(subName as SyllabusSubject)) {
      setSelectedChapters((previous) => previous.filter((chapter) => chapter.subject !== subName))
      setChapterSubjectFilter((previous) => previous === subName ? 'all' : previous)
    }
  }

  const handleFinish = () => {
    const manualSubjectNames = [...customChapters.reduce((names, chapter) => {
      const key = chapter.subject.toLowerCase()
      if (!names.has(key)) names.set(key, chapter.subject)
      return names
    }, new Map<string, string>()).values()]
    const customColors = ['#3b82f6', '#10b981', '#8b5cf6', '#14b8a6', '#f59e0b', '#ec4899']
    const customSubjectConfigs = manualSubjectNames.map((subjectName, index) => {
      const preset = defaultSubjectPool.find(
        (subject) => subject.name.toLowerCase() === subjectName.toLowerCase()
      )
      return preset || {
        name: subjectName,
        color: customColors[index % customColors.length],
        priority: 'medium' as PriorityLevel
      }
    })
    const subjectConfigs = [
      ...defaultSubjectPool.filter((subject) => selectedSubjects.includes(subject.name)),
      ...customSubjectConfigs
    ].filter((subject, index, allSubjects) =>
      allSubjects.findIndex((candidate) => candidate.name.toLowerCase() === subject.name.toLowerCase()) === index
    )
    const pool = addSubjects(
      subjectConfigs.map((subject) => ({ ...subject, weeklyGoalHours: 0 }))
    )
    const poolWithChapterProgress = pool.map((subject) => {
      const additions: { subject: string; title: string; classLevel?: SyllabusClass }[] = [
        ...selectedChapters.filter((chapter) => chapter.subject === subject.name),
        ...customChapters.filter((chapter) =>
          chapter.subject.toLowerCase() === subject.name.toLowerCase()
        )
      ]
      if (additions.length === 0) return subject

      const chapters = [...(subject.chapters || [])]
      additions.forEach((addition) => {
        const existingIndex = chapters.findIndex((chapter) =>
          chapter.title.trim().toLowerCase() === addition.title.toLowerCase() &&
          (addition.classLevel
            ? !chapter.classLevel || chapter.classLevel === addition.classLevel
            : !chapter.classLevel)
        )

        if (existingIndex >= 0) {
          const existing = chapters[existingIndex]
          chapters[existingIndex] = {
            ...existing,
            completed: true,
            classLevel: existing.classLevel || addition.classLevel
          }
        } else {
          const chapterSlug = addition.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          chapters.push({
            id: `chapter-${subject.id}-${addition.classLevel || 'custom'}-${chapterSlug}`,
            title: addition.title,
            completed: true,
            ...(addition.classLevel ? { classLevel: addition.classLevel } : {})
          })
        }
      })

      updateSubject(subject.id, { chapters })
      return { ...subject, chapters }
    })
    const chosenSubjectNames = new Set(
      [...selectedSubjects, ...manualSubjectNames].map((subjectName) => subjectName.toLowerCase())
    )
    const chosenIds = poolWithChapterProgress
      .filter((subject) => chosenSubjectNames.has(subject.name.toLowerCase()))
      .map((subject) => subject.id)

    updateProfile({
      name: name.trim() || 'Student',
      gradeOrExam,
      targetDailyStudyHours: dailyHours,
      preferredFocusMinutes: focusDuration,
      preferredBreakMinutes: breakDuration,
      companionName: companionName.trim() || 'StudyBot',
      companionTone,
      checkInIntervalMinutes: checkInInterval,
      onboardingCompleted: true
    })

    generateSmartTimetable({
      startHour: 16,
      endHour: Math.min(22, 16 + Math.ceil(dailyHours)),
      focusDurationMinutes: focusDuration,
      breakDurationMinutes: breakDuration,
      selectedSubjectIds: chosenIds,
      subjectPool: poolWithChapterProgress
    })

    setShowOnboardingModal(false)
    setActiveTab('dashboard')
  }

  if (!showOnboardingModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-black border border-zinc-700 flex items-center justify-center text-white font-mono text-xs">
              0{step}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Student Onboarding</h2>
              <p className="text-[11px] text-zinc-400">Step {step} of 5</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-white' : i < step ? 'w-3 bg-zinc-600' : 'w-3 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Profile & Exam Target */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Welcome to FocusFlow
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Tell us about your study goals
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  We customize your daily schedule, focus presets, and accountability checks around your specific academic target.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Your Preferred Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav, Priya, Rohan, Maya"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-sm focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-600"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                    Stored 100% locally in your browser.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Target Class or Competitive Exam
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setGradeOrExam(opt)
                          if (opt.startsWith('Class 10')) {
                            setChapterClass('10')
                            setChapterSubjectFilter('all')
                            setChapterEntryMode('cbse')
                          } else if (opt.startsWith('Class 12')) {
                            setChapterClass('12')
                            setChapterSubjectFilter('all')
                            setChapterEntryMode('cbse')
                          } else if (opt.startsWith('Class 11')) {
                            setChapterClass('11')
                            setChapterSubjectFilter('all')
                            setChapterEntryMode('cbse')
                          } else {
                            setChapterEntryMode('custom')
                          }
                        }}
                        className={`text-left p-3 rounded-xl border text-xs transition ${
                          gradeOrExam === opt
                            ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                            : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subjects Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Select your active subjects
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Pick the subjects you need to balance. Our engine automatically alternates high-priority subjects into peak focus windows.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {defaultSubjectPool.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.name)
                  return (
                    <button
                      key={sub.name}
                      type="button"
                      onClick={() => toggleSubject(sub.name)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-500 text-white shadow-sm'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  )
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-400">
                <strong className="text-white">Smart Rotation:</strong> High-priority subjects like Physics & Math are spaced between lighter review sessions to avoid mental fatigue.
              </div>
            </div>
          )}

          {/* STEP 3: Chapters Already Covered */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">Mark your syllabus progress</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {chapterEntryMode === 'cbse'
                    ? 'Choose from CBSE Class 10 Science biology topics or Class 11/12 subject chapters, or switch to your own syllabus.'
                    : 'Write in your subject or paper and add covered chapters one at a time.'}
                </p>
              </div>

              {supportsCbseSyllabus && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Syllabus entry method">
                  <button
                    type="button"
                    onClick={() => setChapterEntryMode('cbse')}
                    aria-pressed={chapterEntryMode === 'cbse'}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      chapterEntryMode === 'cbse'
                        ? 'border-zinc-500 bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    CBSE syllabus chapter list
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterEntryMode('custom')}
                    aria-pressed={chapterEntryMode === 'custom'}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      chapterEntryMode === 'custom'
                        ? 'border-zinc-500 bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    Write my own syllabus
                  </button>
                </div>
              )}

              {chapterEntryMode === 'cbse' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-medium text-zinc-500">Official CBSE 2026–27 syllabus PDFs:</span>
                  {cbseSyllabusPdfLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-zinc-800 bg-black px-2.5 py-1 text-[10px] text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                  <span className="text-[10px] text-zinc-500">Class 10 Biology topics are included in the integrated Science syllabus.</span>
                </div>
              )}

              {chapterEntryMode === 'custom' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="mb-3 text-xs text-zinc-400">
                      Enter a course, subject, or paper name, then add each chapter or topic you have already covered.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="custom-chapter-subject" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                          Subject or paper
                        </label>
                        <input
                          id="custom-chapter-subject"
                          type="text"
                          value={customChapterSubject}
                          onChange={(event) => setCustomChapterSubject(event.target.value)}
                          placeholder="e.g. Data Structures, Anatomy"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="custom-chapter-title" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                          Chapter or topic
                        </label>
                        <input
                          id="custom-chapter-title"
                          type="text"
                          value={customChapterTitle}
                          onChange={(event) => setCustomChapterTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                              event.preventDefault()
                              addCustomChapter()
                            }
                          }}
                          placeholder="e.g. Trees and Graphs"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addCustomChapter}
                      disabled={!customChapterSubject.trim() || !customChapterTitle.trim()}
                      className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add chapter
                    </button>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-black/60 p-3.5" aria-live="polite">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold text-zinc-200">Covered chapters</h4>
                      <span className="text-[10px] font-mono text-zinc-500">{customChapters.length} added</span>
                    </div>
                    {customChapters.length === 0 ? (
                      <p className="mt-2 text-xs text-zinc-500">Your chapters will appear here as you add them.</p>
                    ) : (
                      <ul className="mt-3 flex flex-col gap-2">
                        {customChapters.map((chapter) => (
                          <li
                            key={`${chapter.subject.toLowerCase()}-${chapter.title.toLowerCase()}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-mono text-zinc-500">{chapter.subject}</p>
                              <p className="break-words text-xs font-medium text-zinc-100">{chapter.title}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCustomChapters((previous) => previous.filter((item) => item !== chapter))}
                              aria-label={`Remove ${chapter.subject}: ${chapter.title}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : selectedSubjects.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-black p-4 text-xs text-zinc-400">
                  Choose Biology, Physics, Chemistry, or Mathematics in the previous step to pick chapters here.
                </div>
              ) : availableSyllabusSubjects.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-black p-4 text-xs text-zinc-400">
                  Select Biology for Class 10 Science topics, or Biology, Physics, Chemistry, or Mathematics for Class 11/12 chapter lists.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="syllabus-class" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                          Class
                        </label>
                        <select
                          id="syllabus-class"
                          value={chapterClass}
                          onChange={(event) => {
                            setChapterClass(event.target.value as SyllabusClass)
                            setChapterSubjectFilter('all')
                            setChapterSelection('')
                          }}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-zinc-600 focus:outline-none"
                        >
                          <option value="10">Class 10</option>
                          <option value="11">Class 11</option>
                          <option value="12">Class 12</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="syllabus-subject" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                          Subject
                        </label>
                        <select
                          id="syllabus-subject"
                          value={chapterSubjectFilter}
                          onChange={(event) => {
                            setChapterSubjectFilter(event.target.value as 'all' | SyllabusSubject)
                            setChapterSelection('')
                          }}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-zinc-600 focus:outline-none"
                        >
                          <option value="all">All subjects</option>
                          {availableSyllabusSubjects.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 items-end gap-2 sm:grid-cols-[1fr_auto]">
                      <div>
                        <label htmlFor="syllabus-chapter" className="mb-1.5 block text-xs font-semibold text-zinc-300">
                          Chapter
                        </label>
                        <select
                          id="syllabus-chapter"
                          value={chapterSelection}
                          onChange={(event) => setChapterSelection(event.target.value)}
                          disabled={availableChapterOptions.length === 0}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-zinc-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">
                            {availableChapterOptions.length > 0 ? 'Choose a chapter' : 'All chapters added'}
                          </option>
                          {availableChapterOptions.map((chapter) => (
                            <option
                              key={`${chapter.subject}::${chapter.title}`}
                              value={`${chapter.subject}::${chapter.title}`}
                            >
                              {chapterSubjectFilter === 'all' ? `${chapter.subject} · ${chapter.title}` : chapter.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addSelectedChapter}
                        disabled={!selectedChapterOption}
                        className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add chapter
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-black/60 p-3.5" aria-live="polite">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold text-zinc-200">Covered chapters</h4>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {selectedChapters.length} added
                      </span>
                    </div>
                    {selectedChapters.length === 0 ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        Your chapters will appear here as you add them.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {selectedChapters.map((chapter) => (
                          <li
                            key={`${chapter.classLevel}-${chapter.subject}-${chapter.title}`}
                            className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-mono text-zinc-500">
                                Class {chapter.classLevel} · {chapter.subject}
                              </p>
                              <p className="break-words text-xs font-medium text-zinc-100">
                                {chapter.title}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedChapters((previous) => previous.filter((item) =>
                                !(item.classLevel === chapter.classLevel && item.subject === chapter.subject && item.title === chapter.title)
                              ))}
                              aria-label={`Remove Class ${chapter.classLevel} ${chapter.subject}: ${chapter.title}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Available Hours & Rhythm */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Daily study hours & focus rhythm
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Validated in student interviews: realistic timetables prevent the "relax for the whole day" burnout cycle.
                </p>
              </div>

              <div className="space-y-4 pt-1 text-xs">
                <div className="p-4 rounded-xl bg-black border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-zinc-300">
                      Available Self-Study Hours Per Day
                    </label>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {dailyHours} Hours
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>2 hrs (Light)</span>
                    <span>5.5 hrs (Recommended)</span>
                    <span>10 hrs (Sprint)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-2">
                    Preferred Focus & Break Rhythm
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 45-10 Rule */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(45)
                        setBreakDuration(10)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 45 && breakDuration === 10
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                        <span>45–10 Rule</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Interview Pick
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        45 min deep focus + 10 min restorative break. Optimal for high schoolers.
                      </p>
                    </button>

                    {/* 25-5 Pomodoro */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(25)
                        setBreakDuration(5)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 25 && breakDuration === 5
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">
                        25–5 Pomodoro
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        25 min sprint + 5 min quick pause. Great for high distraction days.
                      </p>
                    </button>

                    {/* 50-10 Extended */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDuration(50)
                        setBreakDuration(10)
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        focusDuration === 50 && breakDuration === 10
                          ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">
                        50–10 Extended
                      </span>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        50 min uninterrupted work. Excellent for solving full mock papers.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Accountability Bot */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-black text-white">
                  Accountability Companion & Shield
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Addresses the key interview finding: <em>"Asked sibling to check on me so I stay focused."</em> FocusFlow provides an AI companion to keep you accountable!
                </p>
              </div>

              <div className="space-y-4 pt-1 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-300 mb-1.5">
                      Companion Name
                    </label>
                    <input
                      type="text"
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                      placeholder="e.g. StudyBot, Mentor Max"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-300 mb-1.5">
                      Check-In Frequency
                    </label>
                    <select
                      value={checkInInterval}
                      onChange={(e) => setCheckInInterval(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white"
                    >
                      <option value={15}>Every 15 minutes (Strict)</option>
                      <option value={20}>Every 20 minutes (Balanced)</option>
                      <option value={30}>Every 30 minutes (Gentle)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1.5">
                    Companion Personality Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['encouraging', 'friendly', 'strict'] as const).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setCompanionTone(tone)}
                        className={`p-2.5 rounded-xl border text-xs capitalize transition ${
                          companionTone === tone
                            ? 'bg-zinc-900 border-zinc-500 text-white font-semibold'
                            : 'bg-black border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <strong className="text-white block">Ready to Launch!</strong>
                    Your personalized study schedule will be generated and your focus dashboard will open immediately.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowOnboardingModal(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Skip for now
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Complete Setup & Launch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
