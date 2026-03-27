import { format, parseISO } from "date-fns";

export const formatDate = (date: string | Date, formatStr = "PPP") => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
};
