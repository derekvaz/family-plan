import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Plus, X, CheckCircle, Circle, ChevronLeft, ChevronRight, 
  Trash2, Clock, Calendar, Check, Settings, UserPlus, Edit2
} from 'lucide-react';

// Accessible color palette for family members
const DEFAULT_FAMILY_MEMBERS = [
  { id: 'sam', name: 'Sam', color: '#D97706', lightColor: '#FEF3C7', textColor: '#92400E' },
  { id: 'shannon', name: 'Shannon', color: '#059669', lightColor: '#D1FAE5', textColor: '#065F46' },
  { id: 'matias', name: 'Matias', color: '#DB2777', lightColor: '#FCE7F3', textColor: '#9D174D' },
  { id: 'nicole', name: 'Nicole', color: '#4B5563', lightColor: '#E5E7EB', textColor: '#1F2937' }
];

// Available colors for new family members
const COLOR_OPTIONS = [
  { color: '#D97706', lightColor: '#FEF3C7', textColor: '#92400E', name: 'Amber' },
  { color: '#059669', lightColor: '#D1FAE5', textColor: '#065F46', name: 'Seafoam' },
  { color: '#DB2777', lightColor: '#FCE7F3', textColor: '#9D174D', name: 'Fuchsia' },
  { color: '#4B5563', lightColor: '#E5E7EB', textColor: '#1F2937', name: 'Gray' },
  { color: '#7C3AED', lightColor: '#EDE9FE', textColor: '#5B21B6', name: 'Purple' },
  { color: '#0891B2', lightColor: '#CFFAFE', textColor: '#155E75', name: 'Cyan' },
  { color: '#DC2626', lightColor: '#FEE2E2', textColor: '#991B1B', name: 'Red' },
  { color: '#2563EB', lightColor: '#DBEAFE', textColor: '#1E40AF', name: 'Blue' },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const COMMON_ACTIVITIES = [
  'Soccer practice', 'Piano lesson', 'Homework time', 'Doctor appointment',
  'Grocery shopping', 'Family dinner', 'Movie night', 'Play date',
  'Dance class', 'Swimming', 'Tutoring', 'Birthday party'
];

const COMMON_CHORES = [
  'Take out trash', 'Do dishes', 'Vacuum living room', 'Clean bathroom',
  'Mow lawn', 'Do laundry', 'Fold clothes', 'Make bed',
  'Feed pet', 'Walk dog', 'Water plants', 'Clean room'
];

// Generate initial demo data
const generateDemoData = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const events = [];
  let id = 1;
  
  const createDate = (dayOffset, hour, minute = 0) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };
  
  // Sam's activities
  events.push({
    id: id++, title: 'Work meeting', description: 'Weekly team standup with the marketing department',
    assignees: ['sam'], startTime: createDate(1, 9, 0), endTime: createDate(1, 10, 0),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Mon'] }
  });
  
  events.push({
    id: id++, title: 'Mow lawn', description: 'Front and back yard',
    assignees: ['sam'], startTime: createDate(6, 10, 0), endTime: createDate(6, 11, 30),
    isChore: true, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Sat'] }
  });
  
  // Shannon's activities
  events.push({
    id: id++, title: 'Yoga class', description: 'Morning yoga at the community center',
    assignees: ['shannon'], startTime: createDate(2, 7, 0), endTime: createDate(2, 8, 0),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Tue', 'Thu'] }
  });
  
  events.push({
    id: id++, title: 'Grocery shopping', description: 'Weekly groceries at Whole Foods',
    assignees: ['shannon'], startTime: createDate(3, 14, 0), endTime: createDate(3, 15, 30),
    isChore: true, completed: true, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Wed'] }
  });
  
  // Matias's activities
  events.push({
    id: id++, title: 'Soccer practice', description: 'Team practice at Riverside Park',
    assignees: ['matias'], startTime: createDate(2, 16, 0), endTime: createDate(2, 17, 30),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Tue', 'Thu'] }
  });
  
  events.push({
    id: id++, title: 'Clean room', description: 'Organize desk and vacuum floor',
    assignees: ['matias'], startTime: createDate(6, 9, 0), endTime: createDate(6, 10, 0),
    isChore: true, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Sat'] }
  });
  
  events.push({
    id: id++, title: 'Homework time', description: 'Daily homework and study session',
    assignees: ['matias'], startTime: createDate(1, 16, 0), endTime: createDate(1, 17, 0),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
  });
  
  // Nicole's activities
  events.push({
    id: id++, title: 'Piano lesson', description: 'Weekly lesson with Mrs. Johnson',
    assignees: ['nicole'], startTime: createDate(3, 15, 0), endTime: createDate(3, 16, 0),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Wed'] }
  });
  
  events.push({
    id: id++, title: 'Make bed', description: 'Make bed and tidy nightstand',
    assignees: ['nicole'], startTime: createDate(0, 8, 0), endTime: createDate(0, 8, 15),
    isChore: true, completed: true, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
  });
  
  events.push({
    id: id++, title: 'Dance class', description: 'Ballet class at Dance Academy',
    assignees: ['nicole'], startTime: createDate(5, 14, 0), endTime: createDate(5, 15, 30),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Fri'] }
  });
  
  // Family activities
  events.push({
    id: id++, title: 'Family dinner', description: 'Weekly family dinner - no phones!',
    assignees: ['sam', 'shannon', 'matias', 'nicole'],
    startTime: createDate(0, 18, 0), endTime: createDate(0, 19, 30),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Sun'] }
  });
  
  events.push({
    id: id++, title: 'Movie night', description: 'Family movie night - kids pick the movie',
    assignees: ['sam', 'shannon', 'matias', 'nicole'],
    startTime: createDate(5, 19, 0), endTime: createDate(5, 21, 0),
    isChore: false, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Fri'] }
  });
  
  // Shared chores
  events.push({
    id: id++, title: 'Take out trash', description: 'Kitchen and bathroom trash bins',
    assignees: ['matias', 'nicole'], startTime: createDate(4, 19, 0), endTime: createDate(4, 19, 15),
    isChore: true, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Thu'] }
  });
  
  events.push({
    id: id++, title: 'Do dishes', description: 'Load and unload dishwasher',
    assignees: ['sam', 'shannon'], startTime: createDate(0, 19, 30), endTime: createDate(0, 20, 0),
    isChore: true, completed: false, isAllDay: false,
    recurring: { enabled: true, frequency: 'weekly', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
  });
  
  // All day events
  events.push({
    id: id++, title: 'School holiday', description: 'Teacher in-service day - no school',
    assignees: ['matias', 'nicole'], startTime: createDate(1, 0, 0), endTime: createDate(1, 23, 59),
    isChore: false, completed: false, isAllDay: true, recurring: { enabled: false }
  });
  
  events.push({
    id: id++, title: 'Dentist appointments', description: 'Annual checkups for the whole family',
    assignees: ['sam', 'shannon', 'matias', 'nicole'],
    startTime: createDate(4, 0, 0), endTime: createDate(4, 23, 59),
    isChore: false, completed: false, isAllDay: true, recurring: { enabled: false }
  });
  
  return events;
};

// Utility functions
const getWeekDates = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
};

// Get 5 days centered on the given date
const getFiveDayDates = (date) => {
  const center = new Date(date);
  center.setHours(0, 0, 0, 0);
  
  const dates = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// Check if a date matches a recurring event pattern
const matchesRecurringPattern = (event, date) => {
  if (!event.recurring?.enabled) return false;

  const { frequency, days } = event.recurring;
  if (!days || days.length === 0) return false;

  // Get day name of the date we're checking
  const dayName = DAYS_OF_WEEK[date.getDay()];

  // Check if this day is in the recurring days
  if (!days.includes(dayName)) return false;

  const eventStart = new Date(event.startTime);
  eventStart.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  // Don't show recurring events before their start date
  if (checkDate < eventStart) return false;

  // For weekly, just match the day
  if (frequency === 'weekly') {
    return true;
  }

  // For biweekly, check if we're in the right week (every other week from start)
  if (frequency === 'biweekly') {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksDiff = Math.floor((checkDate.getTime() - eventStart.getTime()) / msPerWeek);
    return weeksDiff % 2 === 0;
  }

  // For monthly, match the same week-of-month position
  if (frequency === 'monthly') {
    const startWeekOfMonth = Math.floor((eventStart.getDate() - 1) / 7);
    const dateWeekOfMonth = Math.floor((date.getDate() - 1) / 7);
    return startWeekOfMonth === dateWeekOfMonth;
  }

  return false;
};

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Calculate positions for overlapping events
const calculateEventPositions = (events) => {
  if (events.length === 0) return [];
  
  // Sort events by start time, then by duration (longer first)
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = new Date(a.startTime).getTime();
    const bStart = new Date(b.startTime).getTime();
    if (aStart !== bStart) return aStart - bStart;
    const aDuration = new Date(a.endTime).getTime() - aStart;
    const bDuration = new Date(b.endTime).getTime() - bStart;
    return bDuration - aDuration;
  });
  
  // Track columns for each event
  const eventPositions = [];
  const columns = []; // Array of { endTime, events[] }
  
  for (const event of sortedEvents) {
    const eventStart = new Date(event.startTime).getTime();
    const eventEnd = new Date(event.endTime).getTime();
    
    // Find the first column where this event fits (no overlap)
    let columnIndex = columns.findIndex(col => col.endTime <= eventStart);
    
    if (columnIndex === -1) {
      // Need a new column
      columnIndex = columns.length;
      columns.push({ endTime: eventEnd, events: [event] });
    } else {
      // Fit into existing column
      columns[columnIndex].endTime = Math.max(columns[columnIndex].endTime, eventEnd);
      columns[columnIndex].events.push(event);
    }
    
    eventPositions.push({
      event,
      column: columnIndex,
    });
  }
  
  // Now determine the total columns for each overlapping group
  // and assign final widths
  const result = [];
  
  for (const pos of eventPositions) {
    const eventStart = new Date(pos.event.startTime).getTime();
    const eventEnd = new Date(pos.event.endTime).getTime();
    
    // Count how many events overlap with this one
    let maxColumns = 1;
    for (const otherPos of eventPositions) {
      if (otherPos.event.id === pos.event.id) continue;
      const otherStart = new Date(otherPos.event.startTime).getTime();
      const otherEnd = new Date(otherPos.event.endTime).getTime();
      
      // Check if they overlap
      if (eventStart < otherEnd && eventEnd > otherStart) {
        maxColumns = Math.max(maxColumns, otherPos.column + 1);
      }
    }
    
    maxColumns = Math.max(maxColumns, pos.column + 1);
    
    result.push({
      event: pos.event,
      column: pos.column,
      totalColumns: maxColumns,
    });
  }
  
  // Second pass: for each event, find the true max columns among overlapping events
  for (const item of result) {
    const eventStart = new Date(item.event.startTime).getTime();
    const eventEnd = new Date(item.event.endTime).getTime();
    
    let trueMax = item.totalColumns;
    for (const other of result) {
      if (other.event.id === item.event.id) continue;
      const otherStart = new Date(other.event.startTime).getTime();
      const otherEnd = new Date(other.event.endTime).getTime();
      
      if (eventStart < otherEnd && eventEnd > otherStart) {
        trueMax = Math.max(trueMax, other.totalColumns);
      }
    }
    item.totalColumns = trueMax;
  }
  
  return result;
};

// Storage
const STORAGE_KEY = 'family-chores-app-data';
const MEMBERS_STORAGE_KEY = 'family-chores-app-members';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

const saveToStorage = (events) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch (e) {}
};

const loadMembersFromStorage = () => {
  try {
    const data = localStorage.getItem(MEMBERS_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

const saveMembersToStorage = (members) => {
  try { localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members)); } catch (e) {}
};

// Event Card Component
const EventCard = ({ event, onClick, style, familyMembers }) => {
  const getMember = (id) => familyMembers.find(m => m.id === id);
  
  const getBackground = (assignees) => {
    if (assignees.length === 1) {
      const member = getMember(assignees[0]);
      return member?.lightColor || '#E5E7EB';
    }
    const colors = assignees.map(id => getMember(id)?.lightColor || '#E5E7EB');
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };
  
  const getOutlineColor = (assignees) => {
    const member = getMember(assignees[0]);
    return member?.color || '#9CA3AF';
  };
  
  const getTextColor = (assignees) => {
    const member = getMember(assignees[0]);
    return member?.textColor || '#1F2937';
  };
  
  const background = getBackground(event.assignees);
  const textColor = getTextColor(event.assignees);
  const outlineColor = event.isChore ? getOutlineColor(event.assignees) : 'transparent';
  
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(event); }}
      className="rounded-md px-1.5 py-0.5 cursor-pointer flex items-start gap-1 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
      style={{
        ...style,
        background,
        border: event.isChore ? `2px solid ${outlineColor}` : 'none',
      }}
    >
      {event.isChore && (
        event.completed ? 
          <CheckCircle size={12} style={{ color: textColor, flexShrink: 0, marginTop: 1 }} /> :
          <Circle size={12} style={{ color: textColor, flexShrink: 0, marginTop: 1 }} />
      )}
      <span
        className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap pt-0.5"
        style={{
          color: textColor,
          textDecoration: event.completed ? 'line-through' : 'none',
          opacity: event.completed ? 0.7 : 1,
          lineHeight: '1.1',
        }}
      >
        {event.title}
      </span>
    </div>
  );
};

// All Day Event Component
const AllDayEvent = ({ event, onClick, familyMembers }) => {
  const getMember = (id) => familyMembers.find(m => m.id === id);
  
  const getBackground = (assignees) => {
    if (assignees.length === 1) {
      const member = getMember(assignees[0]);
      return member?.lightColor || '#E5E7EB';
    }
    const colors = assignees.map(id => getMember(id)?.lightColor || '#E5E7EB');
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };
  
  const getTextColor = (assignees) => {
    const member = getMember(assignees[0]);
    return member?.textColor || '#1F2937';
  };
  
  const background = getBackground(event.assignees);
  const textColor = getTextColor(event.assignees);
  
  return (
    <div
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(event); }}
      className="rounded px-2 py-0.5 cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
      style={{ background }}
    >
      <span 
        className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap block" 
        style={{ color: textColor, lineHeight: '1.2' }}
      >
        {event.title}
      </span>
    </div>
  );
};

// Event Detail Overlay
const EventDetailOverlay = ({ event, onClose, onUpdate, onDelete, familyMembers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  
  useEffect(() => {
    if (event) {
      setEditedEvent({ ...event });
      setIsEditing(false);
    }
  }, [event]);
  
  if (!event || !editedEvent) return null;
  
  const startDate = new Date(event.startTime);
  const getMember = (id) => familyMembers.find(m => m.id === id);
  
  const handleStartEdit = () => {
    setEditedEvent({ ...event });
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setEditedEvent({ ...event });
    setIsEditing(false);
  };
  
  const handleSaveEdit = () => {
    if (!editedEvent.title.trim()) return;
    onUpdate(editedEvent);
    setIsEditing(false);
  };
  
  const toggleAssignee = (id) => {
    const newAssignees = editedEvent.assignees.includes(id)
      ? editedEvent.assignees.filter(a => a !== id)
      : [...editedEvent.assignees, id];
    // Ensure at least one assignee
    if (newAssignees.length > 0) {
      setEditedEvent({ ...editedEvent, assignees: newAssignees });
    }
  };
  
  const toggleRecurringDay = (day) => {
    const currentDays = editedEvent.recurring?.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setEditedEvent({
      ...editedEvent,
      recurring: { ...editedEvent.recurring, days: newDays }
    });
  };
  
  const updateTime = (field, value) => {
    const currentDate = new Date(editedEvent[field]);
    const [hours, minutes] = value.split(':').map(Number);
    currentDate.setHours(hours, minutes, 0, 0);
    setEditedEvent({ ...editedEvent, [field]: currentDate.toISOString() });
  };
  
  const updateDate = (value) => {
    const startTime = new Date(editedEvent.startTime);
    const endTime = new Date(editedEvent.endTime);
    const [year, month, day] = value.split('-').map(Number);
    
    startTime.setFullYear(year, month - 1, day);
    endTime.setFullYear(year, month - 1, day);
    
    setEditedEvent({
      ...editedEvent,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });
  };
  
  const getTimeValue = (isoString) => {
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const getDateValue = (isoString) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };
  
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {event.isChore ? <CheckCircle size={20} /> : <Calendar size={20} />}
            <span className="font-semibold">
              {isEditing ? 'Edit' : ''} {event.isChore ? 'Chore' : 'Activity'} {isEditing ? '' : 'Details'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {isEditing ? (
            <>
              {/* Edit Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editedEvent.description || ''}
                  onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
                <div className="flex flex-wrap gap-2">
                  {familyMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => toggleAssignee(member.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        editedEvent.assignees.includes(member.id) 
                          ? 'ring-2 ring-offset-1' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: member.lightColor, 
                        color: member.textColor,
                        ringColor: member.color
                      }}
                    >
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedEvent.isChore}
                    onChange={(e) => setEditedEvent({ ...editedEvent, isChore: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">This is a chore</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedEvent.isAllDay}
                    onChange={(e) => setEditedEvent({ ...editedEvent, isAllDay: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">All day</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={getDateValue(editedEvent.startTime)}
                  onChange={(e) => updateDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {!editedEvent.isAllDay && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <select
                      value={getTimeValue(editedEvent.startTime)}
                      onChange={(e) => updateTime('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <select
                      value={getTimeValue(editedEvent.endTime)}
                      onChange={(e) => updateTime('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedEvent.recurring?.enabled || false}
                  onChange={(e) => setEditedEvent({
                    ...editedEvent,
                    recurring: { 
                      ...editedEvent.recurring, 
                      enabled: e.target.checked,
                      frequency: editedEvent.recurring?.frequency || 'weekly',
                      days: editedEvent.recurring?.days || []
                    }
                  })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Recurring</span>
              </label>
              
              {editedEvent.recurring?.enabled && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      value={editedEvent.recurring?.frequency || 'weekly'}
                      onChange={(e) => setEditedEvent({
                        ...editedEvent,
                        recurring: { ...editedEvent.recurring, frequency: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on:</label>
                    <div className="flex flex-wrap gap-1">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day}
                          onClick={() => toggleRecurringDay(day)}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            (editedEvent.recurring?.days || []).includes(day)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* View Mode */}
              <h2 className="text-2xl font-bold">{event.title}</h2>
              
              {event.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>
                  {event.isAllDay 
                    ? `All day · ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                    : `${formatTime(event.startTime)} - ${formatTime(event.endTime)} · ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                  }
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Assigned to:</p>
                <div className="flex flex-wrap gap-2">
                  {event.assignees.map(id => {
                    const member = getMember(id);
                    if (!member) return null;
                    return (
                      <span
                        key={id}
                        className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                        style={{ backgroundColor: member?.lightColor, color: member?.textColor }}
                      >
                        <span 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: member?.color }}
                        >
                          {member?.name[0]}
                        </span>
                        {member?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {event.isChore && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      onClick={() => onUpdate({ ...event, completed: !event.completed })}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        event.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      {event.completed && <Check size={14} />}
                    </button>
                    <span className="font-medium">{event.completed ? 'Completed ✓' : 'Mark as complete'}</span>
                  </label>
                </div>
              )}
              
              {event.recurring?.enabled && (
                <p className="text-xs text-gray-500">
                  Repeats {event.recurring.frequency} on {event.recurring.days?.join(', ')}
                </p>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={() => { onDelete(event.id); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editedEvent.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Event Dialog
const AddEventDialog = ({ onClose, onAdd, selectedDate, familyMembers, defaultStartTime, defaultEndTime }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [isChore, setIsChore] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState(defaultStartTime || '09:00');
  const [endTime, setEndTime] = useState(defaultEndTime || '09:30');
  const [date, setDate] = useState(selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('weekly');
  const [recurringDays, setRecurringDays] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Update times if defaults change (e.g., clicking different spot on calendar)
  useEffect(() => {
    if (defaultStartTime) setStartTime(defaultStartTime);
    if (defaultEndTime) setEndTime(defaultEndTime);
  }, [defaultStartTime, defaultEndTime]);
  
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);
  
  const allSuggestions = [...COMMON_ACTIVITIES, ...COMMON_CHORES];
  const filteredSuggestions = allSuggestions.filter(s => 
    s.toLowerCase().includes(title.toLowerCase()) && title.length > 0
  );
  
  const handleSubmit = () => {
    if (!title.trim()) return;
    
    const startDate = new Date(`${date}T${isAllDay ? '00:00' : startTime}`);
    const endDate = new Date(`${date}T${isAllDay ? '23:59' : endTime}`);
    
    onAdd({
      id: Date.now(),
      title: title.trim(),
      description,
      assignees: assignees.length ? assignees : (familyMembers[0]?.id ? [familyMembers[0].id] : []),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      isChore,
      completed: false,
      isAllDay,
      recurring: isRecurring ? { enabled: true, frequency: recurringFrequency, days: recurringDays } : { enabled: false }
    });
    onClose();
  };
  
  const toggleAssignee = (id) => {
    setAssignees(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };
  
  const toggleRecurringDay = (day) => {
    setRecurringDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };
  
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">Add New {isChore ? 'Chore' : 'Activity'}</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">What needs to be done?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder='e.g., "Soccer practice"'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-auto">
                {filteredSuggestions.slice(0, 6).map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setTitle(suggestion);
                      setIsChore(COMMON_CHORES.includes(suggestion));
                      setShowSuggestions(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
            <div className="flex flex-wrap gap-2">
              {familyMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => toggleAssignee(member.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    assignees.includes(member.id) 
                      ? 'ring-2 ring-offset-1' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: member.lightColor, 
                    color: member.textColor,
                    ringColor: member.color
                  }}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isChore}
                onChange={(e) => setIsChore(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">This is a chore</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">All day</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {!isAllDay && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Recurring</span>
          </label>
          
          {isRecurring && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on:</label>
                <div className="flex flex-wrap gap-1">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleRecurringDay(day)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        recurringDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {isChore ? 'Chore' : 'Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Month Picker Dialog
const MonthPickerDialog = ({ onClose, currentDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(currentDate);
  const touchStartRef = useRef(null);
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const totalDays = lastDay.getDate();
  
  const days = [];
  for (let i = 0; i < startPadding; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
  
  const today = new Date();
  
  const handleTouchStart = (e) => { touchStartRef.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartRef.current;
    if (Math.abs(diff) > 50) {
      setViewDate(new Date(year, month + (diff > 0 ? -1 : 1), 1));
    }
    touchStartRef.current = null;
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-4"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-lg">{MONTHS[month]} {year}</span>
          <button 
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
          ))}
          
          {days.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />;
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, currentDate);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => { onSelectDate(date); onClose(); }}
                className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm transition-colors ${
                  isToday ? 'bg-blue-600 text-white' : 
                  isSelected ? 'bg-blue-100 text-blue-600' : 
                  'hover:bg-gray-100'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-4">Swipe up/down to change months</p>
      </div>
    </div>
  );
};

// Settings Dialog
const SettingsDialog = ({ onClose, familyMembers, onUpdateMembers, onRemoveMember }) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState(null);
  
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    
    const newMember = {
      id: newMemberName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: newMemberName.trim(),
      color: selectedColor.color,
      lightColor: selectedColor.lightColor,
      textColor: selectedColor.textColor
    };
    
    onUpdateMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setSelectedColor(COLOR_OPTIONS[0]);
  };
  
  const handleRemoveMember = (memberId) => {
    onRemoveMember(memberId);
    setConfirmDelete(null);
  };
  
  const handleStartEdit = (member) => {
    setEditingMemberId(member.id);
    setEditingName(member.name);
    // Find the matching color option or create one from the member's current colors
    const matchingColor = COLOR_OPTIONS.find(c => c.color === member.color) || {
      color: member.color,
      lightColor: member.lightColor,
      textColor: member.textColor
    };
    setEditingColor(matchingColor);
    setConfirmDelete(null);
  };
  
  const handleSaveEdit = (memberId) => {
    if (!editingName.trim()) {
      handleCancelEdit();
      return;
    }
    
    onUpdateMembers(familyMembers.map(m => 
      m.id === memberId ? { 
        ...m, 
        name: editingName.trim(),
        color: editingColor.color,
        lightColor: editingColor.lightColor,
        textColor: editingColor.textColor
      } : m
    ));
    handleCancelEdit();
  };
  
  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditingName('');
    setEditingColor(null);
  };
  
  // Get the member being edited for preview
  const editingMember = editingMemberId ? familyMembers.find(m => m.id === editingMemberId) : null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <span className="font-semibold">Family Settings</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Current Family Members */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Family Members</h3>
            <div className="space-y-2">
              {familyMembers.map(member => {
                const isEditing = editingMemberId === member.id;
                const displayColor = isEditing ? editingColor : member;
                const displayName = isEditing ? editingName : member.name;
                
                return (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: displayColor?.lightColor || member.lightColor }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 transition-colors"
                        style={{ backgroundColor: displayColor?.color || member.color }}
                      >
                        {displayName[0]?.toUpperCase() || '?'}
                      </div>
                      
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(member.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(member.id)}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                            aria-label="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                            aria-label="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium truncate" style={{ color: member.textColor }}>
                            {member.name}
                          </span>
                          <button
                            onClick={() => handleStartEdit(member)}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-colors flex-shrink-0"
                            aria-label={`Edit ${member.name}`}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!isEditing && (
                      confirmDelete === member.id ? (
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-red-600">Remove?</span>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(member.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-white/50 rounded-full transition-colors flex-shrink-0 ml-2"
                          aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )
                    )}
                  </div>
                );
              })}
              
              {familyMembers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No family members yet. Add one below!</p>
              )}
            </div>
          </div>
          
          {/* Edit Color Picker (shown when editing) */}
          {editingMemberId && editingColor && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Color for {editingName || 'Member'}</h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((colorOpt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEditingColor(colorOpt)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        editingColor.color === colorOpt.color 
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOpt.color }}
                      aria-label={colorOpt.name}
                      title={colorOpt.name}
                    />
                  ))}
                </div>
                
                {/* Live Preview */}
                <div className="mt-3">
                  <label className="block text-sm text-gray-600 mb-1">Preview</label>
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: editingColor.lightColor }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium transition-colors"
                      style={{ backgroundColor: editingColor.color }}
                    >
                      {editingName[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-medium" style={{ color: editingColor.textColor }}>
                      {editingName || 'Name'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add New Member (hidden when editing) */}
          {!editingMemberId && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Family Member</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((colorOpt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(colorOpt)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor.color === colorOpt.color 
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' 
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOpt.color }}
                        aria-label={colorOpt.name}
                        title={colorOpt.name}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Preview */}
                {newMemberName && (
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Preview</label>
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: selectedColor.lightColor }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: selectedColor.color }}
                      >
                        {newMemberName[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: selectedColor.textColor }}>
                        {newMemberName}
                      </span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus size={18} />
                  Add Member
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Removing a family member will delete any activities or chores they are solely assigned to, 
            and remove them from shared activities.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function FamilyPlannerApp() {
  const [familyMembers, setFamilyMembers] = useState(() => loadMembersFromStorage() || DEFAULT_FAMILY_MEMBERS);
  const [events, setEvents] = useState(() => loadFromStorage() || []);
  const [filter, setFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogDefaults, setAddDialogDefaults] = useState({ date: null, startTime: null, endTime: null });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  
  const calendarRef = useRef(null);
  const touchStartRef = useRef(null);
  const headerTouchRef = useRef(null);
  
  const today = new Date();
  const weekDates = getWeekDates(currentDate);
  // On mobile, show only the selected day; on desktop show full week
  const displayDates = isMobile ? [currentDate] : weekDates;
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => { saveToStorage(events); }, [events]);
  useEffect(() => { saveMembersToStorage(familyMembers); }, [familyMembers]);
  
  useEffect(() => {
    if (calendarRef.current) {
      const now = new Date();
      calendarRef.current.scrollTop = Math.max(0, (now.getHours() - 1) * 60);
    }
  }, []);
  
  // Handle removing a family member
  const handleRemoveMember = (memberId) => {
    // Update events: remove member from assignees, delete if sole assignee
    setEvents(prevEvents => {
      return prevEvents
        .map(event => ({
          ...event,
          assignees: event.assignees.filter(id => id !== memberId)
        }))
        .filter(event => event.assignees.length > 0);
    });
    
    // Reset filter if viewing removed member
    if (filter === memberId) {
      setFilter('all');
    }
    
    // Remove the member
    setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
  };
  
  // Create getter functions that use current familyMembers
  const getMemberById = (id) => familyMembers.find(m => m.id === id);
  
  const getGradientBg = (assignees) => {
    if (assignees.length === 1) {
      const member = getMemberById(assignees[0]);
      return member?.lightColor || '#E5E7EB';
    }
    const colors = assignees.map(id => getMemberById(id)?.lightColor || '#E5E7EB');
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };
  
  const getChoreOutline = (assignees) => {
    const member = getMemberById(assignees[0]);
    return member?.color || '#9CA3AF';
  };
  
  const getTextCol = (assignees) => {
    const member = getMemberById(assignees[0]);
    return member?.textColor || '#1F2937';
  };
  
  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter(e => e.assignees.includes(filter));
  }, [events, filter]);
  
  const getEventsForDay = useCallback((date) => {
    const results = [];

    for (const event of filteredEvents) {
      const eventDate = new Date(event.startTime);
      const isOriginalDate = isSameDay(eventDate, date);

      // For non-recurring events, only show on original date
      if (!event.recurring?.enabled) {
        if (isOriginalDate) {
          results.push(event);
        }
        continue;
      }

      // For recurring events, check if this date matches the pattern
      if (matchesRecurringPattern(event, date)) {
        if (isOriginalDate) {
          // On the original date, show the original event
          results.push(event);
        } else {
          // On other matching dates, create a virtual occurrence
          const start = new Date(event.startTime);
          const end = new Date(event.endTime);

          const newStart = new Date(date);
          newStart.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), 0);

          const newEnd = new Date(date);
          newEnd.setHours(end.getHours(), end.getMinutes(), end.getSeconds(), 0);

          results.push({
            ...event,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
            isRecurringOccurrence: true,
          });
        }
      }
    }

    return results;
  }, [filteredEvents]);
  
  const handleTouchStart = (e) => { touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const newDate = new Date(currentDate);
      // On mobile, swipe by 1 day; on desktop, swipe by week
      newDate.setDate(newDate.getDate() + (diffX > 0 ? (isMobile ? -1 : -7) : (isMobile ? 1 : 7)));
      setCurrentDate(newDate);
    }
    touchStartRef.current = null;
  };
  
  const getCurrentTimePosition = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };
  
  const handleWeekNav = (direction) => {
    const newDate = new Date(currentDate);
    // On mobile arrows navigate by day, on desktop by week
    newDate.setDate(newDate.getDate() + (direction * (isMobile ? 1 : 7)));
    setCurrentDate(newDate);
  };
  
  // Handle clicking on calendar to create event at that time
  const handleCalendarClick = (date, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Each hour is 60px, calculate minutes from top
    const totalMinutes = Math.floor(y);
    
    // Round to nearest 30 minutes
    const roundedMinutes = Math.round(totalMinutes / 30) * 30;
    
    const hours = Math.floor(roundedMinutes / 60);
    const minutes = roundedMinutes % 60;
    
    // Clamp hours to valid range
    const clampedHours = Math.max(0, Math.min(23, hours));
    
    const startTimeStr = `${clampedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // End time is 30 minutes later
    let endHours = clampedHours;
    let endMinutes = minutes + 30;
    if (endMinutes >= 60) {
      endMinutes = 0;
      endHours = Math.min(23, endHours + 1);
    }
    const endTimeStr = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    
    setAddDialogDefaults({
      date: date,
      startTime: startTimeStr,
      endTime: endTimeStr
    });
    setAddDialogOpen(true);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        {/* App title - visible on mobile */}
        <div className="sm:hidden flex items-center justify-center py-2 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800">Family Planner</h1>
        </div>
        
        {/* Month/Year navigation */}
        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={() => handleWeekNav(-1)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            {/* App title - visible on desktop */}
            <h1 className="hidden sm:block text-lg font-semibold text-gray-800">Family Planner</h1>
            <span className="hidden sm:block text-gray-300">|</span>
            <button 
              onClick={() => setMonthPickerOpen(true)}
              className="font-semibold text-lg hover:bg-gray-100 px-4 py-1 rounded-lg transition-colors"
            >
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => handleWeekNav(1)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Next">
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => setSettingsOpen(true)} 
              className="p-2 hover:bg-gray-100 rounded-full ml-1" 
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {/* Day headers */}
        <div 
          className="flex"
          onTouchStart={(e) => {
            headerTouchRef.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (headerTouchRef.current === null) return;
            const diff = e.changedTouches[0].clientX - headerTouchRef.current;
            if (Math.abs(diff) > 50) {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + (diff > 0 ? -7 : 7));
              setCurrentDate(newDate);
            }
            headerTouchRef.current = null;
          }}
        >
          <div className="w-14 flex-shrink-0" />
          {weekDates.map(date => {
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, currentDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setCurrentDate(date)}
                className="flex-1 text-center py-2 min-w-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 rounded"
              >
                <div className={`text-xs uppercase tracking-wide ${isToday ? 'text-blue-600 font-semibold' : isSelected && !isToday ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {DAYS_OF_WEEK[date.getDay()]}
                </div>
                <div 
                  className={`w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                    isToday ? 'bg-blue-600 text-white' : isSelected && !isToday ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400' : 'hover:bg-gray-100'
                  }`}
                >
                  {date.getDate()}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Filter tabs */}
        <div className="flex justify-center overflow-x-auto border-t border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              filter === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          {familyMembers.map(member => (
            <button
              key={member.id}
              onClick={() => setFilter(member.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                filter === member.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: member.color }} />
              {member.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Calendar */}
      <div 
        className="flex-1 overflow-hidden bg-white flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* All-day events row */}
        <div className="flex border-b border-gray-200 min-h-[40px]">
          <div className="w-14 flex-shrink-0 border-r border-gray-200" />
          {displayDates.map(date => {
            const allDayEvents = getEventsForDay(date).filter(e => e.isAllDay);
            return (
              <div key={date.toISOString()} className="flex-1 p-1 space-y-1 border-r border-gray-200">
                {allDayEvents.map(event => (
                  <AllDayEvent key={event.id} event={event} onClick={setSelectedEvent} familyMembers={familyMembers} />
                ))}
              </div>
            );
          })}
        </div>
        
        {/* Scrollable time grid */}
        <div ref={calendarRef} className="flex-1 overflow-auto flex">
          {/* Time column */}
          <div className="w-14 flex-shrink-0 border-r border-gray-200 relative">
            {Array.from({ length: 24 }).map((_, h) => (
              <div 
                key={h} 
                className="absolute right-2 flex items-center justify-end"
                style={{ top: h * 60 - 6 }}
              >
                <span className="text-xs text-gray-400 bg-white px-0.5">
                  {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                </span>
              </div>
            ))}
            {/* Spacer for scroll height */}
            <div style={{ height: 24 * 60 }} />
          </div>
          
          {/* Day columns */}
          {displayDates.map(date => {
            const dayEvents = getEventsForDay(date).filter(e => !e.isAllDay);
            const isToday = isSameDay(date, today);
            
            return (
              <div 
                key={date.toISOString()} 
                className={`flex-1 relative ${isMobile ? 'min-w-0' : 'min-w-0'} cursor-pointer`}
                onClick={(e) => handleCalendarClick(date, e)}
              >
                {/* Hour lines */}
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={h} className="absolute left-0 right-0 h-[60px] border-b border-l border-gray-100" style={{ top: h * 60 }} />
                ))}
                
                {/* Current time line */}
                {isToday && (
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                    style={{ top: getCurrentTimePosition() }}
                  >
                    <div className="absolute left-0 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
                  </div>
                )}
                
                {/* Events */}
                {(() => {
                  const positions = calculateEventPositions(dayEvents);
                  return positions.map(({ event, column, totalColumns }) => {
                    const start = new Date(event.startTime);
                    const end = new Date(event.endTime);
                    const top = start.getHours() * 60 + start.getMinutes();
                    const height = Math.max(20, (end - start) / 60000);
                    
                    const width = `calc((100% - 8px) / ${totalColumns})`;
                    const left = `calc(4px + (100% - 8px) / ${totalColumns} * ${column})`;
                    
                    return (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={setSelectedEvent}
                        familyMembers={familyMembers}
                        style={{
                          position: 'absolute',
                          top,
                          left,
                          width,
                          height: Math.max(height - 2, 22),
                          zIndex: 5 + column,
                        }}
                      />
                    );
                  });
                })()}
                
                {/* Total height for 24 hours */}
                <div style={{ height: 24 * 60 }} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* FAB */}
      <button
        onClick={() => {
          setAddDialogDefaults({ date: currentDate, startTime: null, endTime: null });
          setAddDialogOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 z-[100]"
        aria-label="Add activity or chore"
      >
        <Plus size={24} />
      </button>
      
      {/* Dialogs */}
      {addDialogOpen && (
        <AddEventDialog 
          onClose={() => setAddDialogOpen(false)} 
          onAdd={(e) => setEvents(prev => [...prev, e])}
          selectedDate={addDialogDefaults.date || currentDate}
          familyMembers={familyMembers}
          defaultStartTime={addDialogDefaults.startTime}
          defaultEndTime={addDialogDefaults.endTime}
        />
      )}
      
      {selectedEvent && (
        <EventDetailOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={(updated) => {
            setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
            setSelectedEvent(updated);
          }}
          onDelete={(id) => setEvents(prev => prev.filter(e => e.id !== id))}
          familyMembers={familyMembers}
        />
      )}
      
      {monthPickerOpen && (
        <MonthPickerDialog
          onClose={() => setMonthPickerOpen(false)}
          currentDate={currentDate}
          onSelectDate={setCurrentDate}
        />
      )}
      
      {settingsOpen && (
        <SettingsDialog
          onClose={() => setSettingsOpen(false)}
          familyMembers={familyMembers}
          onUpdateMembers={setFamilyMembers}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}
