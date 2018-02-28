'use strict';

//The variables such as API key and API data

var APPID = "24b392a2ec286e7af099fee1f324b904";
var dataObj = null;

//Getting "main table" to variable
var myTable = document.getElementById("main-table");

//The action which happens when "today's" button is clicked
var todaysVar = document.querySelector('.todaysbtn');

todaysVar.onclick = function () {
  if (!dataObj) return false;
  var fiveDaysButton = document.querySelector('.fivedaysbtn');

  if (fiveDaysButton.classList.contains('clicked')) {
    fiveDaysButton.classList.remove('clicked');
  }
  if (!this.classList.contains('clicked')) {
    this.classList.add('clicked');
  }

  document.getElementById("main-table").hidden = false;
  document.querySelector(".current-day").hidden = false;

  document.getElementById("today").hidden = false;
  document.getElementById("fivedays").hidden = true;

  if (document.querySelector(".some-date").innerHTML != getNormalDate(dataObj.list[0].dt)) {
    fillOutTable(dataObj, 0, 8, myTable);
  }
};

//The action which happens when "fiveday's" button is clicked

var fiveDaysVar = document.querySelector('.fivedaysbtn');

fiveDaysVar.onclick = function () {
  if (!dataObj) return false;
  var todaysButton = document.querySelector('.todaysbtn');

  if (todaysButton.classList.contains('clicked')) {
    todaysButton.classList.remove('clicked');
  }

  if (!this.classList.contains('clicked')) {
    this.classList.add('clicked');
  }

  document.getElementById("main-table").hidden = true;
  document.getElementById("today").hidden = true;

  document.querySelector(".current-day").hidden = true;
  document.getElementById("fivedays").hidden = false;
};

//When expanded button is clicked
document.getElementById("fivedays").onclick = function (e) {
  var target = e.target;
  if (target.tagName != "BUTTON" && !target.classList.contains("days_advanced")) return false;
  var myDate = getSecondHourOfEachDay(dataObj);
  var from = null;
  var to = null;
  //if expanded button for today is clicked, return to today's data
  if (target.getAttribute("data-tooltip") == 0) {
    var fiveDaysButton = document.querySelector('.fivedaysbtn');
    var todaysButton = document.querySelector('.todaysbtn');

    if (fiveDaysButton.classList.contains('clicked')) {
      fiveDaysButton.classList.remove('clicked');
    }
    if (!todaysButton.classList.contains('clicked')) {
      todaysButton.classList.add('clicked');
    }

    document.getElementById("main-table").hidden = false;
    document.querySelector(".current-day").hidden = false;

    document.getElementById("today").hidden = false;
    document.getElementById("fivedays").hidden = true;

    if (document.querySelector(".some-date").innerHTML != getNormalDate(dataObj.list[0].dt)) {
      fillOutTable(dataObj, 0, 8, myTable);
    }
    return false;
  }
  //if expanded button for second day is clicked
  if (target.getAttribute("data-tooltip") == 1) {
    from = myDate[0];
    to = myDate[1];
  }
  //for third day
  if (target.getAttribute("data-tooltip") == 2) {
    from = myDate[1];
    to = myDate[2];
  }
  //for fourth day
  if (target.getAttribute("data-tooltip") == 3) {
    from = myDate[2];
    to = myDate[3];
  }
  //for fifth day
  if (target.getAttribute("data-tooltip") == 4) {
    from = myDate[3];
    if (myDate[4]) {
      to = myDate[4];
    } else {
      to = 40;
    }
  }
  //Filling out main table with current values
  fillOutTable(dataObj, from, to, myTable);
  //Show and hide necessary elements
  document.getElementById("main-table").hidden = false;
  document.querySelector(".current-day").hidden = false;

  document.getElementById("today").hidden = false;
  document.getElementById("fivedays").hidden = true;
};

//When name of city is sent
var searchForm = document.getElementById("searchform");
var cityField = document.getElementById("cityname");
var submitBtn = document.getElementById("submitWeather");

submitBtn.onclick = function () {
  if (cityField.value == "") return false;
  var createURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityField.value + "&units=metric&APPID=" + APPID;
  //involve AJAX function
  createObjectFromJSON(createURL);
  return false;
};

searchForm.onsubmit = function () {
  if (cityField.value == "") return false;
  var createURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityField.value + "&units=metric&APPID=" + APPID;
  //involve AJAX function
  createObjectFromJSON(createURL);
  return false;
};

//AJAX
function createObjectFromJSON(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var obj = this.responseText;
      dataObj = JSON.parse(obj);
      if (!document.querySelector('.todaysbtn').classList.contains("clicked")) {
        document.querySelector('.todaysbtn').classList.add("clicked");
      }
      if (document.querySelector('.fivedaysbtn').classList.contains("clicked")) {
        document.querySelector('.todaysbtn').classList.remove("clicked");
      }
      fillOutTable(dataObj, 0, 8, myTable, true);
      fillFields(dataObj);
      document.getElementById("cityname").value = "";
    }
  };

  xhr.onerror = function () {
    console.log('Request Error...');
  };

  xhr.send();
}

//Filling out all the fields of "5 Days" with the values and units
function fillFields(obj) {
  //Using my main function which gets beginning of each day and delcaring it to variable
  var myDate = getSecondHourOfEachDay(obj);

  //showing all the blocks in five days wrapper
  for (var i = 1; i < 6; i++) {
    document.getElementById("day" + i).hidden = false;
  }

  //Filling out Day 1
  document.querySelector("#day1 .date").innerHTML = formatDate(obj.list[0].dt);
  document.querySelector("#day1 .w-icon").setAttribute("src", "https://openweathermap.org/img/w/" + obj.list[0].weather[0].icon + ".png");
  document.querySelector("#day1 .clouds").innerHTML = obj.list[0].weather[0].main;
  document.querySelector("#day1 .temperature").innerHTML = obj.list[0].main.temp.toFixed(0) + "&deg;C";
  document.querySelector("#day1 .pressure").innerHTML = obj.list[0].main.pressure.toFixed(0) + " hPa";
  document.querySelector("#day1 .humidity").innerHTML = obj.list[0].main.humidity + "%";
  document.querySelector("#day1 .wind").innerHTML = obj.list[0].wind.speed.toFixed(0) + " m/s";

  //Filling out all the parameters of each day after today
  //Why "i < 4"? 'cause there's usually 5 keys in "myDate's" array except of the end of each day when there's 4
  //That is the reason for not using "myDate.length", we need only first 4 [0], [1], [2], [3]
  //Date
  for (var _i = 0; _i < 4; _i++) {
    document.querySelector("#day" + (_i + 2) + " .date").innerHTML = formatDate(obj.list[myDate[_i] + 3].dt);
  }

  //Icon
  for (var _i2 = 0; _i2 < 4; _i2++) {
    document.querySelector("#day" + (_i2 + 2) + " .w-icon").setAttribute("src", "https://openweathermap.org/img/w/" + obj.list[myDate[_i2] + 3].weather[0].icon + ".png");
  }

  //Description(Clouds, Snow, Clear so on)
  for (var _i3 = 0; _i3 < 4; _i3++) {
    document.querySelector("#day" + (_i3 + 2) + " .clouds").innerHTML = obj.list[myDate[_i3] + 3].weather[0].main;
  }

  //Temperature
  for (var _i4 = 0; _i4 < 4; _i4++) {
    document.querySelector("#day" + (_i4 + 2) + " .temperature").innerHTML = obj.list[myDate[_i4] + 3].main.temp.toFixed(0) + "&deg;C";
  }

  //Pressure
  for (var _i5 = 0; _i5 < 4; _i5++) {
    document.querySelector("#day" + (_i5 + 2) + " .pressure").innerHTML = obj.list[myDate[_i5] + 3].main.pressure.toFixed(0) + " hPa";
  }

  //Humidity
  for (var _i6 = 0; _i6 < 4; _i6++) {
    document.querySelector("#day" + (_i6 + 2) + " .humidity").innerHTML = obj.list[myDate[_i6] + 3].main.humidity + "%";
  }

  //Wind speed
  for (var _i7 = 0; _i7 < 4; _i7++) {
    document.querySelector("#day" + (_i7 + 2) + " .wind").innerHTML = obj.list[myDate[_i7] + 3].wind.speed.toFixed(0) + " m/s";
  }
}

//Filling out table
function fillOutTable(obj, f, t, table) {
  var show = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  //Showing hidden table
  if (show) {
    if (!document.querySelector('.fivedaysbtn').classList.contains("clicked")) {
      document.getElementById("main-table").hidden = false;
      document.getElementById("today").hidden = false;
    }
    //Country
    document.querySelector(".city-country").innerHTML = "Weather forecast for " + obj.city.name + ", " + obj.city.country;
  }
  //Right day
  document.querySelector(".current-day").innerHTML = "on <span class=\"some-date\">" + getNormalDate(obj.list[f].dt) + "</span>";

  //Filling out time's field
  for (var i = f, j = 1; i < t; i++, j++) {
    table.rows[0].cells[j].innerHTML = getHoursFromDate(obj.list[i].dt);
  }

  //weather every 3 hours
  for (var _i8 = f, _j = 1; _i8 < t; _i8++, _j++) {
    table.rows[1].cells[_j].innerHTML = "<img src=\"https://openweathermap.org/img/w/" + obj.list[_i8].weather[0].icon + ".png\" alt=\"type\"><br><span>" + obj.list[_i8].weather[0].main + "</span>";
  }

  //Temperature every 3 hours
  for (var _i9 = f, _j2 = 1; _i9 < t; _i9++, _j2++) {
    table.rows[2].cells[_j2].innerHTML = obj.list[_i9].main.temp.toFixed(0);
  }

  //Pressure every 3 hours
  for (var _i10 = f, _j3 = 1; _i10 < t; _i10++, _j3++) {
    table.rows[3].cells[_j3].innerHTML = obj.list[_i10].main.pressure.toFixed(0);
  }

  //Humidity every 3 hours
  for (var _i11 = f, _j4 = 1; _i11 < t; _i11++, _j4++) {
    table.rows[4].cells[_j4].innerHTML = obj.list[_i11].main.humidity;
  }

  //Wind speed every 3 hours
  for (var _i12 = f, _j5 = 1; _i12 < t; _i12++, _j5++) {
    table.rows[5].cells[_j5].innerHTML = obj.list[_i12].wind.speed.toFixed(0);
  }
}

//Working with dates, functions helpers
function formatDate(date) {
  var d = new Date(date * 1000);

  var dd = d.getDate();
  if (dd < 10) dd = "0" + dd;

  var mm = d.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  return dd + "." + mm + " " + getWeekDay(d);
}

function getHoursFromDate(date) {
  var d = new Date(date * 1000);

  var hh = d.getHours();
  if (hh < 10) hh = "0" + hh;

  return hh + ":00";
}

function getNormalDate(date) {
  var d = new Date(date * 1000);

  var dd = d.getDate();
  if (dd < 10) dd = "0" + dd;

  return getMonth(d) + " " + dd + ", " + getFullWeekDay(d);
}

function getWeekDay(date) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getMonth(date) {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return months[date.getMonth()];
}

function getFullWeekDay(date) {
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return days[date.getDay()];
}

function getCurrentDay(date) {
  var d = new Date(date * 1000);

  return d.getDate();
}

function getSecondHourOfEachDay(obj) {
  var hoursArray = [];

  for (var i = 0; i < obj.list.length; i++) {
    if (getHoursFromDate(obj.list[i].dt) === "02:00" && getCurrentDay(obj.list[i].dt) != getCurrentDay(obj.list[0].dt)) {
      hoursArray.push(i);
    }
  }
  return hoursArray;
}