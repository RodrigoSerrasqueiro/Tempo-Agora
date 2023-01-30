//Interação
const citySearchBar = document.getElementById('search-bar')
const citySearchButton = document.getElementById('search-button')
//Exibição
const currentDate = document.getElementById('current-date')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('climate-icon')
const WeatherDescription = document.getElementById('climate-description')
const currentTemperature = document.getElementById('climate-temperature')
const windSpeed = document.getElementById('wind-speed')
const feelsLikeTemperature = document.getElementById('feels-like-temperature')
const currentHumidity = document.getElementById('current-humidity')
const sunriseTime = document.getElementById('sunrise-time')
const sunsetTime = document.getElementById('sunset-time')
const climateLabel = document.getElementById('climate-label')
const salutation = document.getElementById('salutation')
const api_key = "788c774af081be77f4202affeed2e415"
let newDate = new Date()
let hours = newDate.getHours()

//Verifica o horário do client e conforme o horário altera o background e exibe uma saudação correspondente.
if(hours >= 18 || hours < 6){
  document.body.style.backgroundColor='#1b1e23'
  climateLabel.style.color='#fff'
  currentDate.style.color="#fff"
  WeatherDescription.style.color="#fff"
  cityName.style.color='#b6aef0'
  salutation.style.color='#b6aef0'
  currentTemperature.style.color='#b6aef0'
}
if(hours >=0 && hours < 6){
  salutation.textContent='Boa madrugada!'
}
else if (hours >= 6 && hours < 12){
  salutation.textContent='Bom dia!'
}
else if (hours >= 12 && hours < 18){
  salutation.textContent='Boa tarde!!!'
}
else{
  salutation.textContent='Boa noite!'
}

//quando o botão de pesquisa é clicado ou o usuário digita ENTER, é acionada uma função.
//Essa função armazena o valor em uma variável e aciona outra função que recebe essa variavel como argumento.
citySearchButton.addEventListener("click", () => {
  let city = citySearchBar.value
  getCityWeather(city)
})
citySearchBar.addEventListener("keyup", function(event) {
  if (event.code === "Enter"  || event.code === "Submit") {
    let city = citySearchBar.value
    getCityWeather(city);
  }
})

//Solicita ao usuário permissão para acessar sua geolocalização. Caso o usuário aceite é acionada uma função que contém 2 parâmetros: lat, lon
//Caso o usuário negue, um alerta irá informá-lo. Em caso de outro erro, aparecerá no console.
navigator.geolocation.getCurrentPosition(
  (position) => {
    let lat = position.coords.latitude
    let lon = position.coords.longitude
    getCurrentLocationWeather(lat, lon)
  },
  (err) => {
    if (err.code === 1){
      alert('Geolocalização negada pelo usuário. Busque manualmente por uma cidade no campo de pesquisa.')
    }
    else{
      console.log(err)
    }
  }
)

//Essa função recebe argumentos da localização do usuário. É realizada uma requisição para a API fornecer informações baseadas na localização do usuário.
//Uma função é acionada para exibir essas informações em tela.
function getCurrentLocationWeather(lat, lon){
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`)
    .then((response) => response.json())
    .then((data) => displayWeather(data))
}

//Essa função recebe o valor digitado pelo usuário e faz uma validação. Caso o valor não seja encontrado ou o campo estiver em branco, receberá um alert correspondente.
//Caso o valor seja válido, é realizada uma requisição para API. Então, é acionada a função que exibirá essas informações em tela.
function getCityWeather(city) {
  weatherIcon.src = "./assets/loading-icon.svg"
  let searchCity = citySearchBar.value
  if(searchCity.length === 0){
    alert('Digite o nome de alguma cidade.')
    location.reload()
  }
  else {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${api_key}`)
    .then(response => {
      if (response.status === 404){
        alert('Cidade inexistente ou não encontrada. Verifique os dados e tente novamente.')
        location.reload()
      } 
      else {
        return response.json()
      }
    })
    .then(data => {
      displayWeather(data)
    })
    .catch(error => {
      console.log(`Erro: ${error}`)
    })
  }
}

//Essa função exibe em tela para o usuário as informações recebidas pela API.
function displayWeather(data) {
  let {
    dt,
    name,
    weather: [{icon, description}],
    main: {temp, feels_like, humidity},
    wind: {speed},
    sys: {sunrise, sunset},
  } =data

  currentDate.textContent = formatDate(dt)
  cityName.textContent = `${name},`
  weatherIcon.src = `./assets/${icon}.svg`
  WeatherDescription.textContent = description
  currentTemperature.textContent = `${Math.round(temp)}ºC`
  windSpeed.textContent = `${Math.round(speed * 3.6)} Km/h`
  feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC`
  currentHumidity.textContent = `${humidity}%`
  sunriseTime.textContent = formatTime(sunrise)
  sunsetTime.textContent = formatTime(sunset)
}

//Essa função converte o formato de data recebido pela API.
function formatDate(epochTime){
  let date = new Date(epochTime * 1000)
  let formattedDate = date.toLocaleDateString('pt-BR', {month: 'long', day: 'numeric'})
  let weekDay = date.toLocaleDateString('pt-BR', {weekday: 'long'})
  return `${weekDay}, ${formattedDate}`
}

//Essa função converte o formato de horário recebido pela API.
function formatTime(epochTime){
  let date = new Date(epochTime * 1000)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  return `${hours}:${minutes}`
}
