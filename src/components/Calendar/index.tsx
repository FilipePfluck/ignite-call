import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/axios'
import * as S from './styles'

interface CalendarDay {
  date: dayjs.Dayjs
  disabled: boolean
}

interface CalendarWeek {
  week: number
  days: CalendarDay[]
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export const Calendar = ({ onDateSelected, selectedDate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  const handleArrows = (key: string) => {
    if (!document.activeElement) return

    const arrows = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

    if (!arrows.includes(key)) return

    const selectedId = String(document.activeElement.id)
    const [row, column] = selectedId.split('/')

    if (!column) return

    let rowNumber = Number(row)
    let columnNumber = Number(column)

    let isNextElementEnabled: boolean = false

    let shouldReturn = false

    do {
      switch (key) {
        case 'ArrowRight': {
          if (columnNumber === 6) {
            columnNumber = 0
            rowNumber++
          } else {
            columnNumber++
          }

          break
        }

        case 'ArrowLeft': {
          if (columnNumber === 0) {
            columnNumber = 6
            rowNumber--
          } else {
            columnNumber--
          }

          break
        }

        case 'ArrowDown': {
          rowNumber++
          break
        }

        case 'ArrowUp': {
          if (rowNumber === 0) {
            document.getElementById('previous-month-button')?.focus()
            shouldReturn = true
            break
          }
          rowNumber--
          break
        }
      }

      if (shouldReturn) return

      const nextElement = document.getElementById(
        `${rowNumber}/${columnNumber}`,
      ) as HTMLButtonElement | null

      if (!nextElement) return

      isNextElementEnabled = !nextElement?.disabled

      if (isNextElementEnabled) {
        nextElement.focus()
      }
    } while (!isNextElementEnabled)
  }

  useEffect(() => {
    const eventHandler = (e: any) => {
      handleArrows(e.key)
    }

    document.addEventListener('keyup', eventHandler)

    return () => document.removeEventListener('keyup', eventHandler)
  }, [])

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  const { data: blockedDates, isLoading } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) return []

    const daysInCurrentMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    // Remember:
    // In dayjs day = weekday and date = day

    const firstWeekDay = currentDate.get('day')

    // This return the days from the previous month
    // that should still appear in the calendar
    // For example, if the current month starts on a friday
    // It should show the last 5 days from the previous month

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInMonth = currentDate.set('date', currentDate.daysInMonth())

    const lastWeekDay = lastDayInMonth.get('day')

    // This has pretty much the same logic as the array above,
    // It contains the first days from the next month.

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInMonth.add(i + 1, 'day')
    })

    // This is an array with all the days that appear in the calendar

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInCurrentMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    // This reduces the array to an array of 5 or 6 weeks
    // (Including the last days from previous month and first days of next month)
    // Each week is used as a row in the calendar table.

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <S.CalendarContainer>
      <S.CalendarHeader>
        <S.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </S.CalendarTitle>

        <S.CalendarActions>
          <button
            id="previous-month-button"
            onClick={handlePreviousMonth}
            title="Previous month"
          >
            <CaretLeft />
          </button>
          <button
            id="next-month-button"
            onClick={handleNextMonth}
            title="Next month"
          >
            <CaretRight />
          </button>
        </S.CalendarActions>
      </S.CalendarHeader>

      <S.CalendarBody>
        <thead>
          <tr>
            <th>DOM.</th>
            <th>SEG.</th>
            <th>TER.</th>
            <th>QUA.</th>
            <th>QUI.</th>
            <th>SEX.</th>
            <th>SAB.</th>
          </tr>
        </thead>
        {!isLoading && (
          <tbody>
            {calendarWeeks.map(({ week, days }, i) => (
              <tr key={week}>
                {days.map(({ date, disabled }, j) => {
                  return (
                    <td key={date.toString()}>
                      <S.CalendarDay
                        id={`${i}/${j}`}
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                        color={
                          date.isSame(dayjs(selectedDate), 'date')
                            ? 'green'
                            : 'gray'
                        }
                      >
                        {date.get('date')}
                      </S.CalendarDay>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        )}
      </S.CalendarBody>
    </S.CalendarContainer>
  )
}
