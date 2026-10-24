export interface Vendedor {
  id: string;
  nombre: string;
  apellido: string;
  iniciales?: string;
  plaza?: string;
  sucursal?: string;
  zona?: string;
  puntaje: number;
  vta_ov: number;
  prod: number;
  no_comp: number;
  lanzamientos: number;
  cobranza: number;
  relevamiento: number;
  posicion_sucursal: number;
  posicion_general: number;
  tendencia?: string;
  periodo?: string;
}
