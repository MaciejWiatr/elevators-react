import { ElevatorHelpers } from "./ElevatorHelpers";

export interface IElevator {
	elevatorId: number;
	currentFloor: number;
	destination: number;
	pickups: PickupItem[];
	moveElevator(): void;
	direction: ElevatorDirection;
	dropPickup(): void;
	loadNewPassengers(pickupList: PickupItem[]): PickupItem[];
}

export enum ElevatorDirection {
	UP,
	DOWN,
	STOP,
}

type PickupItem = [originFloor: number, direction: number, id: string];

export class Elevator implements IElevator {
	public pickups: PickupItem[] = [];

	constructor(
		public elevatorId: number,
		public currentFloor: number,
		public destination: number
	) {}

	public moveElevator() {
		// Elevator is at the destination, stop
		if (this.direction === ElevatorDirection.STOP) return;

		// Elevator is moving upwards
		if (this.direction === ElevatorDirection.UP) {
			this.currentFloor += 1;
		}
		// Elevator is moving downwards
		else {
			this.currentFloor -= 1;
		}
	}

	get direction() {
		const reachedDestination = this.currentFloor === this.destination;
		const isDestinationHigher = this.destination > this.currentFloor;

		if (reachedDestination) {
			return ElevatorDirection.STOP;
		}

		if (isDestinationHigher) {
			return ElevatorDirection.UP;
		} else return ElevatorDirection.DOWN;
	}

	public dropPickup() {
		if (!this.pickups) return;

		this.pickups = this.pickups.filter(([originFloor, direction]) => {
			const pickupGoTo = originFloor + direction;
			// Elevator is at the pickup destination, remove pickup
			if (this.currentFloor === pickupGoTo) {
				return false;
			}
			return true;
		});
	}

	public loadNewPassengers(pickupList: PickupItem[]): PickupItem[] {
		if (pickupList.length === 0) return [];

		// Check if anyone is waiting to be picked up on a certain floor
		const floorPickups =
			ElevatorHelpers.getPassengersThatGoInTheSameDirection(
				this,
				pickupList
			);
		this.pickups = [...this.pickups, ...floorPickups];

		const floorPickupIds = floorPickups.map(
			([_, __, pickupId]) => pickupId
		);

		// Remove picked up items from pickup queue
		const newPickupList = pickupList.filter(
			([_, __, pickupId]) => !floorPickupIds.includes(pickupId)
		);

		return newPickupList;
	}
}
