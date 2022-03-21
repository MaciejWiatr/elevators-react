import { INewElevatorSystem } from "./../core/NewElevatorSystem/ElevatorSystem";
import { IElevator } from "../core/NewElevatorSystem";

export interface ISystemRef {
	elevatorSystem: INewElevatorSystem;
}

export type ElevatorType = IElevator;
