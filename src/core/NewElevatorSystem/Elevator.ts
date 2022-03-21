export interface IElevator {
	elevatorId: number;
	currentFloor: number;
	destination: number;
	pickups: PickupItem[];
	moveElevator(): void;
	direction: ElevatorDirection;
	dropPickup(): void;
	pickupNewPickups(pickupQueue: PickupItem[]): PickupItem[];
	selectNewDestination(
		pickupQueue: PickupItem[],
		elevators: Elevator[]
	): void;
}

type ElevatorDirection = "up" | "down" | "stop";

type PickupItem = [originFloor: number, direction: number, id: string];

export class Elevator implements IElevator {
	public elevatorId: number;
	public currentFloor: number;
	public destination: number;
	public pickups: PickupItem[] = [];

	constructor(elevatorId: number, currentFloor: number, destination: number) {
		this.elevatorId = elevatorId;
		this.currentFloor = currentFloor;
		this.destination = destination;
	}

	public moveElevator() {
		// Elevator is moving
		if (this.direction !== "stop") {
			// Elevator is moving upwards
			if (this.direction === "up") {
				this.currentFloor += 1;
			}
			// Elevator is moving downwards
			else {
				this.currentFloor -= 1;
			}
		}
	}

	get direction() {
		return this.currentFloor !== this.destination
			? this.currentFloor > this.destination
				? "down"
				: "up"
			: "stop";
	}

	public dropPickup() {
		if (!this.pickups) return;

		this.pickups = this.pickups.filter((p) => {
			const goto = p[0] + p[1];
			// Elevator is at the pickup destination, remove pickup
			if (this.currentFloor === goto) {
				return false;
			}
			return true;
		});
	}

	public pickupNewPickups(pickupQueue: PickupItem[]): PickupItem[] {
		if (pickupQueue.length === 0) return [];

		// Check if anyone is waiting to be picked up on a certain floor
		let floorPickups = pickupQueue
			.filter((pickup) => pickup[0] === this.currentFloor)
			.filter((pickup) => {
				// Get only pickups that are going in the same direction
				if (pickup[1] > this.currentFloor && this.direction == "up")
					return true;
				else if (
					pickup[1] < this.currentFloor &&
					this.direction == "down"
				)
					return true;
				else if (this.direction == "stop") return true;
				else return false;
			});

		const floorPickupIds = floorPickups.map((pickup) => pickup[2]);

		// Remove picked up items from pickup queue
		const newQueue = pickupQueue.filter(
			(pickup) => !floorPickupIds.includes(pickup[2])
		);

		this.pickups = [...this.pickups, ...floorPickups];

		return newQueue;
	}

	public selectNewDestination(
		pickupQueue: PickupItem[],
		elevators: Elevator[]
	) {
		const floorPickups = pickupQueue.filter(
			(pickup) => pickup[0] === this.currentFloor
		);

		//  If elevator reached destination and destination doesn't have any pickup then find nearest pickup and go there
		if (
			pickupQueue.length > 0 &&
			this.direction == "stop" &&
			floorPickups.length == 0 &&
			this.pickups.length === 0
		) {
			const nearestPickup = pickupQueue.sort(
				(p) => p[0] - this.currentFloor
			)[0];
			if (nearestPickup) {
				// if (
				// 	elevators.findIndex(
				// 		(e) => e.destination === nearestPickup[0]
				// 	) === -1
				// ) {
				this.destination = nearestPickup[0];
				// }
			}
			return;
		}

		if (this.pickups && this.pickups.length > 0) {
			// Select new destination
			let pickupMax = 0;
			let goto = 0;
			const pickupDestinations = this.pickups
				.map((p) => p[0] + p[1])
				.sort((a, b) => a - b);
			const min = pickupDestinations[0];
			const max = pickupDestinations[pickupDestinations.length - 1];

			switch (this.direction) {
				case "up":
					goto = max;
					if (goto > this.destination) {
						this.destination = goto;
					}
					break;
				case "down":
					goto = min;
					if (goto < this.destination) {
						this.destination = goto;
					}
					break;
				default:
					const pickupUp = pickupDestinations.filter(
						(p) => p > this.currentFloor
					);
					const pickupDown = pickupDestinations.filter(
						(p) => p < this.currentFloor
					);
					if (pickupUp > pickupDown) {
						pickupMax = max;
					} else if (pickupUp < pickupDown) {
						pickupMax = min;
					} else {
						pickupMax = max;
					}
					if (pickupMax !== this.destination) {
						this.destination = pickupMax;
					}
					break;
			}
		}
	}
}
