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

interface IElevatorFormData {
	elevatorNumber: number;
	passengerNumber: number;
	shouldAddPassengers: boolean;
}
interface ISystemRef {
	elevatorSystem: IElevatorSystem;
}

const App = () => {
	const [floorNo] = useState(14);
	const { handleSubmit, register, reset } = useForm<IElevatorFormData>();
	let systemRef = useRef<ISystemRef>({
		elevatorSystem: new ElevatorSystem(1),
	});
	const [elevatorStatus, setElevatorStatus] = useState<ElevatorType[]>([]);
	const [runSimulation, setRunSimulation] = useState(false);

	const addPassenger = (floorNumber: number) => {
		console.log("add passenger", floorNumber);
		systemRef.current.elevatorSystem.pickup(
			floorNumber,
			Math.random() > 0.5 ? 2 : -2
		);
	};

	const onSubmit = (data: IElevatorFormData) => {
		if (runSimulation) {
			setRunSimulation(false);
			return;
		}

		const elevatorSystem = new ElevatorSystem(data.elevatorNumber);

		if (data.passengerNumber) {
			for (let i = 0; i < data.passengerNumber; i++) {
				const randomFloor = Math.floor(Math.random() * floorNo) - 8;
				let randomDest = Math.random() > 0.5 ? 2 : -2;
				elevatorSystem.pickup(randomFloor, randomDest);
			}
		}

		systemRef.current.elevatorSystem = elevatorSystem;
		setRunSimulation(true);
	};

	useInterval(
		() => {
			systemRef.current.elevatorSystem.step();
			setElevatorStatus((s) => [
				...systemRef.current.elevatorSystem.status(),
			]);
		},
		runSimulation ? 300 : null
	);

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
					floorNo={floorNo}
					elevatorStatus={elevatorStatus}
					systemRef={systemRef}
				/>
			</GridItem>
			<GridItem p={2}>
				<Box bgColor={"gray.900"} rounded={"lg"} shadow={"lg"} p={4}>
					<Text fontWeight={"semibold"}>
						Elevator system editor{" "}
						{runSimulation && <Spinner size={"sm"} />}
					</Text>
					<Divider my={4} />
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl colorScheme={"messenger"}>
							<Box my={2}>
								<FormLabel htmlFor="elevatorNumber">
									Number of elevators
								</FormLabel>
								<NumberInput id="elevatorNumber">
									<NumberInputField
										{...register("elevatorNumber", {
											value: 2,
											required: true,
											valueAsNumber: true,
											disabled: runSimulation,
										})}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>
									Please don't go over 16
								</FormHelperText>
							</Box>
							<Box my={2}>
								<FormLabel htmlFor="passengerNumber">
									Number of initial, randomly generated
									passengers
								</FormLabel>
								<NumberInput id="passengerNumber">
									<NumberInputField
										{...register("passengerNumber", {
											value: 5,
											required: true,
											valueAsNumber: true,
											disabled: runSimulation,
										})}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</Box>
							<FormLabel htmlFor="email-alerts" mb="0">
								Should add passengers over time?
							</FormLabel>
							<Switch
								id="email-alerts"
								{...register("shouldAddPassengers", {
									disabled: runSimulation,
								})}
							/>
							<Divider my={4} />
							<HStack justifyContent={"end"}>
								<Button type="reset" variant="ghost">
									Clear
								</Button>
								<Button
									type="submit"
									colorScheme={
										runSimulation ? "red" : "messenger"
									}
								>
									{runSimulation
										? "Stop simulation"
										: "Start simulation"}
								</Button>
							</HStack>
						</FormControl>
					</form>
				</Box>
			</GridItem>
		</Grid>
	);
};

export default App;
