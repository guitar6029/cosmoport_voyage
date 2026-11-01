import { describe, expect, it } from "vitest";
import {
  assertGateInvariants,
  createAvailableGate,
  GateInvariantError,
  GateStatus,
  GateTransitionError,
  occupyGate,
  releaseGate,
  reserveGate,
  type Gate,
} from "../server/domain/cosmoport-voyage/gate";

describe("CosmoPort Voyage gate management", () => {
  const gateId = "gate-aurora-01";
  const spacecraftId = "ship-lyra-7";

  it("reserves, occupies, and releases a gate while retaining its assignment", () => {
    const available = createAvailableGate(gateId);
    const reserved = reserveGate(available, spacecraftId);
    const occupied = occupyGate(reserved);
    const released = releaseGate(occupied);

    expect(available).toEqual({ id: gateId, status: GateStatus.AVAILABLE });
    expect(reserved).toEqual({
      id: gateId,
      status: GateStatus.RESERVED,
      spacecraftId,
    });
    expect(occupied).toEqual({
      id: gateId,
      status: GateStatus.OCCUPIED,
      spacecraftId,
    });
    expect(released).toEqual({ id: gateId, status: GateStatus.AVAILABLE });
  });

  it("rejects reserving a gate that is already reserved or occupied", () => {
    const reserved = reserveGate(createAvailableGate(gateId), spacecraftId);
    const occupied = occupyGate(reserved);

    for (const gate of [reserved, occupied]) {
      expect(() => reserveGate(gate, "ship-orion-3")).toThrow(GateTransitionError);
      expect(() => reserveGate(gate, "ship-orion-3")).toThrow(/cannot be reserved/);
    }
  });

  it("rejects occupation or release from an invalid state", () => {
    const available = createAvailableGate(gateId);
    const reserved = reserveGate(available, spacecraftId);
    const occupied = occupyGate(reserved);

    expect(() => occupyGate(available)).toThrow(GateTransitionError);
    expect(() => occupyGate(occupied)).toThrow(GateTransitionError);
    expect(() => releaseGate(available)).toThrow(GateTransitionError);
    expect(() => releaseGate(reserved)).toThrow(GateTransitionError);
  });

  it("enforces that available gates are unassigned and active gates have one assignment", () => {
    const assignedAvailableGate = {
      id: gateId,
      status: GateStatus.AVAILABLE,
      spacecraftId,
    } as unknown as Gate;
    const unassignedReservedGate = {
      id: gateId,
      status: GateStatus.RESERVED,
    } as unknown as Gate;

    expect(() => assertGateInvariants(assignedAvailableGate)).toThrow(GateInvariantError);
    expect(() => assertGateInvariants(unassignedReservedGate)).toThrow(GateInvariantError);
  });
});
