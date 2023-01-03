// 05:00 -> 300
export function convertTimeStringTomMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number)

  return hours * 60 + minutes
}
