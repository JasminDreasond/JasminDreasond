const dob = new Date('03/16/1997');
// calculate month difference from current date in time  
const month_diff = Date.now() - dob.getTime();

// convert the calculated difference in date format  
const age_dt = new Date(month_diff);

// extract year from date      
const year = age_dt.getUTCFullYear();

// now calculate the age of the user  
const age = Math.abs(year - 1970);

// display the calculated age  
document.getElementById('age').innerText = age;

const timezoneUpdate = () => {
    document.getElementById('timezone').innerText = moment.tz('America/Sao_Paulo').format(`MM/DD/YYYY HH:mm:ss`);
};

setInterval(timezoneUpdate, 1000);
timezoneUpdate();