import {format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval} from 'https://cdn.skypack.dev/date-fns';

window.onload = function() {
    let currentDate = new Date();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let startDate;
    let endDate;

    function daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function clearSelectedDates() {
        let selectedDates = document.getElementsByClassName('selected');
        while(selectedDates[0]) {
            selectedDates[0].classList.remove('selected');
        }
    }

    function selectDateRange(start, end) {
        let dateElements = document.getElementsByClassName('date');
        let range = eachDayOfInterval({start, end});
        for (let i = 0; i < dateElements.length; i++) {
            let day = parseInt(dateElements[i].textContent);
            let date = new Date(year, month, day);
            if (isWithinInterval(date, {start, end})) {
                dateElements[i].classList.add('selected');
            }
        }
    }

    function dateClickHandler(event) {
        let day = parseInt(event.target.textContent);
        let date = new Date(year, month, day);
        if (isNaN(day)) return;  // Ignore clicks on empty cells

        if (!startDate || (startDate && endDate)) {
            clearSelectedDates();
            startDate = date;
            endDate = undefined;
            event.target.classList.add('selected');
        } else if(startDate && !endDate) {
            endDate = date;
            if(startDate > endDate) { // Swap dates if endDate is earlier than startDate
                [startDate, endDate] = [endDate, startDate];
            }
            selectDateRange(startDate, endDate);
        }
    }

    function populateCalendar(month, year) {
        let firstDay = (new Date(year, month)).getDay();
        let calendar = document.getElementById('calendar1');
        calendar.innerHTML = ''; // Empty the calendar before populating it

        let dateNum = 1;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("div");
                if (i === 0 && j < firstDay) {
                    calendar.appendChild(cell);
                } else if (dateNum > daysInMonth(month, year)) {
                    break;
                } else {
                    cell.innerHTML = format(new Date(year, month, dateNum), 'd');
                    cell.classList.add('date');
                    cell.addEventListener('click', dateClickHandler);
                    calendar.appendChild(cell);
                    dateNum++;
                }
            }
        }

        // Update the month and year
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('monthYear1').innerHTML = monthNames[month] + ' ' + year;
    }

    populateCalendar(month, year);

    // Add event listeners to the navigation buttons
    document.getElementById('next').addEventListener('click', function() {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        clearSelectedDates();
        startDate = undefined;
        endDate = undefined
        populateCalendar(month, year);
      });
  
      document.getElementById('prev').addEventListener('click', function() {
          month--;
          if (month < 0) {
              month = 11;
              year--;
          }
          clearSelectedDates();
          startDate = undefined;
          endDate = undefined;
          populateCalendar(month, year);
      });
  }
  
