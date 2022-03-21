import { PickupItem } from ".";
import { ElevatorDirection, IElevator } from "./Elevator";

export class ElevatorHelpers {
	public static getPassengersThatGoInTheSameDirection(
		elevator: IElevator,
		pickupList: PickupItem[]
	) {
		return pickupList
			.filter(([pickupOrigin]) => pickupOrigin === elevator.currentFloor)
			.filter(([_, pickupDirection]) => {
				const pickupGoingUp = pickupDirection > elevator.currentFloor;
				const pickupGoingDown = pickupDirection < elevator.currentFloor;

				// Get only pickups that are going in the same direction
				if (pickupGoingUp && elevator.direction == ElevatorDirection.UP)
					return true;
				else if (
					pickupGoingDown &&
					elevator.direction == ElevatorDirection.DOWN
				)
					return true;
				else if (elevator.direction == ElevatorDirection.STOP)
					return true;
				else return false;
			});
	}

	public static selectNewDestination(
		elevator: IElevator,
		pickupList: PickupItem[]
	) {
		const floorPickups = pickupList.filter(
			([pickupOrigin]) => pickupOrigin === elevator.currentFloor
		);
		const pickupListNotEmpty = pickupList.length > 0;
		const elevatorIsStopped = elevator.direction === ElevatorDirection.STOP;
		const thereAreNoPickups = floorPickups.length === 0;
		const elevatorIsCarryingPassengers = elevator.pickups.length > 0;

		if (
			pickupListNotEmpty &&
			elevatorIsStopped &&
			thereAreNoPickups &&
			!elevatorIsCarryingPassengers
		) {
			// Find nearest element in pickup list
			const nearestPickup = pickupList.sort(
				([pickupOrigin]) => pickupOrigin - elevator.currentFloor
			);
			if (!nearestPickup) return;
			// Get origin floor of nearest pickup
			const nearestPickupOrigin = nearestPickup[0][0];
			// Set destination of elevator to nearest pickup
			elevator.destination = nearestPickupOrigin;
			return;
		}

		if (!elevatorIsCarryingPassengers) return;

		// Holds next elevator destination
		let elevatorGoTo = 0;
		const pickupDestinations = elevator.pickups
			.map(
				([pickupOrigin, pickupDirection]) =>
					pickupOrigin + pickupDirection
			)
			.sort((a, b) => a - b); // Lower floors first
		const lowestFloor = pickupDestinations[0];
		const highestFloor = pickupDestinations[pickupDestinations.length - 1];

		switch (elevator.direction) {
			case ElevatorDirection.UP:
				elevatorGoTo = highestFloor;
				if (elevatorGoTo > elevator.destination) {
					elevator.destination = elevatorGoTo;
				}
				break;
			case ElevatorDirection.DOWN:
				elevatorGoTo = lowestFloor;
				if (elevatorGoTo < elevator.destination) {
					elevator.destination = elevatorGoTo;
				}
				break;
			default:
				const pickupUp = pickupDestinations.filter(
					(p) => p > elevator.currentFloor
				).length;
				const pickupDown = pickupDestinations.filter(
					(p) => p < elevator.currentFloor
				).length;
				if (pickupUp > pickupDown) {
					elevatorGoTo = highestFloor;
				} else if (pickupUp < pickupDown) {
					elevatorGoTo = lowestFloor;
				} else {
					elevatorGoTo = highestFloor;
				}
				elevator.destination = elevatorGoTo;
				break;
		}
	}
}
