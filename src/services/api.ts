import type {
  Agente,
  BoletaReg,
  DatosOcr,
  LoginResponse,
  Vehiculo,
} from "../components/types";

const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "https://backend-pagbol.onrender.com/api";

const obtenerToken = () => sessionStorage.getItem("token");

const authHeaders = (): Record<string, string> => {
  const token = obtenerToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const jsonHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const obtenerMensajeError = async (res: Response): Promise<string> => {
  const texto = await res.text();
  if (!texto) return "Error de conexión con el servidor";
  try {
    const json = JSON.parse(texto);
    if (Array.isArray(json.message)) return json.message.join(", ");
    if (typeof json.message === "string") return json.message;
    if (typeof json.error === "string") return json.error;
    return texto;
  } catch {
    return texto;
  }
};

const peticion = async <T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> => {
  const headers = {
    ...authHeaders(),
    ...(opciones.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  });

  if (!res.ok) {
    throw new Error(await obtenerMensajeError(res));
  }

  return res.json() as Promise<T>;
};

<<<<<<< HEAD
// ─── Auth ────────────────────────────────────────────────────────────────────

=======
>>>>>>> caa78ca919834215c6a9571d8e25f116ab982bee
export const loginAgente = (
  nro_esclf: string,
  password: string,
  captchaToken: string
<<<<<<< HEAD
) =>
  peticion<LoginResponse>("/auth/login", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ nro_esclf, password, captchaToken }),
=======
) => {
  return peticion<LoginResponse>("/auth/login", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      nro_esclf,
      password,
      captchaToken,
    }),
  });
};

export const registrarAgente = (
  nro_esclf: string,
  CI: string,
  grado: string,
  password: string,
  captchaToken: string
) => {
  return peticion("/auth/register", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      nro_esclf,
      CI,
      grado,
      password,
      captchaToken,
    }),
>>>>>>> caa78ca919834215c6a9571d8e25f116ab982bee
  });

export const registrarAgente = (
  nro_esclf: string,
  CI: string,
  grado: string,
  nombres: string,
  apellidos: string,
  password: string,
  captchaToken: string
) =>
  peticion<{ mensaje: string }>("/auth/register", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      nro_esclf,
      CI,
      grado,
      nombres,
      apellidos,
      password,
      captchaToken,
    }),
  });

// ─── Agentes ─────────────────────────────────────────────────────────────────

export const buscarAgente = (nro_esclf: string) =>
  peticion<Agente>(`/agentes/${encodeURIComponent(nro_esclf)}`);

// ─── Vehículos ───────────────────────────────────────────────────────────────

export const buscarVehiculo = (placa: string) =>
  peticion<Vehiculo>(`/vehiculos/${encodeURIComponent(placa)}`);

// ─── Boletas ─────────────────────────────────────────────────────────────────

export const listarBoletas = () => peticion<BoletaReg[]>("/boletas");

export const crearBoleta = (data: Partial<BoletaReg>) =>
  peticion<BoletaReg>("/boletas", {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

export const actualizarBoleta = (
  nro_boleta: string,
  data: Partial<BoletaReg>
) =>
  peticion<BoletaReg>(`/boletas/${encodeURIComponent(nro_boleta)}`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

export const eliminarBoleta = (nro_boleta: string) =>
  peticion<BoletaReg>(`/boletas/${encodeURIComponent(nro_boleta)}`, {
    method: "DELETE",
  });

// ─── OCR ─────────────────────────────────────────────────────────────────────

type RespuestaOcrBackend = {
  resultado?: { datos_sugeridos?: DatosOcr };
  datos_sugeridos?: DatosOcr;
};

export const procesarOCR = async (file: File): Promise<DatosOcr> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/ocr/procesar`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error(await obtenerMensajeError(res));

  const data = (await res.json()) as RespuestaOcrBackend;
  const datos = data.resultado?.datos_sugeridos ?? data.datos_sugeridos;

  if (!datos) throw new Error("El OCR respondió, pero no devolvió datos_sugeridos");

  return datos;
};
