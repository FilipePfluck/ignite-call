import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '../../../../components/Calendar'
import { api } from '../../../../lib/axios'
import * as S from './styles'

interface Time {
  time: number
  isAvailable: boolean
}

interface Availability {
  times: Time[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export const CalendarStep = ({ onSelectDateTime }: CalendarStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const date = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null

  const selectedDateFormatted = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability, isLoading } = useQuery<Availability>(
    ['availability', selectedDateFormatted],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateFormatted,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  const handleSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <S.CalendarContainer
      isTimePickerOpen={isDateSelected}
      className="no-focus-shadow"
      id="calendar-step"
    >
      <Calendar onDateSelected={setSelectedDate} selectedDate={selectedDate} />

      {isDateSelected && (
        <S.TimePicker>
          <S.TimePickerHeader>
            {weekDay},<span> {date}</span>
          </S.TimePickerHeader>

          <S.TimePickerList>
            {isLoading && (
              <>
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
                <S.TimePickerItem />
              </>
            )}
            {!isLoading &&
              availability &&
              availability.times.map(({ isAvailable, time: hour }) => {
                return (
                  <S.TimePickerItem
                    key={hour}
                    disabled={!isAvailable}
                    onClick={() => handleSelectTime(hour)}
                  >
                    {String(hour).padStart(2, '0')}:00h
                  </S.TimePickerItem>
                )
              })}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.CalendarContainer>
  )
}
