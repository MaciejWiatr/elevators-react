import {
	Button,
	Checkbox,
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useAudio } from "react-use";
import CustomPassengerForm from "./CustomPassengerForm";
import Confetti from "react-confetti";

const SystemControls = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [audio, state, controls, ref] = useAudio({
		src: "/music/elevator.mp3",
		autoPlay: false,
		loop: true,
	});

	const onCheckboxChange = (e: any) => {
		if (e.target.checked) {
			controls.play();
			controls.volume(0.5);
		} else {
			controls.pause();
		}
	};

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
			{audio}
			<Checkbox mt={2} onChange={onCheckboxChange} defaultChecked={false}>
				Mood booster ✨ 🎉
			</Checkbox>

			{state.playing && (
				<>
					<Image h={96} src="/images/dog.gif" mt={4} />
					<Confetti />
				</>
			)}

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
