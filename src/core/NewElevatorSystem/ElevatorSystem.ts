import { IElevator, Elevator } from "./Elevator";
import { groupByDirection } from "./../../utils/groupByDirection";
import { nanoid } from "nanoid";

export type ElevatorDto = [
	elevatorId: number,
	currentFloor: number,
	destination: number
];

export type PickupItem = [originFloor: number, direction: number, id: string];

export interface INewElevatorSystem {
	pickup(originFloor: number, direction: number): void;
	status(): ElevatorDto[];
	step(): void;
	elevatorPickups(elevatorId: number): number;
	floorPickups(floorNumber: number): {
		up: PickupItem[];
		down: PickupItem[];
	};
}

export class NewElevatorSystem implements INewElevatorSystem {
	public elevators: IElevator[];
	public pickupQueue: PickupItem[] = [];

	constructor(elevatorNumber: number) {
		// Generate given number of elevators
		// Each elevator is default to 0 floor and 0 direction
		const newElevators: IElevator[] = [];
		for (let i = 0; i < elevatorNumber; i++) {
			newElevators.push(new Elevator(i, 0, 0));
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
		this.pickupQueue.push([originFloor, direction, nanoid()]);
	}

	status(): ElevatorDto[] {
		return this.elevators.map((el) => [
			el.elevatorId,
			el.currentFloor,
			el.destination,
		]);
	}

	step(): void {
		// Use only potentially usefull elevators
		this.elevators.forEach((elevator) => {
			elevator.moveElevator();
			elevator.dropPickup();
			this.pickupQueue = elevator.pickupNewPickups(this.pickupQueue);
			elevator.selectNewDestination(this.pickupQueue, this.elevators);
		});
	}

	elevatorPickups(elevatorId: number): number {
		return (
			this.elevators.find((e) => e.elevatorId === elevatorId)?.pickups
				.length ?? 0
		);
	}

	get isFinished(): boolean {
		const queueEmpty = this.pickupQueue.length === 0;
		const elevatorsEmpty = this.elevators.every((e) => {
			return e.pickups.length === 0;
		});

		return queueEmpty && elevatorsEmpty;
	}
}
