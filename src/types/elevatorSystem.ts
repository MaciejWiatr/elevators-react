import { Elevator } from "./../core/ElevatorSystem";
import { IElevatorSystem } from "../core/ElevatorSystem";

export interface ISystemRef {
	elevatorSystem: IElevatorSystem;
}

export type ElevatorType = Elevator;
