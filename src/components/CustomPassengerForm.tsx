import {
	Button,
	FormControl,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { ElevatorContext } from "../providers/ElevatorSystemProvider";

interface ICustomPassengerFormData {
	originFloor: number;
	destinationFloor: number;
}

const CustomPassengerForm = () => {
	const { floorNumber, addPassenger } = useContext(ElevatorContext);
	const { register, handleSubmit } = useForm<ICustomPassengerFormData>();

	const onSubmit = (data: ICustomPassengerFormData) => {
		addPassenger(data.originFloor, data.destinationFloor);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl>
				<FormLabel htmlFor="amount">Origin floor</FormLabel>
				<NumberInput max={floorNumber / 2} min={-(floorNumber / 2)}>
					<NumberInputField
						id="amount"
						{...register("originFloor", {
							valueAsNumber: true,
						})}
					/>
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<FormLabel htmlFor="amount">Destination floor</FormLabel>
				<NumberInput max={floorNumber / 2} min={-(floorNumber / 2)}>
					<NumberInputField
						id="amount"
						{...register("destinationFloor", {
							valueAsNumber: true,
						})}
					/>
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<Button mt={2} colorScheme="blue" type="submit">
					Add
				</Button>
			</FormControl>
		</form>
	);
};

export default CustomPassengerForm;
