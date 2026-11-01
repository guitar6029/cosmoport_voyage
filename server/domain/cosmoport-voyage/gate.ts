export type GateId = string;
export type SpacecraftId = string;

export const GateStatus = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  OCCUPIED: "OCCUPIED",
} as const;

export type GateStatus = (typeof GateStatus)[keyof typeof GateStatus];

export interface AvailableGate {
  readonly id: GateId;
  readonly status: typeof GateStatus.AVAILABLE;
  readonly spacecraftId?: never;
}

export interface ReservedGate {
  readonly id: GateId;
  readonly status: typeof GateStatus.RESERVED;
  readonly spacecraftId: SpacecraftId;
}

export interface OccupiedGate {
  readonly id: GateId;
  readonly status: typeof GateStatus.OCCUPIED;
  readonly spacecraftId: SpacecraftId;
}

/**
 * A gate can hold no more than one spacecraft assignment. An assignment is
 * required while the gate is reserved or occupied, and absent when available.
 */
export type Gate = AvailableGate | ReservedGate | OccupiedGate;

export type GateTransitionErrorCode =
  | "GATE_NOT_AVAILABLE"
  | "GATE_NOT_RESERVED"
  | "GATE_NOT_OCCUPIED";

export class GateTransitionError extends Error {
  constructor(
    public readonly code: GateTransitionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "GateTransitionError";
  }
}

export class GateInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GateInvariantError";
  }
}

export function createAvailableGate(id: GateId): AvailableGate {
  assertIdentifier(id, "Gate ID");

  return { id, status: GateStatus.AVAILABLE };
}

export function reserveGate(gate: Gate, spacecraftId: SpacecraftId): ReservedGate {
  assertGateInvariants(gate);
  assertIdentifier(spacecraftId, "Spacecraft ID");

  if (gate.status !== GateStatus.AVAILABLE) {
    throw new GateTransitionError(
      "GATE_NOT_AVAILABLE",
      `Gate ${gate.id} is ${gate.status} and cannot be reserved.`,
    );
  }

  return { id: gate.id, status: GateStatus.RESERVED, spacecraftId };
}

export function occupyGate(gate: Gate): OccupiedGate {
  assertGateInvariants(gate);

  if (gate.status !== GateStatus.RESERVED) {
    throw new GateTransitionError(
      "GATE_NOT_RESERVED",
      `Gate ${gate.id} is ${gate.status} and cannot be marked occupied.`,
    );
  }

  return {
    id: gate.id,
    status: GateStatus.OCCUPIED,
    spacecraftId: gate.spacecraftId,
  };
}

export function releaseGate(gate: Gate): AvailableGate {
  assertGateInvariants(gate);

  if (gate.status !== GateStatus.OCCUPIED) {
    throw new GateTransitionError(
      "GATE_NOT_OCCUPIED",
      `Gate ${gate.id} is ${gate.status} and cannot be released.`,
    );
  }

  return { id: gate.id, status: GateStatus.AVAILABLE };
}

/** Validates externally reconstructed gate state before applying a transition. */
export function assertGateInvariants(gate: Gate): void {
  assertIdentifier(gate.id, "Gate ID");
  const gateId = gate.id;
  switch (gate.status) {
    case GateStatus.AVAILABLE:
      if ("spacecraftId" in gate && gate.spacecraftId !== undefined) {
        throw new GateInvariantError("An available gate cannot have a spacecraft assignment.");
      }
      return;
    case GateStatus.RESERVED:
    case GateStatus.OCCUPIED:
      assertIdentifier(gate.spacecraftId, "Spacecraft ID");
      return;
    default:
      throw new GateInvariantError(`Gate ${gateId} has an unknown status.`);
  }
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new GateInvariantError(`${label} must not be blank.`);
  }
}
