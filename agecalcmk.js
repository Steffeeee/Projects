var AgeCalculator = function() {
    var birthdateInput, result, sub, otherSection, otherList;
    const MONTHS_MK = ["Јануари", "Февруари", "Март", "Април", "Mај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];

    function init() {
        const mdlOpen = document.getElementById("mdlO");
        const mdlClose = document.getElementById("mdlX");
        birthdateInput = document.getElementById("birthdate");
        result = document.getElementById("result1");
        sub = document.getElementById("sub");
        otherSection = document.getElementById("otherSection");
        otherList = document.getElementById("otherList");

        birthdateInput.addEventListener("input", calculateAge);
        mdlOpen.addEventListener("click", toggleModal);
        mdlClose.addEventListener("click", toggleModal);
        mdlOpen.classList.remove("hidden");

        calculateAge();
    }

    function parseDate(input) {
        if (!input) return null;
        input = input.trim();
        let date;

        // DD.MM.YYYY format (e.g., 15.12.2025)
        const dmyRegex = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
        const dmyMatch = input.match(dmyRegex);
        if (dmyMatch) {
            const day = parseInt(dmyMatch[1], 10);
            const month = parseInt(dmyMatch[2], 10) - 1;
            const year = parseInt(dmyMatch[3], 10);
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) return date;
        }

        // Month name formats (e.g., Ноември 15, 2025; 15 Ноември 2025)
        const monthRegex = /([а-яА-Я]+)\s*(\d{1,2}),?\s*(\d{4})|(\d{1,2})\s*([а-яА-Я]+),?\s*(\d{4})/;
        const monthMatch = input.match(monthRegex);
        if (monthMatch) {
            let day, month, year;
            if (monthMatch[1]) { // Ноември 15, 2025 or Ноември 15 2025
                const monthName = monthMatch[1];
                day = parseInt(monthMatch[2], 10);
                year = parseInt(monthMatch[3], 10);
                month = MONTHS_MK.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
            } else if (monthMatch[4]) { // 15 Ноември, 2025 or 15 Ноември 2025
                day = parseInt(monthMatch[4], 10);
                const monthName = monthMatch[5];
                year = parseInt(monthMatch[6], 10);
                month = MONTHS_MK.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
            }
            if (month !== -1) {
                date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        return null;
    }

    function calculateAgeDifference(birthDate, currentDate) {
        var diffMs = currentDate - birthDate;
        var years = currentDate.getFullYear() - birthDate.getFullYear();
        var months = currentDate.getMonth() - birthDate.getMonth();
        var days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        var totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return [years, months, days, totalDays];
    }

    function formatDate(date) {
        return `${MONTHS_MK[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function calculateAge() {
        const birthStr = birthdateInput.value;
        result.textContent = "Внесете датум на раѓање...";
        sub.textContent = "";
        otherList.innerHTML = "";
        otherSection.classList.add("hidden");

        if (!birthStr) return;

        const birthDate = parseDate(birthStr);
        if (!birthDate || isNaN(birthDate.getTime())) {
            result.textContent = "Ве молиме внесете валиден датум";
            return;
        }

        const today = new Date();
        if (birthDate > today) {
            result.textContent = "Датумот на раѓање не може да биде во иднина";
            return;
        }

        const [years, months, days, totalDays] = calculateAgeDifference(birthDate, today);

        const yearLabel = years === 1 ? "година" : "години";
        const monthLabel = months === 1 ? "месец" : "месеци";
        const dayLabel = days === 1 ? "ден" : "дена";

        result.textContent = `Имате ${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}`;
        sub.textContent = `Роден/а на ${formatDate(birthDate)}`;

        otherList.innerHTML = `
            <li>${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}</li>
            <li>${(years * 12 + months)} ${months === 1 ? "месец" : "месеци"}, ${days} ${dayLabel}</li>
            <li>${Math.floor(totalDays / 7)} ${totalDays === 1 ? "недела" : "недели"}, ${totalDays % 7} ${dayLabel}</li>
            <li>${totalDays} ${dayLabel}</li>
            <li>${totalDays * 24} ${totalDays === 1 ? "час" : "часа"}</li>
            <li>${totalDays * 1440} ${totalDays === 1 ? "минута" : "минути"}</li>
            <li>${totalDays * 86400} ${totalDays === 1 ? "секунда" : "секунди"}</li>
        `;
        otherSection.classList.remove("hidden");
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

window.onload = AgeCalculator;