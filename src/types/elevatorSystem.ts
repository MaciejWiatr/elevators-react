import {
	IElevatorSystem,
	PickupItem,
} from "../core/ElevatorSystem/ElevatorSystem";
import { IElevator } from "../core/ElevatorSystem";

export interface ISystemRef {
	elevatorSystem: IElevatorSystem;
}

export type ElevatorType = IElevator;

export interface IGroupedPickups {
	up: PickupItem[];
	down: PickupItem[];
}
