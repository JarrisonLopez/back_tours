import type {
  Actividad,
  Alimentacion,
  Guia,
  Hospedaje,
  Transporte,
} from '../types/app.types.js';

function getPrecioActividad(totalPersonas: number, actividad: Actividad): number {
  if (totalPersonas === 1) return Number(actividad.precio_1_persona);
  if (totalPersonas >= 2 && totalPersonas <= 3) return Number(actividad.precio_1_a_3_personas);
  if (totalPersonas >= 4 && totalPersonas <= 9) return Number(actividad.precio_4_a_9_personas);
  return Number(actividad.precio_10_o_mas);
}

export function calcularCotizacion(params: {
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadDias: number;
  hospedaje?: Hospedaje | null;
  alimentaciones?: Alimentacion[];
  transporte?: Transporte | null;
  actividad?: Actividad | null;
  guia?: Guia | null;
}) {
  const totalPersonas = params.cantidadAdultos + params.cantidadNinos;

  const hospedaje = params.hospedaje
    ? (
        params.cantidadAdultos * Number(params.hospedaje.costo_noche_adulto) +
        params.cantidadNinos * Number(params.hospedaje.costo_noche_nino)
      ) * params.cantidadDias
    : 0;

  const alimentacionPorDia = (params.alimentaciones ?? []).reduce((acc, item) => {
    return (
      acc +
      params.cantidadAdultos * Number(item.costo_alimentacion_adulto) +
      params.cantidadNinos * Number(item.costo_alimentacion_nino)
    );
  }, 0);

  const alimentacion = alimentacionPorDia * params.cantidadDias;
  const transporte = params.transporte ? Number(params.transporte.precio_transporte) : 0;
  const actividad = params.actividad ? getPrecioActividad(totalPersonas, params.actividad) : 0;
  const guia = params.guia ? Number(params.guia.precio_dia) * params.cantidadDias : 0;

  return {
    desglose: {
      hospedaje,
      alimentacion,
      transporte,
      actividad,
      guia,
    },
    total: hospedaje + alimentacion + transporte + actividad + guia,
  };
}