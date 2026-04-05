import { FieldValue } from 'firebase/firestore';

export type UserRole = 'passageiro' | 'motorista' | 'dono';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  roles: UserRole[];
  pushToken?: string;
  cnh?: string;
  createdAt: FieldValue | Date;
}

export interface Van {
  id: string;
  donoId: string;
  placa: string;
  capacidade: number;
  modelo?: string;
  ativa: boolean;
  createdAt: FieldValue | Date;
}

export interface Linha {
  id: string;
  donoId: string;
  vanId: string;
  nome: string;
  destino: string;
  destinoCoords: { latitude: number; longitude: number };
  capacidade: number;
  publica: boolean;
  ativa: boolean;
  createdAt: FieldValue | Date;
}

export interface Horario {
  id: string;
  sentido: 'ida' | 'volta';
  hora: string;
  diasSemana: number[];
  ativo: boolean;
}

export interface PontoEmbarque {
  id: string;
  nome: string;
  coords: { latitude: number; longitude: number };
  ordem: number;
}

export interface OperadorLinha {
  motoristaId: string;
  diasSemana: number[];
  ativo: boolean;
}

export interface Convite {
  id: string;
  linhaId: string;
  donoId: string;
  tipo: 'unico' | 'multiplo';
  usadoPor?: string;
  expiresAt: Date;
  ativo: boolean;
}

export interface DiaBloqueado {
  data: string;
  motivo?: string;
  horarios?: string[];
}

export interface Membership {
  id: string;
  passageiroId: string;
  linhaId: string;
  donoId: string;
  status: 'pendente' | 'ativo' | 'inativo';
  pontoId: string;
  conviteId?: string;
  createdAt: FieldValue | Date;
}

export interface GradeItem {
  id: string;
  diaSemana: number;
  horarioId: string;
  sentido: 'ida' | 'volta';
  ativo: boolean;
  validoAte?: Date;
}

export interface PeriodoAusencia {
  id: string;
  inicio: string;
  fim: string;
  ativo: boolean;
}

export interface Excecao {
  id: string;
  passageiroId: string;
  membershipId: string;
  linhaId: string;
  donoId: string;
  data: string;
  horarioId: string;
  tipo: 'ausencia_avulsa' | 'presenca_avulsa';
  createdAt: FieldValue | Date;
}

export type ChatTipo = 'negociacao' | 'linha';

export interface Chat {
  id: string;
  tipo: ChatTipo;
  linhaId: string;
  participantes: string[];
  ultimaMensagem: string;
  ultimaAtividade: FieldValue | Date;
}

export interface Mensagem {
  id: string;
  autorId: string;
  texto: string;
  timestamp: FieldValue | Date;
  lida: boolean;
}

export type StatusPresenca =
  | 'sem_rota'
  | 'ausente_periodo'
  | 'ausente_avulso'
  | 'presente_avulso'
  | 'presente_padrao'
  | 'fora_da_grade';