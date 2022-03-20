import { groupByDirection } from "./../../utils/groupByDirection";
import { nanoid } from "nanoid";

export type Elevator = [
	elevatorId: number,
	currentFloor: number,
	destination: number
];

export type PickupItem = [originFloor: number, direction: number, id: string];

type ElevatorDirection = "up" | "down" | "stop";

export interface IElevatorSystem {
	pickup(originFloor: number, direction: number): void;
	status(): Elevator[];
	step(): void;
	update(elevatorId: number, currentFloor: number, destination: number): void;
	elevatorPickups(elevatorId: number): number;
	floorPickups(floorNumber: number): {
		up: PickupItem[];
		down: PickupItem[];
	};
}

export class ElevatorSystem implements IElevatorSystem {
	private elevators: Elevator[];
	public pickupQueue: PickupItem[] = [];
	public pickupMap: { [id: string]: PickupItem[] } = {};

	constructor(elevatorNumber: number) {
		// Generate given number of elevators
		// Each elevator is default to 0 floor and 0 direction
		const newElevators: Elevator[] = [];
		for (let i = 0; i < elevatorNumber; i++) {
			newElevators.push([i, 0, 0]);
		}
		this.elevators = newElevators;
	}
	floorPickups(floorNumber: number) {
		const pickups = this.pickupQueue.filter(
			(pickup) => pickup[0] === floorNumber
		);

		return groupByDirection(pickups);
	}
	pickup(originFloor: number, direction: number): void {
		// Create pickup with unique nanoid
		console.log("pickup", originFloor, direction);
		this.pickupQueue.push([originFloor, direction, nanoid()]);
	}
	status(): Elevator[] {
		return this.elevators;
	}

	private moveElevator(direction: ElevatorDirection, elevator: Elevator) {
		// Elevator is moving
		if (direction !== "stop") {
			// Elevator is moving upwards
			if (direction === "up") {
				elevator[1] += 1;
			}
			// Elevator is moving downwards
			else {
				elevator[1] -= 1;
			}
		}
	}

	private dropPickup(elevator: Elevator) {
		if (this.pickupMap[elevator[0]]) {
			// Check if elevator is at the pickup destination
			this.pickupMap[elevator[0]].forEach((pickup) => {
				const goto = pickup[0] + pickup[1];
				// Elevator is at the pickup destination, remove pickup
				if (elevator[1] === goto) {
					console.log(pickup[0], pickup[1], elevator[1], goto);
					this.pickupMap[elevator[0]] = this.pickupMap[
						elevator[0]
					].filter((p) => p[2] !== pickup[2]);
				}
			});
		}
	}

	private pickupNewPickups(direction: ElevatorDirection, elevator: Elevator) {
		if (this.pickupQueue.length === 0) return [];

		// Check if anyone is waiting to be picked up on a certain floor
		let floorPickups = this.pickupQueue
			.filter((pickup) => pickup[0] === elevator[1])
			.filter((pickup) => {
				// Get only pickups that are going in the same direction
				if (pickup[1] > elevator[1] && direction == "up") return true;
				else if (pickup[1] < elevator[1] && direction == "down")
					return true;
				else if (direction == "stop") return true;
				else return false;
			});

		const floorPickupIds = floorPickups.map((pickup) => pickup[2]);

		// Remove picked up items from pickup queue
		this.pickupQueue = this.pickupQueue.filter(
			(pickup) => !floorPickupIds.includes(pickup[2])
		);

		// Add picked up items to pickup map
		if (!this.pickupMap[elevator[0]]) {
			this.pickupMap[elevator[0]] = [];
		}
		this.pickupMap[elevator[0]] = [
			...this.pickupMap[elevator[0]],
			...floorPickups,
		];

		return floorPickups;
	}

	private selectNewDestination(
		direction: ElevatorDirection,
		floorPickups: PickupItem[],
		elevator: Elevator
	) {
		// TODO: Optimize this, elevator should pick up path where are the most pickups to go
		//  If elevator reached destination and destination doesn't have any pickup then find nearest pickup and go there
		if (
			this.pickupQueue.length > 0 &&
			direction == "stop" &&
			floorPickups.length == 0 &&
			this.pickupMap[elevator[0]].length === 0
		) {
			const nearestPickup = this.pickupQueue.sort(
				(p) => p[0] - elevator[1]
			)[0];
			if (nearestPickup) {
				elevator[2] = nearestPickup[0];
				// // TODO: REMOVE PICKED UP FROM queue
				// this.pickupQueue = this.pickupQueue.filter(
				// 	(p) => p[2] !== nearestPickup[2]
				// );
				// // Add picked up items to pickup map
				// if (!this.pickupMap[elevator[0]]) {
				// 	this.pickupMap[elevator[0]] = [];
				// }
				// this.pickupMap[elevator[0]] = [
				// 	nearestPickup,
				// 	...floorPickups,
				// ];
			}
			this.update(elevator[0], elevator[1], elevator[2]);
			return;
		}

		if (
			this.pickupMap[elevator[0]] &&
			this.pickupMap[elevator[0]].length > 0
		) {
			// Select new destination
			let pickupMax = 0;
			let goto = 0;
			const pickupDestinations = this.pickupMap[elevator[0]].map(
				(p) => p[0] + p[1]
			);

			switch (direction) {
				case "up":
					pickupMax = Math.max(...pickupDestinations);
					goto = pickupMax;
					if (goto > elevator[2]) {
						elevator[2] = goto;
					}
					break;
				case "down":
					pickupMax = Math.min(...pickupDestinations);
					goto = pickupMax;
					if (goto < elevator[2]) {
						elevator[2] = goto;
					}
					break;
				default:
					const pickupUp = pickupDestinations.filter(
						(p) => p > elevator[1]
					);
					const pickupDown = pickupDestinations.filter(
						(p) => p < elevator[1]
					);
					if (pickupUp > pickupDown) {
						pickupMax = Math.max(...pickupDestinations);
					} else if (pickupUp < pickupDown) {
						pickupMax = Math.min(...pickupDestinations);
					} else {
						pickupMax = Math.max(...pickupDestinations);
					}
					if (pickupMax !== elevator[2]) {
						elevator[2] = pickupMax;
					}
					break;
			}
		}
	}

	step(): void {
		// Use only potentially usefull elevators
		this.elevators.forEach((el) => {
			let elevator: Elevator = [...el];

			const direction =
				elevator[1] !== elevator[2]
					? elevator[1] > elevator[2]
						? "down"
						: "up"
					: "stop";

			this.moveElevator(direction, elevator);
			this.dropPickup(elevator);
			const floorPickups = this.pickupNewPickups(direction, elevator);
			this.selectNewDestination(direction, floorPickups, elevator);
			this.update(elevator[0], elevator[1], elevator[2]);
		});
	}

	update(
		elevatorId: number,
		currentFloor: number,
		destination: number
	): void {
		const elevatorIndex = this.elevators.findIndex(
			(e) => e[0] === elevatorId
		);
		// Replace elevator data
		this.elevators.splice(elevatorIndex, 1, [
			elevatorId,
			currentFloor,
			destination,
		]);
	}

	elevatorPickups(elevatorId: number): number {
		return Object.keys(this.pickupMap).includes(elevatorId.toString())
			? this.pickupMap[elevatorId].length
			: 0;
	}

	get isFinished(): boolean {
		const queueEmpty = this.pickupQueue.length === 0;
		const elevatorsEmpty = this.elevators.every((e) => {
			if (!this.pickupMap[e[0]]) return true;
			return this.pickupMap[e[0]].length === 0;
		});

		return queueEmpty && elevatorsEmpty;
	}
}
