import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import CustomPassengerForm from "./CustomPassengerForm";

const SystemControls = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Flex
			bgColor={"gray.900"}
			rounded={"lg"}
			shadow={"lg"}
			p={4}
			mt={4}
			flexDir="column"
			justifyContent="end"
		>
			<Text fontWeight={"semibold"}>Additional settings</Text>
			<Button mt={2} colorScheme={"green"} onClick={onOpen}>
				Add custom passenger
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add custom pickup</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<CustomPassengerForm />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default SystemControls;
