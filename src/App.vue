<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import Alerta from "./components/Alerta.vue";
const monedas = ref([
  { codigo: "USD", texto: "Dolar de Estados Unidos" },
  { codigo: "MXN", texto: "Peso Mexicano" },
  { codigo: "EUR", texto: "Euro" },
  { codigo: "GBP", texto: "Libra Esterlina" },
  { codigo: "PEN", texto: "Sol Peruano" },
]);

const criptomonedas = ref([]);
const error = ref("");
const cotizar = reactive({
  moneda: "",
  cripto: "",
});
const cotizacion = ref({});

onMounted(() => {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
  fetch(url)
    .then((response) => response.json())
    .then(({ Data }) => (criptomonedas.value = Data));
});

const mostrarResultado = computed(() => {
  return Object.values(cotizacion.value).length > 0;
});

const cotizarCripto = () => {
  // Validar que cotizar esté lleno
  if (Object.values(cotizar).includes("")) {
    error.value = "Todos los campos son obligatorios";
    return;
  }
  error.value = "";
  obtenerCotizacion();
};
const obtenerCotizacion = async () => {
  const { moneda, cripto } = cotizar;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;
  const resp = await fetch(url);
  const data = await resp.json();
  // console.log(data.DISPLAY[cripto][moneda]);
  cotizacion.value = data.DISPLAY[cripto][moneda];
};
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>
    <div class="contenido">
      <Alerta v-if="error">{{ error }}</Alerta>
      <form @submit.prevent="cotizarCripto" class="formulario">
        <div class="campo">
          <label for="moneda">Moneda:</label>
          <select id="moneda" v-model="cotizar.moneda">
            <option value="">--Selecciona--</option>
            <option v-for="moneda in monedas" :value="moneda.codigo">
              {{ moneda.texto }}
            </option>
          </select>
        </div>
        <div class="campo">
          <label for="cripto">Criptomoneda:</label>
          <select id="cripto" v-model="cotizar.cripto">
            <option value="">--Selecciona--</option>
            <option
              v-for="cripto in criptomonedas"
              :value="cripto.CoinInfo.Name"
            >
              {{ cripto.CoinInfo.FullName }}
            </option>
          </select>
        </div>
        <input type="submit" value="Cotizar" />
      </form>
      <div class="contenedor-resultado" v-if="mostrarResultado">
        <h2>Cotización</h2>
        <div class="resultado">
          <img
            :src="'https://cryptocompare.com' + cotizacion.IMAGEURL"
            alt="imagen cripto"
          />
          <div>
            <p>
              El precio es de: <span>{{ cotizacion.PRICE }}</span>
            </p>
            <p>
              El precio más alto del día: <span>{{ cotizacion.HIGHDAY }}</span>
            </p>
            <p>
              El precio más bajo del día: <span>{{ cotizacion.LOWDAY }}</span>
            </p>
            <p>
              Variación última 24 horas:
              <span>{{ cotizacion.CHANGEPCT24HOUR }} %</span>
            </p>
            <p>
              Última actualización: <span>{{ cotizacion.LASTUPDATE }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
