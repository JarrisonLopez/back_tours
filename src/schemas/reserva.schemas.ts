import { z } from 'zod';

export const cotizarSchema = z.object({
  idTour: z.number().int().positive(),
  cantidadAdultos: z.number().int().min(1),
  cantidadNinos: z.number().int().min(0),
  cantidadDias: z.number().int().min(1),
  idHospedaje: z.number().int().positive().optional(),
  idsAlimentacion: z.array(z.number().int().positive()).optional(),
  idTransporte: z.number().int().positive().optional(),
  idActividad: z.number().int().positive().optional(),
  idGuia: z.number().int().positive().optional(),
});