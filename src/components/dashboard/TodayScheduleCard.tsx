import React from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getTodayDateString } from '../../utils/formatters'
import { TimetableTask } from '../../types'

export const TodayScheduleCard: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    startFocusSession,
    setActiveTab,
    rescheduleIncompleteTasks
  } = useApp()

  const todayStr = getTodayDateString()
  const todayTasks = tasks.filter((t) => t.date === todayStr)

  const handleStartTaskFocus = (task: TimetableTask) => {
    startFocusSession({
      subjectId: task.subjectId,
      subjectName: task.subjectName,
      taskTitle: task.title,
      focusMinutes: task.durationMinutes || 45,
      breakMinutes: 10,
      preset: task.durationMinutes === 25 ? '25-5' : '45-10'
    })
    setActiveTab('focus')
  }

  const completedCount = todayTasks.filter((t) => t.status === 'completed').length
  const hasIncomplete = todayTasks.some((t) => t.status === 'pending')

  return (
    <div className="rounded-2xl border border-[#333538] bg-[#1e1f20] p-5 shadow-lg text-[#e3e3e3]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#2e3135]">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-[#8ab4f8]" />
            <h3 className="text-sm font-semibold text-[#e3e3e3]">Today's Study Plan</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131314] border border-[#2e3135] text-[#9aa0a6]">
              {completedCount}/{todayTasks.length} Done
            </span>
          </div>
          <p className="text-xs text-[#9aa0a6] mt-0.5">
            Follow realistic 45-minute blocks with scheduled recharge breaks
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasIncomplete && (
            <button
              onClick={() => rescheduleIncompleteTasks()}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2d] transition"
              title="Reschedule unfinished tasks"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reschedule</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('timetable')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] hover:border-[#8ab4f8] transition shadow-sm"
          >
            <span>Full Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {todayTasks.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-[#131314] border border-dashed border-[#2e3135]">
          <Sparkles className="w-8 h-8 text-[#5f6368] mx-auto mb-2" />
          <h4 className="text-sm font-medium text-[#9aa0a6]">No tasks scheduled for today</h4>
          <p className="text-xs text-[#5f6368] mt-1 max-w-sm mx-auto">
            Use the Smart Timetable Generator to create a realistic schedule based on your available study hours.
          </p>
          <button
            onClick={() => setActiveTab('timetable')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-medium bg-[#8ab4f8] text-[#131314] hover:bg-[#aecbfa] transition"
          >
            Generate Today's Timetable
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {todayTasks.map((task) => {
            const isDone = task.status === 'completed'
            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition ${
                  isDone
                    ? 'bg-[#131314]/50 border-[#2e3135] opacity-50'
                    : 'bg-[#131314] border-[#2e3135] hover:border-[#3c4043]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-[#5f6368] hover:text-[#81c995] transition"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#81c995]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#5f6368]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#1e1f20] border border-[#2e3135] text-[#9aa0a6]">
                        {task.subjectName}
                      </span>
                      <span className="text-[11px] text-[#9aa0a6] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#5f6368]" />
                        {task.startTime} – {task.endTime} ({task.durationMinutes}m)
                      </span>
                    </div>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        isDone ? 'line-through text-[#5f6368]' : 'text-[#e3e3e3]'
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 flex items-center justify-end space-x-2">
                  {!isDone && (
                    <button
                      onClick={() => handleStartTaskFocus(task)}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#282a2d] hover:bg-[#333538] text-[#e3e3e3] border border-[#3c4043] hover:border-[#8ab4f8] transition shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current text-[#8ab4f8]" />
                      <span>Focus Now</span>
                    </button>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-mono font-medium text-[#81c995] px-2 py-0.5 rounded bg-[#81c995]/10 border border-[#81c995]/20">
                      Finished
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
