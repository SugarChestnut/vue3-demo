const getLocalTime = (utc: string, time: Date): Date => {
    const urtArr: string[] = utc.split(":");
    const utcHour: number = isNaN(Number(urtArr[0])) ? 0 : Number(urtArr[0]);
    const utcMin: number = isNaN(Number(urtArr[1])) ? 0 : Number(urtArr[1]);
    const d: Date = new Date(time);
    const len: number = d.getTime();
    const offset: number = d.getTimezoneOffset() * 60000;
    const utcTime = len + offset;
    return new Date(utcTime + 3600000 * utcHour + utcMin * 60000);
}

export default getLocalTime;