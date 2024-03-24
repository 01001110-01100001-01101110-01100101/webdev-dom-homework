export const getCommentDate = (date) => {
    const currentDate = date ? new Date(date) : new Date();
    let dd = currentDate.getDate();
    if (dd < 10) dd = "0" + dd;
    let mm = currentDate.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    let yy = currentDate.getFullYear() % 100;
    if (yy < 10) yy = "0" + yy;
    let hour = currentDate.getHours();
    if (hour < 10) hour = "0" + hour;
    let minute = currentDate.getMinutes();
    if (minute < 10) minute = "0" + minute;
    return dd + "." + mm + "." + yy + " " + hour + ":" + minute;
};