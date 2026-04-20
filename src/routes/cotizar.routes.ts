import { Router } from 'express';
import { cotizarSchema } from '../schemas/reserva.schemas.js';
import { supabase } from '../lib/supabase.js';
import { calcularCotizacion } from '../services/pricing.service.js';

export const cotizarRouter = Router();

cotizarRouter.post('/', async (req, res, next) => {
  try {
    const payload = cotizarSchema.parse(req.body);

    const [hospedajeRes, alimentacionRes, transporteRes, actividadRes, guiaRes] = await Promise.all([
      payload.idHospedaje
        ? supabase
            .from('hospedaje')
            .select('*')
            .eq('id', payload.idHospedaje)
            .eq('id_tour', payload.idTour)
            .single()
        : Promise.resolve({ data: null, error: null }),

      payload.idsAlimentacion && payload.idsAlimentacion.length > 0
        ? supabase
            .from('alimentacion')
            .select('*')
            .in('id', payload.idsAlimentacion)
            .eq('id_tour', payload.idTour)
        : Promise.resolve({ data: [], error: null }),

      payload.idTransporte
        ? supabase
            .from('transporte')
            .select('*')
            .eq('id', payload.idTransporte)
            .eq('id_tour', payload.idTour)
            .single()
        : Promise.resolve({ data: null, error: null }),

      payload.idActividad
        ? supabase
            .from('actividad')
            .select('*')
            .eq('id', payload.idActividad)
            .eq('id_tour', payload.idTour)
            .single()
        : Promise.resolve({ data: null, error: null }),

      payload.idGuia
        ? supabase
            .from('guia')
            .select('*')
            .eq('id', payload.idGuia)
            .eq('id_tour', payload.idTour)
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const errors = [
      hospedajeRes.error,
      alimentacionRes.error,
      transporteRes.error,
      actividadRes.error,
      guiaRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw new Error(errors[0]?.message ?? 'No se pudo cotizar');
    }

    const resultado = calcularCotizacion({
      cantidadAdultos: payload.cantidadAdultos,
      cantidadNinos: payload.cantidadNinos,
      cantidadDias: payload.cantidadDias,
      hospedaje: hospedajeRes.data,
      alimentaciones: alimentacionRes.data ?? [],
      transporte: transporteRes.data,
      actividad: actividadRes.data,
      guia: guiaRes.data,
    });

    res.json(resultado);
  } catch (error) {
    next(error);
  }
});