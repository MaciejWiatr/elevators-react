import { range } from "./../../utils/range";
import { ElevatorSystem } from "./index";
import { performance } from "perf_hooks";

describe("Elevator system", () => {
	it("handles 1024 pickups with 16 elevators under 100 miliseconds", () => {
		const system = new ElevatorSystem(16);

		range(1, 1024).forEach((_) => {
			system.pickup(
				Math.floor(Math.random() * 50) - 25,
				Math.floor(Math.random() * 50) - 25
			);
		});

		console.time("elevator system performance");
		const startTime = performance.now();
		while (!system.isFinished) {
			system.step();
		}
		const endTime = performance.now();
		console.timeEnd("elevator system performance");

		// Expect time of execution to be under 100 milisecond
		expect(endTime - startTime).toBeLessThan(100);
	});
});
