export const formatWorkingHours = (workingHours: number): string => {
  if (!workingHours || workingHours <= 0) return "0 seconds";

  const totalSeconds = Math.floor(workingHours * 60 * 60);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 && hours === 0) {
    // only show seconds if duration is small
    parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
  }
  let totalWorkingTime = parts.join(" ");
  console.log('\n','\n' ,totalWorkingTime,'\n','\n' ,);
  return totalWorkingTime;
};
