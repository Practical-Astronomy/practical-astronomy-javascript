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
    var observerDateParts = $("#observedate").val().split("-");

    // Information about the observer location:
    var monthOfObservation = parseInt(observerDateParts[1]);
    var dayOfObservation = parseInt(observerDateParts[2]);
    var yearOfObservation = parseInt(observerDateParts[0]);
    var isDaylightSavings = $("#dst").prop('checked');
    var zoneCorrectionHours = parseInt($("#zonecorrect").val());

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


    $("#eclipseCertainDate").html(lunarEclipseCertainDateMonth + "/" + lunarEclipseCertainDateDay + "/" + lunarEclipseCertainDateYear);
    $("#eclipseMagnitude").html(eclipseMagnitude);

    // Populate the results table for universal time:
    $("#eclipseStartPenumbral").html(formatTime(utStartPenPhaseHour, utStartPenPhaseMinutes));
    $("#eclipseStartUmbral").html(formatTime(utStartUmbralPhaseHour, utStartUmbralPhaseMinutes));
    $("#eclipseStartTotal").html(formatTime(utStartTotalPhaseHour, utStartTotalPhaseMinutes));
    $("#eclipseMidEclipse").html(formatTime(utMidEclipseHour, utMidEclipseMinutes));
    $("#eclipseEndTotal").html(formatTime(utEndTotalPhaseHour, utEndTotalPhaseMinutes));
    $("#eclipseEndUmbral").html(formatTime(utEndUmbralPhaseHour, utEndUmbralPhaseMinutes));
    $("#eclipseEndPenumbral").html(formatTime(utEndPenPhaseHour, utEndPenPhaseMinutes));

    // Populate the results table for local time:
    $("#eclipseStartPenumbralLocal").html(getLocalTime(utStartPenPhaseHour, utStartPenPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseStartUmbralLocal").html(getLocalTime(utStartUmbralPhaseHour, utStartUmbralPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseStartTotalLocal").html(getLocalTime(utStartTotalPhaseHour, utStartTotalPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseMidEclipseLocal").html(getLocalTime(utMidEclipseHour, utMidEclipseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseEndTotalLocal").html(getLocalTime(utEndTotalPhaseHour, utEndTotalPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseEndUmbralLocal").html(getLocalTime(utEndUmbralPhaseHour, utEndUmbralPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
    $("#eclipseEndPenumbralLocal").html(getLocalTime(utEndPenPhaseHour, utEndPenPhaseMinutes, zoneCorrectionHours, isDaylightSavings));
}

$(document).ready(function () {
    $("#btnGetInfo").click(function () {
        testPA();
    });

    $('#observedate').val('2026-03-02');
    $('#dst').prop('checked', true);
    $('#zonecorrect').val('5');
});
