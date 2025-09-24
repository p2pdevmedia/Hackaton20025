import { useMemo } from 'react';

const EVENT_TYPE_STYLES = {
  climb: {
    cell: 'border-emerald-200 bg-emerald-50',
    label: 'text-emerald-700',
    dot: 'bg-emerald-500'
  },
  kayak: {
    cell: 'border-sky-200 bg-sky-50',
    label: 'text-sky-700',
    dot: 'bg-sky-500'
  }
};

const createUtcDate = (year, month, day) => new Date(Date.UTC(year, month, day));

const formatKey = date => date.toISOString().split('T')[0];

const addDays = (date, amount) => {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + amount);
  return copy;
};

const formatGoogleDate = date => {
  const iso = date.toISOString().replace(/[-:]/g, '');
  return iso.split('.')[0] + 'Z';
};

const formatGoogleAllDay = date => date.toISOString().split('T')[0].replace(/-/g, '');

const ActivityCalendar = ({ months, events, locale, text }) => {
  const weekdayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, index) =>
      formatter
        .format(createUtcDate(2023, 0, index + 1))
        .replace('.', '')
    );
  }, [locale]);

  const monthMatrices = useMemo(() => {
    return months.map(monthInfo => {
      const firstDay = createUtcDate(monthInfo.year, monthInfo.month, 1);
      const daysInMonth = createUtcDate(monthInfo.year, monthInfo.month + 1, 0).getUTCDate();
      const leadingEmptyDays = firstDay.getUTCDay();
      const cells = [];

      for (let i = 0; i < leadingEmptyDays; i += 1) {
        cells.push(null);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(createUtcDate(monthInfo.year, monthInfo.month, day));
      }

      while (cells.length % 7 !== 0) {
        cells.push(null);
      }

      const weeks = [];
      for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
      }
      return { ...monthInfo, weeks };
    });
  }, [months]);

  const enrichedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      style: EVENT_TYPE_STYLES[event.type] || EVENT_TYPE_STYLES.climb
    }));
  }, [events]);

  const eventLookup = useMemo(() => {
    const map = new Map();
    enrichedEvents.forEach(event => {
      let current = new Date(event.start.getTime());
      while (current <= event.end) {
        const key = formatKey(current);
        const existing = map.get(key) || [];
        existing.push(event);
        map.set(key, existing);
        current = addDays(current, 1);
      }
    });
    return map;
  }, [enrichedEvents]);

  const formatRange = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'long',
        day: 'numeric'
      }),
    [locale]
  );

  const googleDateFormatter = useMemo(() => {
    const hasTime = enrichedEvents.some(event => event.start.getUTCHours() !== 0 || event.end.getUTCHours() !== 0);
    if (hasTime) {
      return {
        toRange: (start, end) => `${formatGoogleDate(start)}/${formatGoogleDate(end)}`
      };
    }
    return {
      toRange: (start, end) => `${formatGoogleAllDay(start)}/${formatGoogleAllDay(end)}`
    };
  }, [enrichedEvents]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
      <div className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{text.heading}</h2>
            <p className="text-sm text-slate-600">{text.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold uppercase tracking-wide text-slate-500">{text.legendTitle}</span>
            {Object.entries(text.legend).map(([type, label]) => {
              const style = EVENT_TYPE_STYLES[type] || EVENT_TYPE_STYLES.climb;
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1"
                >
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="text-slate-600">{label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {monthMatrices.map(month => (
          <div key={`${month.year}-${month.month}`} className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-800">{month.label}</h3>
            <div className="mt-4 grid grid-cols-7 text-center text-[11px] uppercase tracking-wide text-slate-500">
              {weekdayNames.map(name => (
                <span key={name}>{name}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 text-sm">
              {month.weeks.flat().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="min-h-[72px] border border-slate-200 bg-slate-50" />;
                }
                const dayEvents = eventLookup.get(formatKey(date)) || [];
                const classes = [
                  'min-h-[72px] border border-slate-200 p-2 text-left transition-colors duration-200'
                ];
                if (dayEvents.length > 0) {
                  classes.push(dayEvents[0].style.cell);
                }
                return (
                  <div key={formatKey(date)} className={classes.join(' ')}>
                    <div className="flex items-start justify-between text-xs font-semibold text-slate-700">
                      <span>{date.getUTCDate()}</span>
                      {dayEvents.length > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${dayEvents[0].style.label}`}>
                          {text.legend[dayEvents[0].type]}
                        </span>
                      )}
                    </div>
                    {dayEvents.map(event => (
                      <p key={event.id} className={`mt-1 text-[11px] font-medium ${event.style.label}`}>
                        {event.shortLabel || event.title}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {enrichedEvents.map(event => {
          const exclusiveEnd = addDays(event.end, 1);
          const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            event.title
          )}&dates=${googleDateFormatter.toRange(event.start, exclusiveEnd)}&details=${encodeURIComponent(
            `${event.description}\n${text.location}`
          )}&location=${encodeURIComponent(text.location)}&sf=true&output=xml`;

          const rangeLabel = `${formatRange.format(event.start)} – ${formatRange.format(event.end)}`;

          return (
            <div
              key={event.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-900">{event.title}</h4>
                <p className="text-sm text-slate-600">{event.description}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{rangeLabel}</p>
              </div>
              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                <span className="text-lg">＋</span>
                {text.addToGoogle}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityCalendar;
