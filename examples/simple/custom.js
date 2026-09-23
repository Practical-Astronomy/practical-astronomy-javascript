/** Pad a number with a leading zero, e.g., '1' becomes '01' */
function padNumber(input_number) {
    return input_number.toString().padStart(2, '0');
}

function formatTime(hours, minutes) {
    return (hours === -99) ? "N/A" : hours + ":" + padNumber(minutes);
}

/** Convert UTC hours and minutes to local time */
function getLocalTime(utcHours, utcMinutes, zoneCorrectionHours, isDaylightSavings) {
    if (utcHours === -99) {
        return "N/A";
    }

    if (isDaylightSavings) {
        zoneCorrectionHours = zoneCorrectionHours - 1;
    }

    let offsetMinutes = -(zoneCorrectionHours * 60);

    const totalMinutes = (utcHours * 60 + utcMinutes + offsetMinutes + 1440) % 1440;

    const localHours = Math.floor(totalMinutes / 60);
    const localMinutes = totalMinutes % 60;

    return formatTime(localHours, localMinutes);
}

function testPA() {
    // Split the observer date into month, day, and year parts:
    var observerDate = document.getElementById('observedate').value;
    var observerDateParts = observerDate.split("-");

    // Information about the observer location:
    var monthOfObservation = parseInt(observerDateParts[1]);
    var dayOfObservation = parseInt(observerDateParts[2]);
    var yearOfObservation = parseInt(observerDateParts[0]);
    var isDaylightSavings = document.getElementById('dst').checked;
    var zoneCorrectionHours = parseInt(document.getElementById('zonecorrect').value);

    // Retrieve eclipse information:
    var [
        lunarEclipseCertainDateDay, lunarEclipseCertainDateMonth, lunarEclipseCertainDateYear,
        utStartPenPhaseHour, utStartPenPhaseMinutes,
        utStartUmbralPhaseHour, utStartUmbralPhaseMinutes,
        utStartTotalPhaseHour, utStartTotalPhaseMinutes,
        utMidEclipseHour, utMidEclipseMinutes,
        utEndTotalPhaseHour, utEndTotalPhaseMinutes,
        utEndUmbralPhaseHour, utEndUmbralPhaseMinutes,
        utEndPenPhaseHour, utEndPenPhaseMinutes,
        eclipseMagnitude
    ] =
        paEclipses.lunarEclipseCircumstances(dayOfObservation, monthOfObservation, yearOfObservation, isDaylightSavings, zoneCorrectionHours);

    document.getElementById("eclipseCertainDate").innerHTML =
        lunarEclipseCertainDateMonth + "/" + lunarEclipseCertainDateDay + "/" + lunarEclipseCertainDateYear;
    document.getElementById("eclipseMagnitude").innerHTML = eclipseMagnitude;

    // Populate the results table for universal time:
    document.getElementById("eclipseStartPenumbral").innerHTML =
        formatTime(utStartPenPhaseHour, utStartPenPhaseMinutes);
    document.getElementById("eclipseStartUmbral").innerHTML =
        formatTime(utStartUmbralPhaseHour, utStartUmbralPhaseMinutes);
    document.getElementById("eclipseStartTotal").innerHTML =
        formatTime(utStartTotalPhaseHour, utStartTotalPhaseMinutes);
    document.getElementById("eclipseMidEclipse").innerHTML =
        formatTime(utMidEclipseHour, utMidEclipseMinutes);
    document.getElementById("eclipseEndTotal").innerHTML =
        formatTime(utEndTotalPhaseHour, utEndTotalPhaseMinutes);
    document.getElementById("eclipseEndUmbral").innerHTML =
        formatTime(utEndUmbralPhaseHour, utEndUmbralPhaseMinutes);
    document.getElementById("eclipseEndPenumbral").innerHTML =
        formatTime(utEndPenPhaseHour, utEndPenPhaseMinutes);

    // Populate the results table for local time:
    document.getElementById("eclipseStartPenumbralLocal").innerHTML =
        getLocalTime(utStartPenPhaseHour, utStartPenPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseStartUmbralLocal").innerHTML =
        getLocalTime(utStartUmbralPhaseHour, utStartUmbralPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseStartTotalLocal").innerHTML =
        getLocalTime(utStartTotalPhaseHour, utStartTotalPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseMidEclipseLocal").innerHTML =
        getLocalTime(utMidEclipseHour, utMidEclipseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseEndTotalLocal").innerHTML =
        getLocalTime(utEndTotalPhaseHour, utEndTotalPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseEndUmbralLocal").innerHTML =
        getLocalTime(utEndUmbralPhaseHour, utEndUmbralPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
    document.getElementById("eclipseEndPenumbralLocal").innerHTML =
        getLocalTime(utEndPenPhaseHour, utEndPenPhaseMinutes, zoneCorrectionHours, isDaylightSavings);
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize fields to defaults:
    document.getElementById("observedate").value = "2026-03-02";
    document.getElementById("dst").checked = true;
    document.getElementById("zonecorrect").value = "5";
})