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