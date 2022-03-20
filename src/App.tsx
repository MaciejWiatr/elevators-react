import "./App.css";
import { Grid, GridItem } from "@chakra-ui/react";
import { ElevatorVis } from "./components/ElevatorVis";
import { IElevatorFormData } from "./types";
import ElevatorForm from "./components/ElevatorForm";
import { useElevatorSystem } from "./hooks";

const App = () => {
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
