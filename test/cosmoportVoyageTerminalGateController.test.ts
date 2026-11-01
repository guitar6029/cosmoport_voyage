import { describe, expect, it } from "vitest";
import { GateStatus } from "../server/domain/cosmoport-voyage/gate";
import {
  TerminalGateController,
  TerminalGateControllerError,
} from "../server/domain/cosmoport-voyage/terminalGateController";

describe("CosmoPort Voyage terminal gate controller", () => {
  const terminalId = "terminal-aurora";
  const gateIds = ["gate-01", "gate-02"];

  it("allocates the first available gate in configured order", () => {
    const controller = new TerminalGateController(terminalId, gateIds);

    expect(controller.requestReservation("ship-lyra")).toEqual({
      outcome: "RESERVED",
      gate: {
        id: "gate-01",
        status: GateStatus.RESERVED,
        spacecraftId: "ship-lyra",
      },
    });
  });

  it("allocates different gates to multiple spacecraft", () => {
    const controller = new TerminalGateController(terminalId, gateIds);

    const firstReservation = controller.requestReservation("ship-lyra");
    const secondReservation = controller.requestReservation("ship-orion");

    expect(firstReservation).toMatchObject({ outcome: "RESERVED", gate: { id: "gate-01" } });
    expect(secondReservation).toMatchObject({ outcome: "RESERVED", gate: { id: "gate-02" } });
  });

  it("returns a clear result when no gate is available", () => {
    const controller = new TerminalGateController(terminalId, ["gate-01"]);
    controller.requestReservation("ship-lyra");

    expect(controller.requestReservation("ship-orion")).toEqual({ outcome: "NO_GATE_AVAILABLE" });
  });

  it("rejects docking and release attempts by a spacecraft that does not own the gate", () => {
    const controller = new TerminalGateController(terminalId, ["gate-01"]);
    const reservation = controller.requestReservation("ship-lyra");
    if (reservation.outcome !== "RESERVED") {
      throw new Error("Expected a gate reservation.");
    }

    expect(() => controller.confirmDocking(reservation.gate.id, "ship-orion")).toThrow(
      TerminalGateControllerError,
    );

    controller.confirmDocking(reservation.gate.id, "ship-lyra");

    expect(() => controller.releaseGate(reservation.gate.id, "ship-orion")).toThrow(
      TerminalGateControllerError,
    );
  });

  it("rejects duplicate active reservations for one spacecraft", () => {
    const controller = new TerminalGateController(terminalId, gateIds);
    controller.requestReservation("ship-lyra");

    expect(() => controller.requestReservation("ship-lyra")).toThrow(
      TerminalGateControllerError,
    );
  });

  it("makes a released gate available for a later reservation", () => {
    const controller = new TerminalGateController(terminalId, ["gate-01"]);
    const reservation = controller.requestReservation("ship-lyra");
    if (reservation.outcome !== "RESERVED") {
      throw new Error("Expected a gate reservation.");
    }

    controller.confirmDocking(reservation.gate.id, "ship-lyra");
    controller.releaseGate(reservation.gate.id, "ship-lyra");

    expect(controller.requestReservation("ship-orion")).toMatchObject({
      outcome: "RESERVED",
      gate: { id: "gate-01", spacecraftId: "ship-orion" },
    });
  });

  it("does not expose mutable controller-owned gate state", () => {
    const controller = new TerminalGateController(terminalId, ["gate-01"]);
    const snapshot = controller.getGateSnapshot() as unknown as Array<{
      status: string;
      spacecraftId?: string;
    }>;

    snapshot[0].status = GateStatus.OCCUPIED;
    snapshot[0].spacecraftId = "ship-intruder";

    expect(controller.getGateSnapshot()).toEqual([
      { id: "gate-01", status: GateStatus.AVAILABLE },
    ]);
    expect(controller.requestReservation("ship-lyra")).toMatchObject({
      outcome: "RESERVED",
      gate: { id: "gate-01", spacecraftId: "ship-lyra" },
    });
  });
});
