import {
  createAvailableGate,
  GateStatus,
  occupyGate,
  releaseGate as releaseGateDomain,
  reserveGate,
  type AvailableGate,
  type Gate,
  type GateId,
  type OccupiedGate,
  type ReservedGate,
  type SpacecraftId,
} from "./gate";

export type GateReservationResult =
  | { readonly outcome: "RESERVED"; readonly gate: ReservedGate }
  | { readonly outcome: "NO_GATE_AVAILABLE" };

export type TerminalGateControllerErrorCode =
  | "DUPLICATE_GATE_ID"
  | "UNKNOWN_GATE"
  | "DUPLICATE_ACTIVE_ASSIGNMENT"
  | "RESERVATION_NOT_OWNED"
  | "OCCUPIED_GATE_NOT_OWNED";

export class TerminalGateControllerError extends Error {
  constructor(
    public readonly code: TerminalGateControllerErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "TerminalGateControllerError";
  }
}

/**
 * In-memory coordinator for the gates in one terminal. It selects the first
 * available gate in configured order. This controller does not guarantee
 * atomic reservations across independent processes or database transactions.
 */
export class TerminalGateController {
  private readonly gates = new Map<GateId, Gate>();

  constructor(
    public readonly terminalId: string,
    gateIds: readonly GateId[],
  ) {
    if (terminalId.trim().length === 0) {
      throw new TerminalGateControllerError(
        "UNKNOWN_GATE",
        "Terminal ID must not be blank.",
      );
    }

    for (const gateId of gateIds) {
      if (this.gates.has(gateId)) {
        throw new TerminalGateControllerError(
          "DUPLICATE_GATE_ID",
          `Terminal ${terminalId} has duplicate gate ID ${gateId}.`,
        );
      }

      this.gates.set(gateId, createAvailableGate(gateId));
    }
  }

  requestReservation(spacecraftId: SpacecraftId): GateReservationResult {
    if (this.hasActiveAssignment(spacecraftId)) {
      throw new TerminalGateControllerError(
        "DUPLICATE_ACTIVE_ASSIGNMENT",
        `Spacecraft ${spacecraftId} already has an active gate assignment in terminal ${this.terminalId}.`,
      );
    }

    const gate = [...this.gates.values()].find(({ status }) => status === GateStatus.AVAILABLE);
    if (!gate) {
      return { outcome: "NO_GATE_AVAILABLE" };
    }

    const reservedGate = reserveGate(gate, spacecraftId);
    this.gates.set(reservedGate.id, reservedGate);

    return { outcome: "RESERVED", gate: cloneGate(reservedGate) };
  }

  confirmDocking(gateId: GateId, spacecraftId: SpacecraftId): OccupiedGate {
    const gate = this.getGateOrThrow(gateId);
    if (gate.status !== GateStatus.RESERVED || gate.spacecraftId !== spacecraftId) {
      throw new TerminalGateControllerError(
        "RESERVATION_NOT_OWNED",
        `Spacecraft ${spacecraftId} does not own a reservation for gate ${gateId}.`,
      );
    }

    const occupiedGate = occupyGate(gate);
    this.gates.set(occupiedGate.id, occupiedGate);

    return cloneGate(occupiedGate) as OccupiedGate;
  }

  releaseGate(gateId: GateId, spacecraftId: SpacecraftId): AvailableGate {
    const gate = this.getGateOrThrow(gateId);
    if (gate.status !== GateStatus.OCCUPIED || gate.spacecraftId !== spacecraftId) {
      throw new TerminalGateControllerError(
        "OCCUPIED_GATE_NOT_OWNED",
        `Spacecraft ${spacecraftId} does not occupy gate ${gateId}.`,
      );
    }

    const availableGate = releaseGateDomain(gate);
    this.gates.set(availableGate.id, availableGate);

    return cloneGate(availableGate) as AvailableGate;
  }

  getGateSnapshot(): readonly Gate[] {
    return [...this.gates.values()].map(cloneGate);
  }

  private getGateOrThrow(gateId: GateId): Gate {
    const gate = this.gates.get(gateId);
    if (!gate) {
      throw new TerminalGateControllerError(
        "UNKNOWN_GATE",
        `Gate ${gateId} does not belong to terminal ${this.terminalId}.`,
      );
    }

    return gate;
  }

  private hasActiveAssignment(spacecraftId: SpacecraftId): boolean {
    return [...this.gates.values()].some(
      (gate) =>
        (gate.status === GateStatus.RESERVED || gate.status === GateStatus.OCCUPIED) &&
        gate.spacecraftId === spacecraftId,
    );
  }
}

function cloneGate(gate: Gate): Gate {
  switch (gate.status) {
    case GateStatus.AVAILABLE:
      return { id: gate.id, status: GateStatus.AVAILABLE };
    case GateStatus.RESERVED:
      return { id: gate.id, status: GateStatus.RESERVED, spacecraftId: gate.spacecraftId };
    case GateStatus.OCCUPIED:
      return { id: gate.id, status: GateStatus.OCCUPIED, spacecraftId: gate.spacecraftId };
  }
}
