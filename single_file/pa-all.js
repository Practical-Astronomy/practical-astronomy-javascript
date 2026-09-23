class paBinary {
    /** Calculate orbital data for binary star. */
    static binaryStarOrbit(greenwichDateDay, greenwichDateMonth, greenwichDateYear, binaryName) {
        var [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode] = paBinaryData.getBinaryData(binaryName);

        var yYears = (greenwichDateYear + (paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) - paMacros.civilDateToJulianDate(0, 1, greenwichDateYear)) / 365.242191) - Number(epochPeri);
        var mDeg = 360 * yYears / Number(period);
        var mRad = paUtils.degreesToRadians(mDeg - 360 * Math.floor(mDeg / 360));
        var eccentricity = Number(ecc);
        var trueAnomalyRad = paMacros.trueAnomaly(mRad, eccentricity);
        var rArcsec = (1 - eccentricity * Math.cos(paMacros.eccentricAnomaly(mRad, eccentricity))) * Number(axis);
        var taPeriRad = trueAnomalyRad + paUtils.degreesToRadians(Number(longPeri));

        var y = Math.sin(taPeriRad) * Math.cos(paUtils.degreesToRadians(Number(incl)));
        var x = Math.cos(taPeriRad);
        var aDeg = paMacros.degrees(Math.atan2(y, x));
        var thetaDeg1 = aDeg + Number(paNode);
        var thetaDeg2 = thetaDeg1 - 360 * Math.floor(thetaDeg1 / 360);
        var rhoArcsec = rArcsec * Math.cos(taPeriRad) / Math.cos(paUtils.degreesToRadians(thetaDeg2 - Number(paNode)));

        var positionAngleDeg = paUtils.round(thetaDeg2, 1);
        var separationArcsec = paUtils.round(rhoArcsec, 2);

        return [positionAngleDeg, separationArcsec];
    }
}

class paBinaryData {
    static binaryStarNames = {
        etaCor: "eta-Cor",
        gammaVir: "gamma-Vir",
        etaCas: "eta-Cas",
        zetaOri: "zeta-Ori",
        alphaCma: "alpha-CMa",
        deltaGem: "delta-Gem",
        alphaGem: "alpha-Gem",
        aplahCmi: "aplah-CMi",
        alphaCen: "alpha-Cen",
        alphaSco: "alpha Sco"
    };

    /**
     * Binary Star Data
     * 
     * Elements:
     *   0: binaryName -- Name of binary system.
     *   1: period     -- Period of the orbit.
     *   2: epochPeri  -- Epoch of the perihelion.
     *   3: longPeri   -- Longitude of the perihelion.
     *   4: ecc        -- Eccentricity of the orbit.
     *   5: axis       -- Semi-major axis of the orbit.
     *   6: incl       -- Orbital inclination.
     *   7: paNode     -- Position angle of the ascending node.
     */
    static binaryData = [
        [this.binaryStarNames.etaCor, 41.623, 1934.008, 219.907, 0.2763, 0.907, 59.025, 23.717],
        [this.binaryStarNames.gammaVir, 171.37, 1836.433, 252.88, 0.8808, 3.746, 146.05, 31.78],
        [this.binaryStarNames.etaCas, 480.0, 1889.6, 268.59, 0.497, 11.9939, 34.76, 278.42],
        [this.binaryStarNames.zetaOri, 1508.6, 2070.6, 47.3, 0.07, 2.728, 72.0, 155.5],
        [this.binaryStarNames.alphaCma, 50.09, 1894.13, 147.27, 0.5923, 7.5, 136.53, 44.57],
        [this.binaryStarNames.deltaGem, 1200.0, 1437.0, 57.19, 0.11, 6.9753, 63.28, 18.38],
        [this.binaryStarNames.alphaGem, 420.07, 1965.3, 261.43, 0.33, 6.295, 115.94, 40.47],
        [this.binaryStarNames.aplahCmi, 40.65, 1927.6, 269.8, 0.4, 4.548, 35.7, 284.3],
        [this.binaryStarNames.alphaCen, 79.92, 1955.56, 231.56, 0.516, 17.583, 79.24, 204.868],
        [this.binaryStarNames.alphaSco, 900.0, 1889.0, 0.0, 0.0, 3.21, 86.3, 273.0]
    ];

    static getBinaryData(binaryName) {
        let [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode] = ["not found", -99, -99, -99, -99, -99, -99, -99];

        for (let iLoop = 0; iLoop < this.binaryData.length; iLoop++) {
            if (this.binaryData[iLoop][0] == binaryName) {
                binary_name = String(this.binaryData[iLoop][0]);
                period = Number(this.binaryData[iLoop][1]);
                epochPeri = Number(this.binaryData[iLoop][2]);
                longPeri = Number(this.binaryData[iLoop][3]);
                ecc = Number(this.binaryData[iLoop][4]);
                axis = Number(this.binaryData[iLoop][5]);
                incl = Number(this.binaryData[iLoop][6]);
                paNode = Number(this.binaryData[iLoop][7]);

                break;
            }
        }

        return [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode];
    };
}

class paComet {
    /** Calculate position of an elliptical comet. */
    static positionOfEllipticalComet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, cometName) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit] = paCometData.getCometEllipticalData(cometName);

        var timeSinceEpochYears = (paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) - paMacros.civilDateToJulianDate(0.0, 1, greenwichDateYear)) / 365.242191 + greenwichDateYear - Number(epoch_EpochOfPerihelion);
        var mcDeg = 360 * timeSinceEpochYears / Number(period_PeriodOfOrbit);
        var mcRad = paUtils.degreesToRadians(mcDeg - 360 * Math.floor(mcDeg / 360));
        var eccentricity = Number(ecc_EccentricityOfOrbit);
        var trueAnomalyDeg = paMacros.degrees(paMacros.trueAnomaly(mcRad, eccentricity));
        var lcDeg = trueAnomalyDeg + Number(peri_LongitudeOfPerihelion);
        var rAU = Number(axis_SemiMajorAxisOfOrbit) * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(paUtils.degreesToRadians(trueAnomalyDeg)));
        var lcNodeRad = paUtils.degreesToRadians(lcDeg - Number(node_LongitudeOfAscendingNode));
        var psiRad = Math.asin(Math.sin(lcNodeRad) * Math.sin(paUtils.degreesToRadians(Number(incl_InclinationOfOrbit))));

        var y = Math.sin(lcNodeRad) * Math.cos(paUtils.degreesToRadians(Number(incl_InclinationOfOrbit)));
        var x = Math.cos(lcNodeRad);

        var ldDeg = paMacros.degrees(Math.atan2(y, x)) + Number(node_LongitudeOfAscendingNode);
        var rdAU = rAU * Math.cos(psiRad);

        var earthLongitudeLeDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) + 180.0;
        var earthRadiusVectorAU = paMacros.sunDist(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var leLdRad = paUtils.degreesToRadians(earthLongitudeLeDeg - ldDeg);
        var aRad = (rdAU < earthRadiusVectorAU) ? Math.atan2((rdAU * Math.sin(leLdRad)), (earthRadiusVectorAU - rdAU * Math.cos(leLdRad))) : Math.atan2((earthRadiusVectorAU * Math.sin(-leLdRad)), (rdAU - earthRadiusVectorAU * Math.cos(leLdRad)));

        var cometLongDeg1 = (rdAU < earthRadiusVectorAU) ? 180.0 + earthLongitudeLeDeg + paMacros.degrees(aRad) : paMacros.degrees(aRad) + ldDeg;
        var cometLongDeg = cometLongDeg1 - 360 * Math.floor(cometLongDeg1 / 360);
        var cometLatDeg = paMacros.degrees(Math.atan(rdAU * Math.tan(psiRad) * Math.sin(paUtils.degreesToRadians(cometLongDeg1 - ldDeg)) / (earthRadiusVectorAU * Math.sin(-leLdRad))));
        var cometRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));
        var cometDecDeg1 = paMacros.ecDec(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);
        var cometDistanceAU = Math.sqrt(Math.pow(earthRadiusVectorAU, 2) + Math.pow(rAU, 2) - 2.0 * earthRadiusVectorAU * rAU * Math.cos(paUtils.degreesToRadians(lcDeg - earthLongitudeLeDeg)) * Math.cos(psiRad));

        var cometRAHour = paMacros.decimalHoursHour(cometRAHours1 + 0.008333);
        var cometRAMin = paMacros.decimalHoursMinute(cometRAHours1 + 0.008333);
        var cometDecDeg = paMacros.decimalDegreesDegrees(cometDecDeg1 + 0.008333);
        var cometDecMin = paMacros.decimalDegreesMinutes(cometDecDeg1 + 0.008333);
        var cometDistEarth = paUtils.round(cometDistanceAU, 2);

        return [cometRAHour, cometRAMin, cometDecDeg, cometDecMin, cometDistEarth];
    }

    /**
     * Calculate position of a parabolic comet.
     */
    static positionOfParabolicComet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, cometName) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var [comet_name, epochPeriDay, epochPeriMonth, epochPeriYear, argPeri, node, periDist, incl] = paCometData.getCometParabolicData(cometName);

        var perihelionEpochDay = Number(epochPeriDay);
        var perihelionEpochMonth = Number(epochPeriMonth);
        var perihelionEpochYear = Number(epochPeriYear);
        var qAU = Number(periDist);
        var inclinationDeg = Number(incl);
        var perihelionDeg = Number(argPeri);
        var nodeDeg = Number(node);

        var [cometLongDeg, cometLatDeg, cometDistAU] = paMacros.pCometLongLatDist(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, perihelionEpochDay, perihelionEpochMonth, perihelionEpochYear, qAU, inclinationDeg, perihelionDeg, nodeDeg);

        var cometRAHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));
        var cometDecDeg1 = paMacros.ecDec(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);

        var cometRAHour = paMacros.decimalHoursHour(cometRAHours);
        var cometRAMin = paMacros.decimalHoursMinute(cometRAHours);
        var cometRASec = paMacros.decimalHoursSecond(cometRAHours);
        var cometDecDeg = paMacros.decimalDegreesDegrees(cometDecDeg1);
        var cometDecMin = paMacros.decimalDegreesMinutes(cometDecDeg1);
        var cometDecSec = paMacros.decimalDegreesSeconds(cometDecDeg1);
        var cometDistEarth = paUtils.round(cometDistAU, 2);

        return [cometRAHour, cometRAMin, cometRASec, cometDecDeg, cometDecMin, cometDecSec, cometDistEarth];
    }
}

class paCometData {
    static cometEllipticalNames = {
        encke: "Encke",
        temple2: "Temple 2",
        hanedaCampos: "Haneda-Campos",
        schwassmannWachmann2: "Schwassmann-Wachmann 2",
        borrelly: "Borrelly",
        whipple: "Whipple",
        oterma: "Oterma",
        schaumasse: "Schaumasse",
        comasSola: "Comas Sola",
        schwassmannWachmann1: "Schwassmann-Wachmann 1",
        neujmin1: "Neujmin 1",
        crommelin: "Crommelin",
        olbers: "Olbers",
        ponsBrooks: "Pons-Brooks",
        halley: "Halley"
    };

    static cometParabolicNames = {
        kohler: "Kohler"
    };

    /**
     * Comet Elliptical Data
     * 
     * Elements:
     *   0: Name
     *   1: epoch_EpochOfPerihelion
     *   2: peri_LongitudeOfPerihelion
     *   3: node_LongitudeOfAscendingNode
     *   4: period_PeriodOfOrbit
     *   5: axis_SemiMajorAxisOfOrbit
     *   6: ecc_EccentricityOfOrbit
     *   7: incl_InclinationOfOrbit
     */
    static cometEllipticalData = [
        [this.cometEllipticalNames.encke, 1974.32, 160.1, 334.2, 3.3, 2.21, 0.85, 12.0],
        [this.cometEllipticalNames.temple2, 1972.87, 310.2, 119.3, 5.26, 3.02, 0.55, 12.5],
        [this.cometEllipticalNames.hanedaCampos, 1978.77, 12.02, 131.7, 5.37, 3.07, 0.64, 5.81],
        [this.cometEllipticalNames.schwassmannWachmann2, 1974.7, 123.3, 126.0, 6.51, 3.49, 0.39, 3.7],
        [this.cometEllipticalNames.borrelly, 1974.36, 67.8, 75.1, 6.76, 3.58, 0.63, 30.2],
        [this.cometEllipticalNames.whipple, 1970.77, 18.2, 188.4, 7.47, 3.82, 0.35, 10.2],
        [this.cometEllipticalNames.oterma, 1958.44, 150.0, 155.1, 7.88, 3.96, 0.14, 4.0],
        [this.cometEllipticalNames.schaumasse, 1960.29, 138.1, 86.2, 8.18, 4.05, 0.71, 12.0],
        [this.cometEllipticalNames.comasSola, 1969.83, 102.9, 62.8, 8.55, 4.18, 0.58, 13.4],
        [this.cometEllipticalNames.schwassmannWachmann1, 1974.12, 334.1, 319.6, 15.03, 6.09, 0.11, 9.7],
        [this.cometEllipticalNames.neujmin1, 1966.94, 334.0, 347.2, 17.93, 6.86, 0.78, 15.0],
        [this.cometEllipticalNames.crommelin, 1956.82, 86.4, 250.4, 27.89, 9.17, 0.92, 28.9],
        [this.cometEllipticalNames.olbers, 1956.46, 150.0, 85.4, 69.47, 16.84, 0.93, 44.6],
        [this.cometEllipticalNames.ponsBrooks, 1954.39, 94.2, 255.2, 70.98, 17.2, 0.96, 74.2],
        [this.cometEllipticalNames.halley, 1986.112, 170.011, 58.154, 76.0081, 17.9435, 0.9673, 162.2384]
    ];

    /**
     * Comet Parabolic Data 
     * 
     * Elements:
     *   0: comet_name
     *   1: epochPeriDay
     *   2: epochPeriMonth
     *   3: epochPeriYear
     *   4: argPeri
     *   5: node
     *   6: periDist
     *   7: incl 
     */
    static cometParabolicData = [
        [this.cometParabolicNames.kohler, 10.5659, 11, 1977, 163.4799, 181.8175, 0.990662, 48.7196]
    ];

    static getCometEllipticalData(cometName) {
        let [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit] = ["not found", -99, -99, -99, -99, -99, -99, -99]

        for (let iLoop = 0; iLoop < this.cometEllipticalData.length; iLoop++) {
            if (this.cometEllipticalData[iLoop][0] == cometName) {
                comet_name = String(this.cometEllipticalData[iLoop][0]);
                epoch_EpochOfPerihelion = Number(this.cometEllipticalData[iLoop][1]);
                peri_LongitudeOfPerihelion = Number(this.cometEllipticalData[iLoop][2]);
                node_LongitudeOfAscendingNode = Number(this.cometEllipticalData[iLoop][3]);
                period_PeriodOfOrbit = Number(this.cometEllipticalData[iLoop][4]);
                axis_SemiMajorAxisOfOrbit = Number(this.cometEllipticalData[iLoop][5]);
                ecc_EccentricityOfOrbit = Number(this.cometEllipticalData[iLoop][6]);
                incl_InclinationOfOrbit = Number(this.cometEllipticalData[iLoop][7]);

                break;
            }
        }

        return [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit];
    };

    static getCometParabolicData(cometName) {
        let [comet_name, epochPeriDay, epochPeriMonth, epochPeriYear, argPeri, node, periDist, incl] = ["not found", -99, -99, -99, -99, -99, -99, -99];

        for (let iLoop = 0; iLoop < this.cometParabolicData.length; iLoop++) {
            if (this.cometParabolicData[iLoop][0] == cometName) {
                comet_name = String(this.cometParabolicData[iLoop][0]);
                epochPeriDay = Number(this.cometParabolicData[iLoop][1]);
                epochPeriMonth = Number(this.cometParabolicData[iLoop][2]);
                epochPeriYear = Number(this.cometParabolicData[iLoop][3]);
                argPeri = Number(this.cometParabolicData[iLoop][4]);
                node = Number(this.cometParabolicData[iLoop][5]);
                periDist = Number(this.cometParabolicData[iLoop][6]);
                incl = Number(this.cometParabolicData[iLoop][7]);

                break;
            }
        }

        return [comet_name, epochPeriDay, epochPeriMonth, epochPeriYear, argPeri, node, periDist, incl];
    }
}

class paCoordinates {
    /**
     * Convert an Angle (degrees, minutes, and seconds) to Decimal Degrees
     */
    static angleToDecimalDegrees(degrees, minutes, seconds) {
        var a = Math.abs(seconds) / 60;
        var b = (Math.abs(minutes) + a) / 60;
        var c = Math.abs(degrees) + b;
        var d = (degrees < 0 || minutes < 0 || seconds < 0) ? -c : c;

        return d;
    }

    /**
     * Convert Decimal Degrees to an Angle (degrees, minutes, and seconds)
     */
    static decimalDegreesToAngle(decimalDegrees) {
        var unsignedDecimal = Math.abs(decimalDegrees);
        var totalSeconds = unsignedDecimal * 3600;
        var seconds2DP = paUtils.round(totalSeconds % 60, 2);
        var correctedSeconds = (seconds2DP == 60) ? 0 : seconds2DP;
        var correctedRemainder = (seconds2DP == 60) ? totalSeconds + 60 : totalSeconds;
        var minutes = Math.floor(correctedRemainder / 60) % 60;
        var unsignedDegrees = Math.floor(correctedRemainder / 3600);
        var signedDegrees = (decimalDegrees < 0) ? -1 * unsignedDegrees : unsignedDegrees;

        return [signedDegrees, minutes, Math.floor(correctedSeconds)];
    }

    /**
     * Convert Right Ascension to Hour Angle
     */
    static rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, isDaylightSavings, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
        var daylightSaving = (isDaylightSavings) ? 1 : 0;

        var hourAngle = paMacros.rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude);

        var hourAngleHours = paMacros.decimalHoursHour(hourAngle);
        var hourAngleMinutes = paMacros.decimalHoursMinute(hourAngle);
        var hourAngleSeconds = paMacros.decimalHoursSecond(hourAngle);

        return [hourAngleHours, hourAngleMinutes, hourAngleSeconds];
    }

    /**
     * Convert Hour Angle to Right Ascension
     */
    static hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, isDaylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var rightAscension = paMacros.hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude);

        var rightAscensionHours = paMacros.decimalHoursHour(rightAscension);
        var rightAscensionMinutes = paMacros.decimalHoursMinute(rightAscension);
        var rightAscensionSeconds = paMacros.decimalHoursSecond(rightAscension);

        return [rightAscensionHours, rightAscensionMinutes, rightAscensionSeconds];
    }

    /**
     * Convert Equatorial Coordinates to Horizon Coordinates
     */
    static equatorialCoordinatesToHorizonCoordinates(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
        var azimuthInDecimalDegrees = paMacros.equatorialCoordinatesToAzimuth(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude);

        var altitudeInDecimalDegrees = paMacros.equatorialCoordinatesToAltitude(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude);

        var azimuthDegrees = paMacros.decimalDegreesDegrees(azimuthInDecimalDegrees);
        var azimuthMinutes = paMacros.decimalDegreesMinutes(azimuthInDecimalDegrees);
        var azimuthSeconds = paMacros.decimalDegreesSeconds(azimuthInDecimalDegrees);

        var altitudeDegrees = paMacros.decimalDegreesDegrees(altitudeInDecimalDegrees);
        var altitudeMinutes = paMacros.decimalDegreesMinutes(altitudeInDecimalDegrees);
        var altitudeSeconds = paMacros.decimalDegreesSeconds(altitudeInDecimalDegrees);

        return [azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds];
    }

    /**
     * Convert Horizon Coordinates to Equatorial Coordinates
     */
    static horizonCoordinatesToEquatorialCoordinates(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
        var hourAngleInDecimalDegrees = paMacros.horizonCoordinatesToHourAngle(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude);

        var declinationInDecimalDegrees = paMacros.horizonCoordinatesToDeclination(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude);

        var hourAngleHours = paMacros.decimalHoursHour(hourAngleInDecimalDegrees);
        var hourAngleMinutes = paMacros.decimalHoursMinute(hourAngleInDecimalDegrees);
        var hourAngleSeconds = paMacros.decimalHoursSecond(hourAngleInDecimalDegrees);

        var declinationDegrees = paMacros.decimalDegreesDegrees(declinationInDecimalDegrees);
        var declinationMinutes = paMacros.decimalDegreesMinutes(declinationInDecimalDegrees);
        var declinationSeconds = paMacros.decimalDegreesSeconds(declinationInDecimalDegrees);

        return [hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds];
    }

    /**
     * Calculate Mean Obliquity of the Ecliptic for a Greenwich Date
     */
    static meanObliquityOfTheEcliptic(greenwichDay, greenwichMonth, greenwichYear) {
        var jd = paMacros.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
        var mjd = jd - 2451545;
        var t = mjd / 36525;
        var de1 = t * (46.815 + t * (0.0006 - (t * 0.00181)));
        var de2 = de1 / 3600;

        return 23.439292 - de2;
    }

    /**
     * Convert Ecliptic Coordinates to Equatorial Coordinates
     */
    static eclipticCoordinateToEquatorialCoordinate(eclipticLongitudeDegrees, eclipticLongitudeMinutes, eclipticLongitudeSeconds, eclipticLatitudeDegrees, eclipticLatitudeMinutes, eclipticLatitudeSeconds, greenwichDay, greenwichMonth, greenwichYear) {
        var eclonDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(eclipticLongitudeDegrees, eclipticLongitudeMinutes, eclipticLongitudeSeconds);
        var eclatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(eclipticLatitudeDegrees, eclipticLatitudeMinutes, eclipticLatitudeSeconds);
        var eclonRad = paUtils.degreesToRadians(eclonDeg);
        var eclatRad = paUtils.degreesToRadians(eclatDeg);
        var obliqDeg = paMacros.obliq(greenwichDay, greenwichMonth, greenwichYear);
        var obliqRad = paUtils.degreesToRadians(obliqDeg);
        var sinDec = Math.sin(eclatRad) * Math.cos(obliqRad) + Math.cos(eclatRad) * Math.sin(obliqRad) * Math.sin(eclonRad);
        var decRad = Math.asin(sinDec);
        var decDeg = paMacros.degrees(decRad);
        var y = Math.sin(eclonRad) * Math.cos(obliqRad) - Math.tan(eclatRad) * Math.sin(obliqRad);
        var x = Math.cos(eclonRad);
        var raRad = Math.atan2(y, x);
        var raDeg1 = paMacros.degrees(raRad);
        var raDeg2 = raDeg1 - 360 * Math.floor(raDeg1 / 360);
        var raHours = paMacros.decimalDegreesToDegreeHours(raDeg2);

        var outRAHours = paMacros.decimalHoursHour(raHours);
        var outRAMinutes = paMacros.decimalHoursMinute(raHours);
        var outRASeconds = paMacros.decimalHoursSecond(raHours);
        var outDecDegrees = paMacros.decimalDegreesDegrees(decDeg);
        var outDecMinutes = paMacros.decimalDegreesMinutes(decDeg);
        var outDecSeconds = paMacros.decimalDegreesSeconds(decDeg);

        return [outRAHours, outRAMinutes, outRASeconds, outDecDegrees, outDecMinutes, outDecSeconds];
    }

    /**
     * Convert Equatorial Coordinates to Ecliptic Coordinates
     */
    static equatorialCoordinateToEclipticCoordinate(raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds, gwDay, gwMonth, gwYear) {
        var raDeg = paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHours, raMinutes, raSeconds));
        var decDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDegrees, decMinutes, decSeconds);
        var raRad = paUtils.degreesToRadians(raDeg);
        var decRad = paUtils.degreesToRadians(decDeg);
        var obliqDeg = paMacros.obliq(gwDay, gwMonth, gwYear);
        var obliqRad = paUtils.degreesToRadians(obliqDeg);
        var sinEclLat = Math.sin(decRad) * Math.cos(obliqRad) - Math.cos(decRad) * Math.sin(obliqRad) * Math.sin(raRad);
        var eclLatRad = Math.asin(sinEclLat);
        var eclLatDeg = paMacros.degrees(eclLatRad);
        var y = Math.sin(raRad) * Math.cos(obliqRad) + Math.tan(decRad) * Math.sin(obliqRad);
        var x = Math.cos(raRad);
        var eclLongRad = Math.atan2(y, x);
        var eclLongDeg1 = paMacros.degrees(eclLongRad);
        var eclLongDeg2 = eclLongDeg1 - 360 * Math.floor(eclLongDeg1 / 360);

        var outEclLongDeg = paMacros.decimalDegreesDegrees(eclLongDeg2);
        var outEclLongMin = paMacros.decimalDegreesMinutes(eclLongDeg2);
        var outEclLongSec = paMacros.decimalDegreesSeconds(eclLongDeg2);
        var outEclLatDeg = paMacros.decimalDegreesDegrees(eclLatDeg);
        var outEclLatMin = paMacros.decimalDegreesMinutes(eclLatDeg);
        var outEclLatSec = paMacros.decimalDegreesSeconds(eclLatDeg);

        return [outEclLongDeg, outEclLongMin, outEclLongSec, outEclLatDeg, outEclLatMin, outEclLatSec];
    }

    /**
     * 
     * Convert Equatorial Coordinates to Galactic Coordinates
     */
    static equatorialCoordinateToGalacticCoordinate(raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds) {
        var raDeg = paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHours, raMinutes, raSeconds));
        var decDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDegrees, decMinutes, decSeconds);
        var raRad = paUtils.degreesToRadians(raDeg);
        var decRad = paUtils.degreesToRadians(decDeg);
        var sinB = Math.cos(decRad) * Math.cos(paUtils.degreesToRadians(27.4)) * Math.cos(raRad - paUtils.degreesToRadians(192.25)) + Math.sin(decRad) * Math.sin(paUtils.degreesToRadians(27.4));
        var bRadians = Math.asin(sinB);
        var bDeg = paMacros.degrees(bRadians);
        var y = Math.sin(decRad) - sinB * Math.sin(paUtils.degreesToRadians(27.4));
        var x = Math.cos(decRad) * Math.sin(raRad - paUtils.degreesToRadians(192.25)) * Math.cos(paUtils.degreesToRadians(27.4));
        var longDeg1 = paMacros.degrees(Math.atan2(y, x)) + 33;
        var longDeg2 = longDeg1 - 360 * Math.floor(longDeg1 / 360);

        var galLongDeg = paMacros.decimalDegreesDegrees(longDeg2);
        var galLongMin = paMacros.decimalDegreesMinutes(longDeg2);
        var galLongSec = paMacros.decimalDegreesSeconds(longDeg2);
        var galLatDeg = paMacros.decimalDegreesDegrees(bDeg);
        var galLatMin = paMacros.decimalDegreesMinutes(bDeg);
        var galLatSec = paMacros.decimalDegreesSeconds(bDeg);

        return [galLongDeg, galLongMin, galLongSec, galLatDeg, galLatMin, galLatSec];
    }

    /**
     * Convert Galactic Coordinates to Equatorial Coordinates
     */
    static galacticCoordinateToEquatorialCoordinate(galLongDeg, galLongMin, galLongSec, galLatDeg, galLatMin, galLatSec) {
        var glongDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(galLongDeg, galLongMin, galLongSec);
        var glatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(galLatDeg, galLatMin, galLatSec);
        var glongRad = paUtils.degreesToRadians(glongDeg);
        var glatRad = paUtils.degreesToRadians(glatDeg);
        var sinDec = Math.cos(glatRad) * Math.cos(paUtils.degreesToRadians(27.4)) * Math.sin(glongRad - paUtils.degreesToRadians(33.0)) + Math.sin(glatRad) * Math.sin(paUtils.degreesToRadians(27.4));
        var decRadians = Math.asin(sinDec);
        var decDeg = paMacros.degrees(decRadians);
        var y = Math.cos(glatRad) * Math.cos(glongRad - paUtils.degreesToRadians(33.0));
        var x = Math.sin(glatRad) * Math.cos(paUtils.degreesToRadians(27.4)) - Math.cos(glatRad) * Math.sin(paUtils.degreesToRadians(27.4)) * Math.sin(glongRad - paUtils.degreesToRadians(33.0));

        var raDeg1 = paMacros.degrees(Math.atan2(y, x)) + 192.25;
        var raDeg2 = raDeg1 - 360 * Math.floor(raDeg1 / 360);
        var raHours1 = paMacros.decimalDegreesToDegreeHours(raDeg2);

        var raHours = paMacros.decimalHoursHour(raHours1);
        var raMinutes = paMacros.decimalHoursMinute(raHours1);
        var raSeconds = paMacros.decimalHoursSecond(raHours1);
        var decDegrees = paMacros.decimalDegreesDegrees(decDeg);
        var decMinutes = paMacros.decimalDegreesMinutes(decDeg);
        var decSeconds = paMacros.decimalDegreesSeconds(decDeg);

        return [raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds];
    }

    /**
     * Calculate the angle between two celestial objects
     */
    static angleBetweenTwoObjects(raLong1HourDeg, raLong1Min, raLong1Sec, decLat1Deg, decLat1Min, decLat1Sec, raLong2HourDeg, raLong2Min, raLong2Sec, decLat2Deg, decLat2Min, decLat2Sec, hourOrDegree) {
        var raLong1Decimal = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.HMStoDH(raLong1HourDeg, raLong1Min, raLong1Sec) : paMacros.degreesMinutesSecondsToDecimalDegrees(raLong1HourDeg, raLong1Min, raLong1Sec);
        var raLong1Deg = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.degreeHoursToDecimalDegrees(raLong1Decimal) : raLong1Decimal;

        var raLong1Rad = paUtils.degreesToRadians(raLong1Deg);
        var decLat1Deg1 = paMacros.degreesMinutesSecondsToDecimalDegrees(decLat1Deg, decLat1Min, decLat1Sec);
        var decLat1Rad = paUtils.degreesToRadians(decLat1Deg1);

        var raLong2Decimal = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.HMStoDH(raLong2HourDeg, raLong2Min, raLong2Sec) : paMacros.degreesMinutesSecondsToDecimalDegrees(raLong2HourDeg, raLong2Min, raLong2Sec);
        var raLong2Deg = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.degreeHoursToDecimalDegrees(raLong2Decimal) : raLong2Decimal;
        var raLong2Rad = paUtils.degreesToRadians(raLong2Deg);
        var decLat2Deg1 = paMacros.degreesMinutesSecondsToDecimalDegrees(decLat2Deg, decLat2Min, decLat2Sec);
        var decLat2Rad = paUtils.degreesToRadians(decLat2Deg1);

        var cosD = Math.sin(decLat1Rad) * Math.sin(decLat2Rad) + Math.cos(decLat1Rad) * Math.cos(decLat2Rad) * Math.cos(raLong1Rad - raLong2Rad);
        var dRad = Math.acos(cosD);
        var dDeg = paMacros.degrees(dRad);

        var angleDeg = paMacros.decimalDegreesDegrees(dDeg);
        var angleMin = paMacros.decimalDegreesMinutes(dDeg);
        var angleSec = paMacros.decimalDegreesSeconds(dDeg);

        return [angleDeg, angleMin, angleSec];
    }

    /**
     * Calculate rising and setting times for an object.
     */
    static risingAndSetting(raHours, raMinutes, raSeconds, decDeg, decMin, decSec, gwDateDay, gwDateMonth, gwDateYear, geogLongDeg, geogLatDeg, vertShiftDeg) {
        var raHours1 = paMacros.HMStoDH(raHours, raMinutes, raSeconds);
        var decRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMin, decSec));
        var verticalDisplRadians = paUtils.degreesToRadians(vertShiftDeg);
        var geoLatRadians = paUtils.degreesToRadians(geogLatDeg);
        var cosH = -(Math.sin(verticalDisplRadians) + Math.sin(geoLatRadians) * Math.sin(decRad)) / (Math.cos(geoLatRadians) * Math.cos(decRad));
        var hHours = paMacros.decimalDegreesToDegreeHours(paMacros.degrees(Math.acos(cosH)));
        var lstRiseHours = (raHours1 - hHours) - 24 * Math.floor((raHours1 - hHours) / 24);
        var lstSetHours = (raHours1 + hHours) - 24 * Math.floor((raHours1 + hHours) / 24);
        var aDeg = paMacros.degrees(Math.acos((Math.sin(decRad) + Math.sin(verticalDisplRadians) * Math.sin(geoLatRadians)) / (Math.cos(verticalDisplRadians) * Math.cos(geoLatRadians))));
        var azRiseDeg = aDeg - 360 * Math.floor(aDeg / 360);
        var azSetDeg = (360 - aDeg) - 360 * Math.floor((360 - aDeg) / 360);
        var utRiseHours1 = paMacros.greenwichSiderealTimeToUniversalTime(paMacros.localSiderealTimeToGreenwichSiderealTime(lstRiseHours, 0, 0, geogLongDeg), 0, 0, gwDateDay, gwDateMonth, gwDateYear);
        var utSetHours1 = paMacros.greenwichSiderealTimeToUniversalTime(paMacros.localSiderealTimeToGreenwichSiderealTime(lstSetHours, 0, 0, geogLongDeg), 0, 0, gwDateDay, gwDateMonth, gwDateYear);
        var utRiseAdjustedHours = utRiseHours1 + 0.008333;
        var utSetAdjustedHours = utSetHours1 + 0.008333;

        var riseSetStatus = paTypes.RiseSetStatus.OK;
        if (cosH > 1)
            riseSetStatus = paTypes.RiseSetStatus.NeverRises;
        if (cosH < -1)
            riseSetStatus = paTypes.RiseSetStatus.Circumpolar;

        var utRiseHour = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursHour(utRiseAdjustedHours) : 0;
        var utRiseMin = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursMinute(utRiseAdjustedHours) : 0;
        var utSetHour = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursHour(utSetAdjustedHours) : 0;
        var utSetMin = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursMinute(utSetAdjustedHours) : 0;
        var azRise = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paUtils.round(azRiseDeg, 2) : 0;
        var azSet = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paUtils.round(azSetDeg, 2) : 0;

        return [riseSetStatus, utRiseHour, utRiseMin, utSetHour, utSetMin, azRise, azSet];
    }

    /**
     * Calculate precession (corrected coordinates between two epochs)
     */
    static correctForPrecession(raHour, raMinutes, raSeconds, decDeg, decMinutes, decSeconds, epoch1Day, epoch1Month, epoch1Year, epoch2Day, epoch2Month, epoch2Year) {
        var ra1Rad = paUtils.degreesToRadians(paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHour, raMinutes, raSeconds)));
        var dec1Rad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMinutes, decSeconds));
        var tCenturies = (paMacros.civilDateToJulianDate(epoch1Day, epoch1Month, epoch1Year) - 2415020) / 36525;
        var mSec = 3.07234 + (0.00186 * tCenturies);
        var nArcsec = 20.0468 - (0.0085 * tCenturies);
        var nYears = (paMacros.civilDateToJulianDate(epoch2Day, epoch2Month, epoch2Year) - paMacros.civilDateToJulianDate(epoch1Day, epoch1Month, epoch1Year)) / 365.25;
        var s1Hours = ((mSec + (nArcsec * Math.sin(ra1Rad) * Math.tan(dec1Rad) / 15)) * nYears) / 3600;
        var ra2Hours = paMacros.HMStoDH(raHour, raMinutes, raSeconds) + s1Hours;
        var s2Deg = (nArcsec * Math.cos(ra1Rad) * nYears) / 3600;
        var dec2Deg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMinutes, decSeconds) + s2Deg;

        var correctedRAHour = paMacros.decimalHoursHour(ra2Hours);
        var correctedRAMinutes = paMacros.decimalHoursMinute(ra2Hours);
        var correctedRASeconds = paMacros.decimalHoursSecond(ra2Hours);
        var correctedDecDeg = paMacros.decimalDegreesDegrees(dec2Deg);
        var correctedDecMinutes = paMacros.decimalDegreesMinutes(dec2Deg);
        var correctedDecSeconds = paMacros.decimalDegreesSeconds(dec2Deg);

        return [correctedRAHour, correctedRAMinutes, correctedRASeconds, correctedDecDeg, correctedDecMinutes, correctedDecSeconds];
    }

    /**
     * Calculate nutation for two values: ecliptic longitude and obliquity, for a Greenwich date.
     */
    static nutationInEclipticLongitudeAndObliquity(greenwichDay, greenwichMonth, greenwichYear) {
        var jdDays = paMacros.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
        var tCenturies = (jdDays - 2415020) / 36525;
        var aDeg = 100.0021358 * tCenturies;
        var l1Deg = 279.6967 + (0.000303 * tCenturies * tCenturies);
        var lDeg1 = l1Deg + 360 * (aDeg - Math.floor(aDeg));
        var lDeg2 = lDeg1 - 360 * Math.floor(lDeg1 / 360);
        var lRad = paUtils.degreesToRadians(lDeg2);
        var bDeg = 5.372617 * tCenturies;
        var nDeg1 = 259.1833 - 360 * (bDeg - Math.floor(bDeg));
        var nDeg2 = nDeg1 - 360 * (Math.floor(nDeg1 / 360));
        var nRad = paUtils.degreesToRadians(nDeg2);
        var nutInLongArcsec = -17.2 * Math.sin(nRad) - 1.3 * Math.sin(2 * lRad);
        var nutInOblArcsec = 9.2 * Math.cos(nRad) + 0.5 * Math.cos(2 * lRad);

        var nutInLongDeg = nutInLongArcsec / 3600;
        var nutInOblDeg = nutInOblArcsec / 3600;

        return [nutInLongDeg, nutInOblDeg];
    }

    /**
     * Correct ecliptic coordinates for the effects of aberration.
     */
    static correctForAberration(utHour, utMinutes, utSeconds, gwDay, gwMonth, gwYear, trueEclLongDeg, trueEclLongMin, trueEclLongSec, trueEclLatDeg, trueEclLatMin, trueEclLatSec) {
        var trueLongDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(trueEclLongDeg, trueEclLongMin, trueEclLongSec);
        var trueLatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(trueEclLatDeg, trueEclLatMin, trueEclLatSec);
        var sunTrueLongDeg = paMacros.sunLong(utHour, utMinutes, utSeconds, 0, 0, gwDay, gwMonth, gwYear);
        var dlongArcsec = -20.5 * Math.cos(paUtils.degreesToRadians(sunTrueLongDeg - trueLongDeg)) / Math.cos(paUtils.degreesToRadians(trueLatDeg));
        var dlatArcsec = -20.5 * Math.sin(paUtils.degreesToRadians(sunTrueLongDeg - trueLongDeg)) * Math.sin(paUtils.degreesToRadians(trueLatDeg));
        var apparentLongDeg = trueLongDeg + (dlongArcsec / 3600);
        var apparentLatDeg = trueLatDeg + (dlatArcsec / 3600);

        var apparentEclLongDeg = paMacros.decimalDegreesDegrees(apparentLongDeg);
        var apparentEclLongMin = paMacros.decimalDegreesMinutes(apparentLongDeg);
        var apparentEclLongSec = paMacros.decimalDegreesSeconds(apparentLongDeg);
        var apparentEclLatDeg = paMacros.decimalDegreesDegrees(apparentLatDeg);
        var apparentEclLatMin = paMacros.decimalDegreesMinutes(apparentLatDeg);
        var apparentEclLatSec = paMacros.decimalDegreesSeconds(apparentLatDeg);

        return [apparentEclLongDeg, apparentEclLongMin, apparentEclLongSec, apparentEclLatDeg, apparentEclLatMin, apparentEclLatSec];
    }

    /**
     * Calculate corrected RA/Dec, accounting for atmospheric refraction.
     */
    static atmosphericRefraction(trueRAHour, trueRAMin, trueRASec, trueDecDeg, trueDecMin, trueDecSec, coordinateType, geogLongDeg, geogLatDeg, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, lctHour, lctMin, lctSec, atmosphericPressureMbar, atmosphericTemperatureCelsius) {
        var haHour = paMacros.rightAscensionToHourAngle(trueRAHour, trueRAMin, trueRASec, lctHour, lctMin, lctSec, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);
        var azimuthDeg = paMacros.equatorialCoordinatesToAzimuth(haHour, 0, 0, trueDecDeg, trueDecMin, trueDecSec, geogLatDeg);
        var altitudeDeg = paMacros.equatorialCoordinatesToAltitude(haHour, 0, 0, trueDecDeg, trueDecMin, trueDecSec, geogLatDeg);
        var correctedAltitudeDeg = paMacros.refract(altitudeDeg, coordinateType, atmosphericPressureMbar, atmosphericTemperatureCelsius);

        var correctedHAHour = paMacros.horizonCoordinatesToHourAngle(azimuthDeg, 0, 0, correctedAltitudeDeg, 0, 0, geogLatDeg);
        var correctedRAHour1 = paMacros.hourAngleToRightAscension(correctedHAHour, 0, 0, lctHour, lctMin, lctSec, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);
        var correctedDecDeg1 = paMacros.horizonCoordinatesToDeclination(azimuthDeg, 0, 0, correctedAltitudeDeg, 0, 0, geogLatDeg);

        var correctedRAHour = paMacros.decimalHoursHour(correctedRAHour1);
        var correctedRAMin = paMacros.decimalHoursMinute(correctedRAHour1);
        var correctedRASec = paMacros.decimalHoursSecond(correctedRAHour1);
        var correctedDecDeg = paMacros.decimalDegreesDegrees(correctedDecDeg1);
        var correctedDecMin = paMacros.decimalDegreesMinutes(correctedDecDeg1);
        var correctedDecSec = paMacros.decimalDegreesSeconds(correctedDecDeg1);

        return [correctedRAHour, correctedRAMin, correctedRASec, correctedDecDeg, correctedDecMin, correctedDecSec];
    }

    /**
     * Calculate corrected RA/Dec, accounting for geocentric parallax.
     */
    static correctionsForGeocentricParallax(raHour, raMin, raSec, decDeg, decMin, decSec, coordinateType, equatorialHorParallaxDeg, geogLongDeg, geogLatDeg, heightM, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, lctHour, lctMin, lctSec) {
        var haHours = paMacros.rightAscensionToHourAngle(raHour, raMin, raSec, lctHour, lctMin, lctSec, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);

        var correctedHAHours = paMacros.parallaxHA(haHours, 0, 0, decDeg, decMin, decSec, coordinateType, geogLatDeg, heightM, equatorialHorParallaxDeg);

        var correctedRAHours = paMacros.hourAngleToRightAscension(correctedHAHours, 0, 0, lctHour, lctMin, lctSec, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);

        var correctedDecDeg1 = paMacros.parallaxDec(haHours, 0, 0, decDeg, decMin, decSec, coordinateType, geogLatDeg, heightM, equatorialHorParallaxDeg);

        var correctedRAHour = paMacros.decimalHoursHour(correctedRAHours);
        var correctedRAMin = paMacros.decimalHoursMinute(correctedRAHours);
        var correctedRASec = paMacros.decimalHoursSecond(correctedRAHours);
        var correctedDecDeg = paMacros.decimalDegreesDegrees(correctedDecDeg1);
        var correctedDecMin = paMacros.decimalDegreesMinutes(correctedDecDeg1);
        var correctedDecSec = paMacros.decimalDegreesSeconds(correctedDecDeg1);

        return [correctedRAHour, correctedRAMin, correctedRASec, correctedDecDeg, correctedDecMin, correctedDecSec];
    }

    /**
     * 
     * Calculate heliographic coordinates for a given Greenwich date, with a given heliographic position angle and heliographic displacement in arc minutes.
     */
    static heliographicCoordinates(helioPositionAngleDeg, helioDisplacementArcmin, gwdateDay, gwdateMonth, gwdateYear) {
        var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
        var tCenturies = (julianDateDays - 2415020) / 36525;
        var longAscNodeDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(74, 22, 0) + (84 * tCenturies / 60);
        var sunLongDeg = paMacros.sunLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var y = Math.sin(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg)) * Math.cos(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0)));
        var x = -Math.cos(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg));
        var aDeg = paMacros.degrees(Math.atan2(y, x));
        var mDeg1 = 360 - (360 * (julianDateDays - 2398220) / 25.38);
        var mDeg2 = mDeg1 - 360 * Math.floor(mDeg1 / 360);
        var l0Deg1 = mDeg2 + aDeg;
        var b0Rad = Math.asin(Math.sin(paUtils.degreesToRadians(sunLongDeg - longAscNodeDeg)) * Math.sin(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0))));
        var theta1Rad = Math.atan(-Math.cos(paUtils.degreesToRadians(sunLongDeg)) * Math.tan(paUtils.degreesToRadians(paMacros.obliq(gwdateDay, gwdateMonth, gwdateYear))));
        var theta2Rad = Math.atan(-Math.cos(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg)) * Math.tan(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0))));
        var pDeg = paMacros.degrees(theta1Rad + theta2Rad);
        var rho1Deg = helioDisplacementArcmin / 60;
        var rhoRad = Math.asin(2 * rho1Deg / paMacros.sunDia(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear)) - paUtils.degreesToRadians(rho1Deg);
        var bRad = Math.asin(Math.sin(b0Rad) * Math.cos(rhoRad) + Math.cos(b0Rad) * Math.sin(rhoRad) * Math.cos(paUtils.degreesToRadians(pDeg - helioPositionAngleDeg)));
        var bDeg = paMacros.degrees(bRad);
        var lDeg1 = paMacros.degrees(Math.asin(Math.sin(rhoRad) * Math.sin(paUtils.degreesToRadians(pDeg - helioPositionAngleDeg)) / Math.cos(bRad))) + l0Deg1;
        var lDeg2 = lDeg1 - 360 * Math.floor(lDeg1 / 360);

        var helioLongDeg = paUtils.round(lDeg2, 2);
        var helioLatDeg = paUtils.round(bDeg, 2);

        return [helioLongDeg, helioLatDeg];
    }

    /**
     * Calculate carrington rotation number for a Greenwich date
     */
    static carringtonRotationNumber(gwdateDay, gwdateMonth, gwdateYear) {
        var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);

        var crn = 1690 + paUtils.round((julianDateDays - 2444235.34) / 27.2753, 0);

        return crn;
    }

    /**
     * Calculate selenographic (lunar) coordinates (sub-Earth)
     */
    static selenographicCoordinates1(gwdateDay, gwdateMonth, gwdateYear) {
        var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
        var tCenturies = (julianDateDays - 2451545) / 36525;
        var longAscNodeDeg = 125.044522 - 1934.136261 * tCenturies;
        var f1 = 93.27191 + 483202.0175 * tCenturies;
        var f2 = f1 - 360 * Math.floor(f1 / 360);
        var geocentricMoonLongDeg = paMacros.moonLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var geocentricMoonLatRad = paUtils.degreesToRadians(paMacros.moonLat(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
        var inclinationRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(1, 32, 32.7));
        var nodeLongRad = paUtils.degreesToRadians(longAscNodeDeg - geocentricMoonLongDeg);
        var sinBe = -Math.cos(inclinationRad) * Math.sin(geocentricMoonLatRad) + Math.sin(inclinationRad) * Math.cos(geocentricMoonLatRad) * Math.sin(nodeLongRad);
        var subEarthLatDeg = paMacros.degrees(Math.asin(sinBe));
        var aRad = Math.atan2((-Math.sin(geocentricMoonLatRad) * Math.sin(inclinationRad) - Math.cos(geocentricMoonLatRad) * Math.cos(inclinationRad) * Math.sin(nodeLongRad)), (Math.cos(geocentricMoonLatRad) * Math.cos(nodeLongRad)));
        var aDeg = paMacros.degrees(aRad);
        var subEarthLongDeg1 = aDeg - f2;
        var subEarthLongDeg2 = subEarthLongDeg1 - 360 * Math.floor(subEarthLongDeg1 / 360);
        var subEarthLongDeg3 = (subEarthLongDeg2 > 180) ? subEarthLongDeg2 - 360 : subEarthLongDeg2;
        var c1Rad = Math.atan(Math.cos(nodeLongRad) * Math.sin(inclinationRad) / (Math.cos(geocentricMoonLatRad) * Math.cos(inclinationRad) + Math.sin(geocentricMoonLatRad) * Math.sin(inclinationRad) * Math.sin(nodeLongRad)));
        var obliquityRad = paUtils.degreesToRadians(paMacros.obliq(gwdateDay, gwdateMonth, gwdateYear));
        var c2Rad = Math.atan(Math.sin(obliquityRad) * Math.cos(paUtils.degreesToRadians(geocentricMoonLongDeg)) / (Math.sin(obliquityRad) * Math.sin(geocentricMoonLatRad) * Math.sin(paUtils.degreesToRadians(geocentricMoonLongDeg)) - Math.cos(obliquityRad) * Math.cos(geocentricMoonLatRad)));
        var cDeg = paMacros.degrees(c1Rad + c2Rad);

        var subEarthLongitude = paUtils.round(subEarthLongDeg3, 2);
        var subEarthLatitude = paUtils.round(subEarthLatDeg, 2);
        var positionAngleOfPole = paUtils.round(cDeg, 2);

        return [subEarthLongitude, subEarthLatitude, positionAngleOfPole];
    }

    /**
     * Calculate selenographic (lunar) coordinates (sub-Solar)
     */
    static selenographicCoordinates2(gwdateDay, gwdateMonth, gwdateYear) {
        var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
        var tCenturies = (julianDateDays - 2451545) / 36525;
        var longAscNodeDeg = 125.044522 - 1934.136261 * tCenturies;
        var f1 = 93.27191 + 483202.0175 * tCenturies;
        var f2 = f1 - 360 * Math.floor(f1 / 360);
        var sunGeocentricLongDeg = paMacros.sunLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var moonEquHorParallaxArcMin = paMacros.moonHP(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear) * 60;
        var sunEarthDistAU = paMacros.sunDist(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var geocentricMoonLatRad = paUtils.degreesToRadians(paMacros.moonLat(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
        var geocentricMoonLongDeg = paMacros.moonLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var adjustedMoonLongDeg = sunGeocentricLongDeg + 180 + (26.4 * Math.cos(geocentricMoonLatRad) * Math.sin(paUtils.degreesToRadians(sunGeocentricLongDeg - geocentricMoonLongDeg)) / (moonEquHorParallaxArcMin * sunEarthDistAU));
        var adjustedMoonLatRad = 0.14666 * geocentricMoonLatRad / (moonEquHorParallaxArcMin * sunEarthDistAU);
        var inclinationRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(1, 32, 32.7));
        var nodeLongRad = paUtils.degreesToRadians(longAscNodeDeg - adjustedMoonLongDeg);
        var sinBs = -Math.cos(inclinationRad) * Math.sin(adjustedMoonLatRad) + Math.sin(inclinationRad) * Math.cos(adjustedMoonLatRad) * Math.sin(nodeLongRad);
        var subSolarLatDeg = paMacros.degrees(Math.asin(sinBs));
        var aRad = Math.atan2((-Math.sin(adjustedMoonLatRad) * Math.sin(inclinationRad) - Math.cos(adjustedMoonLatRad) * Math.cos(inclinationRad) * Math.sin(nodeLongRad)), (Math.cos(adjustedMoonLatRad) * Math.cos(nodeLongRad)));
        var aDeg = paMacros.degrees(aRad);
        var subSolarLongDeg1 = aDeg - f2;
        var subSolarLongDeg2 = subSolarLongDeg1 - 360 * Math.floor(subSolarLongDeg1 / 360);
        var subSolarLongDeg3 = (subSolarLongDeg2 > 180) ? subSolarLongDeg2 - 360 : subSolarLongDeg2;
        var subSolarColongDeg = 90 - subSolarLongDeg3;

        var subSolarLongitude = paUtils.round(subSolarLongDeg3, 2);
        var subSolarColongitude = paUtils.round(subSolarColongDeg, 2);
        var subSolarLatitude = paUtils.round(subSolarLatDeg, 2);

        return [subSolarLongitude, subSolarColongitude, subSolarLatitude];
    }
}

class paDateTime {
    /**
     * Gets the date of Easter for the year specified.
     */
    static getDateOfEaster(inputYear) {
        var year = inputYear;

        var a = year % 19;
        var b = Math.floor(year / 100);
        var c = year % 100;
        var d = Math.floor(b / 4);
        var e = b % 4;
        var f = Math.floor((b + 8) / 25);
        var g = Math.floor((b - f + 1) / 3);
        var h = ((19 * a) + b - d - g + 15) % 30;
        var i = Math.floor(c / 4);
        var k = c % 4;
        var l = (32 + 2 * (e + i) - h - k) % 7;
        var m = Math.floor((a + (11 * h) + (22 * l)) / 451);
        var n = Math.floor((h + l - (7 * m) + 114) / 31);
        var p = (h + l - (7 * m) + 114) % 31;

        var day = p + 1;
        var month = n;

        return [month, day, year];
    }

    /**
     * Calculate day number for a date.
     */
    static civilDateToDayNumber(month, day, year) {
        if (month <= 2) {
            month = month - 1;
            month = (paUtils.isLeapYear(year)) ? month * 62 : month * 63;
            month = Math.floor(month / 2);
        }
        else {
            month = Math.floor((month + 1) * 30.6);
            month = (paUtils.isLeapYear(year)) ? month - 62 : month - 63;
        }

        return month + day;
    }

    /**
     * Convert a Civil Time (hours,minutes,seconds) to Decimal Hours
     */
    static civilTimeToDecimalHours(hours, minutes, seconds) {
        return paMacros.HMStoDH(hours, minutes, seconds);
    }

    /**
     * Convert Decimal Hours to Civil Time
     */
    static decimalHoursToCivilTime(decimalHours) {
        var hours = paMacros.decimalHoursHour(decimalHours);
        var minutes = paMacros.decimalHoursMinute(decimalHours);
        var seconds = paMacros.decimalHoursSecond(decimalHours);

        return [hours, minutes, seconds];
    }

    /**
     * Convert local Civil Time to Universal Time
     */
    static localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, isDaylightSavings, zoneCorrection, localDay, localMonth, localYear) {
        var lct = this.civilTimeToDecimalHours(lctHours, lctMinutes, lctSeconds);

        var daylightSavingsOffset = (isDaylightSavings) ? 1 : 0;

        var utInterim = lct - daylightSavingsOffset - zoneCorrection;
        var gdayInterim = localDay + (utInterim / 24);

        var jd = paMacros.civilDateToJulianDate(gdayInterim, localMonth, localYear);

        var gDay = paMacros.julianDateDay(jd);
        var gMonth = paMacros.julianDateMonth(jd);
        var gYear = paMacros.julianDateYear(jd);

        var ut = 24 * (gDay - Math.floor(gDay));

        return [
            paMacros.decimalHoursHour(ut),
            paMacros.decimalHoursMinute(ut),
            paMacros.decimalHoursSecond(ut),
            Math.floor(gDay),
            gMonth,
            gYear
        ];
    }

    /**
     * Convert Universal Time to local Civil Time
     */
    static universalTimeToLocalCivilTime(utHours, utMinutes, utSeconds, isDaylightSavings, zoneCorrection, gwDay, gwMonth, gwYear) {
        var dstValue = (isDaylightSavings) ? 1 : 0;
        var ut = paMacros.HMStoDH(utHours, utMinutes, utSeconds);
        var zoneTime = ut + zoneCorrection;
        var localTime = zoneTime + dstValue;
        var localJDPlusLocalTime = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear) + (localTime / 24);
        var localDay = paMacros.julianDateDay(localJDPlusLocalTime);
        var integerDay = Math.floor(localDay);
        var localMonth = paMacros.julianDateMonth(localJDPlusLocalTime);
        var localYear = paMacros.julianDateYear(localJDPlusLocalTime);

        var lct = 24 * (localDay - integerDay);

        return [
            paMacros.decimalHoursHour(lct),
            paMacros.decimalHoursMinute(lct),
            paMacros.decimalHoursSecond(lct),
            integerDay,
            localMonth,
            localYear
        ];
    }

    /**
     * Convert Universal Time to Greenwich Sidereal Time
     */
    static universalTimeToGreenwichSiderealTime(utHours, utMinutes, utSeconds, gwDay, gwMonth, gwYear) {
        var jd = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear);
        var s = jd - 2451545;
        var t = s / 36525;
        var t01 = 6.697374558 + (2400.051336 * t) + (0.000025862 * t * t);
        var t02 = t01 - (24.0 * Math.floor(t01 / 24));
        var ut = paMacros.HMStoDH(utHours, utMinutes, utSeconds);
        var a = ut * 1.002737909;
        var gst1 = t02 + a;
        var gst2 = gst1 - (24.0 * Math.floor(gst1 / 24));

        var gstHours = paMacros.decimalHoursHour(gst2);
        var gstMinutes = paMacros.decimalHoursMinute(gst2);
        var gstSeconds = paMacros.decimalHoursSecond(gst2);

        return [gstHours, gstMinutes, gstSeconds];
    }

    /**
     * Convert Greenwich Sidereal Time to Universal Time
     */
    static greenwichSiderealTimeToUniversalTime(gstHours, gstMinutes, gstSeconds, gwDay, gwMonth, gwYear) {
        var jd = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear);
        var s = jd - 2451545;
        var t = s / 36525;
        var t01 = 6.697374558 + (2400.051336 * t) + (0.000025862 * t * t);
        var t02 = t01 - (24 * Math.floor(t01 / 24));
        var gstHours1 = paMacros.HMStoDH(gstHours, gstMinutes, gstSeconds);

        var a = gstHours1 - t02;
        var b = a - (24 * Math.floor(a / 24));
        var ut = b * 0.9972695663;
        var utHours = paMacros.decimalHoursHour(ut);
        var utMinutes = paMacros.decimalHoursMinute(ut);
        var utSeconds = paMacros.decimalHoursSecond(ut);

        var warningFlag = (ut < 0.065574) ? paTypes.WarningFlag.Warning : paTypes.WarningFlag.OK;

        return [utHours, utMinutes, utSeconds, warningFlag];
    }

    /**
     * Convert Greenwich Sidereal Time to Local Sidereal Time
     */
    static greenwichSiderealTimeToLocalSiderealTime(gstHours, gstMinutes, gstSeconds, geographicalLongitude) {
        var gst = paMacros.HMStoDH(gstHours, gstMinutes, gstSeconds);
        var offset = geographicalLongitude / 15;
        var lstHours1 = gst + offset;
        var lstHours2 = lstHours1 - (24 * Math.floor(lstHours1 / 24));

        var lstHours = paMacros.decimalHoursHour(lstHours2);
        var lstMinutes = paMacros.decimalHoursMinute(lstHours2);
        var lstSeconds = paMacros.decimalHoursSecond(lstHours2);

        return [lstHours, lstMinutes, lstSeconds];
    }

    /**
     * Convert Local Sidereal Time to Greenwich Sidereal Time
     */
    static localSiderealTimeToGreenwichSiderealTime(lstHours, lstMinutes, lstSeconds, geographicalLongitude) {
        var gst = paMacros.HMStoDH(lstHours, lstMinutes, lstSeconds);
        var longHours = geographicalLongitude / 15;
        var gst1 = gst - longHours;
        var gst2 = gst1 - (24 * Math.floor(gst1 / 24));

        var gstHours = paMacros.decimalHoursHour(gst2);
        var gstMinutes = paMacros.decimalHoursMinute(gst2);
        var gstSeconds = paMacros.decimalHoursSecond(gst2);

        return [gstHours, gstMinutes, gstSeconds];
    }
}

class paEclipses {
    /**
     * Determine if a lunar eclipse is likely to occur.
     */
    static lunarEclipseOccurrence(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var julianDateOfFullMoon = paMacros.fullMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var gDateOfFullMoonDay = paMacros.julianDateDay(julianDateOfFullMoon);
        var integerDay = Math.floor(gDateOfFullMoonDay);
        var gDateOfFullMoonMonth = paMacros.julianDateMonth(julianDateOfFullMoon);
        var gDateOfFullMoonYear = paMacros.julianDateYear(julianDateOfFullMoon);
        var utOfFullMoonHours = gDateOfFullMoonDay - integerDay;

        var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);

        var eclipseOccurrence = paMacros.lunarEclipseOccurrence(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var status = eclipseOccurrence;
        var eventDateDay = localCivilDateDay;
        var eventDateMonth = localCivilDateMonth;
        var eventDateYear = localCivilDateYear;

        return [status, eventDateDay, eventDateMonth, eventDateYear];
    }

    /**
     * Calculate the circumstances of a lunar eclipse.
     */
    static lunarEclipseCircumstances(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var julianDateOfFullMoon = paMacros.fullMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gDateOfFullMoonDay = paMacros.julianDateDay(julianDateOfFullMoon);
        var integerDay = Math.floor(gDateOfFullMoonDay);
        var gDateOfFullMoonMonth = paMacros.julianDateMonth(julianDateOfFullMoon);
        var gDateOfFullMoonYear = paMacros.julianDateYear(julianDateOfFullMoon);
        var utOfFullMoonHours = gDateOfFullMoonDay - integerDay;

        var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);

        var utMaxEclipse = paMacros.utMaxLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utFirstContact = paMacros.utFirstContactLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utLastContact = paMacros.utLastContactLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utStartUmbralPhase = paMacros.utStartUmbraLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utEndUmbralPhase = paMacros.utEndUmbraLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utStartTotalPhase = paMacros.utStartTotalLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
        var utEndTotalPhase = paMacros.utEndTotalLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);

        var eclipseMagnitude1 = paMacros.magLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);

        var lunarEclipseCertainDateDay = localCivilDateDay;
        var lunarEclipseCertainDateMonth = localCivilDateMonth;
        var lunarEclipseCertainDateYear = localCivilDateYear;

        var utStartPenPhaseHour = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utFirstContact + 0.008333);
        var utStartPenPhaseMinutes = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utFirstContact + 0.008333);

        var utStartUmbralPhaseHour = (utStartUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utStartUmbralPhase + 0.008333);
        var utStartUmbralPhaseMinutes = (utStartUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utStartUmbralPhase + 0.008333);

        var utStartTotalPhaseHour = (utStartTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utStartTotalPhase + 0.008333);
        var utStartTotalPhaseMinutes = (utStartTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utStartTotalPhase + 0.008333);

        var utMidEclipseHour = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursHour(utMaxEclipse + 0.008333);
        var utMidEclipseMinutes = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utMaxEclipse + 0.008333);

        var utEndTotalPhaseHour = (utEndTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utEndTotalPhase + 0.008333);
        var utEndTotalPhaseMinutes = (utEndTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utEndTotalPhase + 0.008333);

        var utEndUmbralPhaseHour = (utEndUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utEndUmbralPhase + 0.008333);
        var utEndUmbralPhaseMinutes = (utEndUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utEndUmbralPhase + 0.008333);

        var utEndPenPhaseHour = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utLastContact + 0.008333);
        var utEndPenPhaseMinutes = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utLastContact + 0.008333);

        var eclipseMagnitude = (eclipseMagnitude1 == -99.0) ? -99.0 : paUtils.round(eclipseMagnitude1, 2);

        return [lunarEclipseCertainDateDay, lunarEclipseCertainDateMonth, lunarEclipseCertainDateYear, utStartPenPhaseHour, utStartPenPhaseMinutes, utStartUmbralPhaseHour, utStartUmbralPhaseMinutes, utStartTotalPhaseHour, utStartTotalPhaseMinutes, utMidEclipseHour, utMidEclipseMinutes, utEndTotalPhaseHour, utEndTotalPhaseMinutes, utEndUmbralPhaseHour, utEndUmbralPhaseMinutes, utEndPenPhaseHour, utEndPenPhaseMinutes, eclipseMagnitude];
    }

    /**
     * Determine if a solar eclipse is likely to occur.
     */
    static solarEclipseOccurrence(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var julianDateOfNewMoon = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gDateOfNewMoonDay = paMacros.julianDateDay(julianDateOfNewMoon);
        var integerDay = Math.floor(gDateOfNewMoonDay);
        var gDateOfNewMoonMonth = paMacros.julianDateMonth(julianDateOfNewMoon);
        var gDateOfNewMoonYear = paMacros.julianDateYear(julianDateOfNewMoon);
        var utOfNewMoonHours = gDateOfNewMoonDay - integerDay;

        var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);

        var eclipseOccurrence = paMacros.solarEclipseOccurrence(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var status = eclipseOccurrence;
        var eventDateDay = localCivilDateDay;
        var eventDateMonth = localCivilDateMonth;
        var eventDateYear = localCivilDateYear;

        return [status, eventDateDay, eventDateMonth, eventDateYear];
    }

    /**
       * Calculate the circumstances of a solar eclipse.
     */
    static solarEclipseCircumstances(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var julianDateOfNewMoon = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gDateOfNewMoonDay = paMacros.julianDateDay(julianDateOfNewMoon);
        var integerDay = Math.floor(gDateOfNewMoonDay);
        var gDateOfNewMoonMonth = paMacros.julianDateMonth(julianDateOfNewMoon);
        var gDateOfNewMoonYear = paMacros.julianDateYear(julianDateOfNewMoon);
        var utOfNewMoonHours = gDateOfNewMoonDay - integerDay;
        var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);

        var utMaxEclipse = paMacros.utMaxSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
        var utFirstContact = paMacros.utFirstContactSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
        var utLastContact = paMacros.utLastContactSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
        var magnitude = paMacros.magSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);

        var solarEclipseCertainDateDay = localCivilDateDay;
        var solarEclipseCertainDateMonth = localCivilDateMonth;
        var solarEclipseCertainDateYear = localCivilDateYear;

        var utFirstContactHour = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utFirstContact + 0.008333);
        var utFirstContactMinutes = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utFirstContact + 0.008333);

        var utMidEclipseHour = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursHour(utMaxEclipse + 0.008333);
        var utMidEclipseMinutes = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utMaxEclipse + 0.008333);

        var utLastContactHour = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utLastContact + 0.008333);
        var utLastContactMinutes = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utLastContact + 0.008333);

        var eclipseMagnitude = (magnitude == -99.0) ? -99.0 : paUtils.round(magnitude, 3);

        return [solarEclipseCertainDateDay, solarEclipseCertainDateMonth, solarEclipseCertainDateYear, utFirstContactHour, utFirstContactMinutes, utMidEclipseHour, utMidEclipseMinutes, utLastContactHour, utLastContactMinutes, eclipseMagnitude];
    }
}

class paMacros {
    /**
       * Convert a Civil Time (hours,minutes,seconds) to Decimal Hours
     * 
       * Original macro name: HMSDH
     */
    static HMStoDH(hours, minutes, seconds) {
        var fHours = hours;
        var fMinutes = minutes;
        var fSeconds = seconds;

        var a = Math.abs(fSeconds) / 60;
        var b = (Math.abs(fMinutes) + a) / 60;
        var c = Math.abs(fHours) + b;

        return (fHours < 0 || fMinutes < 0 || fSeconds < 0) ? -c : c;
    }

    /**
     * Return the hour part of a Decimal Hours
     * 
     * Original macro name: DHHour
     */
    static decimalHoursHour(decimalHours) {
        var a = Math.abs(decimalHours);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var e = (c == 60) ? b + 60 : b;

        return (decimalHours < 0) ? - (Math.floor(e / 3600)) : Math.floor(e / 3600);
    }

    /**
     * Return the minutes part of a Decimal Hours
     * 
     * Original macro name: DHMin
     */
    static decimalHoursMinute(decimalHours) {
        var a = Math.abs(decimalHours);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var e = (c == 60) ? b + 60 : b;

        return Math.floor(e / 60) % 60;
    }

    /**
     * Return the seconds part of a Decimal Hours
     * 
     * Original macro name: DHSec
     */
    static decimalHoursSecond(decimalHours) {
        var a = Math.abs(decimalHours);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var d = (c == 60) ? 0 : c;

        return d;
    }

    /**
     * Convert a Greenwich Date/Civil Date (day,month,year) to Julian Date
     *
     * Original macro name: CDJD
     */
    static civilDateToJulianDate(day, month, year) {
        var fDay = day;
        var fMonth = month;
        var fYear = year;

        var y = (fMonth < 3) ? fYear - 1 : fYear;
        var m = (fMonth < 3) ? fMonth + 12 : fMonth;

        var b;

        if (fYear > 1582) {
            var a = Math.floor(y / 100);
            b = 2 - a + Math.floor(a / 4);
        }
        else {
            if (fYear == 1582 && fMonth > 10) {
                var a = Math.floor(y / 100);
                b = 2 - a + Math.floor(a / 4);
            }
            else {
                if (fYear == 1582 && fMonth == 10 && fDay >= 15) {
                    var a = Math.floor(y / 100);
                    b = 2 - a + Math.floor(a / 4);
                }
                else {
                    b = 0;
                }
            }
        }

        var c = (y < 0) ? Math.floor(((365.25 * y) - 0.75)) : Math.floor(365.25 * y);
        var d = Math.floor(30.6001 * (m + 1.0));

        return b + c + d + fDay + 1720994.5;
    }

    /**
     * Returns the day part of a Julian Date
     * 
     * Original macro name: JDCDay
     */
    static julianDateDay(julianDate) {
        var i = Math.floor(julianDate + 0.5);
        var f = julianDate + 0.5 - i;
        var a = Math.floor((i - 1867216.25) / 36524.25);
        var b = (i > 2299160) ? i + 1 + a - Math.floor(a / 4) : i;
        var c = b + 1524;
        var d = Math.floor((c - 122.1) / 365.25);
        var e = Math.floor(365.25 * d);
        var g = Math.floor((c - e) / 30.6001);

        return c - e + f - Math.floor(30.6001 * g);
    }

    /**
     * Returns the month part of a Julian Date
     * 
     * Original macro name: JDCMonth
     */
    static julianDateMonth(julianDate) {
        var i = Math.floor(julianDate + 0.5);
        var a = Math.floor((i - 1867216.25) / 36524.25);
        var b = (i > 2299160) ? i + 1 + a - Math.floor(a / 4) : i;
        var c = b + 1524;
        var d = Math.floor((c - 122.1) / 365.25);
        var e = Math.floor(365.25 * d);
        var g = Math.floor((c - e) / 30.6001);

        var returnValue = (g < 13.5) ? g - 1 : g - 13;

        return returnValue;
    }

    /**
     * Returns the year part of a Julian Date
     * 
     * Original macro name: JDCYear
     */
    static julianDateYear(julianDate) {
        var i = Math.floor(julianDate + 0.5);
        var a = Math.floor((i - 1867216.25) / 36524.25);
        var b = (i > 2299160) ? i + 1.0 + a - Math.floor(a / 4.0) : i;
        var c = b + 1524;
        var d = Math.floor((c - 122.1) / 365.25);
        var e = Math.floor(365.25 * d);
        var g = Math.floor((c - e) / 30.6001);
        var h = (g < 13.5) ? g - 1 : g - 13;

        var returnValue = (h > 2.5) ? d - 4716 : d - 4715;

        return returnValue;
    }

    /**
     * Convert Right Ascension to Hour Angle
     * 
     * Original macro name: RAHA
     */
    static rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
        var a = this.localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var b = this.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var c = this.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var d = this.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var e = this.universalTimeToGreenwichSiderealTime(a, 0, 0, b, c, d);
        var f = this.greenwichSiderealTimeToLocalSiderealTime(e, 0, 0, geographicalLongitude);
        var g = this.HMStoDH(raHours, raMinutes, raSeconds);
        var h = f - g;

        return (h < 0) ? 24 + h : h;
    }

    /**
     * Convert Hour Angle to Right Ascension
     * 
     * Original macro name: HARA
     */
    static hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
        var a = this.localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var b = this.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var c = this.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var d = this.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var e = this.universalTimeToGreenwichSiderealTime(a, 0, 0, b, c, d);
        var f = this.greenwichSiderealTimeToLocalSiderealTime(e, 0, 0, geographicalLongitude);
        var g = this.HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
        var h = f - g;

        return (h < 0) ? 24 + h : h;
    }

    /**
     * Convert Local Civil Time to Universal Time
     * 
     * Original macro name: LctUT
     */
    static localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
        var a = this.HMStoDH(lctHours, lctMinutes, lctSeconds);
        var b = a - daylightSaving - zoneCorrection;
        var c = localDay + (b / 24);
        var d = this.civilDateToJulianDate(c, localMonth, localYear);
        var e = this.julianDateDay(d);
        var e1 = Math.floor(e);

        return 24 * (e - e1);
    }

    /**
     * Convert Universal Time to Local Civil Time
     * 
     * Original macro name: UTLct
     */
    static universalTimeToLocalCivilTime(uHours, uMinutes, uSeconds, daylightSaving, zoneCorrection, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.HMStoDH(uHours, uMinutes, uSeconds);
        var b = a + zoneCorrection;
        var c = b + daylightSaving;
        var d = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) + (c / 24);
        var e = this.julianDateDay(d);
        var e1 = Math.floor(e);

        return 24 * (e - e1);
    }


    /**
     * Determine Greenwich Day for Local Time
     * 
     * Original macro name: LctGDay
     */
    static localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
        var a = this.HMStoDH(lctHours, lctMinutes, lctSeconds);
        var b = a - daylightSaving - zoneCorrection;
        var c = localDay + (b / 24);
        var d = this.civilDateToJulianDate(c, localMonth, localYear);
        var e = this.julianDateDay(d);

        return Math.floor(e);
    }

    /**
     * Determine Greenwich Month for Local Time
     * 
     * Original macro name: LctGMonth
     */
    static localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
        var a = this.HMStoDH(lctHours, lctMinutes, lctSeconds);
        var b = a - daylightSaving - zoneCorrection;
        var c = localDay + (b / 24);
        var d = this.civilDateToJulianDate(c, localMonth, localYear);

        return this.julianDateMonth(d);
    }

    /**
     * Determine Greenwich Year for Local Time
     * 
     * Original macro name: LctGYear
     */
    static localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
        var a = this.HMStoDH(lctHours, lctMinutes, lctSeconds);
        var b = a - daylightSaving - zoneCorrection;
        var c = localDay + (b / 24);
        var d = this.civilDateToJulianDate(c, localMonth, localYear);

        return this.julianDateYear(d);
    }

    /**
     * Convert Universal Time to Greenwich Sidereal Time
     * 
     * Original macro name: UTGST
     */
    static universalTimeToGreenwichSiderealTime(uHours, uMinutes, uSeconds, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
        var b = a - 2451545;
        var c = b / 36525;
        var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
        var e = d - (24 * Math.floor(d / 24));
        var f = this.HMStoDH(uHours, uMinutes, uSeconds);
        var g = f * 1.002737909;
        var h = e + g;

        return h - (24 * Math.floor(h / 24));
    }

    /**
     * Convert Greenwich Sidereal Time to Local Sidereal Time
     * 
     * Original macro name: GSTLST
     */
    static greenwichSiderealTimeToLocalSiderealTime(greenwichHours, greenwichMinutes, greenwichSeconds, geographicalLongitude) {
        var a = this.HMStoDH(greenwichHours, greenwichMinutes, greenwichSeconds);
        var b = geographicalLongitude / 15;
        var c = a + b;

        return c - (24 * Math.floor(c / 24));
    }

    /**
     * Convert Equatorial Coordinates to Azimuth (in decimal degrees)
     * 
     * Original macro name: EQAz
     */
    static equatorialCoordinatesToAzimuth(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
        var a = this.HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
        var b = a * 15;
        var c = paUtils.degreesToRadians(b);
        var d = this.degreesMinutesSecondsToDecimalDegrees(declinationDegrees, declinationMinutes, declinationSeconds);
        var e = paUtils.degreesToRadians(d);
        var f = paUtils.degreesToRadians(geographicalLatitude);
        var g = Math.sin(e) * Math.sin(f) + Math.cos(e) * Math.cos(f) * Math.cos(c);
        var h = -Math.cos(e) * Math.cos(f) * Math.sin(c);
        var i = Math.sin(e) - (Math.sin(f) * g);
        var j = this.degrees(Math.atan2(h, i));

        return j - 360.0 * Math.floor(j / 360);
    }

    /**
     * Convert Equatorial Coordinates to Altitude (in decimal degrees)
     * 
     * Original macro name: EQAlt
     */
    static equatorialCoordinatesToAltitude(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
        var a = this.HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
        var b = a * 15;
        var c = paUtils.degreesToRadians(b);
        var d = this.degreesMinutesSecondsToDecimalDegrees(declinationDegrees, declinationMinutes, declinationSeconds);
        var e = paUtils.degreesToRadians(d);
        var f = paUtils.degreesToRadians(geographicalLatitude);
        var g = Math.sin(e) * Math.sin(f) + Math.cos(e) * Math.cos(f) * Math.cos(c);

        return this.degrees(Math.asin(g));
    }

    /**
     * Convert Degrees Minutes Seconds to Decimal Degrees
     * 
     * Original macro name: DMSDD
     */
    static degreesMinutesSecondsToDecimalDegrees(degrees, minutes, seconds) {
        var a = Math.abs(seconds) / 60;
        var b = (Math.abs(minutes) + a) / 60;
        var c = Math.abs(degrees) + b;

        return (degrees < 0 || minutes < 0 || seconds < 0) ? -c : c;
    }

    /**
     * Convert W to Degrees
     * 
     * Original macro name: Degrees
     */
    static degrees(w) {
        return w * 57.29577951;
    }

    /**
     * Return Degrees part of Decimal Degrees
     * 
     * Original macro name: DDDeg
     */
    static decimalDegreesDegrees(decimalDegrees) {
        var a = Math.abs(decimalDegrees);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var e = (c == 60) ? 60 : b;

        return (decimalDegrees < 0) ? -(Math.floor(e / 3600)) : Math.floor(e / 3600);
    }

    /**
     * Return Minutes part of Decimal Degrees
     * 
     * Original macro name: DDMin
     */
    static decimalDegreesMinutes(decimalDegrees) {
        var a = Math.abs(decimalDegrees);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var e = (c == 60) ? b + 60 : b;

        return Math.floor(e / 60) % 60;
    }

    /**
     * Return Seconds part of Decimal Degrees
     * 
     * Original macro name: DDSec
     */
    static decimalDegreesSeconds(decimalDegrees) {
        var a = Math.abs(decimalDegrees);
        var b = a * 3600;
        var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
        var d = (c == 60) ? 0 : c;

        return d;
    }

    /**
     * Convert Horizon Coordinates to Declination (in decimal degrees)
     * 
     * Original macro name: HORDec
     */
    static horizonCoordinatesToDeclination(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
        var a = this.degreesMinutesSecondsToDecimalDegrees(azimuthDegrees, azimuthMinutes, azimuthSeconds);
        var b = this.degreesMinutesSecondsToDecimalDegrees(altitudeDegrees, altitudeMinutes, altitudeSeconds);
        var c = paUtils.degreesToRadians(a);
        var d = paUtils.degreesToRadians(b);
        var e = paUtils.degreesToRadians(geographicalLatitude);
        var f = Math.sin(d) * Math.sin(e) + Math.cos(d) * Math.cos(e) * Math.cos(c);

        return this.degrees(Math.asin(f));
    }

    /**
     * Convert Horizon Coordinates to Hour Angle (in decimal degrees)
     * 
     * Original macro name: HORHa
     */
    static horizonCoordinatesToHourAngle(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
        var a = this.degreesMinutesSecondsToDecimalDegrees(azimuthDegrees, azimuthMinutes, azimuthSeconds);
        var b = this.degreesMinutesSecondsToDecimalDegrees(altitudeDegrees, altitudeMinutes, altitudeSeconds);
        var c = paUtils.degreesToRadians(a);
        var d = paUtils.degreesToRadians(b);
        var e = paUtils.degreesToRadians(geographicalLatitude);
        var f = Math.sin(d) * Math.sin(e) + Math.cos(d) * Math.cos(e) * Math.cos(c);
        var g = -Math.cos(d) * Math.cos(e) * Math.sin(c);
        var h = Math.sin(d) - Math.sin(e) * f;
        var i = this.decimalDegreesToDegreeHours(this.degrees(Math.atan2(g, h)));

        return i - 24 * Math.floor(i / 24);
    }

    /**
     * Convert Decimal Degrees to Degree-Hours
     * 
     * Original macro name: DDDH
     */
    static decimalDegreesToDegreeHours(decimalDegrees) {
        return decimalDegrees / 15;
    }

    /**
     * Convert Degree-Hours to Decimal Degrees
     * 
     * Original macro name: DHDD
     */
    static degreeHoursToDecimalDegrees(degreeHours) {
        return degreeHours * 15;
    }

    /**
     * Obliquity of the Ecliptic for a Greenwich Date
     * 
     * Original macro name: Obliq
     */
    static obliq(greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
        var b = a - 2415020;
        var c = (b / 36525) - 1;
        var d = c * (46.815 + c * (0.0006 - (c * 0.00181)));
        var e = d / 3600;

        return 23.43929167 - e + this.nutatObl(greenwichDay, greenwichMonth, greenwichYear);
    }

    /**
     * Nutation amount to be added in ecliptic longitude, in degrees.
     * 
     * Original macro name: NutatLong
     */
    static nutatLong(gd, gm, gy) {
        var dj = this.civilDateToJulianDate(gd, gm, gy) - 2415020;
        var t = dj / 36525;
        var t2 = t * t;

        var a = 100.0021358 * t;
        var b = 360 * (a - Math.floor(a));

        var l1 = 279.6967 + 0.000303 * t2 + b;
        var l2 = 2 * paUtils.degreesToRadians(l1);

        a = 1336.855231 * t;
        b = 360 * (a - Math.floor(a));

        var d1 = 270.4342 - 0.001133 * t2 + b;
        var d2 = 2 * paUtils.degreesToRadians(d1);

        a = 99.99736056 * t;
        b = 360 * (a - Math.floor(a));

        var m1 = 358.4758 - 0.00015 * t2 + b;
        m1 = paUtils.degreesToRadians(m1);

        a = 1325.552359 * t;
        b = 360 * (a - Math.floor(a));

        var m2 = 296.1046 + 0.009192 * t2 + b;
        m2 = paUtils.degreesToRadians(m2);

        a = 5.372616667 * t;
        b = 360 * (a - Math.floor(a));

        var n1 = 259.1833 + 0.002078 * t2 - b;
        n1 = paUtils.degreesToRadians(n1);

        var n2 = 2.0 * n1;

        var dp = (-17.2327 - 0.01737 * t) * Math.sin(n1);
        dp = dp + (-1.2729 - 0.00013 * t) * Math.sin(l2) + 0.2088 * Math.sin(n2);
        dp = dp - 0.2037 * Math.sin(d2) + (0.1261 - 0.00031 * t) * Math.sin(m1);
        dp = dp + 0.0675 * Math.sin(m2) - (0.0497 - 0.00012 * t) * Math.sin(l2 + m1);
        dp = dp - 0.0342 * Math.sin(d2 - n1) - 0.0261 * Math.sin(d2 + m2);
        dp = dp + 0.0214 * Math.sin(l2 - m1) - 0.0149 * Math.sin(l2 - d2 + m2);
        dp = dp + 0.0124 * Math.sin(l2 - n1) + 0.0114 * Math.sin(d2 - m2);

        return dp / 3600;
    }

    /**
     * Nutation of Obliquity
     * 
     * Original macro name: NutatObl
     */
    static nutatObl(greenwichDay, greenwichMonth, greenwichYear) {
        var dj = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) - 2415020;
        var t = dj / 36525;
        var t2 = t * t;

        var a = 100.0021358 * t;
        var b = 360 * (a - Math.floor(a));

        var l1 = 279.6967 + 0.000303 * t2 + b;
        var l2 = 2 * paUtils.degreesToRadians(l1);

        a = 1336.855231 * t;
        b = 360 * (a - Math.floor(a));

        var d1 = 270.4342 - 0.001133 * t2 + b;
        var d2 = 2 * paUtils.degreesToRadians(d1);

        a = 99.99736056 * t;
        b = 360 * (a - Math.floor(a));

        var m1 = paUtils.degreesToRadians(358.4758 - 0.00015 * t2 + b);

        a = 1325.552359 * t;
        b = 360 * (a - Math.floor(a));

        var m2 = paUtils.degreesToRadians(296.1046 + 0.009192 * t2 + b);

        a = 5.372616667 * t;
        b = 360 * (a - Math.floor(a));

        var n1 = paUtils.degreesToRadians(259.1833 + 0.002078 * t2 - b);

        var n2 = 2 * n1;

        var ddo = (9.21 + 0.00091 * t) * Math.cos(n1);
        ddo = ddo + (0.5522 - 0.00029 * t) * Math.cos(l2) - 0.0904 * Math.cos(n2);
        ddo = ddo + 0.0884 * Math.cos(d2) + 0.0216 * Math.cos(l2 + m1);
        ddo = ddo + 0.0183 * Math.cos(d2 - n1) + 0.0113 * Math.cos(d2 + m2);
        ddo = ddo - 0.0093 * Math.cos(l2 - m1) - 0.0066 * Math.cos(l2 - n1);

        return ddo / 3600;
    }

    /**
     * Convert Greenwich Sidereal Time to Universal Time
     * 
     * Original macro name: GSTUT
     */
    static greenwichSiderealTimeToUniversalTime(greenwichSiderealHours, greenwichSiderealMinutes, greenwichSiderealSeconds, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
        var b = a - 2451545;
        var c = b / 36525;
        var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
        var e = d - (24 * Math.floor(d / 24));
        var f = this.HMStoDH(greenwichSiderealHours, greenwichSiderealMinutes, greenwichSiderealSeconds);
        var g = f - e;
        var h = g - (24 * Math.floor(g / 24));

        return h * 0.9972695663;
    }

    /**
     * Convert Local Sidereal Time to Greenwich Sidereal Time
     * 
     * Original macro name: LSTGST
     */
    static localSiderealTimeToGreenwichSiderealTime(localHours, localMinutes, localSeconds, longitude) {
        var a = this.HMStoDH(localHours, localMinutes, localSeconds);
        var b = longitude / 15;
        var c = a - b;

        return c - (24 * Math.floor(c / 24));
    }

    /**
     * Calculate Sun's ecliptic longitude
     * 
     * Original macro name: SunLong
     */
    static sunLong(lch, lcm, lcs, ds, zc, ld, lm, ly) {
        var aa = this.localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var bb = this.localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var cc = this.localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var ut = this.localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var dj = this.civilDateToJulianDate(aa, bb, cc) - 2415020;
        var t = (dj / 36525) + (ut / 876600);
        var t2 = t * t;
        var a = 100.0021359 * t;
        var b = 360.0 * (a - Math.floor(a));

        var l = 279.69668 + 0.0003025 * t2 + b;
        a = 99.99736042 * t;
        b = 360 * (a - Math.floor(a));

        var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
        var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

        var am = paUtils.degreesToRadians(m1);
        var at = this.trueAnomaly(am, ec);

        a = 62.55209472 * t;
        b = 360 * (a - Math.floor(a));

        var a1 = paUtils.degreesToRadians(153.23 + b);
        a = 125.1041894 * t;
        b = 360 * (a - Math.floor(a));

        var b1 = paUtils.degreesToRadians(216.57 + b);
        a = 91.56766028 * t;
        b = 360.0 * (a - Math.floor(a));

        var c1 = paUtils.degreesToRadians(312.69 + b);
        a = 1236.853095 * t;
        b = 360.0 * (a - Math.floor(a));

        var d1 = paUtils.degreesToRadians(350.74 - 0.00144 * t2 + b);
        var e1 = paUtils.degreesToRadians(231.19 + 20.2 * t);
        a = 183.1353208 * t;
        b = 360.0 * (a - Math.floor(a));
        var h1 = paUtils.degreesToRadians(353.4 + b);

        var d2 = 0.00134 * Math.cos(a1) + 0.00154 * Math.cos(b1) + 0.002 * Math.cos(c1);
        d2 = d2 + 0.00179 * Math.sin(d1) + 0.00178 * Math.sin(e1);
        var d3 = 0.00000543 * Math.sin(a1) + 0.00001575 * Math.sin(b1);
        d3 = d3 + 0.00001627 * Math.sin(c1) + 0.00003076 * Math.cos(d1);

        var sr = at + paUtils.degreesToRadians(l - m1 + d2);
        var tp = 6.283185308;

        sr = sr - tp * Math.floor(sr / tp);

        return this.degrees(sr);
    }

    /**
     * Solve Kepler's equation, and return value of the true anomaly in radians
     * 
     * Original macro name: TrueAnomaly
     */
    static trueAnomaly(am, ec) {
        var tp = 6.283185308;
        var m = am - tp * Math.floor(am / tp);
        var ae = m;

        while (1 == 1) {
            var d = ae - (ec * Math.sin(ae)) - m;
            if (Math.abs(d) < 0.000001) {
                break;
            }
            d = d / (1.0 - (ec * Math.cos(ae)));
            ae = ae - d;
        }
        var a = Math.sqrt((1 + ec) / (1 - ec)) * Math.tan(ae / 2);
        var at = 2.0 * Math.atan(a);

        return at;
    }

    /**
     * Calculate effects of refraction
     * 
     * Original macro name: Refract
     */
    static refract(y2, sw, pr, tr) {
        var y = paUtils.degreesToRadians(y2);

        var d = (sw == paTypes.CoordinateType.True) ? -1.0 : 1.0;

        if (d == -1) {
            var y3 = y;
            var y1 = y;
            var r1 = 0.0;

            while (1 == 1) {
                var yNew = y1 + r1;
                var rfNew = this.refractL3035(pr, tr, yNew, d);

                if (y < -0.087)
                    return 0;

                var r2 = rfNew;

                if ((r2 == 0) || (Math.abs(r2 - r1) < 0.000001)) {
                    var qNew = y3;

                    return this.degrees(qNew + rfNew);
                }

                r1 = r2;
            }
        }

        var rf = this.refractL3035(pr, tr, y, d);

        if (y < -0.087)
            return 0;

        var q = y;

        return this.degrees(q + rf);
    }

    /**
     * Helper function for Refract
     */
    static refractL3035(pr, tr, y, d) {
        if (y < 0.2617994) {
            if (y < -0.087)
                return 0;

            var yd = this.degrees(y);
            var a = ((0.00002 * yd + 0.0196) * yd + 0.1594) * pr;
            var b = (273.0 + tr) * ((0.0845 * yd + 0.505) * yd + 1);

            return paUtils.degreesToRadians(-(a / b) * d);
        }

        return -d * 0.00007888888 * pr / ((273.0 + tr) * Math.tan(y));
    }

    /**
     * Calculate corrected hour angle in decimal hours
     * 
     * Original macro name: ParallaxHA
     */
    static parallaxHA(hh, hm, hs, dd, dm, ds, sw, gp, ht, hp) {
        var a = paUtils.degreesToRadians(gp);
        var c1 = Math.cos(a);
        var s1 = Math.sin(a);

        var u = Math.atan(0.996647 * s1 / c1);
        var c2 = Math.cos(u);
        var s2 = Math.sin(u);
        var b = ht / 6378160;

        var rs = (0.996647 * s2) + (b * s1);

        var rc = c2 + (b * c1);
        var tp = 6.283185308;

        var rp = 1.0 / Math.sin(paUtils.degreesToRadians(hp));

        var x = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(this.HMStoDH(hh, hm, hs)));
        var x1 = x;
        var y = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var y1 = y;

        var d = (sw == paTypes.CoordinateType.True) ? 1.0 : -1.0;

        if (d == 1) {
            var [resultP, resultQ] = this.parallaxHAL2870(x, y, rc, rp, rs, tp);
            return this.decimalDegreesToDegreeHours(this.degrees(resultP));
        }

        var p1 = 0.0;
        var q1 = 0.0;
        var xLoop = x;
        var yLoop = y;

        while (1 == 1) {
            var [resultP, resultQ] = this.parallaxHAL2870(xLoop, yLoop, rc, rp, rs, tp);
            var p2 = resultP - xLoop;
            var q2 = resultQ - yLoop;

            var aa = Math.abs(p2 - p1);
            var bb = Math.abs(q2 - q1);

            if ((aa < 0.000001) && (bb < 0.000001)) {
                var p3 = x1 - p2;

                return this.decimalDegreesToDegreeHours(this.degrees(p3));
            }

            xLoop = x1 - p2;
            yLoop = y1 - q2;
            p1 = p2;
            q1 = q2;
        }
    }

    /**
     * Helper function for parallax_ha
     */
    static parallaxHAL2870(x, y, rc, rp, rs, tp) {
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);

        var aa = (rc * Math.sin(x)) / ((rp * cy) - (rc * cx));

        var dx = Math.atan(aa);
        var p = x + dx;
        var cp = Math.cos(p);

        p = p - tp * Math.floor(p / tp);
        var q = Math.atan(cp * (rp * sy - rs) / (rp * cy * cx - rc));

        return [p, q];
    }

    /**
     * Calculate corrected declination in decimal degrees
     * 
     * Original macro name: ParallaxDec
     */
    static parallaxDec(hh, hm, hs, dd, dm, ds, sw, gp, ht, hp) {
        var a = paUtils.degreesToRadians(gp);
        var c1 = Math.cos(a);
        var s1 = Math.sin(a);

        var u = Math.atan(0.996647 * s1 / c1);

        var c2 = Math.cos(u);
        var s2 = Math.sin(u);
        var b = ht / 6378160;
        var rs = (0.996647 * s2) + (b * s1);

        var rc = c2 + (b * c1);
        var tp = 6.283185308;

        var rp = 1.0 / Math.sin(paUtils.degreesToRadians(hp));

        var x = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(this.HMStoDH(hh, hm, hs)));
        var x1 = x;

        var y = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var y1 = y;

        var d = (sw == paTypes.CoordinateType.True) ? 1.0 : -1.0;

        if (d == 1) {
            var [resultP, resultQ] = this.parallaxDecL2870(x, y, rc, rp, rs, tp);

            return this.degrees(resultQ);
        }

        var p1 = 0.0;
        var q1 = 0.0;

        var xLoop = x;
        var yLoop = y;

        while (1 == 1) {
            var [resultP, resultQ] = this.parallaxDecL2870(xLoop, yLoop, rc, rp, rs, tp);
            var p2 = resultP - xLoop;
            var q2 = resultQ - yLoop;
            var aa = Math.abs(p2 - p1);

            if ((aa < 0.000001) && (b < 0.000001)) {
                var q = y1 - q2;

                return degrees(q);
            }
            xLoop = x1 - p2;
            yLoop = y1 - q2;
            p1 = p2;
            q1 = q2;
        }
    }

    /**
     * Helper function for parallax_dec
     */
    static parallaxDecL2870(x, y, rc, rp, rs, tp) {
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);

        var aa = (rc * Math.sin(x)) / ((rp * cy) - (rc * cx));
        var dx = Math.atan(aa);
        var p = x + dx;
        var cp = Math.cos(p);

        p = p - tp * Math.floor(p / tp);
        var q = Math.atan(cp * (rp * sy - rs) / (rp * cy * cx - rc));

        return [p, q];
    }

    /**
     * Calculate Sun's angular diameter in decimal degrees
     * 
     * Original macro name: SunDia
     */
    static sunDia(lch, lcm, lcs, ds, zc, ld, lm, ly) {
        var a = this.sunDist(lch, lcm, lcs, ds, zc, ld, lm, ly);

        return 0.533128 / a;
    }

    /**
     * Calculate Sun's distance from the Earth in astronomical units
     * 
     * Original macro name: SunDist
     */
    static sunDist(lch, lcm, lcs, ds, zc, ld, lm, ly) {
        var aa = this.localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var bb = this.localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var cc = this.localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var ut = this.localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var dj = this.civilDateToJulianDate(aa, bb, cc) - 2415020;

        var t = (dj / 36525) + (ut / 876600);
        var t2 = t * t;

        var a = 100.0021359 * t;
        var b = 360 * (a - Math.floor(a));
        a = 99.99736042 * t;
        b = 360 * (a - Math.floor(a));
        var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
        var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

        var am = paUtils.degreesToRadians(m1);
        var ae = this.eccentricAnomaly(am, ec);

        a = 62.55209472 * t;
        b = 360 * (a - Math.floor(a));
        var a1 = paUtils.degreesToRadians(153.23 + b);
        a = 125.1041894 * t;
        b = 360 * (a - Math.floor(a));
        var b1 = paUtils.degreesToRadians(216.57 + b);
        a = 91.56766028 * t;
        b = 360 * (a - Math.floor(a));
        var c1 = paUtils.degreesToRadians(312.69 + b);
        a = 1236.853095 * t;
        b = 360 * (a - Math.floor(a));
        var d1 = paUtils.degreesToRadians(350.74 - 0.00144 * t2 + b);
        var e1 = paUtils.degreesToRadians(231.19 + 20.2 * t);
        a = 183.1353208 * t;
        b = 360 * (a - Math.floor(a));
        var h1 = paUtils.degreesToRadians(353.4 + b);

        var d3 = (0.00000543 * Math.sin(a1) + 0.00001575 * Math.sin(b1)) + (0.00001627 * Math.sin(c1) + 0.00003076 * Math.cos(d1)) + (0.00000927 * Math.sin(h1));

        return 1.0000002 * (1 - ec * Math.cos(ae)) + d3;
    }

    /**
     * Solve Kepler's equation, and return value of the eccentric anomaly in radians
     * 
     * Original macro name: EccentricAnomaly
     */
    static eccentricAnomaly(am, ec) {
        var tp = 6.283185308;
        var m = am - tp * Math.floor(am / tp);
        var ae = m;

        while (1 == 1) {
            var d = ae - (ec * Math.sin(ae)) - m;

            if (Math.abs(d) < 0.000001) {
                break;
            }

            d = d / (1 - (ec * Math.cos(ae)));
            ae = ae - d;
        }

        return ae;
    }

    /**
     * Calculate geocentric ecliptic longitude for the Moon
     * 
     * Original macro name: MoonLong
     */
    static moonLong(lh, lm, ls, ds, zc, dy, mn, yr) {
        var ut = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var t = ((this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
        var t2 = t * t;

        var m1 = 27.32158213;
        var m2 = 365.2596407;
        var m3 = 27.55455094;
        var m4 = 29.53058868;
        var m5 = 27.21222039;
        var m6 = 6798.363307;
        var q = this.civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
        m1 = q / m1;
        m2 = q / m2;
        m3 = q / m3;
        m4 = q / m4;
        m5 = q / m5;
        m6 = q / m6;
        m1 = 360 * (m1 - Math.floor(m1));
        m2 = 360 * (m2 - Math.floor(m2));
        m3 = 360 * (m3 - Math.floor(m3));
        m4 = 360 * (m4 - Math.floor(m4));
        m5 = 360 * (m5 - Math.floor(m5));
        m6 = 360 * (m6 - Math.floor(m6));

        var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
        var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
        var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
        var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
        var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
        var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
        var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
        var s1 = Math.sin(a);
        var s2 = Math.sin(paUtils.degreesToRadians(na));
        var b = 346.56 + (132.87 - 0.0091731 * t) * t;
        var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
        var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
        var s4 = Math.sin(c);
        ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
        ms = ms - 0.001778 * s1;
        md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
        mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
        me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
        var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
        var e2 = e * e;
        ml = paUtils.degreesToRadians(ml);
        ms = paUtils.degreesToRadians(ms);
        me1 = paUtils.degreesToRadians(me1);
        mf = paUtils.degreesToRadians(mf);
        md = paUtils.degreesToRadians(md);

        var l = 6.28875 * Math.sin(md) + 1.274018 * Math.sin(2.0 * me1 - md);
        l = l + 0.658309 * Math.sin(2.0 * me1) + 0.213616 * Math.sin(2.0 * md);
        l = l - e * 0.185596 * Math.sin(ms) - 0.114336 * Math.sin(2.0 * mf);
        l = l + 0.058793 * Math.sin(2.0 * (me1 - md));
        l = l + 0.057212 * e * Math.sin(2.0 * me1 - ms - md) + 0.05332 * Math.sin(2.0 * me1 + md);
        l = l + 0.045874 * e * Math.sin(2.0 * me1 - ms) + 0.041024 * e * Math.sin(md - ms);
        l = l - 0.034718 * Math.sin(me1) - e * 0.030465 * Math.sin(ms + md);
        l = l + 0.015326 * Math.sin(2.0 * (me1 - mf)) - 0.012528 * Math.sin(2.0 * mf + md);
        l = l - 0.01098 * Math.sin(2.0 * mf - md) + 0.010674 * Math.sin(4.0 * me1 - md);
        l = l + 0.010034 * Math.sin(3.0 * md) + 0.008548 * Math.sin(4.0 * me1 - 2.0 * md);
        l = l - e * 0.00791 * Math.sin(ms - md + 2.0 * me1) - e * 0.006783 * Math.sin(2.0 * me1 + ms);
        l = l + 0.005162 * Math.sin(md - me1) + e * 0.005 * Math.sin(ms + me1);
        l = l + 0.003862 * Math.sin(4.0 * me1) + e * 0.004049 * Math.sin(md - ms + 2.0 * me1);
        l = l + 0.003996 * Math.sin(2.0 * (md + me1)) + 0.003665 * Math.sin(2.0 * me1 - 3.0 * md);
        l = l + e * 0.002695 * Math.sin(2.0 * md - ms) + 0.002602 * Math.sin(md - 2.0 * (mf + me1));
        l = l + e * 0.002396 * Math.sin(2.0 * (me1 - md) - ms) - 0.002349 * Math.sin(md + me1);
        l = l + e2 * 0.002249 * Math.sin(2.0 * (me1 - ms)) - e * 0.002125 * Math.sin(2.0 * md + ms);
        l = l - e2 * 0.002079 * Math.sin(2.0 * ms) + e2 * 0.002059 * Math.sin(2.0 * (me1 - ms) - md);
        l = l - 0.001773 * Math.sin(md + 2.0 * (me1 - mf)) - 0.001595 * Math.sin(2.0 * (mf + me1));
        l = l + e * 0.00122 * Math.sin(4.0 * me1 - ms - md) - 0.00111 * Math.sin(2.0 * (md + mf));
        l = l + 0.000892 * Math.sin(md - 3.0 * me1) - e * 0.000811 * Math.sin(ms + md + 2.0 * me1);
        l = l + e * 0.000761 * Math.sin(4.0 * me1 - ms - 2.0 * md);
        l = l + e2 * 0.000704 * Math.sin(md - 2.0 * (ms + me1));
        l = l + e * 0.000693 * Math.sin(ms - 2.0 * (md - me1));
        l = l + e * 0.000598 * Math.sin(2.0 * (me1 - mf) - ms);
        l = l + 0.00055 * Math.sin(md + 4.0 * me1) + 0.000538 * Math.sin(4.0 * md);
        l = l + e * 0.000521 * Math.sin(4.0 * me1 - ms) + 0.000486 * Math.sin(2.0 * md - me1);
        l = l + e2 * 0.000717 * Math.sin(md - 2.0 * ms);
        var mm = this.unwind(ml + paUtils.degreesToRadians(l));

        return this.degrees(mm);
    }

    /**
     * Calculate geocentric ecliptic latitude for the Moon
     * 
     * Original macro name: MoonLat
     */
    static moonLat(lh, lm, ls, ds, zc, dy, mn, yr) {
        var ut = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var t = ((this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
        var t2 = t * t;

        var m1 = 27.32158213;
        var m2 = 365.2596407;
        var m3 = 27.55455094;
        var m4 = 29.53058868;
        var m5 = 27.21222039;
        var m6 = 6798.363307;
        var q = this.civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
        m1 = q / m1;
        m2 = q / m2;
        m3 = q / m3;
        m4 = q / m4;
        m5 = q / m5;
        m6 = q / m6;
        m1 = 360 * (m1 - Math.floor(m1));
        m2 = 360 * (m2 - Math.floor(m2));
        m3 = 360 * (m3 - Math.floor(m3));
        m4 = 360 * (m4 - Math.floor(m4));
        m5 = 360 * (m5 - Math.floor(m5));
        m6 = 360 * (m6 - Math.floor(m6));

        var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
        var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
        var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
        var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
        var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
        var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
        var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
        var s1 = Math.sin(a);
        var s2 = Math.sin(paUtils.degreesToRadians(na));
        var b = 346.56 + (132.87 - 0.0091731 * t) * t;
        var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
        var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
        var s4 = Math.sin(c);
        ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
        ms = ms - 0.001778 * s1;
        md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
        mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
        me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
        var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
        var e2 = e * e;
        ms = paUtils.degreesToRadians(ms);
        na = paUtils.degreesToRadians(na);
        me1 = paUtils.degreesToRadians(me1);
        mf = paUtils.degreesToRadians(mf);
        md = paUtils.degreesToRadians(md);

        var g = 5.128189 * Math.sin(mf) + 0.280606 * Math.sin(md + mf);
        g = g + 0.277693 * Math.sin(md - mf) + 0.173238 * Math.sin(2.0 * me1 - mf);
        g = g + 0.055413 * Math.sin(2.0 * me1 + mf - md) + 0.046272 * Math.sin(2.0 * me1 - mf - md);
        g = g + 0.032573 * Math.sin(2.0 * me1 + mf) + 0.017198 * Math.sin(2.0 * md + mf);
        g = g + 0.009267 * Math.sin(2.0 * me1 + md - mf) + 0.008823 * Math.sin(2.0 * md - mf);
        g = g + e * 0.008247 * Math.sin(2.0 * me1 - ms - mf) + 0.004323 * Math.sin(2.0 * (me1 - md) - mf);
        g = g + 0.0042 * Math.sin(2.0 * me1 + mf + md) + e * 0.003372 * Math.sin(mf - ms - 2.0 * me1);
        g = g + e * 0.002472 * Math.sin(2.0 * me1 + mf - ms - md);
        g = g + e * 0.002222 * Math.sin(2.0 * me1 + mf - ms);
        g = g + e * 0.002072 * Math.sin(2.0 * me1 - mf - ms - md);
        g = g + e * 0.001877 * Math.sin(mf - ms + md) + 0.001828 * Math.sin(4.0 * me1 - mf - md);
        g = g - e * 0.001803 * Math.sin(mf + ms) - 0.00175 * Math.sin(3.0 * mf);
        g = g + e * 0.00157 * Math.sin(md - ms - mf) - 0.001487 * Math.sin(mf + me1);
        g = g - e * 0.001481 * Math.sin(mf + ms + md) + e * 0.001417 * Math.sin(mf - ms - md);
        g = g + e * 0.00135 * Math.sin(mf - ms) + 0.00133 * Math.sin(mf - me1);
        g = g + 0.001106 * Math.sin(mf + 3.0 * md) + 0.00102 * Math.sin(4.0 * me1 - mf);
        g = g + 0.000833 * Math.sin(mf + 4.0 * me1 - md) + 0.000781 * Math.sin(md - 3.0 * mf);
        g = g + 0.00067 * Math.sin(mf + 4.0 * me1 - 2.0 * md) + 0.000606 * Math.sin(2.0 * me1 - 3.0 * mf);
        g = g + 0.000597 * Math.sin(2.0 * (me1 + md) - mf);
        g = g + e * 0.000492 * Math.sin(2.0 * me1 + md - ms - mf) + 0.00045 * Math.sin(2.0 * (md - me1) - mf);
        g = g + 0.000439 * Math.sin(3.0 * md - mf) + 0.000423 * Math.sin(mf + 2.0 * (me1 + md));
        g = g + 0.000422 * Math.sin(2.0 * me1 - mf - 3.0 * md) - e * 0.000367 * Math.sin(ms + mf + 2.0 * me1 - md);
        g = g - e * 0.000353 * Math.sin(ms + mf + 2.0 * me1) + 0.000331 * Math.sin(mf + 4.0 * me1);
        g = g + e * 0.000317 * Math.sin(2.0 * me1 + mf - ms + md);
        g = g + e2 * 0.000306 * Math.sin(2.0 * (me1 - ms) - mf) - 0.000283 * Math.sin(md + 3.0 * mf);
        var w1 = 0.0004664 * Math.cos(na);
        var w2 = 0.0000754 * Math.cos(c);
        var bm = paUtils.degreesToRadians(g) * (1.0 - w1 - w2);

        return this.degrees(bm);
    }

    /**
     * Calculate horizontal parallax for the Moon
     * 
     * Original macro name: MoonHP
     */
    static moonHP(lh, lm, ls, ds, zc, dy, mn, yr) {
        var ut = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var t = ((this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
        var t2 = t * t;

        var m1 = 27.32158213;
        var m2 = 365.2596407;
        var m3 = 27.55455094;
        var m4 = 29.53058868;
        var m5 = 27.21222039;
        var m6 = 6798.363307;
        var q = this.civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
        m1 = q / m1;
        m2 = q / m2;
        m3 = q / m3;
        m4 = q / m4;
        m5 = q / m5;
        m6 = q / m6;
        m1 = 360 * (m1 - Math.floor(m1));
        m2 = 360 * (m2 - Math.floor(m2));
        m3 = 360 * (m3 - Math.floor(m3));
        m4 = 360 * (m4 - Math.floor(m4));
        m5 = 360 * (m5 - Math.floor(m5));
        m6 = 360 * (m6 - Math.floor(m6));

        var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
        var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
        var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
        var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
        var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
        var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
        var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
        var s1 = Math.sin(a);
        var s2 = Math.sin(paUtils.degreesToRadians(na));
        var b = 346.56 + (132.87 - 0.0091731 * t) * t;
        var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
        var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
        var s4 = Math.sin(c);
        ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
        ms = ms - 0.001778 * s1;
        md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
        mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
        me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
        var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
        var e2 = e * e;
        ms = paUtils.degreesToRadians(ms);
        me1 = paUtils.degreesToRadians(me1);
        mf = paUtils.degreesToRadians(mf);
        md = paUtils.degreesToRadians(md);

        var pm = 0.950724 + 0.051818 * Math.cos(md) + 0.009531 * Math.cos(2.0 * me1 - md);
        pm = pm + 0.007843 * Math.cos(2.0 * me1) + 0.002824 * Math.cos(2.0 * md);
        pm = pm + 0.000857 * Math.cos(2.0 * me1 + md) + e * 0.000533 * Math.cos(2.0 * me1 - ms);
        pm = pm + e * 0.000401 * Math.cos(2.0 * me1 - md - ms);
        pm = pm + e * 0.00032 * Math.cos(md - ms) - 0.000271 * Math.cos(me1);
        pm = pm - e * 0.000264 * Math.cos(ms + md) - 0.000198 * Math.cos(2.0 * mf - md);
        pm = pm + 0.000173 * Math.cos(3.0 * md) + 0.000167 * Math.cos(4.0 * me1 - md);
        pm = pm - e * 0.000111 * Math.cos(ms) + 0.000103 * Math.cos(4.0 * me1 - 2.0 * md);
        pm = pm - 0.000084 * Math.cos(2.0 * md - 2.0 * me1) - e * 0.000083 * Math.cos(2.0 * me1 + ms);
        pm = pm + 0.000079 * Math.cos(2.0 * me1 + 2.0 * md) + 0.000072 * Math.cos(4.0 * me1);
        pm = pm + e * 0.000064 * Math.cos(2.0 * me1 - ms + md) - e * 0.000063 * Math.cos(2.0 * me1 + ms - md);
        pm = pm + e * 0.000041 * Math.cos(ms + me1) + e * 0.000035 * Math.cos(2.0 * md - ms);
        pm = pm - 0.000033 * Math.cos(3.0 * md - 2.0 * me1) - 0.00003 * Math.cos(md + me1);
        pm = pm - 0.000029 * Math.cos(2.0 * (mf - me1)) - e * 0.000029 * Math.cos(2.0 * md + ms);
        pm = pm + e2 * 0.000026 * Math.cos(2.0 * (me1 - ms)) - 0.000023 * Math.cos(2.0 * (mf - me1) + md);
        pm = pm + e * 0.000019 * Math.cos(4.0 * me1 - ms - md);

        return pm;
    }

    /**
     * Calculate distance from the Earth to the Moon (km)
     * 
     * Original macro name: MoonDist
     */
    static moonDist(lh, lm, ls, ds, zc, dy, mn, yr) {
        var hp = paUtils.degreesToRadians(this.moonHP(lh, lm, ls, ds, zc, dy, mn, yr));
        var r = 6378.14 / Math.sin(hp);

        return r;
    }

    /**
     * Calculate the Moon's angular diameter (degrees)
     * 
     * Original macro name: MoonSize
     */
    static moonSize(lh, lm, ls, ds, zc, dy, mn, yr) {
        var hp = paUtils.degreesToRadians(this.moonHP(lh, lm, ls, ds, zc, dy, mn, yr));
        var r = 6378.14 / Math.sin(hp);
        var th = 384401.0 * 0.5181 / r;

        return th;
    }

    /**
     * Convert angle in radians to equivalent angle in degrees.
     * 
     * Original macro name: Unwind
     */
    static unwind(w) {
        return w - 6.283185308 * Math.floor(w / 6.283185308);
    }

    /**
     * Convert angle in degrees to equivalent angle in the range 0 to 360 degrees.
     * 
     * Original macro name: UnwindDeg
     */
    static unwindDeg(w) {
        return w - 360 * Math.floor(w / 360);
    }

    /**
     * Mean ecliptic longitude of the Sun at the epoch
     * 
     * Original macro name: SunElong
     */
    static sunELong(gd, gm, gy) {
        var t = (this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
        var t2 = t * t;
        var x = 279.6966778 + 36000.76892 * t + 0.0003025 * t2;

        return x - 360 * Math.floor(x / 360);
    }

    /**
     * Longitude of the Sun at perigee
     * 
     * Original macro name: SunPeri
     */
    static sunPeri(gd, gm, gy) {
        var t = (this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
        var t2 = t * t;
        var x = 281.2208444 + 1.719175 * t + 0.000452778 * t2;

        return x - 360 * Math.floor(x / 360);
    }

    /**
     * Eccentricity of the Sun-Earth orbit
     * 
     * Original macro name: SunEcc
     */
    static sunEcc(gd, gm, gy) {
        var t = (this.civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
        var t2 = t * t;

        return 0.01675104 - 0.0000418 * t - 0.000000126 * t2;
    }

    /**
     * Ecliptic - Declination (degrees)
     * 
     * Original macro name: ECDec
     */
    static ecDec(eld, elm, els, bd, bm, bs, gd, gm, gy) {
        var a = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(eld, elm, els));
        var b = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(bd, bm, bs));
        var c = paUtils.degreesToRadians(this.obliq(gd, gm, gy));
        var d = Math.sin(b) * Math.cos(c) + Math.cos(b) * Math.sin(c) * Math.sin(a);

        return this.degrees(Math.asin(d));
    }

    /**
     * Ecliptic - Right Ascension (degrees)
     * 
     * Original macro name: ECRA
     */
    static ecRA(eld, elm, els, bd, bm, bs, gd, gm, gy) {
        var a = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(eld, elm, els));
        var b = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(bd, bm, bs));
        var c = paUtils.degreesToRadians(this.obliq(gd, gm, gy));
        var d = Math.sin(a) * Math.cos(c) - Math.tan(b) * Math.sin(c);
        var e = Math.cos(a);
        var f = this.degrees(Math.atan2(d, e));

        return f - 360 * Math.floor(f / 360);
    }

    /**
     * Calculate Sun's true anomaly, i.e., how much its orbit deviates from a true circle to an ellipse.
     *
     * Original macro name: SunTrueAnomaly
     */
    static sunTrueAnomaly(lch, lcm, lcs, ds, zc, ld, lm, ly) {
        var aa = this.localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var bb = this.localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var cc = this.localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var ut = this.localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var dj = this.civilDateToJulianDate(aa, bb, cc) - 2415020;

        var t = (dj / 36525) + (ut / 876600);
        var t2 = t * t;

        var a = 99.99736042 * t;
        var b = 360 * (a - Math.floor(a));

        var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
        var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

        var am = paUtils.degreesToRadians(m1);

        return this.degrees(this.trueAnomaly(am, ec));
    }

    /**
     * Calculate the Sun's mean anomaly.
     * 
     * Original macro name: SunMeanAnomaly
     */
    static sunMeanAnomaly(lch, lcm, lcs, ds, zc, ld, lm, ly) {
        var aa = this.localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var bb = this.localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var cc = this.localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var ut = this.localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
        var dj = this.civilDateToJulianDate(aa, bb, cc) - 2415020;
        var t = (dj / 36525) + (ut / 876600);
        var t2 = t * t;
        var a = 100.0021359 * t;
        var b = 360 * (a - Math.floor(a));
        var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
        var am = this.unwind(paUtils.degreesToRadians(m1));

        return am;
    }

    /**
     * Calculate local civil time of sunrise.
     * 
     * Original macro name: SunriseLCT
     */
    static sunriseLCT(ld, lm, ly, ds, zc, gl, gp) {
        var di = 0.8333333;
        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.sunriseLCTL3710(gd, gm, gy, sr, di, gp);

        var xx;
        if (result1_s != paTypes.RiseSetCalcStatus.OK) {
            xx = -99.0;
        }
        else {
            var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
            var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

            if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
                xx = -99.0;
            }
            else {
                sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

                var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.sunriseLCTL3710(gd, gm, gy, sr, di, gp);

                if (result2_s != paTypes.RiseSetCalcStatus.OK) {
                    xx = -99.0;
                }
                else {
                    x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
                    ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
                    xx = this.universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
                }
            }
        }

        return xx;
    }

    /**
     * Helper function for sunrise_lct()
     */
    static sunriseLCTL3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeRise(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0.0, 0.0, y, 0.0, 0.0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Calculate local civil time of sunset.
     * 
     * Original macro name: SunsetLCT
     */
    static sunsetLCT(ld, lm, ly, ds, zc, gl, gp) {
        var di = 0.8333333;
        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.sunsetLCTL3710(gd, gm, gy, sr, di, gp);

        var xx;
        if (result1_s != paTypes.RiseSetCalcStatus.OK) {
            xx = -99.0;
        }
        else {
            var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
            var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

            if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
                xx = -99.0;
            }
            else {
                sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);
                var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.sunsetLCTL3710(gd, gm, gy, sr, di, gp);

                if (result2_s != paTypes.RiseSetCalcStatus.OK) {
                    xx = -99;
                }
                else {
                    x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
                    ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
                    xx = this.universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
                }
            }
        }
        return xx;
    }

    /**
     * Helper function for sunset_lct().
     */
    static sunsetLCTL3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0.0, 0.0, 0.0, 0.0, 0.0, gd, gm, gy);
        var y = this.ecDec(a, 0.0, 0.0, 0.0, 0.0, 0.0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeSet(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Calculate azimuth of sunrise.
     *
     * Original macro name: SunriseAz
     */
    static sunriseAZ(ld, lm, ly, ds, zc, gl, gp) {
        var di = 0.8333333;
        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.sunriseAZ_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != paTypes.RiseSetCalcStatus.OK) {
            return -99.0;
        }

        var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
        var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
            return -99.0;
        }

        sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

        var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.sunriseAZ_L3710(gd, gm, gy, sr, di, gp);

        if (result2_s != paTypes.RiseSetCalcStatus.OK) {
            return -99.0;
        }

        return this.riseSetAzimuthRise(this.decimalDegreesToDegreeHours(x), 0, 0, result2_y, 0.0, 0.0, di, gp);
    }

    /**
     * Helper function for sunrise_az()
     */
    static sunriseAZ_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeRise(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Calculate azimuth of sunset.
     * 
     * Original macro name: SunsetAz
     */
    static sunsetAZ(ld, lm, ly, ds, zc, gl, gp) {
        var di = 0.8333333;
        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.sunsetAZ_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != paTypes.RiseSetCalcStatus.OK) {
            return -99.0;
        }

        var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
        var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
            return -99.0;
        }

        sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

        var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.sunsetAZ_L3710(gd, gm, gy, sr, di, gp);

        if (result2_s != paTypes.RiseSetCalcStatus.OK) {
            return -99.0;
        }
        return this.riseSetAzimuthSet(this.decimalDegreesToDegreeHours(x), 0, 0, result2_y, 0, 0, di, gp);
    }

    /**
     * Helper function for sunset_az()
     */
    static sunsetAZ_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeSet(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Status of conversion of Greenwich Sidereal Time to Universal Time.
     * 
     * Original macro name: eGSTUT
     */
    static eGreenwichSiderealToUniversalTime(gsh, gsm, gss, gd, gm, gy) {
        var a = this.civilDateToJulianDate(gd, gm, gy);
        var b = a - 2451545;
        var c = b / 36525;
        var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
        var e = d - (24 * Math.floor(d / 24));
        var f = this.HMStoDH(gsh, gsm, gss);
        var g = f - e;
        var h = g - (24 * Math.floor(g / 24));

        return ((h * 0.9972695663) < (4.0 / 60.0)) ? paTypes.WarningFlag.Warning : paTypes.WarningFlag.OK;
    }

    /**
     * Rise/Set status
     * 
     * Original macro name: eRS
     */
    static eRS(rah, ram, ras, dd, dm, ds, vd, g) {
        var a = this.HMStoDH(rah, ram, ras);
        var c = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var d = paUtils.degreesToRadians(vd);
        var e = paUtils.degreesToRadians(g);
        var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));

        var returnValue = paTypes.RiseSetStatus.OK
        if (f >= 1)
            returnValue = paTypes.RiseSetStatus.NeverRises;
        if (f <= -1)
            returnValue = paTypes.RiseSetStatus.Circumpolar;

        return returnValue;
    }

    /**
     * Local sidereal time of rise, in hours.
     * 
     * Original macro name: RSLSTR
     */
    static riseSetLocalSiderealTimeRise(rah, ram, ras, dd, dm, ds, vd, g) {
        var a = this.HMStoDH(rah, ram, ras);
        var b = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(a));
        var c = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var d = paUtils.degreesToRadians(vd);
        var e = paUtils.degreesToRadians(g);
        var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));
        var h = (Math.abs(f) < 1) ? Math.acos(f) : 0;
        var i = this.decimalDegreesToDegreeHours(this.degrees(b - h));

        return i - 24 * Math.floor(i / 24);
    }

    /**
     * Local sidereal time of setting, in hours.
     * 
     * Original macro name: RSLSTS
     */
    static riseSetLocalSiderealTimeSet(rah, ram, ras, dd, dm, ds, vd, g) {
        var a = this.HMStoDH(rah, ram, ras);
        var b = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(a));
        var c = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var d = paUtils.degreesToRadians(vd);
        var e = paUtils.degreesToRadians(g);
        var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));
        var h = (Math.abs(f) < 1) ? Math.acos(f) : 0;
        var i = this.decimalDegreesToDegreeHours(this.degrees(b + h));

        return i - 24 * Math.floor(i / 24);
    }

    /**
     * Sunrise/Sunset calculation status.
     * 
     * Original macro name: eSunRS
     */
    static eSunRS(ld, lm, ly, ds, zc, gl, gp) {
        var di = 0.8333333;
        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.eSunRS_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != paTypes.RiseSetCalcStatus.OK) {
            return result1_s;
        }
        else {
            var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
            var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
            sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);
            var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.eSunRS_L3710(gd, gm, gy, sr, di, gp);
            if (result2_s != paTypes.RiseSetCalcStatus.OK) {
                return result2_s;
            }
            else {
                x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);

                if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
                    return paTypes.RiseSetCalcStatus.ConversionWarning;
                }

                return result2_s;
            }
        }
    }

    /**
     * Helper function for eSunRS()
     */
    static eSunRS_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeRise(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Azimuth of rising, in degrees.
     * 
     * Original macro name: RSAZR
     */
    static riseSetAzimuthRise(rah, ram, ras, dd, dm, ds, vd, g) {
        var a = this.HMStoDH(rah, ram, ras);
        var c = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var d = paUtils.degreesToRadians(vd);
        var e = paUtils.degreesToRadians(g);
        var f = (Math.sin(c) + Math.sin(d) * Math.sin(e)) / (Math.cos(d) * Math.cos(e));
        var h = (this.eRS(rah, ram, ras, dd, dm, ds, vd, g) == paTypes.RiseSetStatus.OK) ? Math.acos(f) : 0;
        var i = this.degrees(h);

        return i - 360 * Math.floor(i / 360);
    }

    /**
     * Azimuth of setting, in degrees.
     * 
     * Original macro name: RSAZS
     */
    static riseSetAzimuthSet(rah, ram, ras, dd, dm, ds, vd, g) {
        var a = this.HMStoDH(rah, ram, ras);
        var c = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var d = paUtils.degreesToRadians(vd);
        var e = paUtils.degreesToRadians(g);
        var f = (Math.sin(c) + Math.sin(d) * Math.sin(e)) / (Math.cos(d) * Math.cos(e));
        var h = (this.eRS(rah, ram, ras, dd, dm, ds, vd, g) == paTypes.RiseSetStatus.OK) ? Math.acos(f) : 0;
        var i = 360 - this.degrees(h);

        return i - 360 * Math.floor(i / 360);
    }

    /**
     * Calculate morning twilight start, in local time.
     * 
     * Original macro name: TwilightAMLCT
     */
    static twilightAMLCT(ld, lm, ly, ds, zc, gl, gp, tt) {
        var di = tt;

        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.twilightAMLCT_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != "OK")
            return -99.0;

        var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
        var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK)
            return -99.0;

        sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

        var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.twilightAMLCT_L3710(gd, gm, gy, sr, di, gp);

        if (result2_s != "OK")
            return -99.0;

        x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        var xx = this.universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);

        return xx;
    }

    /**
     * Helper function for twilight_am_lct()
     */
    static twilightAMLCT_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeRise(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Calculate evening twilight end, in local time.
     * 
     * Original macro name: TwilightPMLCT
     */
    static twilightPMLCT(ld, lm, ly, ds, zc, gl, gp, tt) {
        var di = tt;

        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.twilightPMLCT_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != "OK")
            return 0.0;

        var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
        var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK)
            return 0.0;

        sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

        var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.twilightPMLCT_L3710(gd, gm, gy, sr, di, gp);

        if (result2_s != "OK")
            return 0.0;

        x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

        return this.universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
    }

    /**
     * Helper function for twilight_pm_lct()
     */
    static twilightPMLCT_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeSet(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        return [a, x, y, la, s];
    }

    /**
     * Twilight calculation status.
     * 
     * Original macro name: eTwilight
     */
    static eTwilight(ld, lm, ly, ds, zc, gl, gp, tt) {
        var di = tt;

        var gd = this.localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
        var gm = this.localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
        var gy = this.localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
        var sr = this.sunLong(12, 0, 0, ds, zc, ld, lm, ly);

        var [result1_a, result1_x, result1_y, result1_la, result1_s] = this.eTwilight_L3710(gd, gm, gy, sr, di, gp);

        if (result1_s != "OK")
            return result1_s;

        var x = this.localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
        var ut = this.greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
        sr = this.sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

        var [result2_a, result2_x, result2_y, result2_la, result2_s] = this.eTwilight_L3710(gd, gm, gy, sr, di, gp);

        if (result2_s != "OK")
            return result2_s;

        x = this.localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);

        if (this.eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
            return paTypes.TwilightStatus.ConversionWarning;
        }

        return result2_s;
    }

    /**
     * Helper function for e_twilight()
     */
    static eTwilight_L3710(gd, gm, gy, sr, di, gp) {
        var a = sr + this.nutatLong(gd, gm, gy) - 0.005694;
        var x = this.ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var y = this.ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
        var la = this.riseSetLocalSiderealTimeRise(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
        var s = this.eRS(this.decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

        if (s != paTypes.RiseSetStatus.OK) {
            if (s == paTypes.RiseSetStatus.Circumpolar) {
                s = paTypes.TwilightStatus.AllNight;
            }
            else {
                if (s == paTypes.RiseSetStatus.NeverRises) {
                    s = paTypes.TwilightStatus.TooFarBelowHorizon;
                }
            }
        }

        return [a, x, y, la, s];
    }

    /**
     * Calculate the angle between two celestial objects
     * 
     * Original macro name: Angle
     */
    static angle(xx1, xm1, xs1, dd1, dm1, ds1, xx2, xm2, xs2, dd2, dm2, ds2, s) {
        var a = (s == paTypes.AngleMeasure.Hours)
            ? this.degreeHoursToDecimalDegrees(this.HMStoDH(xx1, xm1, xs1))
            : this.degreesMinutesSecondsToDecimalDegrees(xx1, xm1, xs1);
        var b = paUtils.degreesToRadians(a);
        var c = this.degreesMinutesSecondsToDecimalDegrees(dd1, dm1, ds1);
        var d = paUtils.degreesToRadians(c);
        var e = (s == paTypes.AngleMeasure.Hours)
            ? this.degreeHoursToDecimalDegrees(this.HMStoDH(xx2, xm2, xs2))
            : this.degreesMinutesSecondsToDecimalDegrees(xx2, xm2, xs2);
        var f = paUtils.degreesToRadians(e);
        var g = this.degreesMinutesSecondsToDecimalDegrees(dd2, dm2, ds2);
        var h = paUtils.degreesToRadians(g);
        var i = Math.acos(Math.sin(d) * Math.sin(h) + Math.cos(d) * Math.cos(h) * Math.cos(b - f));

        return this.degrees(i);
    }

    /**
     * Calculate several planetary properties.
     * 
     * Original macro names: PlanetLong, PlanetLat, PlanetDist, PlanetHLong1, PlanetHLong2, PlanetHLat, PlanetRVect
     */
    static planetCoordinates(lh, lm, ls, ds, zc, dy, mn, yr, s) {
        var a11 = 178.179078;
        var a12 = 415.2057519;
        var a13 = 0.0003011;
        var a14 = 0.0;
        var a21 = 75.899697;
        var a22 = 1.5554889;
        var a23 = 0.0002947;
        var a24 = 0.0;
        var a31 = 0.20561421;
        var a32 = 0.00002046;
        var a33 = -0.00000003;
        var a34 = 0.0;
        var a41 = 7.002881;
        var a42 = 0.0018608;
        var a43 = -0.0000183;
        var a44 = 0.0;
        var a51 = 47.145944;
        var a52 = 1.1852083;
        var a53 = 0.0001739;
        var a54 = 0.0;
        var a61 = 0.3870986;
        var a62 = 6.74;
        var a63 = -0.42;

        var b11 = 342.767053;
        var b12 = 162.5533664;
        var b13 = 0.0003097;
        var b14 = 0.0;
        var b21 = 130.163833;
        var b22 = 1.4080361;
        var b23 = -0.0009764;
        var b24 = 0.0;
        var b31 = 0.00682069;
        var b32 = -0.00004774;
        var b33 = 0.000000091;
        var b34 = 0.0;
        var b41 = 3.393631;
        var b42 = 0.0010058;
        var b43 = -0.000001;
        var b44 = 0.0;
        var b51 = 75.779647;
        var b52 = 0.89985;
        var b53 = 0.00041;
        var b54 = 0.0;
        var b61 = 0.7233316;
        var b62 = 16.92;
        var b63 = -4.4;

        var c11 = 293.737334;
        var c12 = 53.17137642;
        var c13 = 0.0003107;
        var c14 = 0.0;
        var c21 = 334.218203;
        var c22 = 1.8407584;
        var c23 = 0.0001299;
        var c24 = -0.00000119;
        var c31 = 0.0933129;
        var c32 = 0.000092064;
        var c33 = -0.000000077;
        var c34 = 0.0;
        var c41 = 1.850333;
        var c42 = -0.000675;
        var c43 = 0.0000126;
        var c44 = 0.0;
        var c51 = 48.786442;
        var c52 = 0.7709917;
        var c53 = -0.0000014;
        var c54 = -0.00000533;
        var c61 = 1.5236883;
        var c62 = 9.36;
        var c63 = -1.52;

        var d11 = 238.049257;
        var d12 = 8.434172183;
        var d13 = 0.0003347;
        var d14 = -0.00000165;
        var d21 = 12.720972;
        var d22 = 1.6099617;
        var d23 = 0.00105627;
        var d24 = -0.00000343;
        var d31 = 0.04833475;
        var d32 = 0.00016418;
        var d33 = -0.0000004676;
        var d34 = -0.0000000017;
        var d41 = 1.308736;
        var d42 = -0.0056961;
        var d43 = 0.0000039;
        var d44 = 0.0;
        var d51 = 99.443414;
        var d52 = 1.01053;
        var d53 = 0.00035222;
        var d54 = -0.00000851;
        var d61 = 5.202561;
        var d62 = 196.74;
        var d63 = -9.4;

        var e11 = 266.564377;
        var e12 = 3.398638567;
        var e13 = 0.0003245;
        var e14 = -0.0000058;
        var e21 = 91.098214;
        var e22 = 1.9584158;
        var e23 = 0.00082636;
        var e24 = 0.00000461;
        var e31 = 0.05589232;
        var e32 = -0.0003455;
        var e33 = -0.000000728;
        var e34 = 0.00000000074;
        var e41 = 2.492519;
        var e42 = -0.0039189;
        var e43 = -0.00001549;
        var e44 = 0.00000004;
        var e51 = 112.790414;
        var e52 = 0.8731951;
        var e53 = -0.00015218;
        var e54 = -0.00000531;
        var e61 = 9.554747;
        var e62 = 165.6;
        var e63 = -8.88;

        var f11 = 244.19747;
        var f12 = 1.194065406;
        var f13 = 0.000316;
        var f14 = -0.0000006;
        var f21 = 171.548692;
        var f22 = 1.4844328;
        var f23 = 0.0002372;
        var f24 = -0.00000061;
        var f31 = 0.0463444;
        var f32a = -0.00002658;
        var f33 = 0.000000077;
        var f34 = 0.0;
        var f41 = 0.772464;
        var f42 = 0.0006253;
        var f43 = 0.0000395;
        var f44 = 0.0;
        var f51 = 73.477111;
        var f52 = 0.4986678;
        var f53 = 0.0013117;
        var f54 = 0.0;
        var f61 = 19.21814;
        var f62 = 65.8;
        var f63 = -7.19;

        var g11 = 84.457994;
        var g12 = 0.6107942056;
        var g13 = 0.0003205;
        var g14 = -0.0000006;
        var g21 = 46.727364;
        var g22 = 1.4245744;
        var g23 = 0.00039082;
        var g24 = -0.000000605;
        var g31 = 0.00899704;
        var g32 = 0.00000633;
        var g33 = -0.000000002;
        var g34 = 0.0;
        var g41 = 1.779242;
        var g42 = -0.0095436;
        var g43 = -0.0000091;
        var g44 = 0.0;
        var g51 = 130.681389;
        var g52 = 1.098935;
        var g53 = 0.00024987;
        var g54 = -0.000004718;
        var g61 = 30.10957;
        var g62 = 62.2;
        var g63 = -6.87;

        let pl = [];

        pl.push(["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        var ip = 0;
        var b = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var a = this.civilDateToJulianDate(gd, gm, gy);
        var t = ((a - 2415020.0) / 36525.0) + (b / 876600.0);

        var a0 = a11;
        var a1 = a12;
        var a2 = a13;
        var a3 = a14;
        var b0 = a21;
        var b1 = a22;
        var b2 = a23;
        var b3 = a24;
        var c0 = a31;
        var c1 = a32;
        var c2 = a33;
        var c3 = a34;
        var d0 = a41;
        var d1 = a42;
        var d2 = a43;
        var d3 = a44;
        var e0 = a51;
        var e1 = a52;
        var e2 = a53;
        var e3 = a54;
        var f = a61;
        var g = a62;
        var h = a63;
        var aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        var c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Mercury",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = b11;
        a1 = b12;
        a2 = b13;
        a3 = b14;
        b0 = b21;
        b1 = b22;
        b2 = b23;
        b3 = b24;
        c0 = b31;
        c1 = b32;
        c2 = b33;
        c3 = b34;
        d0 = b41;
        d1 = b42;
        d2 = b43;
        d3 = b44;
        e0 = b51;
        e1 = b52;
        e2 = b53;
        e3 = b54;
        f = b61;
        g = b62;
        h = b63;
        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Venus",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = c11;
        a1 = c12;
        a2 = c13;
        a3 = c14;
        b0 = c21;
        b1 = c22;
        b2 = c23;
        b3 = c24;
        c0 = c31;
        c1 = c32;
        c2 = c33;
        c3 = c34;
        d0 = c41;
        d1 = c42;
        d2 = c43;
        d3 = c44;
        e0 = c51;
        e1 = c52;
        e2 = c53;
        e3 = c54;
        f = c61;
        g = c62;
        h = c63;

        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Mars",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = d11;
        a1 = d12;
        a2 = d13;
        a3 = d14;
        b0 = d21;
        b1 = d22;
        b2 = d23;
        b3 = d24;
        c0 = d31;
        c1 = d32;
        c2 = d33;
        c3 = d34;
        d0 = d41;
        d1 = d42;
        d2 = d43;
        d3 = d44;
        e0 = d51;
        e1 = d52;
        e2 = d53;
        e3 = d54;
        f = d61;
        g = d62;
        h = d63;

        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Jupiter",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = e11;
        a1 = e12;
        a2 = e13;
        a3 = e14;
        b0 = e21;
        b1 = e22;
        b2 = e23;
        b3 = e24;
        c0 = e31;
        c1 = e32;
        c2 = e33;
        c3 = e34;
        d0 = e41;
        d1 = e42;
        d2 = e43;
        d3 = e44;
        e0 = e51;
        e1 = e52;
        e2 = e53;
        e3 = e54;
        f = e61;
        g = e62;
        h = e63;

        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Saturn",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = f11;
        a1 = f12;
        a2 = f13;
        a3 = f14;
        b0 = f21;
        b1 = f22;
        b2 = f23;
        b3 = f24;
        c0 = f31;
        c1 = f32a;
        c2 = f33;
        c3 = f34;
        d0 = f41;
        d1 = f42;
        d2 = f43;
        d3 = f44;
        e0 = f51;
        e1 = f52;
        e2 = f53;
        e3 = f54;
        f = f61;
        g = f62;
        h = f63;

        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Uranus",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        a0 = g11;
        a1 = g12;
        a2 = g13;
        a3 = g14;
        b0 = g21;
        b1 = g22;
        b2 = g23;
        b3 = g24;
        c0 = g31;
        c1 = g32;
        c2 = g33;
        c3 = g34;
        d0 = g41;
        d1 = g42;
        d2 = g43;
        d3 = g44;
        e0 = g51;
        e1 = g52;
        e2 = g53;
        e3 = g54;
        f = g61;
        g = g62;
        h = g63;

        aa = a1 * t;
        b = 360.0 * (aa - Math.floor(aa));
        c = a0 + b + (a3 * t + a2) * t * t;

        pl.push(
            [
                "Neptune",
                c - 360.0 * Math.floor(c / 360.0),
                (a1 * 0.009856263) + (a2 + a3) / 36525.0,
                ((b3 * t + b2) * t + b1) * t + b0,
                ((c3 * t + c2) * t + c1) * t + c0,
                ((d3 * t + d2) * t + d1) * t + d0,
                ((e3 * t + e2) * t + e1) * t + e0,
                f,
                g,
                h,
                0.0
            ]
        );

        let checkPlanet = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99, -99];

        for (let iLoop = 0; iLoop < pl.length; iLoop++) {
            if (pl[iLoop][0] == s)
                checkPlanet = pl[iLoop];
        }

        if (checkPlanet[0] == "not found")
            return [degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0))];

        var li = 0.0;
        var ms = this.sunMeanAnomaly(lh, lm, ls, ds, zc, dy, mn, yr);
        var sr = paUtils.degreesToRadians(this.sunLong(lh, lm, ls, ds, zc, dy, mn, yr));
        var re = this.sunDist(lh, lm, ls, ds, zc, dy, mn, yr);
        var lg = sr + Math.PI;

        var l0 = 0.0;
        var s0 = 0.0;
        var p0 = 0.0;
        var vo = 0.0;
        var lp1 = 0.0;
        var ll = 0.0;
        var rd = 0.0;
        var pd = 0.0;
        var sp = 0.0;
        var ci = 0.0;

        for (let k = 1; k <= 3; k++) {
            for (let iLoop = 0; iLoop < pl.length; iLoop++) {
                pl[iLoop][10] = paUtils.degreesToRadians(Number(pl[iLoop][1]) - Number(pl[iLoop][3]) - li * Number(pl[iLoop][2]));
            }

            var qa = 0.0;
            var qb = 0.0;
            var qc = 0.0;
            var qd = 0.0;
            var qe = 0.0;
            var qf = 0.0;
            var qg = 0.0;
            var sa = 0.0;
            var ca = 0.0;

            if (s == "Mercury")
                [qa, qb] = planetLong_L4685(pl);

            if (s == "Venus")
                [qa, qb, qc, qe] = planetLong_L4735(pl, ms, t);

            if (s == "Mars") {
                [a, sa, ca, qc, qe, qa, qb] = planetLong_L4810(pl, ms);
            }

            let matchPlanet = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99, -99];
            for (let iLoop = 0; iLoop < pl.length; iLoop++) {
                if (pl[iLoop][0] == s)
                    matchPlanet = pl[iLoop];
            }

            if (s == "Jupiter" || s == "Saturn" || s == "Uranus" || s == "Neptune")
                [qa, qb, qc, qd, qe, qf, qg] = this.planetLong_L4945(t, matchPlanet);

            var ec = Number(matchPlanet[4]) + qd;
            var am = Number(matchPlanet[10]) + qe;
            var at = this.trueAnomaly(am, ec);
            var pvv = (Number(matchPlanet[7]) + qf) * (1.0 - ec * ec) / (1.0 + ec * Math.cos(at));
            var lp = this.degrees(at) + Number(matchPlanet[3]) + this.degrees(qc - qe);
            lp = paUtils.degreesToRadians(lp);
            var om = paUtils.degreesToRadians(matchPlanet[6]);
            var lo = lp - om;
            var so = Math.sin(lo);
            var co = Math.cos(lo);
            var inn = paUtils.degreesToRadians(matchPlanet[5]);
            pvv = pvv + qb;
            sp = so * Math.sin(inn);
            var y = so * Math.cos(inn);
            var ps = Math.asin(sp) + qg;
            sp = Math.sin(ps);
            pd = Math.atan2(y, co) + om + paUtils.degreesToRadians(qa);
            pd = this.unwind(pd);
            ci = Math.cos(ps);
            rd = pvv * ci;
            ll = pd - lg;
            var rh = re * re + pvv * pvv - 2.0 * re * pvv * ci * Math.cos(ll);
            rh = Math.sqrt(rh);
            li = rh * 0.005775518;

            if (k == 1) {
                l0 = pd;
                s0 = ps;
                p0 = pvv;
                vo = rh;
                lp1 = lp;
            }
        }

        var l1 = Math.sin(ll);
        var l2 = Math.cos(ll);

        var ep = (ip < 3) ? Math.atan(-1.0 * rd * l1 / (re - rd * l2)) + lg + Math.PI : Math.atan(re * l1 / (rd - re * l2)) + pd;
        ep = this.unwind(ep);

        var bp = Math.atan(rd * sp * Math.sin(ep - pd) / (ci * re * l1));

        var planetLongitude = this.degrees(this.unwind(ep));
        var planetLatitude = this.degrees(this.unwind(bp));
        var planetDistanceAU = vo;
        var planetHLong1 = this.degrees(lp1);
        var planetHLong2 = this.degrees(l0);
        var planetHLat = this.degrees(s0);
        var planetRVect = p0;

        return [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect];
    }

    /**
     * Helper function for planet_long_lat()
     */
    static planetLong_L4685(pl) {
        var qa = 0.00204 * Math.cos(5.0 * pl[2][10] - 2.0 * pl[1][10] + 0.21328);
        qa = qa + 0.00103 * Math.cos(2.0 * pl[2][10] - pl[1][10] - 2.8046);
        qa = qa + 0.00091 * Math.cos(2.0 * pl[4][10] - pl[1][10] - 0.64582);
        qa = qa + 0.00078 * Math.cos(5.0 * pl[2][10] - 3.0 * pl[1][10] + 0.17692);

        var qb = 0.000007525 * Math.cos(2.0 * pl[4][10] - pl[1][10] + 0.925251);
        qb = qb + 0.000006802 * Math.cos(5.0 * pl[2][10] - 3.0 * pl[1][10] - 4.53642);
        qb = qb + 0.000005457 * Math.cos(2.0 * pl[2][10] - 2.0 * pl[1][10] - 1.24246);
        qb = qb + 0.000003569 * Math.cos(5.0 * pl[2][10] - pl[1][10] - 1.35699);

        return [qa, qb];
    }

    /**
     * Helper function for planet_long_lat()
     */
    static planetLong_L4735(pl, ms, t) {
        var qc = 0.00077 * Math.sin(4.1406 + t * 2.6227);
        qc = paUtils.degreesToRadians(qc);
        var qe = qc;

        var qa = 0.00313 * Math.cos(2.0 * ms - 2.0 * pl[2][10] - 2.587);
        qa = qa + 0.00198 * Math.cos(3.0 * ms - 3.0 * pl[2][10] + 0.044768);
        qa = qa + 0.00136 * Math.cos(ms - pl[2][10] - 2.0788);
        qa = qa + 0.00096 * Math.cos(3.0 * ms - 2.0 * pl[2][10] - 2.3721);
        qa = qa + 0.00082 * Math.cos(pl[4][10] - pl[2][10] - 3.6318);

        var qb = 0.000022501 * Math.cos(2.0 * ms - 2.0 * pl[2][10] - 1.01592);
        qb = qb + 0.000019045 * Math.cos(3.0 * ms - 3.0 * pl[2][10] + 1.61577);
        qb = qb + 0.000006887 * Math.cos(pl[4][10] - pl[2][10] - 2.06106);
        qb = qb + 0.000005172 * Math.cos(ms - pl[2][10] - 0.508065);
        qb = qb + 0.00000362 * Math.cos(5.0 * ms - 4.0 * pl[2][10] - 1.81877);
        qb = qb + 0.000003283 * Math.cos(4.0 * ms - 4.0 * pl[2][10] + 1.10851);
        qb = qb + 0.000003074 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[2][10] - 0.962846);

        return [qa, qb, qc, qe];
    }

    /**
     * Helper function for planet_long_lat()
     */
    static planetLong_L4810(pl, ms) {
        var a = 3.0 * pl[4][10] - 8.0 * pl[3][10] + 4.0 * ms;
        var sa = Math.sin(a);
        var ca = Math.cos(a);
        var qc = -(0.01133 * sa + 0.00933 * ca);
        qc = paUtils.degreesToRadians(qc);
        var qe = qc;

        var qa = 0.00705 * Math.cos(pl[4][10] - pl[3][10] - 0.85448);
        qa = qa + 0.00607 * Math.cos(2.0 * pl[4][10] - pl[3][10] - 3.2873);
        qa = qa + 0.00445 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[3][10] - 3.3492);
        qa = qa + 0.00388 * Math.cos(ms - 2.0 * pl[3][10] + 0.35771);
        qa = qa + 0.00238 * Math.cos(ms - pl[3][10] + 0.61256);
        qa = qa + 0.00204 * Math.cos(2.0 * ms - 3.0 * pl[3][10] + 2.7688);
        qa = qa + 0.00177 * Math.cos(3.0 * pl[3][10] - pl[2][10] - 1.0053);
        qa = qa + 0.00136 * Math.cos(2.0 * ms - 4.0 * pl[3][10] + 2.6894);
        qa = qa + 0.00104 * (pl[4][10] + 0.30749);

        var qb = 0.000053227 * Math.cos(pl[4][10] - pl[3][10] + 0.717864);
        qb = qb + 0.000050989 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[3][10] - 1.77997);
        qb = qb + 0.000038278 * Math.cos(2.0 * pl[4][10] - pl[3][10] - 1.71617);
        qb = qb + 0.000015996 * Math.cos(ms - pl[3][10] - 0.969618);
        qb = qb + 0.000014764 * Math.cos(2.0 * ms - 3.0 * pl[3][10] + 1.19768);
        qb = qb + 0.000008966 * Math.cos(pl[4][10] - 2.0 * pl[3][10] + 0.761225);
        qb = qb + 0.000007914 * Math.cos(3.0 * pl[4][10] - 2.0 * pl[3][10] - 2.43887);
        qb = qb + 0.000007004 * Math.cos(2.0 * pl[4][10] - 3.0 * pl[3][10] - 1.79573);
        qb = qb + 0.00000662 * Math.cos(ms - 2.0 * pl[3][10] + 1.97575);
        qb = qb + 0.00000493 * Math.cos(3.0 * pl[4][10] - 3.0 * pl[3][10] - 1.33069);
        qb = qb + 0.000004693 * Math.cos(3.0 * ms - 5.0 * pl[3][10] + 3.32665);
        qb = qb + 0.000004571 * Math.cos(2.0 * ms - 4.0 * pl[3][10] + 4.27086);
        qb = qb + 0.000004409 * Math.cos(3.0 * pl[4][10] - pl[3][10] - 2.02158);

        return [a, sa, ca, qc, qe, qa, qb];
    }

    /**
     * Helper function for planet_long_lat()
     */
    static planetLong_L4945(t, planet) {
        var qa = 0.0;
        var qb = 0.0;
        var qc = 0.0;
        var qd = 0.0;
        var qe = 0.0;
        var qf = 0.0;
        var qg = 0.0;
        var vk = 0.0;
        var ja = 0.0;
        var jb = 0.0;
        var jc = 0.0;

        var j1 = t / 5.0 + 0.1;
        var j2 = this.unwind(4.14473 + 52.9691 * t);
        var j3 = this.unwind(4.641118 + 21.32991 * t);
        var j4 = this.unwind(4.250177 + 7.478172 * t);
        var j5 = 5.0 * j3 - 2.0 * j2;
        var j6 = 2.0 * j2 - 6.0 * j3 + 3.0 * j4;

        if (planet[0] == "Mercury" || planet[0] == "Venus" || planet[0] == "Mars")
            return [qa, qb, qc, qd, qe, qf, qg];

        if (planet[0] == "Jupiter" || planet[0] == "Saturn") {
            var j7 = j3 - j2;
            var u1 = Math.sin(j3);
            var u2 = Math.cos(j3);
            var u3 = Math.sin(2.0 * j3);
            var u4 = Math.cos(2.0 * j3);
            var u5 = Math.sin(j5);
            var u6 = Math.cos(j5);
            var u7 = Math.sin(2.0 * j5);
            var u8a = Math.sin(j6);
            var u9 = Math.sin(j7);
            var ua = Math.cos(j7);
            var ub = Math.sin(2.0 * j7);
            var uc = Math.cos(2.0 * j7);
            var ud = Math.sin(3.0 * j7);
            var ue = Math.cos(3.0 * j7);
            var uf = Math.sin(4.0 * j7);
            var ug = Math.cos(4.0 * j7);
            var vh = Math.cos(5.0 * j7);

            if (planet[0] == "Saturn") {
                var ui = Math.sin(3.0 * j3);
                var uj = Math.cos(3.0 * j3);
                var uk = Math.sin(4.0 * j3);
                var ul = Math.cos(4.0 * j3);
                var vi = Math.cos(2.0 * j5);
                var un = Math.sin(5.0 * j7);
                var j8 = j4 - j3;
                var uo = Math.sin(2.0 * j8);
                var up = Math.cos(2.0 * j8);
                var uq = Math.sin(3.0 * j8);
                var ur = Math.cos(3.0 * j8);

                qc = 0.007581 * u7 - 0.007986 * u8a - 0.148811 * u9;
                qc = qc - (0.814181 - (0.01815 - 0.016714 * j1) * j1) * u5;
                qc = qc - (0.010497 - (0.160906 - 0.0041 * j1) * j1) * u6;
                qc = qc - 0.015208 * ud - 0.006339 * uf - 0.006244 * u1;
                qc = qc - 0.0165 * ub * u1 - 0.040786 * ub;
                qc = qc + (0.008931 + 0.002728 * j1) * u9 * u1 - 0.005775 * ud * u1;
                qc = qc + (0.081344 + 0.003206 * j1) * ua * u1 + 0.015019 * uc * u1;
                qc = qc + (0.085581 + 0.002494 * j1) * u9 * u2 + 0.014394 * uc * u2;
                qc = qc + (0.025328 - 0.003117 * j1) * ua * u2 + 0.006319 * ue * u2;
                qc = qc + 0.006369 * u9 * u3 + 0.009156 * ub * u3 + 0.007525 * uq * u3;
                qc = qc - 0.005236 * ua * u4 - 0.007736 * uc * u4 - 0.007528 * ur * u4;
                qc = paUtils.degreesToRadians(qc);

                qd = (-7927.0 + (2548.0 + 91.0 * j1) * j1) * u5;
                qd = qd + (13381.0 + (1226.0 - 253.0 * j1) * j1) * u6 + (248.0 - 121.0 * j1) * u7;
                qd = qd - (305.0 + 91.0 * j1) * vi + 412.0 * ub + 12415.0 * u1;
                qd = qd + (390.0 - 617.0 * j1) * u9 * u1 + (165.0 - 204.0 * j1) * ub * u1;
                qd = qd + 26599.0 * ua * u1 - 4687.0 * uc * u1 - 1870.0 * ue * u1 - 821.0 * ug * u1;
                qd = qd - 377.0 * vh * u1 + 497.0 * up * u1 + (163.0 - 611.0 * j1) * u2;
                qd = qd - 12696.0 * u9 * u2 - 4200.0 * ub * u2 - 1503.0 * ud * u2 - 619.0 * uf * u2;
                qd = qd - 268.0 * un * u2 - (282.0 + 1306.0 * j1) * ua * u2;
                qd = qd + (-86.0 + 230.0 * j1) * uc * u2 + 461.0 * uo * u2 - 350.0 * u3;
                qd = qd + (2211.0 - 286.0 * j1) * u9 * u3 - 2208.0 * ub * u3 - 568.0 * ud * u3;
                qd = qd - 346.0 * uf * u3 - (2780.0 + 222.0 * j1) * ua * u3;
                qd = qd + (2022.0 + 263.0 * j1) * uc * u3 + 248.0 * ue * u3 + 242.0 * uq * u3;
                qd = qd + 467.0 * ur * u3 - 490.0 * u4 - (2842.0 + 279.0 * j1) * u9 * u4;
                qd = qd + (128.0 + 226.0 * j1) * ub * u4 + 224.0 * ud * u4;
                qd = qd + (-1594.0 + 282.0 * j1) * ua * u4 + (2162.0 - 207.0 * j1) * uc * u4;
                qd = qd + 561.0 * ue * u4 + 343.0 * ug * u4 + 469.0 * uq * u4 - 242.0 * ur * u4;
                qd = qd - 205.0 * u9 * ui + 262.0 * ud * ui + 208.0 * ua * uj - 271.0 * ue * uj;
                qd = qd - 382.0 * ue * uk - 376.0 * ud * ul;
                qd = qd * 0.0000001;

                vk = (0.077108 + (0.007186 - 0.001533 * j1) * j1) * u5;
                vk = vk - 0.007075 * u9;
                vk = vk + (0.045803 - (0.014766 + 0.000536 * j1) * j1) * u6;
                vk = vk - 0.072586 * u2 - 0.075825 * u9 * u1 - 0.024839 * ub * u1;
                vk = vk - 0.008631 * ud * u1 - 0.150383 * ua * u2;
                vk = vk + 0.026897 * uc * u2 + 0.010053 * ue * u2;
                vk = vk - (0.013597 + 0.001719 * j1) * u9 * u3 + 0.011981 * ub * u4;
                vk = vk - (0.007742 - 0.001517 * j1) * ua * u3;
                vk = vk + (0.013586 - 0.001375 * j1) * uc * u3;
                vk = vk - (0.013667 - 0.001239 * j1) * u9 * u4;
                vk = vk + (0.014861 + 0.001136 * j1) * ua * u4;
                vk = vk - (0.013064 + 0.001628 * j1) * uc * u4;
                qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

                qf = 572.0 * u5 - 1590.0 * ub * u2 + 2933.0 * u6 - 647.0 * ud * u2;
                qf = qf + 33629.0 * ua - 344.0 * uf * u2 - 3081.0 * uc + 2885.0 * ua * u2;
                qf = qf - 1423.0 * ue + (2172.0 + 102.0 * j1) * uc * u2 - 671.0 * ug;
                qf = qf + 296.0 * ue * u2 - 320.0 * vh - 267.0 * ub * u3 + 1098.0 * u1;
                qf = qf - 778.0 * ua * u3 - 2812.0 * u9 * u1 + 495.0 * uc * u3 + 688.0 * ub * u1;
                qf = qf + 250.0 * ue * u3 - 393.0 * ud * u1 - 856.0 * u9 * u4 - 228.0 * uf * u1;
                qf = qf + 441.0 * ub * u4 + 2138.0 * ua * u1 + 296.0 * uc * u4 - 999.0 * uc * u1;
                qf = qf + 211.0 * ue * u4 - 642.0 * ue * u1 - 427.0 * u9 * ui - 325.0 * ug * u1;
                qf = qf + 398.0 * ud * ui - 890.0 * u2 + 344.0 * ua * uj + 2206.0 * u9 * u2;
                qf = qf - 427.0 * ue * uj;
                qf = qf * 0.000001;

                qg = 0.000747 * ua * u1 + 0.001069 * ua * u2 + 0.002108 * ub * u3;
                qg = qg + 0.001261 * uc * u3 + 0.001236 * ub * u4 - 0.002075 * uc * u4;
                qg = paUtils.degreesToRadians(qg);

                return [qa, qb, qc, qd, qe, qf, qg];
            }

            qc = (0.331364 - (0.010281 + 0.004692 * j1) * j1) * u5;
            qc = qc + (0.003228 - (0.064436 - 0.002075 * j1) * j1) * u6;
            qc = qc - (0.003083 + (0.000275 - 0.000489 * j1) * j1) * u7;
            qc = qc + 0.002472 * u8a + 0.013619 * u9 + 0.018472 * ub;
            qc = qc + 0.006717 * ud + 0.002775 * uf + 0.006417 * ub * u1;
            qc = qc + (0.007275 - 0.001253 * j1) * u9 * u1 + 0.002439 * ud * u1;
            qc = qc - (0.035681 + 0.001208 * j1) * u9 * u2 - 0.003767 * uc * u1;
            qc = qc - (0.033839 + 0.001125 * j1) * ua * u1 - 0.004261 * ub * u2;
            qc = qc + (0.001161 * j1 - 0.006333) * ua * u2 + 0.002178 * u2;
            qc = qc - 0.006675 * uc * u2 - 0.002664 * ue * u2 - 0.002572 * u9 * u3;
            qc = qc - 0.003567 * ub * u3 + 0.002094 * ua * u4 + 0.003342 * uc * u4;
            qc = paUtils.degreesToRadians(qc);

            qd = (3606.0 + (130.0 - 43.0 * j1) * j1) * u5 + (1289.0 - 580.0 * j1) * u6;
            qd = qd - 6764.0 * u9 * u1 - 1110.0 * ub * u1 - 224.0 * ud * u1 - 204.0 * u1;
            qd = qd + (1284.0 + 116.0 * j1) * ua * u1 + 188.0 * uc * u1;
            qd = qd + (1460.0 + 130.0 * j1) * u9 * u2 + 224.0 * ub * u2 - 817.0 * u2;
            qd = qd + 6074.0 * u2 * ua + 992.0 * uc * u2 + 508.0 * ue * u2 + 230.0 * ug * u2;
            qd = qd + 108.0 * vh * u2 - (956.0 + 73.0 * j1) * u9 * u3 + 448.0 * ub * u3;
            qd = qd + 137.0 * ud * u3 + (108.0 * j1 - 997.0) * ua * u3 + 480.0 * uc * u3;
            qd = qd + 148.0 * ue * u3 + (99.0 * j1 - 956.0) * u9 * u4 + 490.0 * ub * u4;
            qd = qd + 158.0 * ud * u4 + 179.0 * u4 + (1024.0 + 75.0 * j1) * ua * u4;
            qd = qd - 437.0 * uc * u4 - 132.0 * ue * u4;
            qd = qd * 0.0000001;

            vk = (0.007192 - 0.003147 * j1) * u5 - 0.004344 * u1;
            vk = vk + (j1 * (0.000197 * j1 - 0.000675) - 0.020428) * u6;
            vk = vk + 0.034036 * ua * u1 + (0.007269 + 0.000672 * j1) * u9 * u1;
            vk = vk + 0.005614 * uc * u1 + 0.002964 * ue * u1 + 0.037761 * u9 * u2;
            vk = vk + 0.006158 * ub * u2 - 0.006603 * ua * u2 - 0.005356 * u9 * u3;
            vk = vk + 0.002722 * ub * u3 + 0.004483 * ua * u3;
            vk = vk - 0.002642 * uc * u3 + 0.004403 * u9 * u4;
            vk = vk - 0.002536 * ub * u4 + 0.005547 * ua * u4 - 0.002689 * uc * u4;
            qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

            qf = 205.0 * ua - 263.0 * u6 + 693.0 * uc + 312.0 * ue + 147.0 * ug + 299.0 * u9 * u1;
            qf = qf + 181.0 * uc * u1 + 204.0 * ub * u2 + 111.0 * ud * u2 - 337.0 * ua * u2;
            qf = qf - 111.0 * uc * u2;
            qf = qf * 0.000001;

            return [qa, qb, qc, qd, qe, qf, qg];
        }

        if (planet[0] == "Uranus" || planet[0] == "Neptune") {
            var j8 = unwind(1.46205 + 3.81337 * t);
            var j9 = 2.0 * j8 - j4;
            var vj = Math.sin(j9);
            var uu = Math.cos(j9);
            var uv = Math.sin(2.0 * j9);
            var uw = Math.cos(2.0 * j9);

            if (planet[0] == "Neptune") {
                ja = j8 - j2;
                jb = j8 - j3;
                jc = j8 - j4;
                qc = (0.001089 * j1 - 0.589833) * vj;
                qc = qc + (0.004658 * j1 - 0.056094) * uu - 0.024286 * uv;
                qc = paUtils.degreesToRadians(qc);

                vk = 0.024039 * vj - 0.025303 * uu + 0.006206 * uv;
                vk = vk - 0.005992 * uw;
                qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

                qd = 4389.0 * vj + 1129.0 * uv + 4262.0 * uu + 1089.0 * uw;
                qd = qd * 0.0000001;

                qf = 8189.0 * uu - 817.0 * vj + 781.0 * uw;
                qf = qf * 0.000001;

                var vd = Math.sin(2.0 * jc);
                var ve = Math.cos(2.0 * jc);
                var vf = Math.sin(j8);
                var vg = Math.cos(j8);
                qa = -0.009556 * Math.sin(ja) - 0.005178 * Math.sin(jb);
                qa = qa + 0.002572 * vd - 0.002972 * ve * vf - 0.002833 * vd * vg;

                qg = 0.000336 * ve * vf + 0.000364 * vd * vg;
                qg = paUtils.degreesToRadians(qg);

                qb = -40596.0 + 4992.0 * Math.cos(ja) + 2744.0 * Math.cos(jb);
                qb = qb + 2044.0 * Math.cos(jc) + 1051.0 * ve;
                qb = qb * 0.000001;

                return [qa, qb, qc, qd, qe, qf, qg];
            }

            ja = j4 - j2;
            jb = j4 - j3;
            jc = j8 - j4;
            qc = (0.864319 - 0.001583 * j1) * vj;
            qc = qc + (0.082222 - 0.006833 * j1) * uu + 0.036017 * uv;
            qc = qc - 0.003019 * uw + 0.008122 * Math.sin(j6);
            qc = paUtils.degreesToRadians(qc);

            vk = 0.120303 * vj + 0.006197 * uv;
            vk = vk + (0.019472 - 0.000947 * j1) * uu;
            qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

            qd = (163.0 * j1 - 3349.0) * vj + 20981.0 * uu + 1311.0 * uw;
            qd = qd * 0.0000001;

            qf = -0.003825 * uu;

            qa = (-0.038581 + (0.002031 - 0.00191 * j1) * j1) * Math.cos(j4 + jb);
            qa = qa + (0.010122 - 0.000988 * j1) * Math.sin(j4 + jb);
            var a = (0.034964 - (0.001038 - 0.000868 * j1) * j1) * Math.cos(2.0 * j4 + jb);
            qa = a + qa + 0.005594 * Math.sin(j4 + 3.0 * jc) - 0.014808 * Math.sin(ja);
            qa = qa - 0.005794 * Math.sin(jb) + 0.002347 * Math.cos(jb);
            qa = qa + 0.009872 * Math.sin(jc) + 0.008803 * Math.sin(2.0 * jc);
            qa = qa - 0.004308 * Math.sin(3.0 * jc);

            var ux = Math.sin(jb);
            var uy = Math.cos(jb);
            var uz = Math.sin(j4);
            var va = Math.cos(j4);
            var vb = Math.sin(2.0 * j4);
            var vc = Math.cos(2.0 * j4);
            qg = (0.000458 * ux - 0.000642 * uy - 0.000517 * Math.cos(4.0 * jc)) * uz;
            qg = qg - (0.000347 * ux + 0.000853 * uy + 0.000517 * Math.sin(4.0 * jb)) * va;
            qg = qg + 0.000403 * (Math.cos(2.0 * jc) * vb + Math.sin(2.0 * jc) * vc);
            qg = paUtils.degreesToRadians(qg);

            qb = -25948.0 + 4985.0 * Math.cos(ja) - 1230.0 * va + 3354.0 * uy;
            qb = qb + 904.0 * Math.cos(2.0 * jc) + 894.0 * (Math.cos(jc) - Math.cos(3.0 * jc));
            qb = qb + (5795.0 * va - 1165.0 * uz + 1388.0 * vc) * ux;
            qb = qb + (1351.0 * va + 5702.0 * uz + 1388.0 * vb) * uy;
            qb = qb * 0.000001;

            return [qa, qb, qc, qd, qe, qf, qg];
        }

        return [qa, qb, qc, qd, qe, qf, qg];
    }

    /**
     * For W, in radians, return S, also in radians.
     * 
     * Original macro name: SolveCubic
     */
    static solveCubic(w) {
        var s = w / 3.0;

        while (1 == 1) {
            var s2 = s * s;
            var d = (s2 + 3.0) * s - w;

            if (Math.abs(d) < 0.000001) {
                return s;
            }

            s = ((2.0 * s * s2) + w) / (3.0 * (s2 + 1.0));
        }
    }

    /**
     * Calculate longitude, latitude, and distance of parabolic-orbit comet.
     * 
     * Original macro names: PcometLong, PcometLat, PcometDist
     */
    static pCometLongLatDist(lh, lm, ls, ds, zc, dy, mn, yr, td, tm, ty, q, i, p, n) {
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var ut = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var tpe = (ut / 365.242191) + this.civilDateToJulianDate(gd, gm, gy) - this.civilDateToJulianDate(td, tm, ty);
        var lg = paUtils.degreesToRadians(this.sunLong(lh, lm, ls, ds, zc, dy, mn, yr) + 180.0);
        var re = this.sunDist(lh, lm, ls, ds, zc, dy, mn, yr);

        var rh2 = 0.0;
        var rd = 0.0;
        var s3 = 0.0;
        var c3 = 0.0;
        var lc = 0.0;
        var s2 = 0.0;
        var c2 = 0.0;

        for (let k = 1; k < 3; k++) {
            var s = this.solveCubic(0.0364911624 * tpe / (q * Math.sqrt(q)));
            s = Number(s);
            var nu = 2.0 * Math.atan(s);
            var r = q * (1.0 + s * s);
            var l = nu + paUtils.degreesToRadians(p);
            var s1 = Math.sin(l);
            var c1 = Math.cos(l);
            var i1 = paUtils.degreesToRadians(i);
            s2 = s1 * Math.sin(i1);
            var ps = Math.asin(s2);
            var y = s1 * Math.cos(i1);
            lc = Math.atan2(y, c1) + paUtils.degreesToRadians(n);
            c2 = Math.cos(ps);
            rd = r * c2;
            var ll = lc - lg;
            c3 = Math.cos(ll);
            s3 = Math.sin(ll);
            var rh = Math.sqrt((re * re) + (r * r) - (2.0 * re * rd * c3 * Math.cos(ps)));
            if (k == 1) {
                rh2 = Math.sqrt((re * re) + (r * r) - (2.0 * re * r * Math.cos(ps) * Math.cos(l + paUtils.degreesToRadians(n) - lg)));
            }
        }

        var ep;

        ep = (rd < re) ? Math.atan((-rd * s3) / (re - (rd * c3))) + lg + 3.141592654 : Math.atan((re * s3) / (rd - (re * c3))) + lc;
        ep = this.unwind(ep);

        var tb = (rd * s2 * Math.sin(ep - lc)) / (c2 * re * s3);
        var bp = Math.atan(tb);

        var cometLongDeg = this.degrees(ep);
        var cometLatDeg = this.degrees(bp);
        var cometDistAU = rh2;

        return [cometLongDeg, cometLatDeg, cometDistAU];
    }

    /**
     * Calculate longitude, latitude, and horizontal parallax of the Moon.
     * 
     * Original macro names: MoonLong, MoonLat, MoonHP
     */
    static moonLongLatHP(lh, lm, ls, ds, zc, dy, mn, yr) {
        var ut = this.localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = this.localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = this.localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = this.localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var t = ((this.civilDateToJulianDate(gd, gm, gy) - 2415020.0) / 36525.0) + (ut / 876600.0);
        var t2 = t * t;

        var m1 = 27.32158213;
        var m2 = 365.2596407;
        var m3 = 27.55455094;
        var m4 = 29.53058868;
        var m5 = 27.21222039;
        var m6 = 6798.363307;
        var q = this.civilDateToJulianDate(gd, gm, gy) - 2415020.0 + (ut / 24.0);
        m1 = q / m1;
        m2 = q / m2;
        m3 = q / m3;
        m4 = q / m4;
        m5 = q / m5;
        m6 = q / m6;
        m1 = 360.0 * (m1 - Math.floor(m1));
        m2 = 360.0 * (m2 - Math.floor(m2));
        m3 = 360.0 * (m3 - Math.floor(m3));
        m4 = 360.0 * (m4 - Math.floor(m4));
        m5 = 360.0 * (m5 - Math.floor(m5));
        m6 = 360.0 * (m6 - Math.floor(m6));

        var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
        var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
        var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
        var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
        var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
        var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
        var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
        var s1 = Math.sin(a);
        var s2 = Math.sin(paUtils.degreesToRadians(na));
        var b = 346.56 + (132.87 - 0.0091731 * t) * t;
        var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
        var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
        var s4 = Math.sin(c);
        ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
        ms = ms - 0.001778 * s1;
        md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
        mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
        me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
        var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
        var e2 = e * e;
        ml = paUtils.degreesToRadians(ml);
        ms = paUtils.degreesToRadians(ms);
        na = paUtils.degreesToRadians(na);
        me1 = paUtils.degreesToRadians(me1);
        mf = paUtils.degreesToRadians(mf);
        md = paUtils.degreesToRadians(md);

        // Longitude-specific
        var l = 6.28875 * Math.sin(md) + 1.274018 * Math.sin(2.0 * me1 - md);
        l = l + 0.658309 * Math.sin(2.0 * me1) + 0.213616 * Math.sin(2.0 * md);
        l = l - e * 0.185596 * Math.sin(ms) - 0.114336 * Math.sin(2.0 * mf);
        l = l + 0.058793 * Math.sin(2.0 * (me1 - md));
        l = l + 0.057212 * e * Math.sin(2.0 * me1 - ms - md) + 0.05332 * Math.sin(2.0 * me1 + md);
        l = l + 0.045874 * e * Math.sin(2.0 * me1 - ms) + 0.041024 * e * Math.sin(md - ms);
        l = l - 0.034718 * Math.sin(me1) - e * 0.030465 * Math.sin(ms + md);
        l = l + 0.015326 * Math.sin(2.0 * (me1 - mf)) - 0.012528 * Math.sin(2.0 * mf + md);
        l = l - 0.01098 * Math.sin(2.0 * mf - md) + 0.010674 * Math.sin(4.0 * me1 - md);
        l = l + 0.010034 * Math.sin(3.0 * md) + 0.008548 * Math.sin(4.0 * me1 - 2.0 * md);
        l = l - e * 0.00791 * Math.sin(ms - md + 2.0 * me1) - e * 0.006783 * Math.sin(2.0 * me1 + ms);
        l = l + 0.005162 * Math.sin(md - me1) + e * 0.005 * Math.sin(ms + me1);
        l = l + 0.003862 * Math.sin(4.0 * me1) + e * 0.004049 * Math.sin(md - ms + 2.0 * me1);
        l = l + 0.003996 * Math.sin(2.0 * (md + me1)) + 0.003665 * Math.sin(2.0 * me1 - 3.0 * md);
        l = l + e * 0.002695 * Math.sin(2.0 * md - ms) + 0.002602 * Math.sin(md - 2.0 * (mf + me1));
        l = l + e * 0.002396 * Math.sin(2.0 * (me1 - md) - ms) - 0.002349 * Math.sin(md + me1);
        l = l + e2 * 0.002249 * Math.sin(2.0 * (me1 - ms)) - e * 0.002125 * Math.sin(2.0 * md + ms);
        l = l - e2 * 0.002079 * Math.sin(2.0 * ms) + e2 * 0.002059 * Math.sin(2.0 * (me1 - ms) - md);
        l = l - 0.001773 * Math.sin(md + 2.0 * (me1 - mf)) - 0.001595 * Math.sin(2.0 * (mf + me1));
        l = l + e * 0.00122 * Math.sin(4.0 * me1 - ms - md) - 0.00111 * Math.sin(2.0 * (md + mf));
        l = l + 0.000892 * Math.sin(md - 3.0 * me1) - e * 0.000811 * Math.sin(ms + md + 2.0 * me1);
        l = l + e * 0.000761 * Math.sin(4.0 * me1 - ms - 2.0 * md);
        l = l + e2 * 0.000704 * Math.sin(md - 2.0 * (ms + me1));
        l = l + e * 0.000693 * Math.sin(ms - 2.0 * (md - me1));
        l = l + e * 0.000598 * Math.sin(2.0 * (me1 - mf) - ms);
        l = l + 0.00055 * Math.sin(md + 4.0 * me1) + 0.000538 * Math.sin(4.0 * md);
        l = l + e * 0.000521 * Math.sin(4.0 * me1 - ms) + 0.000486 * Math.sin(2.0 * md - me1);
        l = l + e2 * 0.000717 * Math.sin(md - 2.0 * ms);
        var mm = this.unwind(ml + paUtils.degreesToRadians(l));


        // Latitude-specific
        var g = 5.128189 * Math.sin(mf) + 0.280606 * Math.sin(md + mf);
        g = g + 0.277693 * Math.sin(md - mf) + 0.173238 * Math.sin(2.0 * me1 - mf);
        g = g + 0.055413 * Math.sin(2.0 * me1 + mf - md) + 0.046272 * Math.sin(2.0 * me1 - mf - md);
        g = g + 0.032573 * Math.sin(2.0 * me1 + mf) + 0.017198 * Math.sin(2.0 * md + mf);
        g = g + 0.009267 * Math.sin(2.0 * me1 + md - mf) + 0.008823 * Math.sin(2.0 * md - mf);
        g = g + e * 0.008247 * Math.sin(2.0 * me1 - ms - mf) + 0.004323 * Math.sin(2.0 * (me1 - md) - mf);
        g = g + 0.0042 * Math.sin(2.0 * me1 + mf + md) + e * 0.003372 * Math.sin(mf - ms - 2.0 * me1);
        g = g + e * 0.002472 * Math.sin(2.0 * me1 + mf - ms - md);
        g = g + e * 0.002222 * Math.sin(2.0 * me1 + mf - ms);
        g = g + e * 0.002072 * Math.sin(2.0 * me1 - mf - ms - md);
        g = g + e * 0.001877 * Math.sin(mf - ms + md) + 0.001828 * Math.sin(4.0 * me1 - mf - md);
        g = g - e * 0.001803 * Math.sin(mf + ms) - 0.00175 * Math.sin(3.0 * mf);
        g = g + e * 0.00157 * Math.sin(md - ms - mf) - 0.001487 * Math.sin(mf + me1);
        g = g - e * 0.001481 * Math.sin(mf + ms + md) + e * 0.001417 * Math.sin(mf - ms - md);
        g = g + e * 0.00135 * Math.sin(mf - ms) + 0.00133 * Math.sin(mf - me1);
        g = g + 0.001106 * Math.sin(mf + 3.0 * md) + 0.00102 * Math.sin(4.0 * me1 - mf);
        g = g + 0.000833 * Math.sin(mf + 4.0 * me1 - md) + 0.000781 * Math.sin(md - 3.0 * mf);
        g = g + 0.00067 * Math.sin(mf + 4.0 * me1 - 2.0 * md) + 0.000606 * Math.sin(2.0 * me1 - 3.0 * mf);
        g = g + 0.000597 * Math.sin(2.0 * (me1 + md) - mf);
        g = g + e * 0.000492 * Math.sin(2.0 * me1 + md - ms - mf) + 0.00045 * Math.sin(2.0 * (md - me1) - mf);
        g = g + 0.000439 * Math.sin(3.0 * md - mf) + 0.000423 * Math.sin(mf + 2.0 * (me1 + md));
        g = g + 0.000422 * Math.sin(2.0 * me1 - mf - 3.0 * md) - e * 0.000367 * Math.sin(ms + mf + 2.0 * me1 - md);
        g = g - e * 0.000353 * Math.sin(ms + mf + 2.0 * me1) + 0.000331 * Math.sin(mf + 4.0 * me1);
        g = g + e * 0.000317 * Math.sin(2.0 * me1 + mf - ms + md);
        g = g + e2 * 0.000306 * Math.sin(2.0 * (me1 - ms) - mf) - 0.000283 * Math.sin(md + 3.0 * mf);
        var w1 = 0.0004664 * Math.cos(na);
        var w2 = 0.0000754 * Math.cos(c);
        var bm = paUtils.degreesToRadians(g) * (1.0 - w1 - w2);

        // Horizontal parallax-specific
        var pm = 0.950724 + 0.051818 * Math.cos(md) + 0.009531 * Math.cos(2.0 * me1 - md);
        pm = pm + 0.007843 * Math.cos(2.0 * me1) + 0.002824 * Math.cos(2.0 * md);
        pm = pm + 0.000857 * Math.cos(2.0 * me1 + md) + e * 0.000533 * Math.cos(2.0 * me1 - ms);
        pm = pm + e * 0.000401 * Math.cos(2.0 * me1 - md - ms);
        pm = pm + e * 0.00032 * Math.cos(md - ms) - 0.000271 * Math.cos(me1);
        pm = pm - e * 0.000264 * Math.cos(ms + md) - 0.000198 * Math.cos(2.0 * mf - md);
        pm = pm + 0.000173 * Math.cos(3.0 * md) + 0.000167 * Math.cos(4.0 * me1 - md);
        pm = pm - e * 0.000111 * Math.cos(ms) + 0.000103 * Math.cos(4.0 * me1 - 2.0 * md);
        pm = pm - 0.000084 * Math.cos(2.0 * md - 2.0 * me1) - e * 0.000083 * Math.cos(2.0 * me1 + ms);
        pm = pm + 0.000079 * Math.cos(2.0 * me1 + 2.0 * md) + 0.000072 * Math.cos(4.0 * me1);
        pm = pm + e * 0.000064 * Math.cos(2.0 * me1 - ms + md) - e * 0.000063 * Math.cos(2.0 * me1 + ms - md);
        pm = pm + e * 0.000041 * Math.cos(ms + me1) + e * 0.000035 * Math.cos(2.0 * md - ms);
        pm = pm - 0.000033 * Math.cos(3.0 * md - 2.0 * me1) - 0.00003 * Math.cos(md + me1);
        pm = pm - 0.000029 * Math.cos(2.0 * (mf - me1)) - e * 0.000029 * Math.cos(2.0 * md + ms);
        pm = pm + e2 * 0.000026 * Math.cos(2.0 * (me1 - ms)) - 0.000023 * Math.cos(2.0 * (mf - me1) + md);
        pm = pm + e * 0.000019 * Math.cos(4.0 * me1 - ms - md);

        var moonLongDeg = this.degrees(mm);
        var moonLatDeg = this.degrees(bm);
        var moonHorPara = pm;

        return [moonLongDeg, moonLatDeg, moonHorPara];
    }

    /**
     * Calculate current phase of Moon.
     * 
     * Original macro name: MoonPhase
     */
    static moonPhase(lh, lm, ls, ds, zc, dy, mn, yr) {
        var [moonLongDeg, moonLatDeg, moonHorPara] = moonLongLatHP(lh, lm, ls, ds, zc, dy, mn, yr);

        var cd = Math.cos(paUtils.degreesToRadians(moonLongDeg - sunLong(lh, lm, ls, ds, zc, dy, mn, yr))) * Math.cos(paUtils.degreesToRadians(moonLatDeg));
        var d = Math.acos(cd);
        var sd = Math.sin(d);
        var i = 0.1468 * sd * (1.0 - 0.0549 * Math.sin(moonMeanAnomaly(lh, lm, ls, ds, zc, dy, mn, yr)));
        i = i / (1.0 - 0.0167 * Math.sin(sunMeanAnomaly(lh, lm, ls, ds, zc, dy, mn, yr)));
        i = 3.141592654 - d - paUtils.degreesToRadians(i);
        var k = (1.0 + Math.cos(i)) / 2.0;

        return paUtils.round(k, 2);
    }

    /**
     * Calculate the Moon's mean anomaly.
     * 
     * Original macro name: MoonMeanAnomaly
     */
    static moonMeanAnomaly(lh, lm, ls, ds, zc, dy, mn, yr) {
        var ut = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
        var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
        var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
        var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
        var t = ((civilDateToJulianDate(gd, gm, gy) - 2415020.0) / 36525.0) + (ut / 876600.0);
        var t2 = t * t;

        var m1 = 27.32158213;
        var m2 = 365.2596407;
        var m3 = 27.55455094;
        var m4 = 29.53058868;
        var m5 = 27.21222039;
        var m6 = 6798.363307;
        var q = civilDateToJulianDate(gd, gm, gy) - 2415020.0 + (ut / 24.0);
        m1 = q / m1;
        m2 = q / m2;
        m3 = q / m3;
        m4 = q / m4;
        m5 = q / m5;
        m6 = q / m6;
        m1 = 360.0 * (m1 - Math.floor(m1));
        m2 = 360.0 * (m2 - Math.floor(m2));
        m3 = 360.0 * (m3 - Math.floor(m3));
        m4 = 360.0 * (m4 - Math.floor(m4));
        m5 = 360.0 * (m5 - Math.floor(m5));
        m6 = 360.0 * (m6 - Math.floor(m6));

        var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
        var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
        var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
        var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
        var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
        var s1 = Math.sin(a);
        var s2 = Math.sin(paUtils.degreesToRadians(na));
        var b = 346.56 + (132.87 - 0.0091731 * t) * t;
        var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
        var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
        md = md + 0.000817 * s1 + s3 + 0.002541 * s2;

        return paUtils.degreesToRadians(md);
    }

    /**
     * Calculate Julian date of New Moon.
     * 
     * Original macro name: NewMoon
     */
    static newMoon(ds, zc, dy, mn, yr) {
        var d0 = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var m0 = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var y0 = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);

        var j0 = this.civilDateToJulianDate(0.0, 1, y0) - 2415020.0;
        var dj = this.civilDateToJulianDate(d0, m0, y0) - 2415020.0;
        var k = this.lint(((y0 - 1900.0 + ((dj - j0) / 365.0)) * 12.3685) + 0.5);
        var tn = k / 1236.85;
        var tf = (k + 0.5) / 1236.85;
        var t = tn;
        var [nf1_a, nf1_b, nf1_f] = this.newMoonFullMoon_L6855(k, t);
        var ni = nf1_a;
        var nf = nf1_b;
        t = tf;
        k = k + 0.5;

        return ni + 2415020.0 + nf;
    }

    /**
     * Calculate Julian date of Full Moon.
     * 
     * Original macro name: FullMoon
     */
    static fullMoon(ds, zc, dy, mn, yr) {
        var d0 = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var m0 = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var y0 = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);

        var j0 = this.civilDateToJulianDate(0.0, 1, y0) - 2415020.0;
        var dj = this.civilDateToJulianDate(d0, m0, y0) - 2415020.0;
        var k = this.lint(((y0 - 1900.0 + ((dj - j0) / 365.0)) * 12.3685) + 0.5);
        var tn = k / 1236.85;
        var tf = (k + 0.5) / 1236.85;
        var t = tn;
        t = tf;
        k = k + 0.5;
        var [nf2_a, nf2_b, nf2_f] = this.newMoonFullMoon_L6855(k, t);
        var fi = nf2_a;
        var ff = nf2_b;

        return fi + 2415020.0 + ff;
    }

    /**
     * Helper function for new_moon() and full_moon() """
     */
    static newMoonFullMoon_L6855(k, t) {
        var t2 = t * t;
        var e = 29.53 * k;
        var c = 166.56 + (132.87 - 0.009173 * t) * t;
        c = paUtils.degreesToRadians(c);
        var b = 0.00058868 * k + (0.0001178 - 0.000000155 * t) * t2;
        b = b + 0.00033 * Math.sin(c) + 0.75933;
        var a = k / 12.36886;
        var a1 = 359.2242 + 360.0 * this.fract(a) - (0.0000333 + 0.00000347 * t) * t2;
        var a2 = 306.0253 + 360.0 * this.fract(k / 0.9330851);
        a2 = a2 + (0.0107306 + 0.00001236 * t) * t2;
        a = k / 0.9214926;
        var f = 21.2964 + 360.0 * this.fract(a) - (0.0016528 + 0.00000239 * t) * t2;
        a1 = this.unwindDeg(a1);
        a2 = this.unwindDeg(a2);
        f = this.unwindDeg(f);
        a1 = paUtils.degreesToRadians(a1);
        a2 = paUtils.degreesToRadians(a2);
        f = paUtils.degreesToRadians(f);

        var dd = (0.1734 - 0.000393 * t) * Math.sin(a1) + 0.0021 * Math.sin(2.0 * a1);
        dd = dd - 0.4068 * Math.sin(a2) + 0.0161 * Math.sin(2.0 * a2) - 0.0004 * Math.sin(3.0 * a2);
        dd = dd + 0.0104 * Math.sin(2.0 * f) - 0.0051 * Math.sin(a1 + a2);
        dd = dd - 0.0074 * Math.sin(a1 - a2) + 0.0004 * Math.sin(2.0 * f + a1);
        dd = dd - 0.0004 * Math.sin(2.0 * f - a1) - 0.0006 * Math.sin(2.0 * f + a2) + 0.001 * Math.sin(2.0 * f - a2);
        dd = dd + 0.0005 * Math.sin(a1 + 2.0 * a2);
        var e1 = Math.floor(e);
        b = b + dd + (e - e1);
        var b1 = Math.floor(b);
        a = e1 + b1;
        b = b - b1;

        return [a, b, f];
    }

    /**
     * Original macro name: FRACT
     */
    static fract(w) {
        return w - this.lint(w);
    }

    /**
     * Original macro name: LINT
     */
    static lint(w) {
        return this.iInt(w) + this.iInt(((1.0 * this.sign(w)) - 1.0) / 2.0);
    }

    /**
     * Original macro name: IINT
     */
    static iInt(w) {
        return this.sign(w) * Math.floor(Math.abs(w));
    }

    /**
     * Calculate sign of number.
     */
    static sign(numberToCheck) {
        var signValue = 0.0;

        if (numberToCheck < 0.0)
            signValue = -1.0;

        if (numberToCheck > 0.0)
            signValue = 1.0;

        return signValue;
    }

    /**
     * Original macro name: UTDayAdjust
     */
    static utDayAdjust(ut, g1) {
        var returnValue = ut;

        if ((ut - g1) < -6.0)
            returnValue = ut + 24.0;

        if ((ut - g1) > 6.0)
            returnValue = ut - 24.0;

        return returnValue;
    }

    /**
     * Original macro name: Fpart
     */
    /// <summary>
    /// </summary>
    static fPart(w) {
        return w - this.lint(w);
    }

    /**
     * Original macro name: EQElat
     */
    static eqeLat(rah, ram, ras, dd, dm, ds, gd, gm, gy) {
        var a = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(this.HMStoDH(rah, ram, ras)));
        var b = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var c = paUtils.degreesToRadians(this.obliq(gd, gm, gy));
        var d = Math.sin(b) * Math.cos(c) - Math.cos(b) * Math.sin(c) * Math.sin(a);

        return this.degrees(Math.asin(d));
    }

    /**
     * Original macro name: EQElong
     */
    static eqeLong(rah, ram, ras, dd, dm, ds, gd, gm, gy) {
        var a = paUtils.degreesToRadians(this.degreeHoursToDecimalDegrees(this.HMStoDH(rah, ram, ras)));
        var b = paUtils.degreesToRadians(this.degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
        var c = paUtils.degreesToRadians(this.obliq(gd, gm, gy));
        var d = Math.sin(a) * Math.cos(c) + Math.tan(b) * Math.sin(c);
        var e = Math.cos(a);
        var f = this.degrees(Math.atan2(d, e));

        return f - 360.0 * Math.floor(f / 360.0);
    }

    /**
     * Get Local Civil Day for Universal Time
     * 
     * Original macro name: UTLcDay
     */
    static universalTime_LocalCivilDay(uHours, uMinutes, uSeconds, daylightSaving, zoneCorrection, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.HMStoDH(uHours, uMinutes, uSeconds);
        var b = a + zoneCorrection;
        var c = b + daylightSaving;
        var d = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) + (c / 24.0);
        var e = this.julianDateDay(d);
        var e1 = Math.floor(e);

        return e1;
    }

    /**
     * Get Local Civil Month for Universal Time
     * 
     * Original macro name: UTLcMonth
     */
    static universalTime_LocalCivilMonth(uHours, uMinutes, uSeconds, daylightSaving, zoneCorrection, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.HMStoDH(uHours, uMinutes, uSeconds);
        var b = a + zoneCorrection;
        var c = b + daylightSaving;
        var d = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) + (c / 24.0);

        return this.julianDateMonth(d);
    }

    /**
     * Get Local Civil Year for Universal Time
     * 
     * Original macro name: UTLcYear
     */
    static universalTime_LocalCivilYear(uHours, uMinutes, uSeconds, daylightSaving, zoneCorrection, greenwichDay, greenwichMonth, greenwichYear) {
        var a = this.HMStoDH(uHours, uMinutes, uSeconds);
        var b = a + zoneCorrection;
        var c = b + daylightSaving;
        var d = this.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) + (c / 24.0);

        return this.julianDateYear(d);
    }

    /**
     * Local time of moonrise.
     * 
     * Original macro name: MoonRiseLCT
     */
    static moonRiseLCT(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [lct6700result1_mm, lct6700result1_bm, lct6700result1_pm, lct6700result1_dp, lct6700result1_th, lct6700result1_di, lct6700result1_p, lct6700result1_q, lct6700result1_lu, lct6700result1_lct] = this.moonRiseLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = lct6700result1_lu;
        lct = lct6700result1_lct;

        if (lct == -99.0)
            return lct;

        var la = lu;

        var x;
        var ut;
        var g1 = 0.0;
        var gu = 0.0;

        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [lct6680result_ut, lct6680result_lct, lct6680result_dy1, lct6680result_mn1, lct6680result_yr1, lct6680result_gdy, lct6680result_gmn, lct6680result_gyr] = this.moonRiseLCT_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = lct6680result_lct;
            dy1 = lct6680result_dy1;
            mn1 = lct6680result_mn1;
            yr1 = lct6680result_yr1;
            gdy = lct6680result_gdy;
            gmn = lct6680result_gmn;
            gyr = lct6680result_gyr;

            var [lct6700result2_mm, lct6700result2_bm, lct6700result2_pm, lct6700result2_dp, lct6700result2_th, lct6700result2_di, lct6700result2_p, lct6700result2_q, lct6700result2_lu, lct6700result2_lct] = this.moonRiseLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
            lu = lct6700result2_lu;
            lct = lct6700result2_lct;

            if (lct == -99.0)
                return lct;

            la = lu;
        }

        x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);


        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);

        return lct;
    }

    /**
     * Helper function for MoonRiseLCT
     */
    static moonRiseLCT_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for MoonRiseLCT
     */
    static moonRiseLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeRise(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        if (this.eRS(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat) != paTypes.WarningFlag.OK)
            lct = -99.0;

        return [mm, bm, pm, dp, th, di, p, q, lu, lct];
    }

    /**
     * Local date of moonrise.
     * 
     * Original macro names: MoonRiseLcDay, MoonRiseLcMonth, MoonRiseLcYear
     */
    static moonRiseLcDMY(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [lct6700result1_mm, lct6700result1_bm, lct6700result1_pm, lct6700result1_dp, lct6700result1_th, lct6700result1_di, lct6700result1_p, lct6700result1_q, lct6700result1_lu, lct6700result1_lct] = this.moonRiseLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = lct6700result1_lu;
        lct = lct6700result1_lct;

        if (lct == -99.0)
            return [lct, lct, lct];

        var la = lu;

        var x;
        var ut;
        var g1 = 0.0;
        var gu = 0.0;
        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [lct6680result1_ut, lct6680result1_lct, lct6680result1_dy1, lct6680result1_mn1, lct6680result1_yr1, lct6680result1_gdy, lct6680result1_gmn, lct6680result1_gyr] = this.moonRiseLcDMY_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = lct6680result1_lct;
            dy1 = lct6680result1_dy1;
            mn1 = lct6680result1_mn1;
            yr1 = lct6680result1_yr1;
            gdy = lct6680result1_gdy;
            gmn = lct6680result1_gmn;
            gyr = lct6680result1_gyr;

            var [lct6700result2_mm, lct6700result2_bm, lct6700result2_pm, lct6700result2_dp, lct6700result2_th, lct6700result2_di, lct6700result2_p, lct6700result2_q, lct6700result2_lu, lct6700result2_lct] = this.moonRiseLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);

            lu = lct6700result2_lu;
            lct = lct6700result2_lct;

            if (lct == -99.0)
                return [lct, lct, lct];

            la = lu;
        }

        x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);

        return [dy1, mn1, yr1];
    }

    /**
     * Helper function for MoonRiseLcDMY
     */
    static moonRiseLcDMY_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for MoonRiseLcDMY
     */
    static moonRiseLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeRise(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        return [mm, bm, pm, dp, th, di, p, q, lu, lct];
    }

    /**
     * Local azimuth of moonrise.
     * 
     * Original macro name: MoonRiseAz
     */
    static moonRiseAz(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [az6700result1_mm, az6700result1_bm, az6700result1_pm, az6700result1_dp, az6700result1_th, az6700result1_di, az6700result1_p, az6700result1_q, az6700result1_lu, az6700result1_lct, az6700result1_au] = this.moonRiseAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = az6700result1_lu;
        lct = az6700result1_lct;

        var au;

        if (lct == -99.0)
            return lct;

        var la = lu;

        var x;
        var ut;
        var g1;
        var gu = 0.0;
        var aa = 0.0;
        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [az6680result1_ut, az6680result1_lct, az6680result1_dy1, az6680result1_mn1, az6680result1_yr1, az6680result1_gdy, az6680result1_gmn, az6680result1_gyr] = this.moonRiseAz_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = az6680result1_lct;
            dy1 = az6680result1_dy1;
            mn1 = az6680result1_mn1;
            yr1 = az6680result1_yr1;
            gdy = az6680result1_gdy;
            gmn = az6680result1_gmn;
            gyr = az6680result1_gyr;

            var [az6700result2_mm, az6700result2_bm, az6700result2_pm, az6700result2_dp, az6700result2_th, az6700result2_di, az6700result2_p, az6700result2_q, az6700result2_lu, az6700result2_lct, az6700result2_au] = this.moonRiseAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
            lu = az6700result2_lu;
            lct = az6700result2_lct;
            au = az6700result2_au;

            if (lct == -99.0)
                return lct;

            la = lu;
            aa = au;
        }

        au = aa;

        return au;
    }

    /**
     * Helper function for MoonRiseAz
     */
    static moonRiseAz_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for MoonRiseAz
     */
    static moonRiseAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeRise(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);
        var au = this.riseSetAzimuthRise(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        return [mm, bm, pm, dp, th, di, p, q, lu, lct, au];
    }

    /**
     * Local time of moonset.
     * 
     * Original macro name: MoonSetLCT
     */
    static moonSetLCT(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [lct6700result1_mm, lct6700result1_bm, lct6700result1_pm, lct6700result1_dp, lct6700result1_th, lct6700result1_di, lct6700result1_p, lct6700result1_q, lct6700result1_lu, lct6700result1_lct] = this.moonSetLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = lct6700result1_lu;
        lct = lct6700result1_lct;

        if (lct == -99.0)
            return lct;

        var la = lu;

        var x;
        var ut;
        var g1 = 0.0;
        var gu = 0.0;
        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [lct6680result1_ut, lct6680result1_lct, lct6680result1_dy1, lct6680result1_mn1, lct6680result1_yr1, lct6680result1_gdy, lct6680result1_gmn, lct6680result1_gyr] = this.moonSetLCT_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = lct6680result1_lct;
            dy1 = lct6680result1_dy1;
            mn1 = lct6680result1_mn1;
            yr1 = lct6680result1_yr1;
            gdy = lct6680result1_gdy;
            gmn = lct6680result1_gmn;
            gyr = lct6680result1_gyr;

            var [lct6700result2_mm, lct6700result2_bm, lct6700result2_pm, lct6700result2_dp, lct6700result2_th, lct6700result2_di, lct6700result2_p, lct6700result2_q, lct6700result2_lu, lct6700result2_lct] = this.moonSetLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
            lu = lct6700result2_lu;
            lct = lct6700result2_lct;

            if (lct == -99.0)
                return lct;

            la = lu;
        }

        x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);

        return lct;
    }

    /**
     * Helper function for MoonSetLCT
     */
    static moonSetLCT_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for MoonSetLCT
     */
    static moonSetLCT_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeSet(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        if (this.eRS(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat) != paTypes.WarningFlag.OK)
            lct = -99.0;

        return [mm, bm, pm, dp, th, di, p, q, lu, lct];
    }

    /**
     * Local date of moonset.
     * 
     * Original macro names: MoonSetLcDay, MoonSetLcMonth, MoonSetLcYear
     */
    static moonSetLcDMY(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [dmy6700result1_mm, dmy6700result1_bm, dmy6700result1_pm, dmy6700result1_dp, dmy6700result1_th, dmy6700result1_di, dmy6700result1_p, dmy6700result1_q, dmy6700result1_lu, dmy6700result1_lct] = this.moonSetLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = dmy6700result1_lu;
        lct = dmy6700result1_lct;

        if (lct == -99.0)
            return [lct, lct, lct];

        var la = lu;

        var x;
        var ut;
        var g1 = 0.0;
        var gu = 0.0;
        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [dmy6680result1_ut, dmy6680result1_lct, dmy6680result1_dy1, dmy6680result1_mn1, dmy6680result1_yr1, dmy6680result1_gdy, dmy6680result1_gmn, dmy6680result1_gyr] = this.moonSetLcDMY_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = dmy6680result1_lct;
            dy1 = dmy6680result1_dy1;
            mn1 = dmy6680result1_mn1;
            yr1 = dmy6680result1_yr1;
            gdy = dmy6680result1_gdy;
            gmn = dmy6680result1_gmn;
            gyr = dmy6680result1_gyr;

            var [dmy6700result2_mm, dmy6700result2_bm, dmy6700result2_pm, dmy6700result2_dp, dmy6700result2_th, dmy6700result2_di, dmy6700result2_p, dmy6700result2_q, dmy6700result2_lu, dmy6700result2_lct] = this.moonSetLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
            lu = dmy6700result2_lu;
            lct = dmy6700result2_lct;

            if (lct == -99.0)
                return [lct, lct, lct];

            la = lu;
        }

        x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
        ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);

        return [dy1, mn1, yr1];
    }

    /**
     * Helper function for MoonSetLcDMY
     */
    static moonSetLcDMY_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for MoonSetLcDMY
     */
    static moonSetLcDMY_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeSet(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        return [mm, bm, pm, dp, th, di, p, q, lu, lct];
    }

    /**
     * Local azimuth of moonset.
     * 
     * Original macro name: MoonSetAz
     */
    static moonSetAz(dy, mn, yr, ds, zc, gLong, gLat) {
        var gdy = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gmn = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var gyr = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var lct = 12.0;
        var dy1 = dy;
        var mn1 = mn;
        var yr1 = yr;

        var [az6700result1_mm, az6700result1_bm, az6700result1_pm, az6700result1_dp, az6700result1_th, az6700result1_di, az6700result1_p, az6700result1_q, az6700result1_lu, az6700result1_lct, az6700result1_au] = this.moonSetAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
        var lu = az6700result1_lu;
        lct = az6700result1_lct;

        var au;

        if (lct == -99.0)
            return lct;

        var la = lu;

        var x;
        var ut;
        var g1;
        var gu = 0.0;
        var aa = 0.0;
        for (let k = 1; k < 9; k++) {
            x = this.localSiderealTimeToGreenwichSiderealTime(la, 0.0, 0.0, gLong);
            ut = this.greenwichSiderealTimeToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr);

            g1 = (k == 1) ? ut : gu;

            gu = ut;
            ut = gu;

            var [az6680result1_ut, az6680result1_lct, az6680result1_dy1, az6680result1_mn1, az6680result1_yr1, az6680result1_gdy, az6680result1_gmn, az6680result1_gyr] = this.moonSetAz_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut);
            lct = az6680result1_lct;
            dy1 = az6680result1_dy1;
            mn1 = az6680result1_mn1;
            yr1 = az6680result1_yr1;
            gdy = az6680result1_gdy;
            gmn = az6680result1_gmn;
            gyr = az6680result1_gyr;

            var [az6700result2_mm, az6700result2_bm, az6700result2_pm, az6700result2_dp, az6700result2_th, az6700result2_di, az6700result2_p, az6700result2_q, az6700result2_lu, az6700result2_lct, az6700result2_au] = this.moonSetAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat);
            lu = az6700result2_lu;
            lct = az6700result2_lct;
            au = az6700result2_au;

            if (lct == -99.0)
                return lct;

            la = lu;
            aa = au;
        }

        au = aa;

        return au;
    }

    /**
     * Helper function for moon_set_az
     */
    static moonSetAz_L6680(x, ds, zc, gdy, gmn, gyr, g1, ut) {
        if (this.eGreenwichSiderealToUniversalTime(x, 0.0, 0.0, gdy, gmn, gyr) != paTypes.WarningFlag.OK)
            if (Math.abs(g1 - ut) > 0.5)
                ut = ut + 23.93447;

        ut = this.utDayAdjust(ut, g1);
        var lct = this.universalTimeToLocalCivilTime(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var dy1 = this.universalTime_LocalCivilDay(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var mn1 = this.universalTime_LocalCivilMonth(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        var yr1 = this.universalTime_LocalCivilYear(ut, 0.0, 0.0, ds, zc, gdy, gmn, gyr);
        gdy = this.localCivilTimeGreenwichDay(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gmn = this.localCivilTimeGreenwichMonth(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        gyr = this.localCivilTimeGreenwichYear(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        ut = ut - 24.0 * Math.floor(ut / 24.0);

        return [ut, lct, dy1, mn1, yr1, gdy, gmn, gyr];
    }

    /**
     * Helper function for moon_set_az
     */
    static moonSetAz_L6700(lct, ds, zc, dy1, mn1, yr1, gdy, gmn, gyr, gLat) {
        var mm = this.moonLong(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var bm = this.moonLat(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1);
        var pm = paUtils.degreesToRadians(this.moonHP(lct, 0.0, 0.0, ds, zc, dy1, mn1, yr1));
        var dp = this.nutatLong(gdy, gmn, gyr);
        var th = 0.27249 * Math.sin(pm);
        var di = th + 0.0098902 - pm;
        var p = this.decimalDegreesToDegreeHours(this.ecRA(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr));
        var q = this.ecDec(mm + dp, 0.0, 0.0, bm, 0.0, 0.0, gdy, gmn, gyr);
        var lu = this.riseSetLocalSiderealTimeSet(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);
        var au = this.riseSetAzimuthSet(p, 0.0, 0.0, q, 0.0, 0.0, this.degrees(di), gLat);

        return [mm, bm, pm, dp, th, di, p, q, lu, lct, au];
    }

    /**
     * Determine if a lunar eclipse is likely to occur.
     * 
     * Original macro name: LEOccurrence
     */
    static lunarEclipseOccurrence(ds, zc, dy, mn, yr) {
        var d0 = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var m0 = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var y0 = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);

        var j0 = this.civilDateToJulianDate(0.0, 1, y0);
        var dj = this.civilDateToJulianDate(d0, m0, y0);
        var k = (y0 - 1900.0 + ((dj - j0) * 1.0 / 365.0)) * 12.3685;
        k = this.lint(k + 0.5);
        var tn = k / 1236.85;
        var tf = (k + 0.5) / 1236.85;
        var t = tn;
        var [l6855result1_f, l6855result1_dd, l6855result1_e1, l6855result1_b1, l6855result1_a, l6855result1_b] = this.lunarEclipseOccurrence_L6855(t, k);
        t = tf;
        k = k + 0.5;
        var [l6855result2_f, l6855result2_dd, l6855result2_e1, l6855result2_b1, l6855result2_a, l6855result2_b] = this.lunarEclipseOccurrence_L6855(t, k);
        var fb = l6855result2_f;

        var df = Math.abs(fb - 3.141592654 * this.lint(fb / 3.141592654));

        if (df > 0.37)
            df = 3.141592654 - df;

        var s = paTypes.LunarEclipseOccurrence.Certain;
        if (df >= 0.242600766) {
            s = LunarEclipseOccurrence.Possible;

            if (df > 0.37)
                s = LunarEclipseOccurrence.None;
        }

        return s;
    }

    /**
     * Helper function for lunar_eclipse_occurrence
     */
    static lunarEclipseOccurrence_L6855(t, k) {
        var t2 = t * t;
        var e = 29.53 * k;
        var c = 166.56 + (132.87 - 0.009173 * t) * t;
        c = paUtils.degreesToRadians(c);
        var b = 0.00058868 * k + (0.0001178 - 0.000000155 * t) * t2;
        b = b + 0.00033 * Math.sin(c) + 0.75933;
        var a = k / 12.36886;
        var a1 = 359.2242 + 360.0 * this.fPart(a) - (0.0000333 + 0.00000347 * t) * t2;
        var a2 = 306.0253 + 360.0 * this.fPart(k / 0.9330851);
        a2 = a2 + (0.0107306 + 0.00001236 * t) * t2;
        a = k / 0.9214926;
        var f = 21.2964 + 360.0 * this.fPart(a) - (0.0016528 + 0.00000239 * t) * t2;
        a1 = this.unwindDeg(a1);
        a2 = this.unwindDeg(a2);
        f = this.unwindDeg(f);
        a1 = paUtils.degreesToRadians(a1);
        a2 = paUtils.degreesToRadians(a2);
        f = paUtils.degreesToRadians(f);

        var dd = (0.1734 - 0.000393 * t) * Math.sin(a1) + 0.0021 * Math.sin(2.0 * a1);
        dd = dd - 0.4068 * Math.sin(a2) + 0.0161 * Math.sin(2.0 * a2) - 0.0004 * Math.sin(3.0 * a2);
        dd = dd + 0.0104 * Math.sin(2.0 * f) - 0.0051 * Math.sin(a1 + a2);
        dd = dd - 0.0074 * Math.sin(a1 - a2) + 0.0004 * Math.sin(2.0 * f + a1);
        dd = dd - 0.0004 * Math.sin(2.0 * f - a1) - 0.0006 * Math.sin(2.0 * f + a2) + 0.001 * Math.sin(2.0 * f - a2);
        dd = dd + 0.0005 * Math.sin(a1 + 2.0 * a2);
        var e1 = Math.floor(e);
        b = b + dd + (e - e1);
        var b1 = Math.floor(b);
        a = e1 + b1;
        b = b - b1;

        return [f, dd, e1, b1, a, b];
    }

    /**
     * Calculate time of maximum shadow for lunar eclipse (UT)
     * 
     * Original macro name: UTMaxLunarEclipse
     */
    static utMaxLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var rp = (hd + rn + ps) * 1.02;
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        return z1;
    }

    /**
     * Calculate time of first shadow contact for lunar eclipse (UT)
     * 
     * Original macro name: UTFirstContactLunarEclipse
     */
    static utFirstContactLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var rp = (hd + rn + ps) * 1.02;
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        if (z6 < 0.0)
            z6 = z6 + 24.0;

        return z6;
    }

    /**
     * Calculate time of last shadow contact for lunar eclipse (UT)
     */
    static utLastContactLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var rp = (hd + rn + ps) * 1.02;
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z7 = z1 + zd - this.lint((z1 + zd) / 24.0) * 24.0;

        return z7;
    }

    /**
     * Calculate start time of umbra phase of lunar eclipse (UT)
     * 
     * Original macro name: UTStartUmbraLunarEclipse
     */
    static utStartUmbraLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var ru = (hd - rn + ps) * 1.02;
        var rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        r = rm + ru;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var z8 = z1 - zd;

        if (z8 < 0.0)
            z8 = z8 + 24.0;

        return z8;
    }

    /**
     * Calculate end time of umbra phase of lunar eclipse (UT)
     * 
     * Original macro name: UTEndUmbraLunarEclipse
     */
    static utEndUmbraLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var ru = (hd - rn + ps) * 1.02;
        var rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        r = rm + ru;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var z9 = z1 + zd - this.lint((z1 + zd) / 24.0) * 24.0;

        return z9;
    }

    /**
     * Calculate start time of total phase of lunar eclipse (UT)
     * 
     * Original macro name: UTStartTotalLunarEclipse
     */
    static utStartTotalLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var ru = (hd - rn + ps) * 1.02;
        var rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        r = rm + ru;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var z8 = z1 - zd;

        r = ru - rm;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var zcc = z1 - zd;

        if (zcc < 0.0)
            zcc = zc + 24.0;

        return zcc;
    }

    /**
     * Calculate end time of total phase of lunar eclipse (UT)
     * 
     * Original macro name: UTEndTotalLunarEclipse
     */
    static utEndTotalLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var ru = (hd - rn + ps) * 1.02;
        var rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        r = rm + ru;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var z8 = z1 - zd;

        r = ru - rm;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        zd = Math.sqrt(dd);
        var zb = z1 + zd - this.lint((z1 + zd) / 24.0) * 24.0;

        return zb;
    }

    /**
     * Calculate magnitude of lunar eclipse.
     * 
     * Original macro name: MagLunarEclipse
     */
    static magLunarEclipse(dy, mn, yr, ds, zc) {
        var tp = 2.0 * Math.PI;

        if (this.lunarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.LunarEclipseOccurrence.None)
            return -99.0;

        var dj = this.fullMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utfm = xi * 24.0;
        var ut = utfm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utfm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utfm;
        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var q = 0.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        sr = sr + Math.PI - this.lint((sr + Math.PI) / tp) * tp;
        by = by - q;
        bz = bz - q;
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var ru = (hd - rn + ps) * 1.02;
        var rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rp;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        r = rm + ru;
        dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);
        var mg = (rm + rp - pj) / (2.0 * rm);

        if (dd < 0.0)
            return mg;

        zd = Math.sqrt(dd);
        var z8 = z1 - zd;

        r = ru - rm;
        dd = z1 - x0;
        mg = (rm + ru - pj) / (2.0 * rm);

        return mg;
    }

    /**
     * Determine if a solar eclipse is likely to occur.
     * 
     * Original macro name: SEOccurrence
     */
    static solarEclipseOccurrence(ds, zc, dy, mn, yr) {
        var d0 = this.localCivilTimeGreenwichDay(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var m0 = this.localCivilTimeGreenwichMonth(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);
        var y0 = this.localCivilTimeGreenwichYear(12.0, 0.0, 0.0, ds, zc, dy, mn, yr);

        var j0 = this.civilDateToJulianDate(0.0, 1, y0);
        var dj = this.civilDateToJulianDate(d0, m0, y0);
        var k = (y0 - 1900.0 + ((dj - j0) * 1.0 / 365.0)) * 12.3685;
        k = this.lint(k + 0.5);
        var tn = k / 1236.85;
        var tf = (k + 0.5) / 1236.85;
        var t = tn;
        var [l6855result1_f, l6855result1_dd, l6855result1_e1, l6855result1_b1, l6855result1_a, l6855result1_b] = this.solarEclipseOccurrence_L6855(t, k);
        var nb = l6855result1_f;
        t = tf;
        k = k + 0.5;

        var df = Math.abs(nb - 3.141592654 * this.lint(nb / 3.141592654));

        if (df > 0.37)
            df = 3.141592654 - df;

        var s = paTypes.SolarEclipseOccurrence.Certain;
        if (df >= 0.242600766) {
            s = paTypes.SolarEclipseOccurrence.Possible;
            if (df > 0.37)
                s = paTypes.SolarEclipseOccurrence.None;
        }

        return s;
    }

    /**
     * Helper function for SolarEclipseOccurrence
     */
    static solarEclipseOccurrence_L6855(t, k) {
        var t2 = t * t;
        var e = 29.53 * k;
        var c = 166.56 + (132.87 - 0.009173 * t) * t;
        c = paUtils.degreesToRadians(c);
        var b = 0.00058868 * k + (0.0001178 - 0.000000155 * t) * t2;
        b = b + 0.00033 * Math.sin(c) + 0.75933;
        var a = k / 12.36886;
        var a1 = 359.2242 + 360.0 * this.fPart(a) - (0.0000333 + 0.00000347 * t) * t2;
        var a2 = 306.0253 + 360.0 * this.fPart(k / 0.9330851);
        a2 = a2 + (0.0107306 + 0.00001236 * t) * t2;
        a = k / 0.9214926;
        var f = 21.2964 + 360.0 * this.fPart(a) - (0.0016528 + 0.00000239 * t) * t2;
        a1 = this.unwindDeg(a1);
        a2 = this.unwindDeg(a2);
        f = this.unwindDeg(f);
        a1 = paUtils.degreesToRadians(a1);
        a2 = paUtils.degreesToRadians(a2);
        f = paUtils.degreesToRadians(f);

        var dd = (0.1734 - 0.000393 * t) * Math.sin(a1) + 0.0021 * Math.sin(2.0 * a1);
        dd = dd - 0.4068 * Math.sin(a2) + 0.0161 * Math.sin(2.0 * a2) - 0.0004 * Math.sin(3.0 * a2);
        dd = dd + 0.0104 * Math.sin(2.0 * f) - 0.0051 * Math.sin(a1 + a2);
        dd = dd - 0.0074 * Math.sin(a1 - a2) + 0.0004 * Math.sin(2.0 * f + a1);
        dd = dd - 0.0004 * Math.sin(2.0 * f - a1) - 0.0006 * Math.sin(2.0 * f + a2) + 0.001 * Math.sin(2.0 * f - a2);
        dd = dd + 0.0005 * Math.sin(a1 + 2.0 * a2);
        var e1 = Math.floor(e);
        b = b + dd + (e - e1);
        var b1 = Math.floor(b);
        a = e1 + b1;
        b = b - b1;

        return [f, dd, e1, b1, a, b];
    }

    /**
     * Calculate time of maximum shadow for solar eclipse (UT)
     * 
     * Original macro name: UTMaxSolarEclipse
     */
    static utMaxSolarEclipse(dy, mn, yr, ds, zc, glong, glat) {
        var tp = 2.0 * Math.PI;

        if (this.solarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.SolarEclipseOccurrence.None)
            return -99.0;

        var dj = this.newMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utnm = xi * 24.0;
        var ut = utnm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utnm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utnm;
        var x = my;
        var y = by;
        var tm = xh - 1.0;
        var hp = hy;
        var [l7390result1_paa, l7390result1_qaa, l7390result1_xaa, l7390result1_pbb, l7390result1_qbb, l7390result1_xbb, l7390result1_p, l7390result1_q] = this.utMaxSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        my = Number(l7390result1_p);
        by = Number(l7390result1_q);
        x = mz;
        y = bz;
        tm = xh + 1.0;
        hp = hz;
        var [l7390result2_paa, l7390result2_qaa, l7390result2_xaa, l7390result2_pbb, l7390result2_qbb, l7390result2_xbb, l7390result2_p, l7390result2_q] = this.utMaxSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        mz = Number(l7390result2_p);
        bz = Number(l7390result2_q);

        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        x = sr;
        y = 0.0;
        tm = ut;
        hp = 0.00004263452 / rr;
        var [l7390result3_paa, l7390result3_qaa, l7390result3_xaa, l7390result3_pbb, l7390result3_qbb, l7390result3_xbb, l7390result3_p, l7390result3_q] = this.utMaxSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        sr = Number(l7390result3_p);
        by = by - Number(l7390result3_q);
        bz = bz - Number(l7390result3_q);
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var _ru = (hd - rn + ps) * 1.02;
        var _rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rn;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);

        return z1;
    }

    /**
     * Helper function for ut_max_solar_eclipse
     */
    static utMaxSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp) {
        var paa = this.ecRA(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var qaa = this.ecDec(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var xaa = this.rightAscensionToHourAngle(this.decimalDegreesToDegreeHours(paa), 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var pbb = this.parallaxHA(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var qbb = this.parallaxDec(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var xbb = this.hourAngleToRightAscension(pbb, 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var p = paUtils.degreesToRadians(this.eqeLong(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));
        var q = paUtils.degreesToRadians(this.eqeLat(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));

        return [paa, qaa, xaa, pbb, qbb, xbb, p, q];
    }

    /**
     * Calculate time of first contact for solar eclipse (UT)
     * 
     * Original macro name: UTFirstContactSolarEclipse
     */
    static utFirstContactSolarEclipse(dy, mn, yr, ds, zc, glong, glat) {
        var tp = 2.0 * Math.PI;

        if (this.solarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.SolarEclipseOccurrence.None)
            return -99.0;

        var dj = this.newMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utnm = xi * 24.0;
        var ut = utnm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utnm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utnm;
        var x = my;
        var y = by;
        var tm = xh - 1.0;
        var hp = hy;
        var [l7390result1_paa, l7390result1_qaa, l7390result1_xaa, l7390result1_pbb, l7390result1_qbb, l7390result1_xbb, l7390result1_p, l7390result1_q] = this.utFirstContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        my = Number(l7390result1_p);
        by = Number(l7390result1_q);
        x = mz;
        y = bz;
        tm = xh + 1.0;
        hp = hz;
        var [l7390result2_paa, l7390result2_qaa, l7390result2_xaa, l7390result2_pbb, l7390result2_qbb, l7390result2_xbb, l7390result2_p, l7390result2_q] = this.utFirstContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        mz = Number(l7390result2_p);
        bz = Number(l7390result2_q);

        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        x = sr;
        y = 0.0;
        tm = ut;
        hp = 0.00004263452 / rr;
        var [l7390result3_paa, l7390result3_qaa, l7390result3_xaa, l7390result3_pbb, l7390result3_qbb, l7390result3_xbb, l7390result3_p, l7390result3_q] = this.utFirstContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        sr = Number(l7390result3_p);
        by = by - Number(l7390result3_q);
        bz = bz - Number(l7390result3_q);
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var _ru = (hd - rn + ps) * 1.02;
        var _rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rn;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z6 = z1 - zd;

        if (z6 < 0.0)
            z6 = z6 + 24.0;

        return z6;
    }

    /**
     * Helper function for UTFirstContactSolarEclipse
     */
    static utFirstContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp) {
        var paa = this.ecRA(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var qaa = this.ecDec(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var xaa = this.rightAscensionToHourAngle(this.decimalDegreesToDegreeHours(paa), 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var pbb = this.parallaxHA(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var qbb = this.parallaxDec(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var xbb = this.hourAngleToRightAscension(pbb, 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var p = paUtils.degreesToRadians(this.eqeLong(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));
        var q = paUtils.degreesToRadians(this.eqeLat(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));

        return [paa, qaa, xaa, pbb, qbb, xbb, p, q];
    }

    /**
     * Calculate time of last contact for solar eclipse (UT)
     * 
     * Original macro name: UTLastContactSolarEclipse
     */
    static utLastContactSolarEclipse(dy, mn, yr, ds, zc, glong, glat) {
        var tp = 2.0 * Math.PI;

        if (this.solarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.SolarEclipseOccurrence.None)
            return -99.0;

        var dj = this.newMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utnm = xi * 24.0;
        var ut = utnm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utnm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utnm;
        var x = my;
        var y = by;
        var tm = xh - 1.0;
        var hp = hy;
        var [l7390result1_paa, l7390result1_qaa, l7390result1_xaa, l7390result1_pbb, l7390result1_qbb, l7390result1_xbb, l7390result1_p, l7390result1_q] = this.utLastContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        my = Number(l7390result1_p);
        by = Number(l7390result1_q);
        x = mz;
        y = bz;
        tm = xh + 1.0;
        hp = hz;
        var [l7390result2_paa, l7390result2_qaa, l7390result2_xaa, l7390result2_pbb, l7390result2_qbb, l7390result2_xbb, l7390result2_p, l7390result2_q] = this.utLastContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        mz = Number(l7390result2_p);
        bz = Number(l7390result2_q);

        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        x = sr;
        y = 0.0;
        tm = ut;
        hp = 0.00004263452 / rr;
        var [l7390result3_paa, l7390result3_qaa, l7390result3_xaa, l7390result3_pbb, l7390result3_qbb, l7390result3_xbb, l7390result3_p, l7390result3_q] = this.utLastContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        sr = Number(l7390result3_p);
        by = by - Number(l7390result3_q);
        bz = bz - Number(l7390result3_q);
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var _ru = (hd - rn + ps) * 1.02;
        var _rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rn;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);
        var z7 = z1 + zd - this.lint((z1 + zd) / 24.0) * 24.0;

        return z7;
    }

    /**
     * Helper function for ut_last_contact_solar_eclipse
     */
    static utLastContactSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp) {
        var paa = this.ecRA(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var qaa = this.ecDec(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var xaa = this.rightAscensionToHourAngle(this.decimalDegreesToDegreeHours(paa), 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var pbb = this.parallaxHA(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var qbb = this.parallaxDec(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var xbb = this.hourAngleToRightAscension(pbb, 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var p = paUtils.degreesToRadians(this.eqeLong(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));
        var q = paUtils.degreesToRadians(this.eqeLat(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));

        return [paa, qaa, xaa, pbb, qbb, xbb, p, q];
    }

    /**
     * Calculate magnitude of solar eclipse.
     * 
     * Original macro name: MagSolarEclipse
     */
    static magSolarEclipse(dy, mn, yr, ds, zc, glong, glat) {
        var tp = 2.0 * Math.PI;

        if (this.solarEclipseOccurrence(ds, zc, dy, mn, yr) == paTypes.SolarEclipseOccurrence.None)
            return -99.0;

        var dj = this.newMoon(ds, zc, dy, mn, yr);
        var gday = this.julianDateDay(dj);
        var gmonth = this.julianDateMonth(dj);
        var gyear = this.julianDateYear(dj);
        var igday = Math.floor(gday);
        var xi = gday - igday;
        var utnm = xi * 24.0;
        var ut = utnm - 1.0;
        var ly = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var my = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var by = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hy = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        ut = utnm + 1.0;
        var sb = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear)) - ly;
        var mz = paUtils.degreesToRadians(this.moonLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var bz = paUtils.degreesToRadians(this.moonLat(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        var hz = paUtils.degreesToRadians(this.moonHP(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));

        if (sb < 0.0)
            sb = sb + tp;

        var xh = utnm;
        var x = my;
        var y = by;
        var tm = xh - 1.0;
        var hp = hy;
        var [l7390result1_paa, l7390result1_qaa, l7390result1_xaa, l7390result1_pbb, l7390result1_qbb, l7390result1_xbb, l7390result1_p, l7390result1_q] = this.magSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        my = Number(l7390result1_p);
        by = Number(l7390result1_q);
        x = mz;
        y = bz;
        tm = xh + 1.0;
        hp = hz;
        var [l7390result2_paa, l7390result2_qaa, l7390result2_xaa, l7390result2_pbb, l7390result2_qbb, l7390result2_xbb, l7390result2_p, l7390result2_q] = this.magSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        mz = Number(l7390result2_p);
        bz = Number(l7390result2_q);

        var x0 = xh + 1.0 - (2.0 * bz / (bz - by));
        var dm = mz - my;

        if (dm < 0.0)
            dm = dm + tp;

        var lj = (dm - sb) / 2.0;
        var mr = my + (dm * (x0 - xh + 1.0) / 2.0);
        ut = x0 - 0.13851852;
        var rr = this.sunDist(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear);
        var sr = paUtils.degreesToRadians(this.sunLong(ut, 0.0, 0.0, 0, 0, igday, gmonth, gyear));
        sr = sr + paUtils.degreesToRadians(this.nutatLong(igday, gmonth, gyear) - 0.00569);
        x = sr;
        y = 0.0;
        tm = ut;
        hp = 0.00004263452 / rr;
        var [l7390result3_paa, l7390result3_qaa, l7390result3_xaa, l7390result3_pbb, l7390result3_qbb, l7390result3_xbb, l7390result3_p, l7390result3_q] = this.magSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp);
        sr = Number(l7390result3_p);
        by = by - Number(l7390result3_q);
        bz = bz - Number(l7390result3_q);
        var p3 = 0.00004263;
        var zh = (sr - mr) / lj;
        var tc = x0 + zh;
        var sh = (((bz - by) * (tc - xh - 1.0) / 2.0) + bz) / lj;
        var s2 = sh * sh;
        var z2 = zh * zh;
        var ps = p3 / (rr * lj);
        var z1 = (zh * z2 / (z2 + s2)) + x0;
        var h0 = (hy + hz) / (2.0 * lj);
        var rm = 0.272446 * h0;
        var rn = 0.00465242 / (lj * rr);
        var hd = h0 * 0.99834;
        var _ru = (hd - rn + ps) * 1.02;
        var _rp = (hd + rn + ps) * 1.02;
        var pj = Math.abs(sh * zh / Math.sqrt(s2 + z2));
        var r = rm + rn;
        var dd = z1 - x0;
        dd = dd * dd - ((z2 - (r * r)) * dd / zh);

        if (dd < 0.0)
            return -99.0;

        var zd = Math.sqrt(dd);

        var mg = (rm + rn - pj) / (2.0 * rn);

        return mg;
    }

    /**
     * Helper function for mag_solar_eclipse
     */
    static magSolarEclipse_L7390(x, y, igday, gmonth, gyear, tm, glong, glat, hp) {
        var paa = this.ecRA(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var qaa = this.ecDec(this.degrees(x), 0.0, 0.0, this.degrees(y), 0.0, 0.0, igday, gmonth, gyear);
        var xaa = this.rightAscensionToHourAngle(this.decimalDegreesToDegreeHours(paa), 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var pbb = this.parallaxHA(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var qbb = this.parallaxDec(xaa, 0.0, 0.0, qaa, 0.0, 0.0, paTypes.CoordinateType.True, glat, 0.0, this.degrees(hp));
        var xbb = this.hourAngleToRightAscension(pbb, 0.0, 0.0, tm, 0.0, 0.0, 0, 0, igday, gmonth, gyear, glong);
        var p = paUtils.degreesToRadians(this.eqeLong(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));
        var q = paUtils.degreesToRadians(this.eqeLat(xbb, 0.0, 0.0, qbb, 0.0, 0.0, igday, gmonth, gyear));

        return [paa, qaa, xaa, pbb, qbb, xbb, p, q];
    }
}

class paMoon {
    /**
     * Calculate approximate position of the Moon.
     */
    static approximatePositionOfMoon(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var l0 = 91.9293359879052;
        var p0 = 130.143076320618;
        var n0 = 291.682546643194;
        var i = 5.145396;

        var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var utHours = paMacros.localCivilTimeToUniversalTime(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var dDays = paMacros.civilDateToJulianDate(gdateDay, gdateMonth, gdateYear) - paMacros.civilDateToJulianDate(0.0, 1, 2010) + utHours / 24;
        var sunLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var sunMeanAnomalyRad = paMacros.sunMeanAnomaly(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var lmDeg = paMacros.unwindDeg(13.1763966 * dDays + l0);
        var mmDeg = paMacros.unwindDeg(lmDeg - 0.1114041 * dDays - p0);
        var nDeg = paMacros.unwindDeg(n0 - (0.0529539 * dDays));
        var evDeg = 1.2739 * Math.sin(paUtils.degreesToRadians(2.0 * (lmDeg - sunLongDeg) - mmDeg));
        var aeDeg = 0.1858 * Math.sin(sunMeanAnomalyRad);
        var a3Deg = 0.37 * Math.sin(sunMeanAnomalyRad);
        var mmdDeg = mmDeg + evDeg - aeDeg - a3Deg;
        var ecDeg = 6.2886 * Math.sin(paUtils.degreesToRadians(mmdDeg));
        var a4Deg = 0.214 * Math.sin(2.0 * paUtils.degreesToRadians(mmdDeg));
        var ldDeg = lmDeg + evDeg + ecDeg - aeDeg + a4Deg;
        var vDeg = 0.6583 * Math.sin(2.0 * paUtils.degreesToRadians(ldDeg - sunLongDeg));
        var lddDeg = ldDeg + vDeg;
        var ndDeg = nDeg - 0.16 * Math.sin(sunMeanAnomalyRad);
        var y = Math.sin(paUtils.degreesToRadians(lddDeg - ndDeg)) * Math.cos(paUtils.degreesToRadians(i));
        var x = Math.cos(paUtils.degreesToRadians(lddDeg - ndDeg));

        var moonLongDeg = paMacros.unwindDeg(paMacros.degrees(Math.atan2(y, x)) + ndDeg);
        var moonLatDeg = paMacros.degrees(Math.asin(Math.sin(paUtils.degreesToRadians(lddDeg - ndDeg)) * Math.sin(paUtils.degreesToRadians(i))));
        var moonRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
        var moonDecDeg1 = paMacros.ecDec(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

        var moonRAHour = paMacros.decimalHoursHour(moonRAHours1);
        var moonRAMin = paMacros.decimalHoursMinute(moonRAHours1);
        var moonRASec = paMacros.decimalHoursSecond(moonRAHours1);
        var moonDecDeg = paMacros.decimalDegreesDegrees(moonDecDeg1);
        var moonDecMin = paMacros.decimalDegreesMinutes(moonDecDeg1);
        var moonDecSec = paMacros.decimalDegreesSeconds(moonDecDeg1);

        return [moonRAHour, moonRAMin, moonRASec, moonDecDeg, moonDecMin, moonDecSec];
    }

    /**
     * Calculate precise position of the Moon.
     */
    static precisePositionOfMoon(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var [moonLongDeg, moonLatDeg, moonHorPara] = paMacros.moonLongLatHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var nutationInLongitudeDeg = paMacros.nutatLong(gdateDay, gdateMonth, gdateYear);
        var correctedLongDeg = moonLongDeg + nutationInLongitudeDeg;
        var earthMoonDistanceKM = 6378.14 / Math.sin(paUtils.degreesToRadians(moonHorPara));
        var moonRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(correctedLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
        var moonDecDeg1 = paMacros.ecDec(correctedLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

        var moonRAHour = paMacros.decimalHoursHour(moonRAHours1);
        var moonRAMin = paMacros.decimalHoursMinute(moonRAHours1);
        var moonRASec = paMacros.decimalHoursSecond(moonRAHours1);
        var moonDecDeg = paMacros.decimalDegreesDegrees(moonDecDeg1);
        var moonDecMin = paMacros.decimalDegreesMinutes(moonDecDeg1);
        var moonDecSec = paMacros.decimalDegreesSeconds(moonDecDeg1);
        var earthMoonDistKM = paUtils.round(earthMoonDistanceKM, 0);
        var moonHorParallaxDeg = paUtils.round(moonHorPara, 6);

        return [moonRAHour, moonRAMin, moonRASec, moonDecDeg, moonDecMin, moonDecSec, earthMoonDistKM, moonHorParallaxDeg];
    }

    /**
     * Calculate Moon phase and position angle of bright limb.
     */
    static moonPhase(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, accuracyLevel) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var sunLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var [moonLongDeg, moonLatDeg, moonHorPara] = paMacros.moonLongLatHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var dRad = paUtils.degreesToRadians(moonLongDeg - sunLongDeg);

        var moonPhase1 = (accuracyLevel == paTypes.AccuracyLevel.Precise) ? paMacros.moonPhase(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) : (1.0 - Math.cos(dRad)) / 2.0;

        var sunRARad = paUtils.degreesToRadians(paMacros.ecRA(sunLongDeg, 0, 0, 0, 0, 0, gdateDay, gdateMonth, gdateYear));
        var moonRARad = paUtils.degreesToRadians(paMacros.ecRA(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
        var sunDecRad = paUtils.degreesToRadians(paMacros.ecDec(sunLongDeg, 0, 0, 0, 0, 0, gdateDay, gdateMonth, gdateYear));
        var moonDecRad = paUtils.degreesToRadians(paMacros.ecDec(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));

        var y = Math.cos(sunDecRad) * Math.sin(sunRARad - moonRARad);
        var x = Math.cos(moonDecRad) * Math.sin(sunDecRad) - Math.sin(moonDecRad) * Math.cos(sunDecRad) * Math.cos(sunRARad - moonRARad);

        var chiDeg = paMacros.degrees(Math.atan2(y, x));

        var moonPhase = paUtils.round(moonPhase1, 2);
        var paBrightLimbDeg = paUtils.round(chiDeg, 2);

        return [moonPhase, paBrightLimbDeg];
    }

    /**
     * Calculate new moon and full moon instances.
     */
    static timesOfNewMoonAndFullMoon(isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var jdOfNewMoonDays = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var jdOfFullMoonDays = paMacros.fullMoon(3, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var gDateOfNewMoonDay = paMacros.julianDateDay(jdOfNewMoonDays);
        var integerDay1 = Math.floor(gDateOfNewMoonDay);
        var gDateOfNewMoonMonth = paMacros.julianDateMonth(jdOfNewMoonDays);
        var gDateOfNewMoonYear = paMacros.julianDateYear(jdOfNewMoonDays);

        var gDateOfFullMoonDay = paMacros.julianDateDay(jdOfFullMoonDays);
        var integerDay2 = Math.floor(gDateOfFullMoonDay);
        var gDateOfFullMoonMonth = paMacros.julianDateMonth(jdOfFullMoonDays);
        var gDateOfFullMoonYear = paMacros.julianDateYear(jdOfFullMoonDays);

        var utOfNewMoonHours = 24.0 * (gDateOfNewMoonDay - integerDay1);
        var utOfFullMoonHours = 24.0 * (gDateOfFullMoonDay - integerDay2);
        var lctOfNewMoonHours = paMacros.universalTimeToLocalCivilTime(utOfNewMoonHours + 0.008333, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var lctOfFullMoonHours = paMacros.universalTimeToLocalCivilTime(utOfFullMoonHours + 0.008333, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);

        var nmLocalTimeHour = paMacros.decimalHoursHour(lctOfNewMoonHours);
        var nmLocalTimeMin = paMacros.decimalHoursMinute(lctOfNewMoonHours);
        var nmLocalDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var nmLocalDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var nmLocalDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
        var fmLocalTimeHour = paMacros.decimalHoursHour(lctOfFullMoonHours);
        var fmLocalTimeMin = paMacros.decimalHoursMinute(lctOfFullMoonHours);
        var fmLocalDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var fmLocalDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);
        var fmLocalDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);

        return [nmLocalTimeHour, nmLocalTimeMin, nmLocalDateDay, nmLocalDateMonth, nmLocalDateYear, fmLocalTimeHour, fmLocalTimeMin, fmLocalDateDay, fmLocalDateMonth, fmLocalDateYear];
    }

    /**
     * Calculate Moon's distance, angular diameter, and horizontal parallax.
     */
    static moonDistAngDiamHorParallax(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var moonDistance = paMacros.moonDist(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var moonAngularDiameter = paMacros.moonSize(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var moonHorizontalParallax = paMacros.moonHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var earthMoonDist = paUtils.round(moonDistance, 0);
        var angDiameterDeg = paMacros.decimalDegreesDegrees(moonAngularDiameter + 0.008333);
        var angDiameterMin = paMacros.decimalDegreesMinutes(moonAngularDiameter + 0.008333);
        var horParallaxDeg = paMacros.decimalDegreesDegrees(moonHorizontalParallax);
        var horParallaxMin = paMacros.decimalDegreesMinutes(moonHorizontalParallax);
        var horParallaxSec = paMacros.decimalDegreesSeconds(moonHorizontalParallax);

        return [earthMoonDist, angDiameterDeg, angDiameterMin, horParallaxDeg, horParallaxMin, horParallaxSec];
    }

    /**
     * Calculate date/time of local moonrise and moonset.
     */
    static moonriseAndMoonset(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var localTimeOfMoonriseHours = paMacros.moonRiseLCT(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
        var [moonRiseLCResult_dy1, moonRiseLCResult_mn1, moonRiseLCResult_yr1] = paMacros.moonRiseLcDMY(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
        var localAzimuthDeg1 = paMacros.moonRiseAz(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);

        var localTimeOfMoonsetHours = paMacros.moonSetLCT(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
        var [moonSetLCResult_dy1, moonSetLCResult_mn1, moonSetLCResult_yr1] = paMacros.moonSetLcDMY(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
        var localAzimuthDeg2 = paMacros.moonSetAz(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);

        var mrLTHour = paMacros.decimalHoursHour(localTimeOfMoonriseHours + 0.008333);
        var mrLTMin = paMacros.decimalHoursMinute(localTimeOfMoonriseHours + 0.008333);
        var mrLocalDateDay = moonRiseLCResult_dy1;
        var mrLocalDateMonth = moonRiseLCResult_mn1;
        var mrLocalDateYear = moonRiseLCResult_yr1;
        var mrAzimuthDeg = paUtils.round(localAzimuthDeg1, 2);
        var msLTHour = paMacros.decimalHoursHour(localTimeOfMoonsetHours + 0.008333);
        var msLTMin = paMacros.decimalHoursMinute(localTimeOfMoonsetHours + 0.008333);
        var msLocalDateDay = moonSetLCResult_dy1;
        var msLocalDateMonth = moonSetLCResult_mn1;
        var msLocalDateYear = moonSetLCResult_yr1;
        var msAzimuthDeg = paUtils.round(localAzimuthDeg2, 2);

        return [mrLTHour, mrLTMin, mrLocalDateDay, mrLocalDateMonth, mrLocalDateYear, mrAzimuthDeg, msLTHour, msLTMin, msLocalDateDay, msLocalDateMonth, msLocalDateYear, msAzimuthDeg];
    }
}

class paPlanet {
    /**
     * Calculate approximate position of a planet.
     */
    static approximatePositionOfPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var [planetInfo_name, planetInfo_tp_PeriodOrbit, planetInfo_long_LongitudeEpoch, planetInfo_peri_LongitudePerihelion, planetInfo_ecc_EccentricityOrbit, planetInfo_axis_AxisOrbit, planetInfo_incl_OrbitalInclination, planetInfo_node_LongitudeAscendingNode, planetInfo_theta0_AngularDiameter, planetInfo_v0_VisualMagnitude] = paPlanetData.getPlanetData(planetName);

        var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var utHours = paMacros.localCivilTimeToUniversalTime(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var dDays = paMacros.civilDateToJulianDate(gdateDay + (utHours / 24), gdateMonth, gdateYear) - paMacros.civilDateToJulianDate(0, 1, 2010);
        var npDeg1 = 360 * dDays / (365.242191 * Number(planetInfo_tp_PeriodOrbit));
        var npDeg2 = npDeg1 - 360 * Math.floor(npDeg1 / 360);
        var mpDeg = npDeg2 + Number(planetInfo_long_LongitudeEpoch) - Number(planetInfo_peri_LongitudePerihelion);
        var lpDeg1 = npDeg2 + (360 * Number(planetInfo_ecc_EccentricityOrbit) * Math.sin(paUtils.degreesToRadians(mpDeg)) / Math.PI) + Number(planetInfo_long_LongitudeEpoch);
        var lpDeg2 = lpDeg1 - 360 * Math.floor(lpDeg1 / 360);
        var planetTrueAnomalyDeg = lpDeg2 - Number(planetInfo_peri_LongitudePerihelion);
        var rAU = Number(planetInfo_axis_AxisOrbit) * (1 - Math.pow(Number(planetInfo_ecc_EccentricityOrbit), 2)) / (1 + Number(planetInfo_ecc_EccentricityOrbit) * Math.cos(paUtils.degreesToRadians(planetTrueAnomalyDeg)));

        var [earthInfo_name, earthInfo_tp_PeriodOrbit, earthInfo_long_LongitudeEpoch, earthInfo_peri_LongitudePerihelion, earthInfo_ecc_EccentricityOrbit, earthInfo_axis_AxisOrbit, earthInfo_incl_OrbitalInclination, earthInfo_node_LongitudeAscendingNode, earthInfo_theta0_AngularDiameter, earthInfo_v0_VisualMagnitude] = paPlanetData.getPlanetData(paPlanetData.planetNames.earth);

        var neDeg1 = 360 * dDays / (365.242191 * Number(earthInfo_tp_PeriodOrbit));
        var neDeg2 = neDeg1 - 360 * Math.floor(neDeg1 / 360);
        var meDeg = neDeg2 + Number(earthInfo_long_LongitudeEpoch) - Number(earthInfo_peri_LongitudePerihelion);
        var leDeg1 = neDeg2 + Number(earthInfo_long_LongitudeEpoch) + 360 * Number(earthInfo_ecc_EccentricityOrbit) * Math.sin(paUtils.degreesToRadians(meDeg)) / Math.PI;
        var leDeg2 = leDeg1 - 360 * Math.floor(leDeg1 / 360);
        var earthTrueAnomalyDeg = leDeg2 - Number(earthInfo_peri_LongitudePerihelion);
        var rAU2 = Number(earthInfo_axis_AxisOrbit) * (1 - Math.pow(Number(earthInfo_ecc_EccentricityOrbit), 2)) / (1 + Number(earthInfo_ecc_EccentricityOrbit) * Math.cos(paUtils.degreesToRadians(earthTrueAnomalyDeg)));
        var lpNodeRad = paUtils.degreesToRadians(lpDeg2 - Number(planetInfo_node_LongitudeAscendingNode));
        var psiRad = Math.asin(Math.sin(lpNodeRad) * Math.sin(paUtils.degreesToRadians(Number(planetInfo_incl_OrbitalInclination))));
        var y = Math.sin(lpNodeRad) * Math.cos(paUtils.degreesToRadians(Number(planetInfo_incl_OrbitalInclination)));
        var x = Math.cos(lpNodeRad);
        var ldDeg = paMacros.degrees(Math.atan2(y, x)) + Number(planetInfo_node_LongitudeAscendingNode);
        var rdAU = rAU * Math.cos(psiRad);
        var leLdRad = paUtils.degreesToRadians(leDeg2 - ldDeg);
        var atan2Type1 = Math.atan2((rdAU * Math.sin(leLdRad)), (rAU2 - rdAU * Math.cos(leLdRad)));
        var atan2Type2 = Math.atan2((rAU2 * Math.sin(-leLdRad)), (rdAU - rAU2 * Math.cos(leLdRad)));
        var aRad = (rdAU < 1) ? atan2Type1 : atan2Type2;
        var lamdaDeg1 = (rdAU < 1) ? 180 + leDeg2 + paMacros.degrees(aRad) : paMacros.degrees(aRad) + ldDeg;
        var lamdaDeg2 = lamdaDeg1 - 360 * Math.floor(lamdaDeg1 / 360);
        var betaDeg = paMacros.degrees(Math.atan(rdAU * Math.tan(psiRad) * Math.sin(paUtils.degreesToRadians(lamdaDeg2 - ldDeg)) / (rAU2 * Math.sin(-leLdRad))));
        var raHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(lamdaDeg2, 0, 0, betaDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
        var decDeg = paMacros.ecDec(lamdaDeg2, 0, 0, betaDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

        var planetRAHour = paMacros.decimalHoursHour(raHours);
        var planetRAMin = paMacros.decimalHoursMinute(raHours);
        var planetRASec = paMacros.decimalHoursSecond(raHours);
        var planetDecDeg = paMacros.decimalDegreesDegrees(decDeg);
        var planetDecMin = paMacros.decimalDegreesMinutes(decDeg);
        var planetDecSec = paMacros.decimalDegreesSeconds(decDeg);

        return [planetRAHour, planetRAMin, planetRASec, planetDecDeg, planetDecMin, planetDecSec];
    }

    /**
     * Calculate precise position of a planet.
     */
    static precisePositionOfPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect] = paMacros.planetCoordinates(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName);

        var planetRAHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));
        var planetDecDeg1 = paMacros.ecDec(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear);

        var planetRAHour = paMacros.decimalHoursHour(planetRAHours);
        var planetRAMin = paMacros.decimalHoursMinute(planetRAHours);
        var planetRASec = paMacros.decimalHoursSecond(planetRAHours);
        var planetDecDeg = paMacros.decimalDegreesDegrees(planetDecDeg1);
        var planetDecMin = paMacros.decimalDegreesMinutes(planetDecDeg1);
        var planetDecSec = paMacros.decimalDegreesSeconds(planetDecDeg1);

        return [planetRAHour, planetRAMin, planetRASec, planetDecDeg, planetDecMin, planetDecSec];
    }

    /**
     * Calculate several visual aspects of a planet.
     */
    static visualAspectsOfAPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

        var [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect] = paMacros.planetCoordinates(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName);

        var planetRARad = paUtils.degreesToRadians(paMacros.ecRA(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));
        var planetDecRad = paUtils.degreesToRadians(paMacros.ecDec(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));

        var lightTravelTimeHours = planetDistanceAU * 0.1386;

        var [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude] = paPlanetData.getPlanetData(planetName);

        var angularDiameterArcsec = Number(theta0_AngularDiameter) / planetDistanceAU;
        var phase1 = 0.5 * (1.0 + Math.cos(paUtils.degreesToRadians(planetLongitude - planetHLong1)));

        var sunEclLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
        var sunRARad = paUtils.degreesToRadians(paMacros.ecRA(sunEclLongDeg, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));
        var sunDecRad = paUtils.degreesToRadians(paMacros.ecDec(sunEclLongDeg, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));

        var y = Math.cos(sunDecRad) * Math.sin(sunRARad - planetRARad);
        var x = Math.cos(planetDecRad) * Math.sin(sunDecRad) - Math.sin(planetDecRad) * Math.cos(sunDecRad) * Math.cos(sunRARad - planetRARad);

        var chiDeg = paMacros.degrees(Math.atan2(y, x));
        var radiusVectorAU = planetRVect;
        var approximateMagnitude1 = 5.0 * Math.log10(radiusVectorAU * planetDistanceAU / (Math.sqrt(phase1))) + Number(v0_VisualMagnitude);

        var distanceAU = paUtils.round(planetDistanceAU, 5);
        var angDiaArcsec = paUtils.round(angularDiameterArcsec, 1);
        var phase = paUtils.round(phase1, 2);
        var lightTimeHour = paMacros.decimalHoursHour(lightTravelTimeHours);
        var lightTimeMinutes = paMacros.decimalHoursMinute(lightTravelTimeHours);
        var lightTimeSeconds = paMacros.decimalHoursSecond(lightTravelTimeHours);
        var posAngleBrightLimbDeg = paUtils.round(chiDeg, 1);
        var approximateMagnitude = paUtils.round(approximateMagnitude1, 1);

        return [distanceAU, angDiaArcsec, phase, lightTimeHour, lightTimeMinutes, lightTimeSeconds, posAngleBrightLimbDeg, approximateMagnitude];
    }
}

class paPlanetData {
    static planetNames = {
        mercury: "Mercury",
        venus: "Venus",
        earth: "Earth",
        mars: "Mars",
        jupiter: "Jupiter",
        saturn: "Saturn",
        uranus: "Uranus",
        neptune: "Neptune"
    };

    /**
     * Planet Data
     * 
     * Elements:
     *   0: Name
     *   1: tp_PeriodOrbit
     *   2: long_LongitudeEpoch
     *   3: peri_LongitudePerihelion
     *   4: ecc_EccentricityOrbit 
     *   5: axis_AxisOrbit 
     *   6: incl_OrbitalInclination 
     *   7: node_LongitudeAscendingNode 
     *   8: theta0_AngularDiameter 
     *   9: v0_VisualMagnitude 
     */
    static planetData = [
        [this.planetNames.mercury, 0.24085, 75.5671, 77.612, 0.205627, 0.387098, 7.0051, 48.449, 6.74, -0.42],
        [this.planetNames.venus, 0.615207, 272.30044, 131.54, 0.006812, 0.723329, 3.3947, 76.769, 16.92, -4.4],
        [this.planetNames.earth, 0.999996, 99.556772, 103.2055, 0.016671, 0.999985, -99.0, -99.0, -99.0, -99.0],
        [this.planetNames.mars, 1.880765, 109.09646, 336.217, 0.093348, 1.523689, 1.8497, 49.632, 9.36, -1.52],
        [this.planetNames.jupiter, 11.857911, 337.917132, 14.6633, 0.048907, 5.20278, 1.3035, 100.595, 196.74, -9.4],
        [this.planetNames.saturn, 29.310579, 172.398316, 89.567, 0.053853, 9.51134, 2.4873, 113.752, 165.6, -8.88],
        [this.planetNames.uranus, 84.039492, 356.135400, 172.884833, 0.046321, 19.21814, 0.773059, 73.926961, 65.8, -7.19],
        [this.planetNames.neptune, 165.845392, 326.895127, 23.07, 0.010483, 30.1985, 1.7673, 131.879, 62.2, -6.87]
    ];

    static getPlanetData(planetName) {
        let [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude] = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99];

        for (let iLoop = 0; iLoop < this.planetData.length; iLoop++) {
            if (this.planetData[iLoop][0] == planetName) {
                planet_name = String(this.planetData[iLoop][0]);
                tp_PeriodOrbit = Number(this.planetData[iLoop][1]);
                long_LongitudeEpoch = Number(this.planetData[iLoop][2]);
                peri_LongitudePerihelion = Number(this.planetData[iLoop][3]);
                ecc_EccentricityOrbit = Number(this.planetData[iLoop][4]);
                axis_AxisOrbit = Number(this.planetData[iLoop][5]);
                incl_OrbitalInclination = Number(this.planetData[iLoop][6]);
                node_LongitudeAscendingNode = Number(this.planetData[iLoop][7]);
                theta0_AngularDiameter = Number(this.planetData[iLoop][8]);
                v0_VisualMagnitude = Number(this.planetData[iLoop][9]);

                break;
            }
        }

        return [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude];
    }
}

class paSun {
    /**
     * Calculate approximate position of the sun for a local date and time.
     */
    static approximatePositionOfSun(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
        var daylightSaving = (isDaylightSaving == true) ? 1 : 0;

        var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var utHours = paMacros.localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var utDays = utHours / 24;
        var jdDays = paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) + utDays;
        var dDays = jdDays - paMacros.civilDateToJulianDate(0, 1, 2010);
        var nDeg = 360 * dDays / 365.242191;
        var mDeg1 = nDeg + paMacros.sunELong(0, 1, 2010) - paMacros.sunPeri(0, 1, 2010);
        var mDeg2 = mDeg1 - 360 * Math.floor(mDeg1 / 360);
        var eCDeg = 360 * paMacros.sunEcc(0, 1, 2010) * Math.sin(paUtils.degreesToRadians(mDeg2)) / Math.PI;
        var lSDeg1 = nDeg + eCDeg + paMacros.sunELong(0, 1, 2010);
        var lSDeg2 = lSDeg1 - 360 * Math.floor(lSDeg1 / 360);
        var raDeg = paMacros.ecRA(lSDeg2, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);
        var raHours = paMacros.decimalDegreesToDegreeHours(raDeg);
        var decDeg = paMacros.ecDec(lSDeg2, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);

        var sunRAHour = paMacros.decimalHoursHour(raHours);
        var sunRAMin = paMacros.decimalHoursMinute(raHours);
        var sunRASec = paMacros.decimalHoursSecond(raHours);
        var sunDecDeg = paMacros.decimalDegreesDegrees(decDeg);
        var sunDecMin = paMacros.decimalDegreesMinutes(decDeg);
        var sunDecSec = paMacros.decimalDegreesSeconds(decDeg);

        return [sunRAHour, sunRAMin, sunRASec, sunDecDeg, sunDecMin, sunDecSec];
    }

    /**
     * Calculate precise position of the sun for a local date and time.
     */
    static precisePositionOfSun(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
        var daylightSaving = (isDaylightSaving == true) ? 1 : 0;

        var gDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var gMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var gYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var sunEclipticLongitudeDeg = paMacros.sunLong(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var raDeg = paMacros.ecRA(sunEclipticLongitudeDeg, 0, 0, 0, 0, 0, gDay, gMonth, gYear);
        var raHours = paMacros.decimalDegreesToDegreeHours(raDeg);
        var decDeg = paMacros.ecDec(sunEclipticLongitudeDeg, 0, 0, 0, 0, 0, gDay, gMonth, gYear);

        var sunRAHour = paMacros.decimalHoursHour(raHours);
        var sunRAMin = paMacros.decimalHoursMinute(raHours);
        var sunRASec = paMacros.decimalHoursSecond(raHours);
        var sunDecDeg = paMacros.decimalDegreesDegrees(decDeg);
        var sunDecMin = paMacros.decimalDegreesMinutes(decDeg);
        var sunDecSec = paMacros.decimalDegreesSeconds(decDeg);

        return [sunRAHour, sunRAMin, sunRASec, sunDecDeg, sunDecMin, sunDecSec];
    }

    /**
     * Calculate distance to the Sun (in km), and angular size.
     */
    static sunDistanceAndAngularSize(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var gDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var gMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var gYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var trueAnomalyDeg = paMacros.sunTrueAnomaly(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
        var trueAnomalyRad = paUtils.degreesToRadians(trueAnomalyDeg);
        var eccentricity = paMacros.sunEcc(gDay, gMonth, gYear);
        var f = (1 + eccentricity * Math.cos(trueAnomalyRad)) / (1 - eccentricity * eccentricity);
        var rKm = 149598500 / f;
        var thetaDeg = f * 0.533128;

        var sunDistKm = paUtils.round(rKm, 0);
        var sunAngSizeDeg = paMacros.decimalDegreesDegrees(thetaDeg);
        var sunAngSizeMin = paMacros.decimalDegreesMinutes(thetaDeg);
        var sunAngSizeSec = paMacros.decimalDegreesSeconds(thetaDeg);

        return [sunDistKm, sunAngSizeDeg, sunAngSizeMin, sunAngSizeSec];
    }

    /**
       * Calculate local sunrise and sunset.
     */
    static sunriseAndSunset(localDay, localMonth, localYear, isDaylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var localSunriseHours = paMacros.sunriseLCT(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg);
        var localSunsetHours = paMacros.sunsetLCT(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg);

        var sunRiseSetStatus = paMacros.eSunRS(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg);

        var adjustedSunriseHours = localSunriseHours + 0.008333;
        var adjustedSunsetHours = localSunsetHours + 0.008333;

        var azimuthOfSunriseDeg1 = paMacros.sunriseAZ(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg);
        var azimuthOfSunsetDeg1 = paMacros.sunsetAZ(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg);

        var localSunriseHour = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paMacros.decimalHoursHour(adjustedSunriseHours) : 0;
        var localSunriseMinute = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paMacros.decimalHoursMinute(adjustedSunriseHours) : 0;

        var localSunsetHour = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paMacros.decimalHoursHour(adjustedSunsetHours) : 0;
        var localSunsetMinute = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paMacros.decimalHoursMinute(adjustedSunsetHours) : 0;

        var azimuthOfSunriseDeg = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paUtils.round(azimuthOfSunriseDeg1, 2) : 0;
        var azimuthOfSunsetDeg = (sunRiseSetStatus == paTypes.RiseSetCalcStatus.OK) ? paUtils.round(azimuthOfSunsetDeg1, 2) : 0;

        var status = sunRiseSetStatus;

        return [localSunriseHour, localSunriseMinute, localSunsetHour, localSunsetMinute, azimuthOfSunriseDeg, azimuthOfSunsetDeg, status];
    }

    /**
       * Calculate times of morning and evening twilight.
     */
    static morningAndEveningTwilight(localDay, localMonth, localYear, isDaylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg, twilightType) {
        var daylightSaving = (isDaylightSaving) ? 1 : 0;

        var startOfAMTwilightHours = paMacros.twilightAMLCT(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg, twilightType);

        var endOfPMTwilightHours = paMacros.twilightPMLCT(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg, twilightType);

        var twilightStatus = paMacros.eTwilight(localDay, localMonth, localYear, daylightSaving, zoneCorrection, geographicalLongDeg, geographicalLatDeg, twilightType);

        var adjustedAMStartTime = startOfAMTwilightHours + 0.008333;
        var adjustedPMStartTime = endOfPMTwilightHours + 0.008333;

        var amTwilightBeginsHour = (twilightStatus == paTypes.TwilightStatus.OK) ? paMacros.decimalHoursHour(adjustedAMStartTime) : -99;
        var amTwilightBeginsMin = (twilightStatus == paTypes.TwilightStatus.OK) ? paMacros.decimalHoursMinute(adjustedAMStartTime) : -99;

        var pmTwilightEndsHour = (twilightStatus == paTypes.TwilightStatus.OK) ? paMacros.decimalHoursHour(adjustedPMStartTime) : -99;
        var pmTwilightEndsMin = (twilightStatus == paTypes.TwilightStatus.OK) ? paMacros.decimalHoursMinute(adjustedPMStartTime) : -99;

        var status = twilightStatus;

        return [amTwilightBeginsHour, amTwilightBeginsMin, pmTwilightEndsHour, pmTwilightEndsMin, status];
    }

    /**
       * Calculate the equation of time. (The difference between the real Sun time and the mean Sun time.)
     */
    static equationOfTime(gwdateDay, gwdateMonth, gwdateYear) {
        var sunLongitudeDeg = paMacros.sunLong(12, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var sunRAHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(sunLongitudeDeg, 0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
        var equivalentUTHours = paMacros.greenwichSiderealTimeToUniversalTime(sunRAHours, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var equationOfTimeHours = equivalentUTHours - 12;

        var equationOfTimeMin = paMacros.decimalHoursMinute(equationOfTimeHours);
        var equationOfTimeSec = paMacros.decimalHoursSecond(equationOfTimeHours);

        return [equationOfTimeMin, equationOfTimeSec];
    }

    /**
     * Calculate solar elongation for a celestial body.
     *
     * Solar elongation is the angle between the lines of sight from the Earth to the Sun and from the Earth to the celestial body.
     */
    static solarElongation(raHour, raMin, raSec, decDeg, decMin, decSec, gwdateDay, gwdateMonth, gwdateYear) {
        var sunLongitudeDeg = paMacros.sunLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var sunRAHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(sunLongitudeDeg, 0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
        var sunDecDeg = paMacros.ecDec(sunLongitudeDeg, 0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
        var solarElongationDeg = paMacros.angle(sunRAHours, 0, 0, sunDecDeg, 0, 0, raHour, raMin, raSec, decDeg, decMin, decSec, paTypes.AngleMeasure.Hours);

        return paUtils.round(solarElongationDeg, 2);
    }
}

class paTypes {
    static AccuracyLevel = {
        Approximate: 'Approximate',
        Precise: 'Precise'
    };

    /** Angle measurement units */
    static AngleMeasure = {
        Degrees: 'Degrees',
        Hours: 'Hours'
    };

    static CoordinateType = {
        True: 'True',
        Apparent: 'Apparent'
    };

    static RiseSetCalcStatus = {
        OK: 'OK',
        ConversionWarning: 'GST to UT conversion warning'
    };

    static RiseSetStatus = {
        OK: 'OK',
        NeverRises: 'NeverRises',
        Circumpolar: 'Circumpolar'
    };

    static LunarEclipseOccurrence = {
        None: "No lunar eclipse",
        Possible: "Lunar eclipse possible",
        Certain: "Lunar eclipse certain"
    };

    static SolarEclipseOccurrence = {
        None: "No solar eclipse",
        Possible: "Solar eclipse possible",
        Certain: "Solar eclipse certain"
    };

    static TwilightStatus = {
        OK: 'OK',
        AllNight: 'Lasts all night',
        TooFarBelowHorizon: 'Sun too far below horizon',
        ConversionWarning: 'GST to UT conversion warning'
    };

    static TwilightType = {
        Civil: 6,
        Nautical: 12,
        Astronomical: 18
    };

    /** Warning flags for calculation results */
    static WarningFlag = {
        OK: 'OK',
        Warning: 'Warning'
    };
}

class paUtils {
    /** Determine if year is a leap year. */
    static isLeapYear(inputYear) {
        var year = inputYear;

        if (year % 4 == 0) {
            if (year % 100 == 0)
                return (year % 400 == 0) ? true : false;
            else
                return true;
        }
        else
            return false;
    }

    /** Round a number (value) to specified number of decimal places (precision) */
    static round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);

        return Math.round(value * multiplier) / multiplier;
    }

    /** Convert radians to degrees. */
    static radiansToDegrees(radians) {
        return radians * Math.PI / 180;
    }

    /** Convert degrees to radians. */
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = {
    paBinary, paBinaryData,
    paComet, paCometData,
    paCoordinates,
    paDateTime,
    paEclipses,
    paMoon,
    paPlanet, paPlanetData,
    paSun,
    paMacros, paTypes, paUtils
}