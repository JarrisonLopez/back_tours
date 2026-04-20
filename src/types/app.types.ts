export type Hospedaje = {
  id: number;
  nombre: string;
  costo_noche_adulto: number;
  costo_noche_nino: number;
  id_tour: number;
};

export type Alimentacion = {
  id: number;
  nombre: string;
  costo_alimentacion_adulto: number;
  costo_alimentacion_nino: number;
  id_tour: number;
};

export type Actividad = {
  id: number;
  nombre: string;
  precio_1_persona: number;
  precio_1_a_3_personas: number;
  precio_4_a_9_personas: number;
  precio_10_o_mas: number;
  id_tour: number;
};

export type Transporte = {
  id: number;
  nombre: string;
  precio_transporte: number;
  id_tour: number;
};

export type Guia = {
  id: number;
  tipo_guia: 'bilingue' | 'leader';
  precio_dia: number;
  id_tour: number;
};

export type ReservaInput = {
  idTour: number;
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadDias: number;
  idHospedaje?: number;
  idsAlimentacion?: number[];
  idTransporte?: number;
  idActividad?: number;
  idGuia?: number;
};