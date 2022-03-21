import { Flex, Button, Text } from "@chakra-ui/react";
import { range } from "../utils/range";
import { Elevator } from "./Elevator";
import { Elevator as ElevatorType } from "../core/ElevatorSystem";
import PassengerCount from "./PassengerCount";
import { INewElevatorSystem } from "../core/NewElevatorSystem";

interface ISystemRef {
	elevatorSystem: INewElevatorSystem;
}

interface IElevatorVisProps {
	floorNo: number;
	addPassenger: (floorNumber: number) => void;
	systemRef: React.MutableRefObject<ISystemRef>;
	elevatorStatus: ElevatorType[];
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
				<Flex
					key={i}
					rounded="lg"
					h="60px"
					alignItems="center"
					justifyContent={"space-between"}
					gap={1}
					bgColor={(i + 1) % 2 === 0 ? "gray.900" : "gray.800"}
					px={4}
				>
					<Text color="gray.300">{i}</Text>
					<Flex alignItems="center">
						<Text>
							<PassengerCount
								floorPickups={systemRef.current.elevatorSystem.floorPickups(
									i
								)}
							/>
						</Text>
						<Button
							variant="ghost"
							colorScheme={"green"}
							size="sm"
							onClick={() => addPassenger(i)}
						>
							Add passenger
						</Button>
					</Flex>
				</Flex>
			))}
			<Flex
				rounded="lg"
				h="60px"
				alignItems="center"
				justifyContent={"space-between"}
				gap={1}
				px={4}
			>
				<Text color="gray.300">0</Text>
				{elevatorStatus.map((elevator, i) => (
					<Elevator
						key={elevator[0]}
						elevatorId={elevator[0]}
						currentFloor={elevator[1]}
						destinationFloor={elevator[2]}
						passengerCount={systemRef.current.elevatorSystem.elevatorPickups(
							elevator[0]
						)}
					/>
				))}
				<Flex alignItems="center">
					<Text>
						<PassengerCount
							floorPickups={systemRef.current.elevatorSystem.floorPickups(
								0
							)}
						/>
					</Text>
					<Button
						variant="ghost"
						colorScheme={"green"}
						size="sm"
						onClick={() => addPassenger(0)}
					>
						Add passenger
					</Button>
				</Flex>
			</Flex>
			{range(-1, -(floorNo / 2)).map((i) => (
				<Flex
					key={i}
					rounded="lg"
					h="60px"
					alignItems="center"
					justifyContent={"space-between"}
					gap={1}
					bgColor={(i + 1) % 2 === 0 ? "gray.900" : "gray.800"}
					px={4}
				>
					<Text color="gray.300">{i}</Text>
					<Flex alignItems="center">
						<PassengerCount
							floorPickups={systemRef.current.elevatorSystem.floorPickups(
								i
							)}
						/>
						<Button
							variant="ghost"
							colorScheme={"green"}
							size="sm"
							onClick={() => addPassenger(i)}
						>
							Add passenger
						</Button>
					</Flex>
				</Flex>
			))}
		</>
	);
}
