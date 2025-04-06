var app = function() {
    let futureInput, hourSelect, minuteSelect, result, subResult, otherSection, otherList;
    const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MONTHS_MK = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];

    function init() {
        const mdlOpen = document.getElementById("mdlO");
        const mdlClose = document.getElementById("mdlX");
        futureInput = document.getElementById("futureDate");
        hourSelect = document.getElementById("hourSelect");
        minuteSelect = document.getElementById("minuteSelect");
        result = document.getElementById("result1");
        subResult = document.getElementById("sub");
        otherSection = document.getElementById("otherSection");
        otherList = document.getElementById("otherList");

        // Populate hour dropdown (00-23)
        for (let i = 0; i < 24; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = String(i).padStart(2, '0');
            hourSelect.appendChild(option);
        }

        // Populate minute dropdown (00-59)
        for (let i = 0; i < 60; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = String(i).padStart(2, '0');
            minuteSelect.appendChild(option);
        }

        // Event listeners
        futureInput.addEventListener("input", calculateCountdown);
        hourSelect.addEventListener("change", calculateCountdown);
        minuteSelect.addEventListener("change", calculateCountdown);
        mdlOpen.addEventListener("click", toggleModal);
        mdlClose.addEventListener("click", toggleModal);
        mdlOpen.classList.remove("hidden");

        // Initial calculation and continuous update
        calculateCountdown();
        setInterval(calculateCountdown, 1000);
    }

    function parseDate(input) {
        if (!input) return null;
        input = input.trim();
        let date;

        if (input.toLowerCase() === "утре" || input.toLowerCase() === "tomorrow") {
            date = new Date();
            date.setDate(date.getDate() + 1);
            return date;
        }

        if (input.toLowerCase().includes("следен божиќ") || input.toLowerCase().includes("next christmas")) {
            date = new Date();
            date.setFullYear(date.getFullYear(), 11, 25);
            if (date < new Date()) date.setFullYear(date.getFullYear() + 1);
            return date;
        }

        const dmyRegex = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
        const dmyMatch = input.match(dmyRegex);
        if (dmyMatch) {
            const day = parseInt(dmyMatch[1], 10);
            const month = parseInt(dmyMatch[2], 10) - 1;
            const year = parseInt(dmyMatch[3], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) return date;
        }

        const dateRegex = /(\d{4})[/-](\d{1,2})[/-](\d{1,2})|(\d{1,2})[/-](\d{1,2})[/-](\d{4})/;
        const dateMatch = input.match(dateRegex);
        if (dateMatch) {
            if (dateMatch[1]) { // YYYY/MM/DD
                const year = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1;
                const day = parseInt(dateMatch[3], 10);
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            } else if (dateMatch[4]) { // MM/DD/YYYY
                const month = parseInt(dateMatch[4], 10) - 1;
                const day = parseInt(dateMatch[5], 10);
                const year = parseInt(dateMatch[6], 10);
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        const monthRegex = /([а-яА-Яa-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/;
        const monthMatch = input.match(monthRegex);
        if (monthMatch) {
            const monthName = monthMatch[1];
            const day = parseInt(monthMatch[2], 10);
            const year = parseInt(monthMatch[3], 10);

            let month = MONTHS_EN.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
            if (month !== -1) {
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            }

            month = MONTHS_MK.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
            if (month !== -1) {
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        return null;
    }

    function calculateCountdown() {
        const input = futureInput.value;
        const baseDate = parseDate(input);
        const now = new Date();

        result.textContent = "Внесете иднински датум...";
        subResult.textContent = "Преостанатото време ќе се појави овде";
        otherList.innerHTML = "";
        otherSection.classList.add("hidden");

        if (!baseDate) {
            if (input) result.textContent = "Ве молиме внесете валиден датум";
            return;
        }

        const futureDate = new Date(baseDate);
        futureDate.setHours(parseInt(hourSelect.value, 10));
        futureDate.setMinutes(parseInt(minuteSelect.value, 10));
        futureDate.setSeconds(0);

        if (futureDate <= now) {
            result.textContent = "Ве молиме изберете иднински датум и време";
            return;
        }

        const diffMs = futureDate - now;
        const secondsTotal = Math.floor(diffMs / 1000);
        const minutesTotal = Math.floor(secondsTotal / 60);
        const hoursTotal = Math.floor(minutesTotal / 60);
        const daysTotal = Math.floor(hoursTotal / 24);
        const monthsTotal = Math.floor(daysTotal / 30.44);
        const yearsTotal = Math.floor(monthsTotal / 12);

        const years = yearsTotal;
        const remainingMonths = monthsTotal % 12;
        const days = daysTotal % 30.44;
        const hours = hoursTotal % 24;
        const minutes = minutesTotal % 60;
        const seconds = secondsTotal % 60;

        const timeString = ` ${String(futureDate.getHours()).padStart(2, '0')}:${String(futureDate.getMinutes()).padStart(2, '0')}`;

        // Determine display format based on time difference
        let resultText = "";
        if (daysTotal <= 1) {
            // Less than 1 day: show hours, minutes, seconds
            const hourLabel = hoursTotal === 1 ? "час" : "часа";
            const minuteLabel = minutes === 1 ? "минута" : "минути";
            const secondLabel = seconds === 1 ? "секунда" : "секунди";
            resultText = `${hoursTotal} ${hourLabel}, ${minutes} ${minuteLabel}, ${seconds} ${secondLabel}`;
        } else if (monthsTotal >= 12) {
            // 12 months or more: show years, remaining months, days, hours, minutes, seconds
            const yearLabel = years === 1 ? "година" : "години";
            const monthLabel = remainingMonths === 1 ? "месец" : "месеци";
            const dayLabel = Math.floor(days) === 1 ? "ден" : "дена";
            const hourLabel = hours === 1 ? "час" : "часа";
            const minuteLabel = minutes === 1 ? "минута" : "минути";
            const secondLabel = seconds === 1 ? "секунда" : "секунди";
            resultText = `${years} ${yearLabel}, ${remainingMonths} ${monthLabel}, ${Math.floor(days)} ${dayLabel}, ${hours} ${hourLabel}, ${minutes} ${minuteLabel}, ${seconds} ${secondLabel}`;
        } else {
            // Between 1 day and 11 months: show months, days, hours, minutes, seconds
            const monthLabel = monthsTotal === 1 ? "месец" : "месеци";
            const dayLabel = Math.floor(days) === 1 ? "ден" : "дена";
            const hourLabel = hours === 1 ? "час" : "часа";
            const minuteLabel = minutes === 1 ? "минута" : "минути";
            const secondLabel = seconds === 1 ? "секунда" : "секунди";
            resultText = `${monthsTotal} ${monthLabel}, ${Math.floor(days)} ${dayLabel}, ${hours} ${hourLabel}, ${minutes} ${minuteLabel}, ${seconds} ${secondLabel}`;
        }

        result.textContent = resultText;
        subResult.textContent = `До ${MONTHS_MK[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()} ${timeString}`;

        otherSection.classList.remove("hidden");
        const formats = [
            `${daysTotal} вкупно дена`,
            `${hoursTotal} вкупно часа`,
            `${minutesTotal} вкупно минути`,
            `${secondsTotal} вкупно секунди`,
            `${Math.floor(daysTotal / 7)} недели, ${daysTotal % 7} дена`,
            `${yearsTotal} ${yearsTotal === 1 ? "година" : "години"}, ${Math.floor(daysTotal % 365.25)} дена`
        ];

        formats.forEach(format => {
            const li = document.createElement("li");
            li.textContent = format;
            otherList.appendChild(li);
        });
    }

    function toggleModal() {
        document.body.classList.toggle("mdl-visible");
        const focusElement = document.body.classList.contains("mdl-visible") 
            ? document.getElementsByClassName("close")[0]
            : document.getElementsByClassName("mdl-launch")[0];
        focusElement.focus();
    }

    return init;
}();

window.onload = app;