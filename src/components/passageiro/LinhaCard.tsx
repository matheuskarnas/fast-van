import { StatusPresenca } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

function StatusBadge({ status }: { status: StatusPresenca }) {
  const map: Record<
    StatusPresenca,
    { label: string; bg: string; text: string }
  > = {
    presente_padrao: { label: "✓ Confirmado", bg: "#E1F5EE", text: "#085041" },
    presente_avulso: {
      label: "✓ Presente hoje",
      bg: "#E1F5EE",
      text: "#085041",
    },
    ausente_avulso: { label: "✗ Ausente hoje", bg: "#FCEBEB", text: "#A32D2D" },
    ausente_periodo: {
      label: "✗ Período de ausência",
      bg: "#FAEEDA",
      text: "#854F0B",
    },
    sem_rota: { label: "— Sem rota hoje", bg: "#F1EFE8", text: "#5F5E5A" },
    fora_da_grade: { label: "— Fora da grade", bg: "#F1EFE8", text: "#5F5E5A" },
  };
  const s = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

export function LinhaCard({
  item,
  onAusencia,
  onDesfazer,
  loadingId,
}: {
  item: any;
  onAusencia: () => void;
  onDesfazer: () => void;
  loadingId: string | null;
}) {
  const { membership, linha, horario, status } = item;
  const cardId = `${membership.id}_${horario.id}`;
  const isLoading = loadingId === cardId;
  const podeAusentar =
    status === "presente_padrao" || status === "presente_avulso";
  const podeDesfazer = status === "ausente_avulso";
  const isPeriodo = status === "ausente_periodo";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.linhaNome}>{linha.nome ?? "Linha"}</Text>
          <Text style={styles.motoristaText}>
            Destino: {linha.destino ?? "—"}
          </Text>
        </View>
        <View
          style={[
            styles.direcaoBadge,
            {
              backgroundColor:
                horario.sentido === "ida" ? "#E6F1FB" : "#EEEDFE",
            },
          ]}
        >
          <Text
            style={[
              styles.direcaoText,
              { color: horario.sentido === "ida" ? "#0C447C" : "#3C3489" },
            ]}
          >
            {horario.sentido === "ida" ? "IDA" : "VOLTA"}
          </Text>
        </View>
      </View>

      <View style={styles.cardMid}>
        <Text style={styles.horarioGrande}>{horario.hora}</Text>
        <View style={styles.pontoRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.pontoText}>Ponto de embarque</Text>
        </View>
      </View>

      {isPeriodo && (
        <View style={styles.periodoBanner}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#854F0B"
          />
          <Text style={styles.periodoText}>Período de ausência ativo</Text>
          <TouchableOpacity onPress={onDesfazer}>
            <Text style={styles.periodoLink}>Ir mesmo assim</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBadge status={status} />
      {(status === "presente_padrao" || status === "presente_avulso") && (
        <Text style={styles.vagaReservada}>Sua vaga está reservada</Text>
      )}

      {isLoading ? (
        <ActivityIndicator color="#F4821F" style={{ marginTop: 8 }} />
      ) : (
        <>
          {podeAusentar && (
            <TouchableOpacity style={styles.ausenciaBtn} onPress={onAusencia}>
              <Text style={styles.ausenciaText}>Não vou hoje</Text>
            </TouchableOpacity>
          )}
          {podeDesfazer && (
            <TouchableOpacity style={styles.desfazerBtn} onPress={onDesfazer}>
              <Text style={styles.desfazerText}>Desfazer ausência</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  greeting: { fontSize: 20, fontWeight: "700", color: "#1A1A2E" },
  dataText: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  topActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F6FA",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  linhaNome: { fontSize: 16, fontWeight: "700", color: "#1A1A2E" },
  motoristaText: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  direcaoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  direcaoText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  cardMid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  horarioGrande: { fontSize: 36, fontWeight: "800", color: "#1A1A2E" },
  pontoRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  pontoText: { fontSize: 13, color: "#6B7280" },
  periodoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FAEEDA",
    borderRadius: 8,
    padding: 10,
  },
  periodoText: { flex: 1, fontSize: 12, color: "#854F0B" },
  periodoLink: { fontSize: 12, fontWeight: "700", color: "#F4821F" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 13, fontWeight: "700" },
  vagaReservada: { fontSize: 12, color: "#9CA3AF" },
  ausenciaBtn: { alignSelf: "flex-start", paddingVertical: 4 },
  ausenciaText: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },
  desfazerBtn: {
    backgroundColor: "#F4821F",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  desfazerText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#6B7280" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F1EFE8",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  btnBuscar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1A3C6E",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  btnBuscarText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    paddingBottom: 20,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", gap: 4 },
  navLabel: { fontSize: 11, color: "#9CA3AF" },
  navLabelActive: { color: "#1A3C6E", fontWeight: "600" },
});
