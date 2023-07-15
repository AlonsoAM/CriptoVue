<script setup>
import { ref, reactive, computed } from "vue";
import Alerta from "./components/Alerta.vue";
import Spinner from "./components/Spinner.vue";

import useCripto from "./composables/useCripto";

const {
  monedas,
  criptomonedas,
  cargando,
  cotizacion,
  obtenerCotizacion,
  mostrarResultado,
} = useCripto();

const error = ref("");
const cotizar = reactive({
  moneda: "",
  cripto: "",
});

const cotizarCripto = () => {
  // Validar que cotizar esté lleno
  if (Object.values(cotizar).includes("")) {
    error.value = "Todos los campos son obligatorios";
    return;
  }
  error.value = "";
  obtenerCotizacion(cotizar);
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
      <Spinner v-if="cargando" />
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
