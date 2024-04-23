let cityInput= document.getElementById('cityname');
let searchBtn= document.getElementById('searchBtn');
locationBtn= document.getElementById('locationBtn');
api_Key = '412cbba2d508e71a4b09eabd298d25d3',
currentWeatherCard= document.querySelectorAll('.leftsideInfo  .card')[0];
fiveDaysForecastCard =document.querySelector('.dayforecast');
aqiCard= document.querySelectorAll('.highlights  .card')[0];
sunriseCard= document.querySelectorAll('.highlights  .card')[1];
aqiList =['Good','Fair','Moderate','Poor','Very Poor'];
humidityVal= document.getElementById('humidityValue');
visibilityVal= document.getElementById('visibiltyValue');
pressureVal= document.getElementById('pressureValue');
windSpeedVal= document.getElementById('windspeedValue');
feelsVal= document.getElementById('feelsValue');
hourlyForecastCard =document.querySelector('.hourly-forecast');

function getWeatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`,
    WEATHER_API_URL =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`,
    AIR_POLLUTION_API_URL =`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_Key}`,
    
    days=[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months=[
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    fetch(AIR_POLLUTION_API_URL).then(res=>res.json()).then(data=>{
        let {co,no,no2,o3,so2,pm2_5,pm10,nh3} =data.list[0].components;
        aqiCard.innerHTML=`
        <div class="cardHead">
            <p>Air Quality</p>
            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi -1]}</p>
        </div>
            <div class="air-indices">
                 <i class="fa fa-wind fa-3x"></i>
                 <div class="item">
                 <p>PM2.5</p>
                 <h2>${pm2_5}</h2>
                 </div>
                <div class="item">
                  <p>PM10</p>
                  <h2>${pm10}</h2>
                 </div>
                <div class="item">
                    <p>s02</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                </div>

                <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                </div>
            </div>
                `;
    }).catch(()=>{
        alert('Failed to fetch info');
    });

    fetch(WEATHER_API_URL).then(res=> res.json()).then(data =>{
        let date= new Date();
        currentWeatherCard.innerHTML=`
        <div class="currentInfo">
                        <div class="details">
                            <p>NOW</p>
                            <h2>${(data.main.temp-273.15).toFixed(2)}&deg;C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weatherIcons">
                            <img src="https://img.freepik.com/premium-photo/${data.weather[0].icon}mystical-atmosphere-fog-white-clouds-haze-isolated-design_957479-41820.jpg?w=900" height="50rem"alt="">
                            <!-- https://img.freepik.com/free-vector/fun-lightning-element-cute-weather-clipart-vector-grey-background_53876-144656.jpg?w=740 -->
                        </div>
                    </div>
                    <hr>
                    <div class="cardfooter">
                        <p><i class="fa fa-calendar-o"></i>${days[date.getDay()]},${date.getDate()},${months[date.getMonth()]},${date.getFullYear()}</p>
                        <p><i class="fa fa-map-marker"></i>${name},${country}</p>
                    </div>
        `;
        let {sunrise, sunset}= data.sys,
        {timezone,visibilty}= data.sys,
        {humidity,pressure,feels_like}= data.main,
        {speed}= data.wind,
        sRiseTime =moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A'),
        sSetTime =moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');
        sunriseCard.innerHTML= `
        <div class="card-head">
                <p>sunrise & sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa fa-sun-o fa-4x"></i>
                    </div>
                        <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                        </div>
                </div>
                <div class="item">
                    <div class="icon">
                    <i class="fa fa-cloud-sun fa-4x"></i>
                    </div>
                    <div>
                    <p>Sunset</p>
                    <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>  
        `;
        humidityVal.innerHTML =`${humidity}%`;
        pressureVal.innerHTML =`${pressure}hPa`;
        visibilityVal.innerHTML =`${visibilty/1000}km`;
        windSpeedVal.innerHTML =`${speed}m/s`;
        feelsVal.innerHTML=`${(feels_like - 273.15).toFixed(2)}&deg;C`;
    }).catch(()=>{
        alert('Failed to fetch current weather');
    });

    fetch(FORECAST_API_URL).then(res=>res.json()).then(data =>{
        let hourlyForecast =data.list;
        hourlyForecastCard.innerHTML="";
        for(i=0;i<=7;i++){
            let hrForecastDate =new Date(hourlyForecast[i].dt_txt);
            let hr= hrForecastDate.getHours();
            let a='PM';
            if(hr<12) a='AM';
            if(hr==0) hr=12;
            if(hr>12) hr= hr-12;
            hourlyForecastCard.innerHTML +=`
            <div class="card">
                <p>${hr} ${a}</p>
                <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}04d.png" alt="">
                <p>${(hourlyForecast[i].main.temp- 273.15).toFixed(2)}&deg;C</p>
            </div>
            `;
        }
        let uniqueForecastDays =[];
        let fiveDaysForecast =data.list.filter(forecast=>{
            let forecastDate =new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML ="";
        for(i=1;i<fiveDaysForecast.length;i++){
            let date=new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML+=`
            <div class="forecastlistitem">
                <div class="icon-wrapper">
                    <img src="https://img.freepik.com/premium-vector/${fiveDaysForecast[i].weather[0].icon}cloud-sun-shine-drawing-doodle-illustration-vector-design-template_537346-159.jpg?w=740" height="37rem" alt="">
                    <span>${(fiveDaysForecast[i].main.temp -273.15).toFixed(2)}&deg;C</span>
                </div>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <p>${days[date.getDay()]}</p>
            </div>
           ` ;
        }
    }).catch(()=>{
        alert('failed to fetch weather news');
    })
}

function getCityCoordinates(){
    let cityName =cityInput.value.trim();
    cityInput.value='';
    if(!cityName) return;
    let GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;
    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
        let {name,lat,lon,country,state} = data[0];
        getWeatherDetails(name,lat,lon,country,state);
    }).catch(()=>{
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}
function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position=>{
        let {latitude,longitude}=position.coords;
        let REVERSE_GEOCODING_URL= `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_Key}`;
        fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
            let {name,country,state}=data[0];
            getWeatherDetails(name,latitude,longitude,country,state);
        }).catch(()=>{
            alert("failed to fetch coordinates ");
        });
        
    },error=>{
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied .Please reset permission to grant access');
        }
    });
}
searchBtn.addEventListener('click',getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
cityInput.addEventListener('keyup',e=>e.key==='Enter');
window.addEventListener('load',getUserCoordinates);