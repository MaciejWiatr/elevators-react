import { Flex, Button, Text } from "@chakra-ui/react";
import { range } from "../utils/range";
import { Elevator } from "./Elevator";
import PassengerCount from "./PassengerCount";
import { IElevatorSystem } from "../core/ElevatorSystem";
import ElevatorVisStripe from "./ElevatorVisStripe";
import { ElevatorDto } from "../core/ElevatorSystem";

interface ISystemRef {
	elevatorSystem: IElevatorSystem;
}

interface IElevatorVisProps {
	floorNo: number;
	addPassenger: (floorNumber: number) => void;
	systemRef: React.MutableRefObject<ISystemRef>;
	elevatorStatus: ElevatorDto[];
}

export function ElevatorVis({
	floorNo,
	addPassenger,
	systemRef,
	elevatorStatus,
}: IElevatorVisProps) {
	return (
		<>
			{range(floorNo / 2, 1).map((i) => (
				<ElevatorVisStripe
					addPassenger={addPassenger}
					i={i}
					key={i}
					floorPickups={systemRef.current.elevatorSystem.getFloorPickups(
						i
					)}
				/>
			))}
			<ElevatorVisStripe
				addPassenger={addPassenger}
				i={0}
				key={0}
				floorPickups={systemRef.current.elevatorSystem.getFloorPickups(
					0
				)}
			>
				{elevatorStatus.map((elevator, i) => (
					<Elevator
						key={elevator[0]}
						elevatorId={elevator[0]}
						currentFloor={elevator[1]}
						destinationFloor={elevator[2]}
						passengerCount={systemRef.current.elevatorSystem.getElevatorPickups(
							elevator[0]
						)}
					/>
				))}
			</ElevatorVisStripe>
			{range(-1, -(floorNo / 2)).map((i) => (
				<ElevatorVisStripe
					addPassenger={addPassenger}
					i={i}
					key={i}
					floorPickups={systemRef.current.elevatorSystem.getFloorPickups(
						i
					)}
				/>
			))}
		</>
	);
}
