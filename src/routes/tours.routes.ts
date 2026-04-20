import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const toursRouter = Router();

toursRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('tour')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    res.json({ tours: data ?? [] });
  } catch (error) {
    next(error);
  }
});

toursRouter.post('/', async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new Error('El nombre del tour es obligatorio y debe tener al menos 3 caracteres');
    }

    const { data, error } = await supabase
      .from('tour')
      .insert({
        nombre: nombre.trim(),
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({
      message: 'Tour creado correctamente',
      tour: data,
    });
  } catch (error) {
    next(error);
  }
});

toursRouter.post('/full', async (req, res, next) => {
  try {
    const {
      nombre,
      hospedajes = [],
      alimentaciones = [],
      actividades = [],
      transportes = [],
      guias = [],
    } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new Error('El nombre del tour es obligatorio y debe tener al menos 3 caracteres');
    }

    const { data: newTour, error: tourError } = await supabase
      .from('tour')
      .insert({ nombre: nombre.trim() })
      .select('*')
      .single();

    if (tourError) throw new Error(tourError.message);

    const idTour = newTour.id;

    if (Array.isArray(hospedajes) && hospedajes.length > 0) {
      const hospedajesData = hospedajes.map((h: any) => ({
        nombre: h.nombre,
        costo_noche_adulto: Number(h.costo_noche_adulto),
        costo_noche_nino: Number(h.costo_noche_nino),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('hospedaje').insert(hospedajesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(alimentaciones) && alimentaciones.length > 0) {
      const alimentacionesData = alimentaciones.map((a: any) => ({
        nombre: a.nombre,
        costo_alimentacion_adulto: Number(a.costo_alimentacion_adulto),
        costo_alimentacion_nino: Number(a.costo_alimentacion_nino),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('alimentacion').insert(alimentacionesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(actividades) && actividades.length > 0) {
      const actividadesData = actividades.map((a: any) => ({
        nombre: a.nombre,
        precio_1_persona: Number(a.precio_1_persona),
        precio_1_a_3_personas: Number(a.precio_1_a_3_personas),
        precio_4_a_9_personas: Number(a.precio_4_a_9_personas),
        precio_10_o_mas: Number(a.precio_10_o_mas),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('actividad').insert(actividadesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(transportes) && transportes.length > 0) {
      const transportesData = transportes.map((t: any) => ({
        nombre: t.nombre,
        precio_transporte: Number(t.precio_transporte),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('transporte').insert(transportesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(guias) && guias.length > 0) {
      const guiasData = guias.map((g: any) => ({
        tipo_guia: g.tipo_guia,
        precio_dia: Number(g.precio_dia),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('guia').insert(guiasData);
      if (error) throw new Error(error.message);
    }

    res.status(201).json({
      message: 'Tour completo creado correctamente',
      tour: newTour,
    });
  } catch (error) {
    next(error);
  }
});

toursRouter.put('/full/:id', async (req, res, next) => {
  try {
    const idTour = Number(req.params.id);

    if (!Number.isInteger(idTour) || idTour <= 0) {
      throw new Error('El id del tour no es válido');
    }

    const {
      nombre,
      hospedajes = [],
      alimentaciones = [],
      actividades = [],
      transportes = [],
      guias = [],
    } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new Error('El nombre del tour es obligatorio y debe tener al menos 3 caracteres');
    }

    const { data: existingTour, error: findError } = await supabase
      .from('tour')
      .select('id')
      .eq('id', idTour)
      .maybeSingle();

    if (findError) throw new Error(findError.message);

    if (!existingTour) {
      return res.status(404).json({ error: 'El tour no existe' });
    }

    const { data: updatedTour, error: updateError } = await supabase
      .from('tour')
      .update({ nombre: nombre.trim() })
      .eq('id', idTour)
      .select('*')
      .single();

    if (updateError) throw new Error(updateError.message);

    const deleteTasks = await Promise.all([
      supabase.from('hospedaje').delete().eq('id_tour', idTour),
      supabase.from('alimentacion').delete().eq('id_tour', idTour),
      supabase.from('actividad').delete().eq('id_tour', idTour),
      supabase.from('transporte').delete().eq('id_tour', idTour),
      supabase.from('guia').delete().eq('id_tour', idTour),
    ]);

    for (const task of deleteTasks) {
      if (task.error) throw new Error(task.error.message);
    }

    if (Array.isArray(hospedajes) && hospedajes.length > 0) {
      const hospedajesData = hospedajes.map((h: any) => ({
        nombre: h.nombre,
        costo_noche_adulto: Number(h.costo_noche_adulto),
        costo_noche_nino: Number(h.costo_noche_nino),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('hospedaje').insert(hospedajesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(alimentaciones) && alimentaciones.length > 0) {
      const alimentacionesData = alimentaciones.map((a: any) => ({
        nombre: a.nombre,
        costo_alimentacion_adulto: Number(a.costo_alimentacion_adulto),
        costo_alimentacion_nino: Number(a.costo_alimentacion_nino),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('alimentacion').insert(alimentacionesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(actividades) && actividades.length > 0) {
      const actividadesData = actividades.map((a: any) => ({
        nombre: a.nombre,
        precio_1_persona: Number(a.precio_1_persona),
        precio_1_a_3_personas: Number(a.precio_1_a_3_personas),
        precio_4_a_9_personas: Number(a.precio_4_a_9_personas),
        precio_10_o_mas: Number(a.precio_10_o_mas),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('actividad').insert(actividadesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(transportes) && transportes.length > 0) {
      const transportesData = transportes.map((t: any) => ({
        nombre: t.nombre,
        precio_transporte: Number(t.precio_transporte),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('transporte').insert(transportesData);
      if (error) throw new Error(error.message);
    }

    if (Array.isArray(guias) && guias.length > 0) {
      const guiasData = guias.map((g: any) => ({
        tipo_guia: g.tipo_guia,
        precio_dia: Number(g.precio_dia),
        id_tour: idTour,
      }));

      const { error } = await supabase.from('guia').insert(guiasData);
      if (error) throw new Error(error.message);
    }

    res.json({
      message: 'Tour completo actualizado correctamente',
      tour: updatedTour,
    });
  } catch (error) {
    next(error);
  }
});

toursRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id del tour no es válido');
    }

    const { data: existingTour, error: findError } = await supabase
      .from('tour')
      .select('id, nombre')
      .eq('id', id)
      .maybeSingle();

    if (findError) throw new Error(findError.message);

    if (!existingTour) {
      return res.status(404).json({
        error: 'El tour no existe',
      });
    }

    const { error: deleteError } = await supabase
      .from('tour')
      .delete()
      .eq('id', id);

    if (deleteError) throw new Error(deleteError.message);

    res.json({
      message: 'Tour eliminado correctamente',
      tour: existingTour,
    });
  } catch (error) {
    next(error);
  }
});