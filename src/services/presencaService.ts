import {
  collection, query, where, getDocs,
  doc, getDoc, setDoc, deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { StatusPresenca, Excecao, Membership } from '../types';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDiaSemana(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

export async function calcularStatus(
  membershipId: string,
  linhaId: string,
  horarioId: string,
  data: Date
): Promise<StatusPresenca> {
  const dataStr = formatDate(data);
  const diaSemana = getDiaSemana(data);

  // 1. Dia bloqueado?
  const bloqDoc = await getDoc(doc(db, 'linhas', linhaId, 'diasBloqueados', dataStr));
  if (bloqDoc.exists()) {
    const bloq = bloqDoc.data();
    if (!bloq.horarios || bloq.horarios.includes(horarioId)) return 'sem_rota';
  }

  // 2. Exceção avulsa?
  const excSnap = await getDocs(
    query(
      collection(db, 'excecoes'),
      where('membershipId', '==', membershipId),
      where('data', '==', dataStr),
      where('horarioId', '==', horarioId)
    )
  );
  if (!excSnap.empty) {
    const exc = excSnap.docs[0].data() as Excecao;
    return exc.tipo === 'presenca_avulsa' ? 'presente_avulso' : 'ausente_avulso';
  }

  // 3. Período de ausência ativo?
  const periodoSnap = await getDocs(
    query(
      collection(db, 'memberships', membershipId, 'periodos'),
      where('ativo', '==', true)
    )
  );
  for (const p of periodoSnap.docs) {
    const { inicio, fim } = p.data();
    if (dataStr >= inicio && dataStr <= fim) return 'ausente_periodo';
  }

  // 4. Na grade?
  const gradeSnap = await getDocs(
    query(
      collection(db, 'memberships', membershipId, 'grade'),
      where('horarioId', '==', horarioId),
      where('diaSemana', '==', diaSemana),
      where('ativo', '==', true)
    )
  );
  if (!gradeSnap.empty) return 'presente_padrao';

  return 'fora_da_grade';
}

export async function marcarAusencia(
  passageiroId: string,
  membershipId: string,
  linhaId: string,
  donoId: string,
  horarioId: string,
  data: Date
) {
  const dataStr = formatDate(data);
  const id = `${membershipId}_${horarioId}_${dataStr}`;
  await setDoc(doc(db, 'excecoes', id), {
    passageiroId, membershipId, linhaId, donoId,
    horarioId, data: dataStr,
    tipo: 'ausencia_avulsa',
    createdAt: serverTimestamp()
  });
}

export async function desfazerAusencia(
  membershipId: string,
  horarioId: string,
  data: Date
) {
  const dataStr = formatDate(data);
  const id = `${membershipId}_${horarioId}_${dataStr}`;
  await deleteDoc(doc(db, 'excecoes', id));
}

// Versão corrigida — usa getDoc ao invés de query por __name__
export async function getMembershipsHoje(passageiroId: string) {
  const hoje = new Date();
  const diaSemana = getDiaSemana(hoje);

  const snap = await getDocs(
    query(
      collection(db, 'memberships'),
      where('passageiroId', '==', passageiroId),
      where('status', '==', 'ativo')
    )
  );

  const results = [];

  for (const memberDoc of snap.docs) {
    const membership = { id: memberDoc.id, ...memberDoc.data() } as Membership & { id: string };

    // Busca linha diretamente pelo ID
    const linhaDoc = await getDoc(doc(db, 'linhas', membership.linhaId));
    if (!linhaDoc.exists()) continue;
    const linha = { id: linhaDoc.id, ...linhaDoc.data() };

    // Busca horários de hoje
    const horariosSnap = await getDocs(
      query(
        collection(db, 'linhas', membership.linhaId, 'horarios'),
        where('diasSemana', 'array-contains', diaSemana),
        where('ativo', '==', true)
      )
    );

    for (const hDoc of horariosSnap.docs) {
      const horario = { id: hDoc.id, ...hDoc.data() };
      const status = await calcularStatus(membership.id, membership.linhaId, horario.id, hoje);

      if (status !== 'fora_da_grade') {
        results.push({ membership, linha, horario, status });
      }
    }
  }

  return results;
}