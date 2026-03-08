// Google Calendar API utilities

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

/**
 * Get user's calendar events
 */
export const getCalendarEvents = async (accessToken, timeMin, timeMax) => {
  try {
    const params = new URLSearchParams({
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50'
    });

    const response = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

/**
 * Create a calendar event from a task
 */
export const createCalendarEvent = async (accessToken, task) => {
  try {
    const event = {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: task.startTime || new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: task.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Sync tasks to calendar
 */
export const syncTasksToCalendar = async (accessToken, tasks) => {
  const syncedTasks = [];

  for (const task of tasks) {
    try {
      const event = await createCalendarEvent(accessToken, task);
      syncedTasks.push({ ...task, calendarEventId: event.id });
    } catch (error) {
      console.error(`Failed to sync task ${task.id}:`, error);
    }
  }

  return syncedTasks;
};
