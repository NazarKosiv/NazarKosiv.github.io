'use strict';

//The variables such as API key and API data

var APPID = "24b392a2ec286e7af099fee1f324b904";
var dataObj = null;

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

//When name of city is sent
var searchForm = document.getElementById("searchform");
var cityField = document.getElementById("cityname");
var submitBtn = document.getElementById("submitWeather");

submitBtn.onclick = function () {
  if (cityField.value == "") return false;
  var createURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityField.value + '&units=metric&APPID=' + APPID;
  //involve AJAX function
  createObjectFromJSON(createURL);
  return false;
};

searchForm.onsubmit = function () {
  if (cityField.value == "") return false;
  var createURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityField.value + '&units=metric&APPID=' + APPID;
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
      fillingTable(dataObj);
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
    document.getElementById('day' + i).hidden = false;
  }

  //Filling out Day 1
  document.querySelector("#day1 .date").innerHTML = formatDate(obj.list[0].dt);
  document.querySelector("#day1 .w-icon").setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[0].weather[0].icon + '.png');
  document.querySelector("#day1 .clouds").innerHTML = obj.list[0].weather[0].main;
  document.querySelector("#day1 .temperature").innerHTML = obj.list[0].main.temp.toFixed(0) + '&deg;C';
  document.querySelector("#day1 .pressure").innerHTML = obj.list[0].main.pressure.toFixed(0) + ' hPa';
  document.querySelector("#day1 .humidity").innerHTML = obj.list[0].main.humidity + '%';
  document.querySelector("#day1 .wind").innerHTML = obj.list[0].wind.speed.toFixed(0) + ' m/s';

  //Filling out all the parameters of each day after today
  //Date
  for (var _i = 0; _i < myDate.length - 1; _i++) {
    document.querySelector('#day' + (_i + 2) + ' .date').innerHTML = formatDate(obj.list[myDate[_i] + 3].dt);
  }

  //Icon
  for (var _i2 = 0; _i2 < myDate.length - 1; _i2++) {
    document.querySelector('#day' + (_i2 + 2) + ' .w-icon').setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[myDate[_i2] + 3].weather[0].icon + '.png');
  }

  //Description(Clouds, Snow, Clear so on)
  for (var _i3 = 0; _i3 < myDate.length - 1; _i3++) {
    document.querySelector('#day' + (_i3 + 2) + ' .clouds').innerHTML = obj.list[myDate[_i3] + 3].weather[0].main;
  }

  //Temperature
  for (var _i4 = 0; _i4 < myDate.length - 1; _i4++) {
    document.querySelector('#day' + (_i4 + 2) + ' .temperature').innerHTML = obj.list[myDate[_i4] + 3].main.temp.toFixed(0) + '&deg;C';
  }

  //Pressure
  for (var _i5 = 0; _i5 < myDate.length - 1; _i5++) {
    document.querySelector('#day' + (_i5 + 2) + ' .pressure').innerHTML = obj.list[myDate[_i5] + 3].main.pressure.toFixed(0) + ' hPa';
  }

  //Humidity
  for (var _i6 = 0; _i6 < myDate.length - 1; _i6++) {
    document.querySelector('#day' + (_i6 + 2) + ' .humidity').innerHTML = obj.list[myDate[_i6] + 3].main.humidity + '%';
  }

  //Wind speed
  for (var _i7 = 0; _i7 < myDate.length - 1; _i7++) {
    document.querySelector('#day' + (_i7 + 2) + ' .wind').innerHTML = obj.list[myDate[_i7] + 3].wind.speed.toFixed(0) + ' m/s';
  }
}

//Filling out "today's" table
function fillingTable(obj) {
  //Showing hidden table
  if (!document.querySelector('.fivedaysbtn').classList.contains("clicked")) {
    document.getElementById("main-table").hidden = false;
    document.getElementById("today").hidden = false;
  }
  //Filling city and country fields
  document.querySelector(".city-country").innerHTML = 'Weather forecast for ' + obj.city.name + ', ' + obj.city.country;
  document.querySelector(".current-day").innerHTML = 'on ' + getNormalDate(obj.list[0].dt);

  //Getting "main table" in variable
  var myTable = document.getElementById("main-table");

  //Filling out time's field
  for (var i = 0; i < 8; i++) {
    myTable.rows[0].cells[i + 1].innerHTML = getHoursFromDate(obj.list[i].dt);
  }

  //weather every 3 hours
  for (var _i8 = 0; _i8 < 8; _i8++) {
    myTable.rows[1].cells[_i8 + 1].innerHTML = '<img src="https://openweathermap.org/img/w/' + obj.list[_i8].weather[0].icon + '.png" alt="type"><br><span>' + obj.list[_i8].weather[0].main + '</span>';
  }

  //Temperature every 3 hours
  for (var _i9 = 0; _i9 < 8; _i9++) {
    myTable.rows[2].cells[_i9 + 1].innerHTML = obj.list[_i9].main.temp.toFixed(0);
  }

  //Pressure every 3 hours
  for (var _i10 = 0; _i10 < 8; _i10++) {
    myTable.rows[3].cells[_i10 + 1].innerHTML = obj.list[_i10].main.pressure.toFixed(0);
  }

  //Humidity every 3 hours
  for (var _i11 = 0; _i11 < 8; _i11++) {
    myTable.rows[4].cells[_i11 + 1].innerHTML = obj.list[_i11].main.humidity;
  }

  //Wind speed every 3 hours
  for (var _i12 = 0; _i12 < 8; _i12++) {
    myTable.rows[5].cells[_i12 + 1].innerHTML = obj.list[_i12].wind.speed.toFixed(0);
  }
}

//Working with dates, functions helpers
function formatDate(date) {
  var d = new Date(date * 1000);

  var dd = d.getDate();
  if (dd < 10) dd = "0" + dd;

  var mm = d.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  return dd + '.' + mm + ' ' + getWeekDay(d);
}

function getHoursFromDate(date) {
  var d = new Date(date * 1000);

  var hh = d.getHours();
  if (hh < 10) hh = "0" + hh;

  return hh + ':00';
}

function getNormalDate(date) {
  var d = new Date(date * 1000);

  var dd = d.getDate();
  if (dd < 10) dd = "0" + dd;

  return getMonth(d) + ' ' + dd + ', ' + getFullWeekDay(d);
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