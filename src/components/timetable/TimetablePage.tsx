import React, { useState } from 'react'
import {
  CalendarDays,
  Plus,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  Play,
  AlertCircle,
  Check
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { TimetableTask, PriorityLevel } from '../../types'
import { getTodayDateString, formatMinutesToHours } from '../../utils/formatters'

export const TimetablePage: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    rescheduleIncompleteTasks,
    generateSmartTimetable,
    subjects,
    updateSubject,
    startFocusSession,
    setActiveTab
  } = useApp()

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString())
  const [showGenModal, setShowGenModal] = useState<boolean>(false)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<TimetableTask | null>(null)
  const [saveToast, setSaveToast] = useState<boolean>(false)

  const currentTasks = tasks.filter((t) => t.date === selectedDate)

  // Generator parameters
  const [genStartHour, setGenStartHour] = useState<number>(16)
  const [genEndHour, setGenEndHour] = useState<number>(21)
  const [genFocusMins, setGenFocusMins] = useState<number>(45)
  const [genBreakMins, setGenBreakMins] = useState<number>(10)
  const [genSelectedSubs, setGenSelectedSubs] = useState<string[]>(subjects.map((s) => s.id))

  // New task form state
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '')
  const [formTitle, setFormTitle] = useState<string>('')
  const [formStartTime, setFormStartTime] = useState<string>('16:00')
  const [formEndTime, setFormEndTime] = useState<string>('16:45')
  const [formDuration, setFormDuration] = useState<number>(45)
  const [formPriority, setFormPriority] = useState<PriorityLevel>('high')
  const [formChapterId, setFormChapterId] = useState<string>('')
  const [showChapterForm, setShowChapterForm] = useState<boolean>(false)
  const [chapterSubjectId, setChapterSubjectId] = useState<string>(subjects[0]?.id || '')
  const [chapterTitle, setChapterTitle] = useState<string>('')

  const handleOpenAddModal = (taskToEdit?: TimetableTask) => {
    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setFormSubjectId(taskToEdit.subjectId)
      setFormTitle(taskToEdit.title)
      setFormStartTime(taskToEdit.startTime)
      setFormEndTime(taskToEdit.endTime)
      setFormDuration(taskToEdit.durationMinutes)
      setFormPriority(taskToEdit.priority)
      setFormChapterId(taskToEdit.chapterId || '')
    } else {
      setEditingTask(null)
      setFormSubjectId(subjects[0]?.id || '')
      setFormTitle('')
      setFormStartTime('16:00')
      setFormEndTime('16:45')
      setFormDuration(45)
      setFormPriority('high')
      setFormChapterId('')
    }
    setShowAddModal(true)
  }

  const handleAddChapter = (event: React.FormEvent) => {
    event.preventDefault()
    const title = chapterTitle.trim()
    const subject = subjects.find((item) => item.id === chapterSubjectId)
    if (!title || !subject) return
    if (subject.chapters?.some((chapter) => chapter.title.toLowerCase() === title.toLowerCase())) return

    updateSubject(subject.id, {
      chapters: [...(subject.chapters || []), {
        id: `chapter-${subject.id}-${Date.now()}`,
        title,
        completed: false
      }]
    })
    setChapterTitle('')
    setShowChapterForm(false)
  }

  const handleToggleChapter = (subjectId: string, chapterId: string) => {
    const subject = subjects.find((item) => item.id === subjectId)
    if (!subject) return
    updateSubject(subjectId, {
      chapters: subject.chapters?.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, completed: !chapter.completed } : chapter
      )
    })
  }

  const handleScheduleChapter = (subjectId: string, chapterId: string, title: string) => {
    handleOpenAddModal()
    setFormSubjectId(subjectId)
    setFormChapterId(chapterId)
    setFormTitle(title)
  }

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const selectedSub = subjects.find((s) => s.id === formSubjectId) || subjects[0]

    if (editingTask) {
      updateTask(editingTask.id, {
        subjectId: selectedSub.id,
        subjectName: selectedSub.name,
        chapterId: formChapterId || undefined,
        title: formTitle.trim(),
        startTime: formStartTime,
        endTime: formEndTime,
        durationMinutes: formDuration,
        priority: formPriority
      })
    } else {
      addTask({
        subjectId: selectedSub.id,
        subjectName: selectedSub.name,
        chapterId: formChapterId || undefined,
        title: formTitle.trim(),
        startTime: formStartTime,
        endTime: formEndTime,
        durationMinutes: formDuration,
        status: 'pending',
        date: selectedDate,
        priority: formPriority
      })
    }
    setShowAddModal(false)
  }

  const handleRunGenerator = () => {
    generateSmartTimetable({
      startHour: genStartHour,
      endHour: genEndHour,
      focusDurationMinutes: genFocusMins,
      breakDurationMinutes: genBreakMins,
      selectedSubjectIds: genSelectedSubs
    })
    setShowGenModal(false)
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  const handleStartTaskFocus = (task: TimetableTask) => {
    startFocusSession({
      subjectId: task.subjectId,
      subjectName: task.subjectName,
      taskTitle: task.title,
      focusMinutes: task.durationMinutes,
      breakMinutes: 10,
      preset: task.durationMinutes === 25 ? '25-5' : '45-10'
    })
    setActiveTab('focus')
  }

  const totalScheduledMinutes = currentTasks.reduce((acc, t) => acc + t.durationMinutes, 0)
  const isOverloaded = totalScheduledMinutes > 8 * 60
  const trackedSubjects = subjects.filter((subject) => (subject.chapters?.length || 0) > 0)
  const totalChapters = trackedSubjects.reduce((total, subject) => total + (subject.chapters?.length || 0), 0)
  const completedChapters = trackedSubjects.reduce(
    (total, subject) => total + (subject.chapters?.filter((chapter) => chapter.completed).length || 0),
    0
  )

  return (
    <div className="space-y-6 animate-fade-rise pb-12 text-[#e3e3e3]">
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#81c995]/50 text-[#81c995] shadow-2xl animate-fade-rise text-xs font-mono">
          <Check className="w-4 h-4 text-[#81c995]" />
          <span>Timetable updated and saved!</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl text-[#e3e3e3]">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-[#8ab4f8]" />
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#e3e3e3]">Smart Timetable Generator</h1>
          </div>
          <p className="text-xs text-[#9aa0a6] mt-1">
            Build feasible study schedules tailored to your available hours and subjects
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Daily / Weekly Toggle */}
          <div className="flex bg-black p-1 rounded-xl border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'daily'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'weekly'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Weekly Overview
            </button>
          </div>

          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Auto-Generate</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Overload Warning */}
      {isOverloaded && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-rose-500/40 flex items-start space-x-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <strong className="block text-rose-200">Schedule Overload Warning!</strong>
            You have scheduled {formatMinutesToHours(totalScheduledMinutes)} of study today. Excessive blocks lead to burnout and whole-day dropouts. Consider trimming 1–2 blocks or scheduling a recovery buffer.
          </div>
        </div>
      )}

      {/* Date Bar & Reschedule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-zinc-400">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
          />
          <span className="text-zinc-500 font-mono">
            ({currentTasks.length} tasks • {formatMinutesToHours(totalScheduledMinutes)})
          </span>
        </div>

        <button
          onClick={() => rescheduleIncompleteTasks(selectedDate)}
          className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white font-semibold self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reschedule Incomplete Tasks to Next Slot</span>
        </button>
      </div>

      <section aria-labelledby="chapter-progress-title" className="p-5 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-xl text-[#e3e3e3]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="chapter-progress-title" className="text-sm font-bold text-white">Chapter progress</h2>
            <p className="text-xs text-[#9aa0a6] mt-1">
              {totalChapters > 0
                ? `${completedChapters} of ${totalChapters} chapters covered`
                : 'Track chapters you have covered and schedule the ones you are working on.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowChapterForm((visible) => !visible)}
            className="flex items-center gap-1.5 self-start px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showChapterForm ? 'Cancel' : 'Add chapter'}</span>
          </button>
        </div>

        {showChapterForm && (
          <form onSubmit={handleAddChapter} className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-2 mt-4 p-3 rounded-xl bg-black border border-zinc-800">
            <label className="sr-only" htmlFor="chapter-subject">Subject for new chapter</label>
            <select
              id="chapter-subject"
              value={chapterSubjectId}
              onChange={(event) => setChapterSubjectId(event.target.value)}
              disabled={subjects.length === 0}
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white disabled:opacity-50"
            >
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            <label className="sr-only" htmlFor="chapter-title">Chapter name</label>
            <input
              id="chapter-title"
              value={chapterTitle}
              onChange={(event) => setChapterTitle(event.target.value)}
              placeholder="Chapter name"
              className="min-w-0 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600"
              required
            />
            <button
              type="submit"
              disabled={subjects.length === 0 || !chapterTitle.trim()}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Save chapter
            </button>
          </form>
        )}

        {trackedSubjects.length === 0 ? (
          <p className="mt-4 p-4 rounded-xl bg-black/50 border border-dashed border-zinc-800 text-xs text-zinc-400">
            No chapters added yet. Add one here, or enter completed chapters during onboarding.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {trackedSubjects.map((subject) => (
              <div key={subject.id} className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-200 mb-2">{subject.name}</h3>
                <ul className="flex flex-col gap-1.5">
                  {subject.chapters?.map((chapter) => (
                    <li key={chapter.id} className="flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleChapter(subject.id, chapter.id)}
                        aria-pressed={chapter.completed}
                        aria-label={chapter.completed ? `Mark ${chapter.title} as not covered` : `Mark ${chapter.title} as covered`}
                        className="flex min-w-0 items-center gap-2 text-left text-zinc-300 hover:text-white"
                      >
                        {chapter.completed
                          ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          : <Circle className="w-4 h-4 shrink-0 text-zinc-600" />}
                        <span className={chapter.completed ? 'truncate line-through text-zinc-500' : 'truncate'}>{chapter.title}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScheduleChapter(subject.id, chapter.id, chapter.title)}
                        className="shrink-0 text-[10px] font-semibold text-zinc-400 hover:text-white"
                      >
                        {chapter.completed ? 'Schedule review' : 'Schedule'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="space-y-3">
          {currentTasks.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950 border border-dashed border-zinc-800">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No study blocks on {selectedDate}</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Click "AI Auto-Generate" to automatically create a feasible timetable based on your available hours.
              </p>
              <button
                onClick={() => setShowGenModal(true)}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
              >
                Auto-Generate Timetable
              </button>
            </div>
          ) : (
            currentTasks.map((task) => {
              const isCompleted = task.status === 'completed'
              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition ${
                    isCompleted
                      ? 'bg-black/40 border-zinc-900 opacity-50'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(task.id)}
                      aria-label={isCompleted ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                      aria-pressed={isCompleted}
                      className="mt-0.5 text-zinc-500 hover:text-white transition"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-200">
                          {task.subjectName}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {task.startTime} – {task.endTime} ({task.durationMinutes}m)
                        </span>
                        <span
                          className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded ${
                            task.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : task.priority === 'medium'
                              ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                              : 'bg-zinc-900 text-zinc-500'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-semibold mt-1.5 ${
                          isCompleted ? 'line-through text-zinc-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 sm:mt-0 flex items-center justify-end space-x-2">
                    {!isCompleted && (
                      <button
                        onClick={() => handleStartTaskFocus(task)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-black text-black" />
                        <span>Start Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenAddModal(task)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
            <div key={day} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 font-bold text-white">
                <span>{day}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {idx < 5 ? '4.5 hrs planned' : '6 hrs mock test'}
                </span>
              </div>
              <div className="space-y-2">
                {subjects.slice(0, 3).map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2 rounded-xl bg-black border border-zinc-800 flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-300">{sub.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">45m deep focus</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AUTO-GENERATOR MODAL */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Smart Timetable Generator</h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Study Hours Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Start Time</span>
                    <select
                      value={genStartHour}
                      onChange={(e) => setGenStartHour(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                    >
                      <option value={15}>3:00 PM (After school)</option>
                      <option value={16}>4:00 PM (45m cooldown)</option>
                      <option value={17}>5:00 PM (Evening)</option>
                      <option value={18}>6:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">End Time</span>
                    <select
                      value={genEndHour}
                      onChange={(e) => setGenEndHour(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                    >
                      <option value={20}>8:00 PM (Light)</option>
                      <option value={21}>9:00 PM (Balanced 5 hrs)</option>
                      <option value={22}>10:00 PM (Deep Sprint)</option>
                      <option value={23}>11:00 PM (Night)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Study & Break Rhythm (from interview)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Focus Block</span>
                    <select
                      value={genFocusMins}
                      onChange={(e) => setGenFocusMins(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                    >
                      <option value={45}>45 Minutes (Recommended)</option>
                      <option value={25}>25 Minutes (Pomodoro)</option>
                      <option value={50}>50 Minutes (Exam simulation)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Break Duration</span>
                    <select
                      value={genBreakMins}
                      onChange={(e) => setGenBreakMins(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                    >
                      <option value={10}>10 Minutes (Standard recharge)</option>
                      <option value={5}>5 Minutes (Quick pause)</option>
                      <option value={15}>15 Minutes (Extended walk)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1.5">
                  Subjects to Rotate
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((sub) => {
                    const isChecked = genSelectedSubs.includes(sub.id)
                    return (
                      <label
                        key={sub.id}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? 'bg-zinc-900 border-zinc-600 text-white'
                            : 'bg-black border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGenSelectedSubs([...genSelectedSubs, sub.id])
                            } else {
                              setGenSelectedSubs(genSelectedSubs.filter((id) => id !== sub.id))
                            }
                          }}
                          className="rounded accent-white"
                        />
                        <span className="text-xs font-medium">{sub.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-800 text-zinc-400 text-[11px]">
                <strong className="text-white">Feasibility Engine:</strong> Automatically alternates high-difficulty numerical subjects with lighter revision and enforces mandatory restorative breaks.
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRunGenerator}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition"
              >
                Generate Feasible Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ADD / EDIT TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
            <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingTask ? 'Edit Study Block' : 'Add New Study Block'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => {
                    setFormSubjectId(e.target.value)
                    setFormChapterId('')
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.priority} priority)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1" htmlFor="tracked-chapter">
                  Link a tracked chapter (optional)
                </label>
                <select
                  id="tracked-chapter"
                  value={formChapterId}
                  onChange={(event) => {
                    const chapterId = event.target.value
                    setFormChapterId(chapterId)
                    const chapter = subjects
                      .find((subject) => subject.id === formSubjectId)
                      ?.chapters?.find((item) => item.id === chapterId)
                    if (chapter) setFormTitle(chapter.title)
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                >
                  <option value="">No linked chapter</option>
                  {subjects.find((subject) => subject.id === formSubjectId)?.chapters?.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}{chapter.completed ? ' (covered)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Completing this task also updates the chapter&apos;s progress.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1" htmlFor="task-title">
                  Task / Chapter Topic
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics Numericals Q1-10"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value))}
                    min="5"
                    max="180"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition"
                >
                  {editingTask ? 'Save Changes' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
