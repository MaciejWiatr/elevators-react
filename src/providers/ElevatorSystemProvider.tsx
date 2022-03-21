import { createContext, ReactNode } from "react";
import { useElevatorSystem } from "../hooks";
import { IElevatorContext } from "../types";

export const ElevatorContext = createContext<IElevatorContext>({});

const ElevatorSystemProvider = ({ children }: { children: ReactNode }) => {
	const {
		elevatorStatus,
		addPassenger,
		toggleRunning,
		isRunning,
		floorNumber,
		systemRef,
		updateElevatorSystem,
	} = useElevatorSystem({ floorNumber: 14, simulationSpeed: 300 });

	return (
		<ElevatorContext.Provider
			value={{
				elevatorStatus,
				addPassenger,
				toggleRunning,
				isRunning,
				floorNumber,
				systemRef,
				updateElevatorSystem,
			}}
		>
			{children}
		</ElevatorContext.Provider>
	);
};

export default ElevatorSystemProvider;
