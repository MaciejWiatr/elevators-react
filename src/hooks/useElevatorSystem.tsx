import { useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useInterval } from "react-use";
import { ElevatorDto, ElevatorSystem } from "../core/ElevatorSystem";
import { IElevatorFormData, ISystemRef } from "../types";

interface IUseElevatorSystemArgs {
	floorNumber: number;
	simulationSpeed: number;
}

export const useElevatorSystem = ({
	floorNumber,
	simulationSpeed = 300,
}: IUseElevatorSystemArgs) => {
	const toast = useToast();
	let systemRef = useRef<ISystemRef>({
		elevatorSystem: new ElevatorSystem(1),
	});
	const [elevatorStatus, setElevatorStatus] = useState<ElevatorDto[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [shouldAddOverTime, setShouldAddOverTime] = useState(false);

	const updateElevatorSystem = (elevatorForm: IElevatorFormData) => {
		const elevatorSystem = new ElevatorSystem(elevatorForm.elevatorNumber);

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

	const addPassenger = (
		floorNumber: number,
		destination = 0,
		random = false
	) => {
		if (!isRunning) {
			toast({
				title: "Simulation is not running",
				description: "Please start simulation first",
				position: "bottom-right",
				status: "error",
				isClosable: true,
			});
			return;
		}

		if (random) {
			// Random destination that shouldnt overflow the elevator
			let randomDest = Math.random() > 0.5 ? 2 : -2;
			if (floorNumber + randomDest > floorNumber) {
				randomDest = -2;
			}
			if (floorNumber + randomDest < -floorNumber) {
				randomDest = 2;
			}
			destination = randomDest;
		}

		console.log(random);

		systemRef.current.elevatorSystem.pickup(
			floorNumber,
			destination - floorNumber
		);
		setElevatorStatus((s) => [
			...systemRef.current.elevatorSystem.status(),
		]);
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
