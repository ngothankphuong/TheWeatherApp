// const moment = require("./moment");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const APP_ID = 'ae63faa1a494070a2b4282c095eb90a1';
const DEFAULT_VALUE = '--'

const searchBtn = $('.search-icon');
const searchInput = $('#search-input');
const cityName = $('.city-name');
const temp = $('.temperature');
const sunset = $('.sunset');
const sunrise = $('.sunrise');
const humidity = $('.humidity');
const windSpeed = $('.wind-speed');
const description = $('.description');
const weather = $('.weather-state');
const weatherIcon = $('.weather-icon');

function getWeather(){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=ho chi minh&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            // if(data.cod !='404') {
            cityName.innerText = data.name;
            weather.innerText = data.weather[0].main;
            description.innerText = data.weather[0].description;
            weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temp.innerText = Math.round(data.main.temp);
            humidity.innerText = data.main.humidity;
            windSpeed.innerText = (data.wind.speed * 3.6).toFixed();
            sunrise.innerText = moment.unix(data.sys.sunrise).format('H:mm');
            sunset.innerText = moment.unix(data.sys.sunset).format('H:mm');
        });
}

getWeather();

searchBtn.onclick = function(){
    searchInput.addEventListener('change', (e) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
            .then(async res => {
                const data = await res.json();
                // if(data.cod !='404') {
                cityName.innerText = data.name;
                weather.innerText = data.weather[0].main;
                description.innerText = data.weather[0].description;
                weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                temp.innerText = Math.round(data.main.temp);
                humidity.innerText = data.main.humidity;
                windSpeed.innerText = (data.wind.speed * 3.6).toFixed();
                sunrise.innerText = moment.unix(data.sys.sunrise).format('H:mm');
                sunset.innerText = moment.unix(data.sys.sunset).format('H:mm');
            });
    });
}

searchInput.addEventListener('change', (e) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            if(data.cod !='404') {
                cityName.innerText = data.name;
                weather.innerText = data.weather[0].main;
                description.innerText = data.weather[0].description;
                weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                temp.innerText = Math.round(data.main.temp);
                humidity.innerText = data.main.humidity;
                windSpeed.innerText = (data.wind.speed * 3.6).toFixed();
                sunrise.innerText = moment.unix(data.sys.sunrise).format('H:mm');
                sunset.innerText = moment.unix(data.sys.sunset).format('H:mm');
            } else {
                cityName.innerText = 'Find not found'
            }
        });
});


//tro ly ao
const microphone = $('.microphone');

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = 'vi-VN';

const synth = window.speechSynthesis;
const speak = (text) => {
    if (synth.speaking) {
        console.erorr('Busy. Speaking...');
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerorr = () => {
        console.erorr('SpeechSynthesisUtterance.onerorr');
    }
    synth.speak(utter);
};

recognition.lang = 'vi-VI';
recognition.continuous = false;

microphone.addEventListener('click', (e) => {
    e.preventDefault();

    recognition.start();
    microphone.classList.add('recording');
});

const handleVoice = (text) => {
    console.log('[text]', text);
    const handleText = text.toLowerCase();

    if (handleText.includes('thời tiết tại')) {
        const location = handleText.split('tại')[1].trim();

        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }

    const container = $('.container');

    if (handleText.includes('màu nền')) {
        const color = handleText.split('màu nền')[1].trim();
        container.style.background = color;
        return ;
    }

    if (handleText.includes('mặc định')) {
        container.style.background = '';
        return;
    }

    if (handleText.includes('mấy giờ')) {
        const textToSpeak = `${moment().hours()} hours ${moment().minute()} minutes`;
        speak(textToSpeak);
        return;
    }

    speak('Try again');
}

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerorr = (err) => {
    console.log(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onreuslt', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}


