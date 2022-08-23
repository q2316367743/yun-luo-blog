let now = new Date(); //当前日期
let nowDayOfWeek = now.getDay(); //今天本周的第几天
let nowDay = now.getDate(); //当前日
let nowMonth = now.getMonth(); //当前月
let nowYear = now.getFullYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

let lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
let lastYear = lastMonthDate.getFullYear();
let lastMonth = lastMonthDate.getMonth();

/*时间戳改日期--不传第二个参数返回年月日,传第二个参数返回年月日时分秒*/
function formatDateTime(data: Date | string | number | undefined) {
    let date = new Date();
    if (data) {
        date = new Date(data);
    }
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mS = m < 10 ? ('0' + m) : (m + '');
    let d = date.getDate();
    let dS = d < 10 ? ('0' + d) : (d + '');
    let h = date.getHours();
    let hS = h < 10 ? ('0' + h) : (h + '');
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let minuteS = minute < 10 ? ('0' + minute) : (minute + '');
    let secondS = second < 10 ? ('0' + second) : (second + '');
    return y + '-' + mS + '-' + dS + ' ' + hS + ':' + minuteS + ':' + secondS;//2017-12-12 12:23:34    
}


//格局化日期：yyyy-MM-dd
function formatDate(date: Date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1 as number | string;
    let myweekday = date.getDate() as number | string;

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数
function getMonthDays(myMonth: number) {
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate.getTime() - monthStartDate.getTime()) / (1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开端月份
function getQuarterStartMonth() {
    let quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得本周的开端日期
function getWeekStartDate() {
    let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
    return formatDate(weekStartDate);
}

//获得本周的停止日期
function getWeekEndDate() {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    return formatDate(weekEndDate);
}

//获得本月的开端日期
function getMonthStartDate() {
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}

//获得本月的停止日期
function getMonthEndDate() {
    let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}

//获得上月开端时候
function getLastMonthStartDate() {
    let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

//获得上月停止时候
function getLastMonthEndDate() {
    let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

//获得本季度的开端日期
function getQuarterStartDate() {

    let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate);
}

//或的本季度的停止日期
function getQuarterEndDate() {
    let quarterEndMonth = getQuarterStartMonth() + 2;
    let quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
}

// 获得本年开始日期
function getYearStartDate() {
    let yearStartDate = new Date(nowYear, 0, 1);
    return formatDate(yearStartDate);
}

// 获得本年结束日期
function getYearEndDate() {
    let yearEndDate = new Date(nowYear, 11, 1);
    return formatDate(yearEndDate);
}

export default {
    formatDateTime,
    formatDate
}
