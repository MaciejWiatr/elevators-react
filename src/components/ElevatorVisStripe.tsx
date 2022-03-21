import { Flex, Button, Text, Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { IGroupedPickups } from "../types";
import PassengerCount from "./PassengerCount";

interface IElevatorVisStripeProps {
	addPassenger(floorNumber: number): void;
	i: number;
	floorPickups: IGroupedPickups;
	children?: ReactNode;
}

export const ElevatorVisStripe = ({
	addPassenger,
	i,
	floorPickups,
	children,
}: IElevatorVisStripeProps) => {
	return (
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
			<Flex w="full" gap={1} justifyContent={"center"}>
				{children}
			</Flex>
			<Flex alignItems="center">
				<Box>
					<PassengerCount floorPickups={floorPickups} />
				</Box>
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
	);
};

export default ElevatorVisStripe;
