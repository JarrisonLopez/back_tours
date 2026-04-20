import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const catalogosRouter = Router();

catalogosRouter.get('/', async (_req, res, next) => {
  try {
    const { data: tours, error: toursError } = await supabase
      .from('tour')
      .select('*')
      .order('id', { ascending: true });

    if (toursError) throw new Error(toursError.message);

    if (!tours || tours.length === 0) {
      return res.json({
        tours: [],
        hospedajes: [],
        alimentaciones: [],
        actividades: [],
        transportes: [],
        guias: [],
      });
    }

    const ids = tours.map((t) => t.id);

    const [hospedajes, alimentaciones, actividades, transportes, guias] = await Promise.all([
      supabase.from('hospedaje').select('*').in('id_tour', ids).order('id'),
      supabase.from('alimentacion').select('*').in('id_tour', ids).order('id'),
      supabase.from('actividad').select('*').in('id_tour', ids).order('id'),
      supabase.from('transporte').select('*').in('id_tour', ids).order('id'),
      supabase.from('guia').select('*').in('id_tour', ids).order('id'),
    ]);

    const errors = [
      hospedajes.error,
      alimentaciones.error,
      actividades.error,
      transportes.error,
      guias.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw new Error(errors[0]?.message ?? 'Error al obtener catálogos');
    }

    res.json({
      tours,
      hospedajes: hospedajes.data ?? [],
      alimentaciones: alimentaciones.data ?? [],
      actividades: actividades.data ?? [],
      transportes: transportes.data ?? [],
      guias: guias.data ?? [],
    });
  } catch (error) {
    next(error);
  }
});