export type Persona = {
  CI: string;
  nombres: string;
  apellidos: string;
  telefono?: string | null;
  direccion?: string | null;
};

export type Agente = {
  nro_esclf: string;
  CI: string;
  grado: string;
  persona: Persona;
};

export type Vehiculo = {
  placa: string;
  marca: string;
  tip_vehi: string;
  color: string;
};

export type Infraccion = {
  nro_infr: string;
  art: string;
  descr?: string | null;
  obsv?: string | null;
};

export type BoletaReg = {
  nro_boleta: string;
  fecha: string;
  hora: string;

  placa: string;
  nro_lic?: string | null;
  categ_lic?: string | null;
  nom_conductor?: string | null;

  tip_vehi: string;
  marca: string;
  color: string;

  art: string;
  nro_infr: string;

  lugar: string;
  zona: string;
  observ?: string | null;

  nro_esclf: string;
  fech_reg: string;

  activo: boolean;
  fech_elim?: string | null;

  vehiculo?: Vehiculo;
  infraccion?: Infraccion;
  agente?: Agente;
};

export type DatosOcr = {
  hora?: string | null;
  dia?: string | null;
  mes?: string | null;
  anio?: string | null;
  fecha?: string | null;

  placa?: string | null;
  nro_lic?: string | null;
  nom_conductor?: string | null;

  tip_vehi?: string | null;
  marca?: string | null;
  color?: string | null;

  art?: string | null;
  nro_infr?: string | null;

  lugar?: string | null;
  zona?: string | null;
  observ?: string | null;

  nro_boleta?: string | null;
  campos_revisar?: string[];
};

export type LoginResponse = {
  token: string;
  agente: Agente;
};