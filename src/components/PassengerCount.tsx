import { Box, Flex, Text } from "@chakra-ui/react";
import { PickupItem } from "../core/ElevatorSystem";

interface IPassengerCountProps {
	floorPickups: {
		up: PickupItem[];
		down: PickupItem[];
	};
}

const PassengerCount = ({ floorPickups }: IPassengerCountProps) => {
	return (
		<Flex gap={2}>
			{floorPickups.up && (
				<Flex alignItems="center" color="green.400" gap={1}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-arrow-up-circle"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="16 12 12 8 8 12" />
						<line x1="12" y1="16" x2="12" y2="8" />
					</svg>
					<Text>{floorPickups.up.length}</Text>
				</Flex>
			)}
			{floorPickups.down && (
				<Flex alignItems="center" color="purple.400" gap={1}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-arrow-down-circle"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="8 12 12 16 16 12" />
						<line x1="12" y1="8" x2="12" y2="16" />
					</svg>
					<Text>{floorPickups.down.length}</Text>
				</Flex>
			)}
		</Flex>
	);
};

export default PassengerCount;
