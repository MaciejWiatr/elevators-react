import "./App.css";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Spinner,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Elevator as ElevatorType,
	ElevatorSystem,
	IElevatorSystem,
} from "./core/ElevatorSystem";
import { useInterval } from "react-use";
import { ElevatorVis } from "./components/ElevatorVis";
import { IElevatorFormData } from "./types";
import ElevatorForm from "./components/ElevatorForm";
import { useElevatorSystem } from "./hooks";

interface ISystemRef {
	elevatorSystem: IElevatorSystem;
}

const App = () => {
	// const [floorNo] = useState(14);
	// let systemRef = useRef<ISystemRef>({
	// 	elevatorSystem: new ElevatorSystem(1),
	// });
	// const [elevatorStatus, setElevatorStatus] = useState<ElevatorType[]>([]);
	// const [runSimulation, setRunSimulation] = useState(false);

	// const addPassenger = (floorNumber: number) => {
	// 	console.log("add passenger", floorNumber);
	// 	systemRef.current.elevatorSystem.pickup(
	// 		floorNumber,
	// 		Math.random() > 0.5 ? 2 : -2
	// 	);
	// };

	// const onSubmit = (data: IElevatorFormData) => {
	// 	if (runSimulation) {
	// 		setRunSimulation(false);
	// 		return;
	// 	}

	// 	const elevatorSystem = new ElevatorSystem(data.elevatorNumber);

	// 	if (data.passengerNumber) {
	// 		for (let i = 0; i < data.passengerNumber; i++) {
	// 			const randomFloor = Math.floor(Math.random() * floorNo) - 8;
	// 			let randomDest = Math.random() > 0.5 ? 2 : -2;
	// 			elevatorSystem.pickup(randomFloor, randomDest);
	// 		}
	// 	}

	// 	systemRef.current.elevatorSystem = elevatorSystem;
	// 	setRunSimulation(true);
	// };

	// useInterval(
	// 	() => {
	// 		systemRef.current.elevatorSystem.step();
	// 		setElevatorStatus((s) => [
	// 			...systemRef.current.elevatorSystem.status(),
	// 		]);
	// 	},
	// 	runSimulation ? 300 : null
	// );

	const {
		elevatorStatus,
		addPassenger,
		toggleRunning,
		isRunning,
		floorNumber,
		systemRef,
		updateElevatorSystem,
	} = useElevatorSystem({ floorNumber: 14, simulationSpeed: 300 });

	const onSubmit = (data: IElevatorFormData) => {
		if (isRunning) {
			toggleRunning();
			return;
		}
		updateElevatorSystem(data);
		toggleRunning();
	};

	return (
		<Grid
			minH="100vh"
			templateRows={{ base: "500px 1fr", md: "1fr" }}
			templateColumns={{ base: "1fr", md: "70% 30%" }}
		>
			<GridItem
				rowStart={0}
				rowEnd={2}
				p={4}
				overflow={"auto"}
				maxH="100vh"
			>
				<ElevatorVis
					addPassenger={addPassenger}
					floorNo={floorNumber}
					elevatorStatus={elevatorStatus}
					systemRef={systemRef}
				/>
			</GridItem>
			<GridItem p={2}>
				<ElevatorForm onSubmit={onSubmit} runSimulation={isRunning} />
			</GridItem>
		</Grid>
	);
};

export default App;
