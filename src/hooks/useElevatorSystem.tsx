import { useRef, useState } from "react";
import { useInterval } from "react-use";
import { ElevatorSystem, IElevatorSystem } from "../core/ElevatorSystem";
import { ElevatorType, IElevatorFormData, ISystemRef } from "../types";

interface IUseElevatorSystemArgs {
	floorNumber: number;
	simulationSpeed: number;
}

export const useElevatorSystem = ({
	floorNumber,
	simulationSpeed = 300,
}: IUseElevatorSystemArgs) => {
	let systemRef = useRef<ISystemRef>({
		elevatorSystem: new ElevatorSystem(1),
	});
	const [elevatorStatus, setElevatorStatus] = useState<ElevatorType[]>([]);
	const [isRunning, setIsRunning] = useState(false);

	const updateElevatorSystem = (elevatorForm: IElevatorFormData) => {
		const elevatorSystem = new ElevatorSystem(elevatorForm.elevatorNumber);

		if (elevatorForm.passengerNumber) {
			for (let i = 0; i < elevatorForm.passengerNumber; i++) {
				const randomFloor = Math.floor(Math.random() * floorNumber) - 8;
				let randomDest = Math.random() > 0.5 ? 2 : -2;
				elevatorSystem.pickup(randomFloor, randomDest);
			}
		}

		systemRef.current.elevatorSystem = elevatorSystem;
	};

	const addPassenger = (floorNumber: number) => {
		console.log("add passenger", floorNumber);
		systemRef.current.elevatorSystem.pickup(
			floorNumber,
			Math.random() > 0.5 ? 2 : -2
		);
	};

	const step = () => {
		systemRef.current.elevatorSystem.step();
		setElevatorStatus((s) => [
			...systemRef.current.elevatorSystem.status(),
		]);
	};

	const addRandomPassenger = () => {
		const randomFloor = Math.floor(Math.random() * floorNumber) - 8;
		let randomDest = Math.random() > 0.5 ? 2 : -2;
		systemRef.current.elevatorSystem.pickup(randomFloor, randomDest);
	};

	const toggleRunning = () => {
		setIsRunning(!isRunning);
	};

	useInterval(
		() => {
			step();
		},
		isRunning ? simulationSpeed : null
	);

	return {
		elevatorStatus,
		addPassenger,
		addRandomPassenger,
		toggleRunning,
		isRunning,
		floorNumber,
		systemRef,
		updateElevatorSystem,
	};
};
