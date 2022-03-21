import { NewElevatorSystem } from "./ElevatorSystem";
import { performance } from "perf_hooks";
import { range } from "../../utils";

describe("New elevator system", () => {
	it("should handle 1024 pickups with 16 elevators under 100 miliseconds", () => {
		const system = new NewElevatorSystem(16);

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

	it("should correcltly deliver pickups", () => {
		const system = new NewElevatorSystem(2);

		system.pickup(0, 2);
		system.pickup(0, -2);
		const statuses = [];

		while (!system.isFinished) {
			system.step();
			statuses.push(system.status());
		}

		const deliveredFirst = statuses.find((status) => status[0][2] === 2);
		const deliveredSecond = statuses.find((status) => status[0][2] === -2);

		expect(deliveredFirst).toBeTruthy();
		expect(deliveredSecond).toBeTruthy();
	});
});
