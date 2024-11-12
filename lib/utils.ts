import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatTime = (string: string) => {
    const time = new Date(string);
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();

    if(day < 10 && month < 10) return `0${day}/0${month}/${year}`;
    if(day < 10) return `0${day}/${month}/${year}`;
    if(month < 10) return `${day}/0${month}/${year}`;
    return `${day}/${month}/${year}`;
}

export const dayRemaining = (string?: string) => {
    if(!string) return "No due date";
    const [day, month, year] = string.split('/');
    const time = new Date(`${month}/${day}/${year}`);
    const now = new Date();

    const remaining = time.getTime() - now.getTime();
    const dayRemaining = Math.floor(remaining / (1000 * 60 * 60 * 24));

    if(dayRemaining < 0) return "Expired";
    if(dayRemaining === 0) return "Today";
    if(dayRemaining === 1) return "Tomorrow";
    return `${dayRemaining} days`;
}


