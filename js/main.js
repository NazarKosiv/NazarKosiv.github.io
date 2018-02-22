'use strict';

//The action which happens when "today's" button is clicked

var todaysVar = document.querySelector('.todaysbtn');
var dataObj = null;

todaysVar.onclick = function () {
  if (!dataObj) return;
  var fiveDaysButton = document.querySelector('.fivedaysbtn');
  var fiveDays = document.querySelector('#content #fivedays');
  var today = document.querySelector('#today');

  if (fiveDaysButton.classList.contains('clicked')) {
    fiveDaysButton.classList.remove('clicked');
  }
  if (!this.classList.contains('clicked')) {
    this.classList.add('clicked');
  }

  document.querySelector(".current-day").hidden = false;

  today.removeAttribute("hidden");
  fiveDays.setAttribute("hidden", "true");
};

//The action which happens when "fiveday's" button is clicked

var fiveDaysVar = document.querySelector('.fivedaysbtn');

fiveDaysVar.onclick = function () {
  if (!dataObj) return;
  var todaysButton = document.querySelector('.todaysbtn');
  var fiveDays = document.querySelector('#content #fivedays');
  var today = document.querySelector('#today');

  if (todaysButton.classList.contains('clicked')) {
    todaysButton.classList.remove('clicked');
  }

  if (!this.classList.contains('clicked')) {
    this.classList.add('clicked');
  }

  document.querySelector(".current-day").hidden = true;

  fiveDays.removeAttribute("hidden");
  today.setAttribute("hidden", "true");
};

//AJAX

function createObjectFromJSON(url) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (this.status == 200) {
      var obj = this.responseText;
      dataObj = JSON.parse(obj);
      document.getElementById("today").removeAttribute("hidden");
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

//Fill out all the fields with the values and units

function fillFields(obj) {
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

  //Filling out day 2
  document.querySelector("#day2 .date").innerHTML = formatDate(obj.list[8].dt);
  document.querySelector("#day2 .w-icon").setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[8].weather[0].icon + '.png');
  document.querySelector("#day2 .clouds").innerHTML = obj.list[8].weather[0].main;
  document.querySelector("#day2 .temperature").innerHTML = obj.list[8].main.temp.toFixed(0) + '&deg;C';
  document.querySelector("#day2 .pressure").innerHTML = obj.list[8].main.pressure.toFixed(0) + ' hPa';
  document.querySelector("#day2 .humidity").innerHTML = obj.list[8].main.humidity + '%';
  document.querySelector("#day2 .wind").innerHTML = obj.list[8].wind.speed.toFixed(0) + ' m/s';

  //Filling out day 3
  document.querySelector("#day3 .date").innerHTML = formatDate(obj.list[16].dt);
  document.querySelector("#day3 .w-icon").setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[16].weather[0].icon + '.png');
  document.querySelector("#day3 .clouds").innerHTML = obj.list[16].weather[0].main;
  document.querySelector("#day3 .temperature").innerHTML = obj.list[16].main.temp.toFixed(0) + '&deg;C';
  document.querySelector("#day3 .pressure").innerHTML = obj.list[16].main.pressure.toFixed(0) + ' hPa';
  document.querySelector("#day3 .humidity").innerHTML = obj.list[16].main.humidity + '%';
  document.querySelector("#day3 .wind").innerHTML = obj.list[16].wind.speed.toFixed(0) + ' m/s';

  //Filling out day 4
  document.querySelector("#day4 .date").innerHTML = formatDate(obj.list[24].dt);
  document.querySelector("#day4 .w-icon").setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[24].weather[0].icon + '.png');
  document.querySelector("#day4 .clouds").innerHTML = obj.list[24].weather[0].main;
  document.querySelector("#day4 .temperature").innerHTML = obj.list[24].main.temp.toFixed(0) + '&deg;C';
  document.querySelector("#day4 .pressure").innerHTML = obj.list[24].main.pressure.toFixed(0) + ' hPa';
  document.querySelector("#day4 .humidity").innerHTML = obj.list[24].main.humidity + '%';
  document.querySelector("#day4 .wind").innerHTML = obj.list[24].wind.speed.toFixed(0) + ' m/s';

  //Filling out day 5
  document.querySelector("#day5 .date").innerHTML = formatDate(obj.list[32].dt);
  document.querySelector("#day5 .w-icon").setAttribute("src", 'https://openweathermap.org/img/w/' + obj.list[32].weather[0].icon + '.png');
  document.querySelector("#day5 .clouds").innerHTML = obj.list[32].weather[0].main;
  document.querySelector("#day5 .temperature").innerHTML = obj.list[32].main.temp.toFixed(0) + '&deg;C';
  document.querySelector("#day5 .pressure").innerHTML = obj.list[32].main.pressure.toFixed(0) + ' hPa';
  document.querySelector("#day5 .humidity").innerHTML = obj.list[32].main.humidity + '%';
  document.querySelector("#day5 .wind").innerHTML = obj.list[32].wind.speed.toFixed(0) + ' m/s';
}

//Filling "today's" table
function fillingTable(obj) {
  //Showing hidden table
  document.getElementById("main-table").hidden = false;
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
  for (var _i = 0; _i < 8; _i++) {
    myTable.rows[1].cells[_i + 1].innerHTML = '<img src="https://openweathermap.org/img/w/' + obj.list[_i].weather[0].icon + '.png" alt="type"><br><span>' + obj.list[_i].weather[0].main + '</span>';
  }

  //Temperature every 3 hours
  for (var _i2 = 0; _i2 < 8; _i2++) {
    myTable.rows[2].cells[_i2 + 1].innerHTML = obj.list[_i2].main.temp.toFixed(0);
  }

  //Pressure every 3 hours
  for (var _i3 = 0; _i3 < 8; _i3++) {
    myTable.rows[3].cells[_i3 + 1].innerHTML = obj.list[_i3].main.pressure.toFixed(0);
  }

  //Humidity every 3 hours
  for (var _i4 = 0; _i4 < 8; _i4++) {
    myTable.rows[4].cells[_i4 + 1].innerHTML = obj.list[_i4].main.humidity;
  }

  //Wind speed every 3 hours
  for (var _i5 = 0; _i5 < 8; _i5++) {
    myTable.rows[5].cells[_i5 + 1].innerHTML = obj.list[_i5].wind.speed.toFixed(0);
  }
}

//When name of city is sent
var searchForm = document.getElementById("searchform");

searchForm.onclick = function (e) {
  var target = e.target;
  if (target.tagName != "INPUT") return;
  var cityName = document.getElementById("cityname").value;
  if (cityName == '') return;
  var APPID = "24b392a2ec286e7af099fee1f324b904";
  var createURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&APPID=' + APPID;
  //involve AJAX function
  createObjectFromJSON(createURL);
};

//Working with dates
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