var DC = (function() {
    function calculate(date1, date2) {
        if (!date1 || !date2) return 0; // Проверува дали date1 или date2 се празни/невалидни; ако е така, враќа 0 за да избегне грешки.
        return date2 instanceof Date ? difference(date1, date2) : addDuration(date1, date2); // Ако date2 е објект од тип Date, повикува difference за разлика; ако не, повикува addDuration за додавање траење.
    }
  
    function addDuration(date, duration) { // Дефинира функција за додавање на траење (години, месеци, денови) на даден датум.
        return new Date( // Враќа нов Date објект со ажурирани вредности за година, месец и ден.
            date.getFullYear() + (duration[0] || 0), // Додава години од duration[0] на тековната година; ако нема вредност, додава 0.
            date.getMonth() + (duration[1] || 0), // Додава месеци од duration[1] на тековниот месец; ако нема вредност, додава 0.
            date.getDate() + (duration[2] || 0) // Додава денови од duration[2] на тековниот ден; ако нема вредност, додава 0.
        );
    }
  
    function difference(date1, date2) { // Дефинира функција за пресметка на разликата помеѓу два датума (date1 и date2).
        date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()); // Нормализира date1 до почеток на денот (без часови, минути, секунди).
        date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()); // Нормализира date2 до почеток на денот за конзистентност.
        
        var time1 = date1.getTime(), // Претвора date1 во милисекунди од 1 јануари 1970 (Unix timestamp).
            time2 = date2.getTime(); // Претвора date2 во милисекунди од 1 јануари 1970 (Unix timestamp).
        
        if (time1 > time2) return difference(date2, date1); // Ако date1 е по date2, ги заменува местата
        
        var daysDiff = Math.round((time2 - time1) / 86400000); // Пресметува разлика во денови со делење на разликата во милисекунди со 86400000 (број на милисекунди во еден ден).
        var year1 = date1.getFullYear(), // Зема година од date1.
            year2 = date2.getFullYear(), // Зема година од date2.
            month1 = date1.getMonth(), // Зема месец од date1 (0-11).
            month2 = date2.getMonth(), // Зема месец од date2 (0-11).
            day1 = date1.getDate(), // Зема ден од date1.
            day2 = date2.getDate(); // Зема ден од date2.
  
        if (day1 > day2) {
            day2 += daysInMonth(++month1, year1);
        }
        if (month1 > month2) { 
            month2 += 12;
            year1++;
        }
        
        return [
            year2 - year1,
            month2 - month1,
            day2 - day1,
            daysDiff
        ];
    }
  
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
    
    return calculate;
})();

var DP = (function() {
    function parse(input, isEndDate) {
        var str = input.toLowerCase().trim();
        if (!str) return null;

        // Initial date (d1) formats
        if (!isEndDate) {
            if (str === "денес" || str === "today") return new Date();
            const dmyRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
            const dmyMatch = str.match(dmyRegex);
            if (str === "утре" || str === "tomorrow") {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                return date;
            }
            if (dmyMatch) {
                const day = parseInt(dmyMatch[1], 10);
                const month = parseInt(dmyMatch[2], 10) - 1;
                const year = parseInt(dmyMatch[3], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime()) && day <= daysInMonth(month + 1, year)) return date;
            }
            const monthRegex = /^([а-я]+)\s+(\d{1,2}),?\s*(\d{4})|(\d{1,2})\s*([а-я]+),?\s*(\d{4})$/;
            const monthMatch = str.match(monthRegex);
            if (monthMatch) {
                let day, month, year;
                if (monthMatch[1]) { // Ноември 15, 2025
                    const monthName = monthMatch[1];
                    day = parseInt(monthMatch[2], 10);
                    year = parseInt(monthMatch[3], 10);
                    month = months.findIndex(m => m.toLowerCase().startsWith(monthName));
                } else if (monthMatch[4]) { // 15 Ноември, 2025
                    day = parseInt(monthMatch[4], 10);
                    const monthName = monthMatch[5];
                    year = parseInt(monthMatch[6], 10);
                    month = months.findIndex(m => m.toLowerCase().startsWith(monthName));
                }
                if (month !== -1) {
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime()) && day <= daysInMonth(month + 1, year)) return date;
                }
            }
            return null;
        }

        // End date (d2) formats
        if (isEndDate) {
            if (str === "утре" || str === "tomorrow") {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                return date;
            }
            const dmyRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
            const dmyMatch = str.match(dmyRegex);
            if (dmyMatch) {
                const day = parseInt(dmyMatch[1], 10);
                const month = parseInt(dmyMatch[2], 10) - 1;
                const year = parseInt(dmyMatch[3], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime()) && day <= daysInMonth(month + 1, year)) return date;
            }
            const monthRegex = /^([а-я]+)\s+(\d{1,2}),?\s*(\d{4})|(\d{1,2})\s*([а-я]+),?\s*(\d{4})$/;
            const monthMatch = str.match(monthRegex);
            if (monthMatch) {
                let day, month, year;
                if (monthMatch[1]) { // Ноември 15, 2025
                    const monthName = monthMatch[1];
                    day = parseInt(monthMatch[2], 10);
                    year = parseInt(monthMatch[3], 10);
                    month = months.findIndex(m => m.toLowerCase().startsWith(monthName));
                } else if (monthMatch[4]) { // 15 Ноември, 2025
                    day = parseInt(monthMatch[4], 10);
                    const monthName = monthMatch[5];
                    year = parseInt(monthMatch[6], 10);
                    month = months.findIndex(m => m.toLowerCase().startsWith(monthName));
                }
                if (month !== -1) {
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime()) && day <= daysInMonth(month + 1, year)) return date;
                }
            }
            // Duration formats (e.g., +n години, -n дена)
            const durationRegex = /^([\+\-])\s*(\d+)\s*(години|месеци|недели|дена)$/;
            const durationMatch = str.match(durationRegex);
            if (durationMatch) {
                const operation = durationMatch[1] === '-' ? -1 : 1;
                const value = parseInt(durationMatch[2], 10);
                const unit = durationMatch[3];
                let duration = [0, 0, 0]; // [years, months, days]
                switch (unit) {
                    case 'години': duration[0] = operation * value; break;
                    case 'месеци': duration[1] = operation * value; break;
                    case 'недели': duration[2] = operation * value * 7; break;
                    case 'дена': duration[2] = operation * value; break;
                }
                return duration;
            }
            return null;
        }
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    var months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];
    return parse;
})();

var app = (function() {
    var startInput, endInput, resultHeader, subText, otherSection, otherList;

    function init() {
        startInput = document.getElementById("d1");
        endInput = document.getElementById("d2");
        resultHeader = document.getElementById("result1");
        subText = document.getElementById("sub");
        otherSection = document.getElementById("otherSection");
        otherList = document.getElementById("otherList");
        
        document.getElementById("mdlO").addEventListener("click", toggleModal);
        document.getElementById("mdlX").addEventListener("click", toggleModal);
        
        startInput.addEventListener("keyup", update);
        endInput.addEventListener("keyup", update);
        
        update();
        setInterval(update, 1000); // Continuous update (1000 miliseconds = 1 sec)
    }
  
    function update(e) {
        if (e && e.keyCode === 13) {
            e.preventDefault();
            endInput.focus();
        }
        
        var startVal = startInput.value,
            endVal = endInput.value,
            startDate = DP(startVal, false), // false for initial date
            endDateOrDuration = DP(endVal, true), // true for end date/duration
            result = DC(startDate, endDateOrDuration);
            
        resultHeader.innerHTML = "";
        subText.innerHTML = "";
        otherList.innerHTML = "";
        otherSection.classList.add("hidden");

        if (!result) {
            resultHeader.innerHTML = "Се чека внес...";
            if (startVal || endVal) {
                subText.innerHTML = formatDate(startDate, startVal) + 
                    (startDate ? " – " : "") + formatDate(endDateOrDuration, endVal);
            }
            return;
        }
  
        if (result instanceof Date) {
            resultHeader.innerHTML = formatDate(result);
            subText.innerHTML = formatDate(startDate) + " – " + formatDate(result);
        } else {
            var years = result[0],
                months = result[1],
                days = result[2],
                daysTotal = result[3];
            
            var yearLabel = years === 1 ? "година" : "години";
            var monthLabel = months === 1 ? "месец" : "месеци";
            var dayLabel = days === 1 ? "ден" : "дена";
            var totalDayLabel = daysTotal === 1 ? "ден" : "дена";

            var mainResult = (years > 0 ? `${years} ${yearLabel}, ` : "") +
                            (months > 0 ? `${months} ${monthLabel}, ` : "") +
                            (days > 0 || (!years && !months) ? `${days} ${dayLabel}` : "");
            resultHeader.innerHTML = mainResult + 
                (years || months ? ` (${daysTotal} ${totalDayLabel})` : "");
            subText.innerHTML = "Помеѓу " + formatDate(startDate) + " - " + formatDate(endDateOrDuration);

            addOtherFormat(`${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}`);
            addOtherFormat(`${years * 12 + months} ${monthsTotalLabel(years * 12 + months)}, ${days} ${dayLabel}`);
            addOtherFormat(`${Math.floor(daysTotal / 7)} ${weekLabel(Math.floor(daysTotal / 7))}, ${daysTotal % 7} ${dayLabel}`);
            addOtherFormat(`${daysTotal} ${totalDayLabel}`);
            addOtherFormat(`${daysTotal * 24} ${hourLabel(daysTotal * 24)}`);
            addOtherFormat(`${daysTotal * 1440} ${minuteLabel(daysTotal * 1440)}`);
            addOtherFormat(`${daysTotal * 86400} ${secondLabel(daysTotal * 86400)}`);
            addOtherFormat(`${daysTotal * 86400000} ${millisecondLabel(daysTotal * 86400000)}`);
            
            if (otherList.innerHTML) otherSection.classList.remove("hidden");
        }
    }
  
    function formatDate(date, input) {
        if (!date) return input === "" ? "Нема Внесен Датум" : "Невалиден Датум";
        return months[date.getMonth()] + " " + ordinal(date.getDate()) + ", " + date.getFullYear();
    }
  
    function ordinal(num) {
        if (num === 1 || num === 21 || num === 31) {
            return num + "ви";
        } else if (num === 2 || num === 22) {
            return num + "ри";
        }  else if (num === 3 || num === 4 || num === 5 || num === 6 || num === 9 || num === 10 || num === 11 || num === 12 || num === 13 || num === 14 || num === 15 || num === 16 || num === 17 || num === 18 || num === 19 || num === 20 || num === 23 || num === 24 || num === 25 || num === 26 || num === 29 || num === 30) {
            return num + "ти";
        } else if (num === 7 || num === 8 || num === 27 || num === 28) {
            return num + "ми";
        } else {
            return num + "ти"; // Дополнителен случај за сите други броеви
        }
    }
  
    function monthsTotalLabel(count) {
        return count === 1 ? "месец" : "месеци";
    }
  
    function weekLabel(count) {
        return count === 1 ? "недела" : "недели";
    }
  
    function hourLabel(count) {
        return count === 1 ? "час" : "часа";
    }
  
    function minuteLabel(count) {
        return count === 1 ? "минута" : "минути";
    }
  
    function secondLabel(count) {
        return count === 1 ? "секунда" : "секунди";
    }
  
    function millisecondLabel(count) {
        return count === 1 ? "милисекунда" : "милисекунди";
    }
  
    function addOtherFormat(text) {
        if (text && !text.match(/^0 /)) {
            var li = document.createElement("li");
            li.textContent = text;
            otherList.appendChild(li);
        }
    }
  
    function toggleModal() {
        document.body.classList.toggle("mdl-visible");
        const focusElement = document.body.classList.contains("mdl-visible") 
            ? document.getElementsByClassName("close")[0]
            : document.getElementsByClassName("mdl-launch")[0];
        focusElement.focus();
    }
  
    return init;
})();

window.onload = app;

var months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];