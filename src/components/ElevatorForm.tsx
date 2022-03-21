import {
	Box,
	Spinner,
	Divider,
	FormControl,
	FormLabel,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	FormHelperText,
	Switch,
	HStack,
	Button,
	Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { IElevatorFormData } from "../types";

interface IElevatorFormProps {
	onSubmit: (data: IElevatorFormData) => void;
	runSimulation: boolean;
}

const ElevatorForm = ({ onSubmit, runSimulation }: IElevatorFormProps) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<IElevatorFormData>();

	return (
		<Box bgColor={"gray.900"} rounded={"lg"} shadow={"lg"} p={4}>
			<Box fontWeight={"semibold"}>
				Elevator system editor{" "}
				{runSimulation && <Spinner size={"sm"} />}
			</Box>
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
									min: 0,
									max: 20,
								})}
							/>
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						<FormHelperText>Please don't go over 16</FormHelperText>
						{errors.elevatorNumber && (
							<Text color="red.400">
								Please enter a valid number in range {"<0-20>"}
							</Text>
						)}
					</Box>
					<Box my={2}>
						<FormLabel htmlFor="passengerNumber">
							Number of initial, randomly generated passengers
						</FormLabel>
						<NumberInput id="passengerNumber">
							<NumberInputField
								{...register("passengerNumber", {
									value: 5,
									required: true,
									valueAsNumber: true,
									disabled: runSimulation,
									min: 0,
									max: 999,
								})}
							/>
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						{errors.passengerNumber && (
							<Text color="red.400">
								Please enter a valid number in range {"<0-999>"}
							</Text>
						)}
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
							colorScheme={runSimulation ? "red" : "messenger"}
						>
							{runSimulation
								? "Stop simulation"
								: "Start simulation"}
						</Button>
					</HStack>
				</FormControl>
			</form>
		</Box>
	);
};

export default ElevatorForm;
