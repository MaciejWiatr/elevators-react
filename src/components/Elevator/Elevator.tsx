import {
	Box,
	BoxProps,
	Flex,
	FlexProps,
	Text,
	TextProps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface IElevatorProps {
	elevatorId: number;
	passengerCount: number;
	currentFloor: number;
	destinationFloor: number;
}

const MotionFlex = motion<FlexProps>(Flex);

export const Elevator = ({
	elevatorId,
	passengerCount,
	currentFloor,
	destinationFloor,
}: IElevatorProps) => {
	return (
		<MotionFlex
			textAlign="center"
			h={50}
			w={10}
			bgColor={"gray.700"}
			rounded={"md"}
			border={"1px solid"}
			borderColor={"gray.600"}
			justifyContent={"center"}
			alignItems={"center"}
			position={"relative"}
			shadow={"md"}
			animate={{ y: currentFloor * -60 }}
		>
			<Box
				position={"absolute"}
				top="-3"
				bgColor={"gray.600"}
				w={5}
				h={5}
				rounded={"full"}
				fontSize={"sm"}
				shadow={"md"}
				overflow="hidden"
				fontWeight="semibold"
			>
				<Box>{elevatorId}</Box>
			</Box>
			<Box overflow={"hidden"}>
				<Text fontWeight="bold" fontSize={"lg"}>
					{passengerCount}
				</Text>
			</Box>
			<Box
				position={"absolute"}
				bottom="-3"
				bgColor={"gray.600"}
				w={5}
				h={5}
				rounded={"full"}
				fontSize={"sm"}
				shadow={"md"}
				overflow="hidden"
				fontWeight="semibold"
			>
				<Box color={destinationFloor > 0 ? "green.300" : "red.300"}>
					{destinationFloor}
				</Box>
			</Box>
		</MotionFlex>
	);
};
