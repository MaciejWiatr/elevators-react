import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ElevatorSystemProvider from "./providers/ElevatorSystemProvider";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};
const theme = extendTheme({ config });

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ElevatorSystemProvider>
				<App />
			</ElevatorSystemProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById("root")
);
