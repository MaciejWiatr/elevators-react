import { useRef, useState } from "react";
import { useInterval } from "react-use";
import { ElevatorSystem } from "../core/ElevatorSystem";
import { ElevatorDto, NewElevatorSystem } from "../core/NewElevatorSystem";
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
		elevatorSystem: new NewElevatorSystem(1),
	});
	const [elevatorStatus, setElevatorStatus] = useState<ElevatorDto[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [shouldAddOverTime, setShouldAddOverTime] = useState(false);

	const updateElevatorSystem = (elevatorForm: IElevatorFormData) => {
		const elevatorSystem = new NewElevatorSystem(
			elevatorForm.elevatorNumber
		);

		setShouldAddOverTime(elevatorForm.shouldAddPassengers);

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
		// Random destination that shouldnt overflow the elevator
		let randomDest = Math.random() > 0.5 ? 2 : -2;
		if (floorNumber + randomDest > floorNumber) {
			randomDest = -2;
		}
		if (floorNumber + randomDest < -floorNumber) {
			randomDest = 2;
		}

		systemRef.current.elevatorSystem.pickup(floorNumber, randomDest);
	};

	const step = () => {
		systemRef.current.elevatorSystem.step();

		setElevatorStatus((s) => [
			...systemRef.current.elevatorSystem.status(),
		]);
	};

	const addRandomPassenger = () => {
		const randomFloor = Math.floor(Math.random() * floorNumber) - 8;

		// Random destination that shouldnt overflow the elevator
		let randomDest = Math.random() > 0.5 ? 2 : -2;
		if (randomFloor + randomDest > floorNumber) {
			randomDest = -2;
		}
		if (randomFloor + randomDest < -floorNumber) {
			randomDest = 2;
		}

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

	useInterval(
		() => {
			if (shouldAddOverTime) {
				addRandomPassenger();
			}
		},
		shouldAddOverTime ? simulationSpeed * 3 : null
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
