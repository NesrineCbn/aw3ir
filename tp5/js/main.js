var app;
window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      formCityName: "",
      messageForm: "",
      cityList: [{ name: "Paris" }],
      cityWeather: null,
      cityWeatherLoading: false
    },

    mounted() {
      this.meteo({ name: "Paris" });
    },

    methods: {
      addCity(e) {
        e.preventDefault();
        const ville = this.formCityName.trim();
        if (!ville) return;

        if (this.isCityExist(ville)) {
          this.messageForm = "existe déjà";
          return;
        }

        this.cityList.push({ name: ville });
        this.formCityName = "";
        this.messageForm = "";
      },

      isCityExist(name) {
        return this.cityList.some(c => c.name.toUpperCase() === name.toUpperCase());
      },

      remove(city) {
        this.cityList = this.cityList.filter(c => c.name !== city.name);
        if (this.cityWeather && this.cityWeather.name === city.name) {
          this.cityWeather = null;
        }
      },

      meteo(city) {
        this.cityWeatherLoading = true;
        this.cityWeather = null;

        const API_KEY = "af160b1a6dc5d4653aa15f805aecc87a";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric&lang=fr`)
          .then(r => r.json())
          .then(json => {
            this.cityWeatherLoading = false;
            if (json.cod === 200) this.cityWeather = json;
            else this.messageForm = "Ville non trouvée";
          });
      },

      // BONUS : Ma position
      getMyPosition() {
        if (!navigator.geolocation) {
          alert("Géolocalisation non supportée");
          return;
        }

        this.cityWeatherLoading = true;
        this.messageForm = "Localisation en cours...";

        navigator.geolocation.getCurrentPosition(pos => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const API_KEY = "270affce7c4f4aa3540b778438d18763";

          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`)
            .then(r => r.json())
            .then(json => {
              this.cityWeatherLoading = false;
              this.messageForm = "";
              if (json.cod === 200) {
                this.cityWeather = json;
                if (!this.isCityExist(json.name)) {
                  this.cityList.push({ name: json.name });
                }
              }
            });
        }, () => {
          this.cityWeatherLoading = false;
          this.messageForm = "";
          alert("Géolocalisation refusée ou impossible");
        });
      }
    },

    computed: {
      cityWheaterDate() {
        if (!this.cityWeather) return "";
        const d = new Date(this.cityWeather.dt * 1000);
        return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
      },
      cityWheaterSunrise() {
        if (!this.cityWeather) return "";
        const d = new Date(this.cityWeather.sys.sunrise * 1000);
        return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
      },
      cityWheaterSunset() {
        if (!this.cityWeather) return "";
        const d = new Date(this.cityWeather.sys.sunset * 1000);
        return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
      },
      openStreetMapArea() {
        if (!this.cityWeather) return "";
        const d = 0.04;
        const lat = this.cityWeather.coord.lat;
        const lon = this.cityWeather.coord.lon;
        return `${lon-d},${lat-d},${lon+d},${lat+d}`;
      }
    }
  });
};
