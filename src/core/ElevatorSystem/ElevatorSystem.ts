import { IElevator, Elevator } from "./Elevator";
import { groupByDirection } from "../../utils/groupByDirection";
import { nanoid } from "nanoid";
import { ElevatorHelpers } from "./ElevatorHelpers";

export type ElevatorDto = [
	elevatorId: number,
	currentFloor: number,
	destination: number
];

export type PickupItem = [originFloor: number, direction: number, id: string];

export interface IElevatorSystem {
	elevators: IElevator[];
	pickupList: PickupItem[];
	pickup(originFloor: number, direction: number): void;
	status(): ElevatorDto[];
	step(): void;
	getElevatorPickups(elevatorId: number): number;
	getFloorPickups(floorNumber: number): {
		up: PickupItem[];
		down: PickupItem[];
	};
}

export class ElevatorSystem implements IElevatorSystem {
	public elevators: IElevator[];
	public pickupList: PickupItem[] = [];

	constructor(elevatorNumber: number) {
		// Generate given number of elevators
		// Each elevator is default to 0 floor and 0 direction
		const newElevators: IElevator[] = [];
		for (let i = 0; i < elevatorNumber; i++) {
			newElevators.push(new Elevator(i, 0, 0));
		}
		this.elevators = newElevators;
	}

	pickup(originFloor: number, direction: number): void {
		// Create pickup with unique nanoid
		this.pickupList.push([originFloor, direction, nanoid()]);
	}

	status(): ElevatorDto[] {
		// Map elevators to dto
		return this.elevators.map((el) => [
			el.elevatorId,
			el.currentFloor,
			el.destination,
		]);
	}

	step(): void {
		this.elevators.forEach((elevator) => {
			elevator.moveElevator();
			elevator.dropPickup();
			this.pickupList = elevator.loadNewPassengers(this.pickupList);
			ElevatorHelpers.selectNewDestination(elevator, this.pickupList);
		});
	}

	getFloorPickups(floorNumber: number) {
		const pickups = this.pickupList.filter(
			([pickupOrigin]) => pickupOrigin === floorNumber
		);

		return groupByDirection(pickups);
	}

	getElevatorPickups(elevatorId: number): number {
		return (
			this.elevators.find((e) => e.elevatorId === elevatorId)?.pickups
				.length ?? 0
		);
	}

	get isFinished(): boolean {
		const queueEmpty = this.pickupList.length === 0;
		const elevatorsEmpty = this.elevators.every((e) => {
			return e.pickups.length === 0;
		});

		return queueEmpty && elevatorsEmpty;
	}
}
