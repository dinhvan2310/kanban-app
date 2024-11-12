export const formatTime = (value : string) => {
    const time = new Date(value);
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();

    if(day < 10 && month < 10) return `0${day}/0${month}/${year}`;
    if(day < 10) return `0${day}/${month}/${year}`;
    if(month < 10) return `${day}/0${month}/${year}`;
    return `${day}/${month}/${year}`;
}

export const dayRemaining = (value : string) => {
    const [day, month, year] = value.split('/');
    const [dayNow, monthNow, yearNow] = new Date().toLocaleDateString().split('/');
    const dayRemaining = (parseInt(day) - parseInt(dayNow)) + (parseInt(month) - parseInt(monthNow)) * 30 + (parseInt(year) - parseInt(yearNow)) * 365;

    if(dayRemaining < 0) return "Expired";
    if(dayRemaining === 0) return "Today";
    if(dayRemaining === 1) return "Tomorrow";
    return `${dayRemaining} days `;
}