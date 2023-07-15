import { ref, onMounted, computed } from "vue";

export default function useCripto() {
  // States
  const criptomonedas = ref([]);
  const monedas = ref([
    { codigo: "USD", texto: "Dolar de Estados Unidos" },
    { codigo: "MXN", texto: "Peso Mexicano" },
    { codigo: "EUR", texto: "Euro" },
    { codigo: "GBP", texto: "Libra Esterlina" },
    { codigo: "PEN", texto: "Sol Peruano" },
  ]);
  const cotizacion = ref({});
  const cargando = ref(false);

  // Methods de carga

  onMounted(() => {
    const url =
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
    fetch(url)
      .then((response) => response.json())
      .then(({ Data }) => (criptomonedas.value = Data));
  });

  // Metodos o funciones

  const obtenerCotizacion = async (cotizar) => {
    cargando.value = true;
    cotizacion.value = {};
    try {
      const { moneda, cripto } = cotizar;
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;
      const resp = await fetch(url);
      const data = await resp.json();
      cotizacion.value = data.DISPLAY[cripto][moneda];
    } catch (error) {
      console.log(error);
    } finally {
      cargando.value = false;
    }
  };

  const mostrarResultado = computed(() => {
    return Object.values(cotizacion.value).length > 0;
  });

  // Retorno para disponibilidad
  return {
    monedas,
    criptomonedas,
    cargando,
    cotizacion,
    obtenerCotizacion,
    mostrarResultado,
  };
}
